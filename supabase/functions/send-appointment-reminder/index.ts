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
    console.log("Starting appointment reminder check...");
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get current time and 24 hours from now
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    // Get appointments for tomorrow or in 1 hour
    const { data: appointments, error: appointmentsError } = await supabaseClient
      .from("patient_appointments")
      .select("*, patient_profiles!inner(email, full_name)")
      .in("status", ["upcoming", "confirmed"])
      .gte("date", now.toISOString().split('T')[0])
      .lte("date", tomorrow.toISOString().split('T')[0]);

    if (appointmentsError) {
      console.error("Error fetching appointments:", appointmentsError);
      throw appointmentsError;
    }

    console.log(`Found ${appointments?.length || 0} appointments to check`);

    for (const appointment of appointments || []) {
      const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
      const hoursDiff = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      let reminderType = "";
      if (hoursDiff <= 1 && hoursDiff > 0) {
        reminderType = "1hour";
      } else if (hoursDiff <= 24 && hoursDiff > 23) {
        reminderType = "24hours";
      }

      if (reminderType) {
        // Check if reminder already sent
        const { data: existingNotification } = await supabaseClient
          .from("notifications")
          .select("id")
          .eq("related_id", appointment.id)
          .eq("type", "appointment_reminder")
          .not("sent_at", "is", null)
          .gte("sent_at", new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()) // Within last 2 hours
          .single();

        if (!existingNotification) {
          console.log(`Sending ${reminderType} reminder for appointment ${appointment.id}`);
          
          const message = reminderType === "1hour"
            ? `Your appointment with ${appointment.doctor_name} at ${appointment.clinic_name} is in 1 hour!`
            : `Reminder: You have an appointment tomorrow with ${appointment.doctor_name} at ${appointment.clinic_name} at ${appointment.time}`;

          // Send email (currently disabled - uncomment Resend import to enable)
          try {
            console.log(`Email would be sent to ${appointment.patient_profiles.email}`);
            // await resend.emails.send({
            //   from: "Ayudost <onboarding@resend.dev>",
            //   to: [appointment.patient_profiles.email],
            //   subject: `Appointment Reminder - ${appointment.doctor_name}`,
            //   html: `
            //     <h2>Appointment Reminder</h2>
            //     <p>Hello ${appointment.patient_profiles.full_name},</p>
            //     <p>${message}</p>
            //     <p><strong>Doctor:</strong> ${appointment.doctor_name}</p>
            //     <p><strong>Clinic:</strong> ${appointment.clinic_name}</p>
            //     <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
            //     <p><strong>Time:</strong> ${appointment.time}</p>
            //     <p>See you soon!</p>
            //   `,
            // });
            // console.log(`Email sent successfully to ${appointment.patient_profiles.email}`);
          } catch (emailError) {
            console.error("Error sending email:", emailError);
          }

          // Create notification record
          await supabaseClient.from("notifications").insert({
            user_id: appointment.user_id,
            type: "appointment_reminder",
            title: "Appointment Reminder",
            message: message,
            related_id: appointment.id,
            scheduled_for: now.toISOString(),
            sent_at: now.toISOString(),
          });
        }
      }
    }

    return new Response(JSON.stringify({ success: true, checked: appointments?.length || 0 }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-appointment-reminder:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
