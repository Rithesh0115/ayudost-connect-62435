import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Note: Email sending disabled - install RESEND_API_KEY and uncomment to enable
// import { Resend } from "npm:resend@2.0.0";
// const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting medication reminder check...");
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Get active prescriptions
    const { data: prescriptions, error: prescriptionsError } = await supabaseClient
      .from("patient_prescriptions")
      .select("*, patient_profiles!inner(email, full_name)")
      .lte("start_date", today)
      .or(`end_date.is.null,end_date.gte.${today}`);

    if (prescriptionsError) {
      console.error("Error fetching prescriptions:", prescriptionsError);
      throw prescriptionsError;
    }

    console.log(`Found ${prescriptions?.length || 0} active prescriptions`);

    for (const prescription of prescriptions || []) {
      // Check if reminder sent today
      const { data: existingNotification } = await supabaseClient
        .from("notifications")
        .select("id")
        .eq("related_id", prescription.id)
        .eq("type", "medication_reminder")
        .gte("sent_at", `${today}T00:00:00`)
        .single();

      if (!existingNotification) {
        console.log(`Sending medication reminder for prescription ${prescription.id}`);
        
        const message = `Time to take your medication: ${prescription.medication} - ${prescription.dosage}, ${prescription.frequency}`;

        // Send email (currently disabled - uncomment Resend import to enable)
        try {
          console.log(`Email would be sent to ${prescription.patient_profiles.email}`);
          // await resend.emails.send({
          //   from: "Ayudost <onboarding@resend.dev>",
          //   to: [prescription.patient_profiles.email],
          //   subject: `Medication Reminder - ${prescription.medication}`,
          //   html: `
          //     <h2>Medication Reminder</h2>
          //     <p>Hello ${prescription.patient_profiles.full_name},</p>
          //     <p>This is a reminder to take your medication:</p>
          //     <p><strong>Medication:</strong> ${prescription.medication}</p>
          //     <p><strong>Dosage:</strong> ${prescription.dosage}</p>
          //     <p><strong>Frequency:</strong> ${prescription.frequency}</p>
          //     ${prescription.doctor ? `<p><strong>Prescribed by:</strong> ${prescription.doctor}</p>` : ''}
          //     <p>Stay healthy!</p>
          //   `,
          // });
          // console.log(`Email sent successfully to ${prescription.patient_profiles.email}`);
        } catch (emailError) {
          console.error("Error sending email:", emailError);
        }

        // Create notification record
        await supabaseClient.from("notifications").insert({
          user_id: prescription.user_id,
          type: "medication_reminder",
          title: "Medication Reminder",
          message: message,
          related_id: prescription.id,
          scheduled_for: now.toISOString(),
          sent_at: now.toISOString(),
        });
      }
    }

    return new Response(JSON.stringify({ success: true, checked: prescriptions?.length || 0 }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-medication-reminder:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
