import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, Phone, Award, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ClinicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clinic, setClinic] = useState<any>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClinicAndDoctors = async () => {
      setLoading(true);

      // Fetch clinic details
      const { data: clinicData, error: clinicError } = await supabase
        .from('clinics')
        .select('*')
        .eq('id', id)
        .single();

      if (clinicError || !clinicData) {
        toast({
          title: "Clinic Not Found",
          description: "The clinic you're looking for doesn't exist",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setClinic(clinicData);

      // Fetch doctors linked to this clinic
      const { data: doctorLinks, error: linksError } = await supabase
        .from('clinic_doctors')
        .select('doctor_id')
        .eq('clinic_id', id);

      if (!linksError && doctorLinks && doctorLinks.length > 0) {
        const doctorIds = doctorLinks.map(link => link.doctor_id);
        
        const { data: doctorsData, error: doctorsError } = await supabase
          .from('public_doctor_profiles')
          .select('*')
          .in('id', doctorIds);

        if (!doctorsError && doctorsData) {
          setDoctors(doctorsData);
        }
      }

      setLoading(false);
    };

    if (id) {
      fetchClinicAndDoctors();
    }
  }, [id, navigate, toast]);

  const handleBookAppointment = async (doctor: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please login to book an appointment",
        variant: "destructive",
      });
      navigate("/patient-auth?mode=login");
      return;
    }

    // Navigate to booking page with doctor details
    navigate(`/book-appointment/${doctor.id}?clinicId=${id}&clinicName=${encodeURIComponent(clinic?.name || '')}&doctorName=${encodeURIComponent(doctor.full_name)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading clinic details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Clinic not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Clinic Info */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-3xl mb-3">{clinic.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-base mb-2">
                    <MapPin className="h-4 w-4" />
                    {clinic.address}, {clinic.taluk}, {clinic.district}, {clinic.state}
                  </CardDescription>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                    {clinic.timings && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {clinic.timings}
                      </div>
                    )}
                    {clinic.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {clinic.phone}
                      </div>
                    )}
                  </div>
                </div>
                {clinic.rating > 0 && (
                  <div className="flex items-center gap-1 bg-accent/10 px-4 py-2 rounded-lg">
                    <Star className="h-5 w-5 fill-accent text-accent" />
                    <span className="font-semibold text-lg">{clinic.rating}</span>
                    <span className="text-sm text-muted-foreground">({clinic.reviews_count || 0})</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {clinic.services && clinic.services.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {clinic.services.map((service: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-sm">
                      {service}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Doctors List */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Available Doctors</h2>
            <p className="text-muted-foreground">
              {doctors.length > 0 
                ? "Choose from our team of experienced Ayurvedic practitioners"
                : "No doctors are currently assigned to this clinic"}
            </p>
          </div>

          {doctors.length > 0 ? (
            <div className="grid gap-6">
              {doctors.map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-[var(--shadow-medium)] transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{doctor.full_name}</CardTitle>
                      <div className="space-y-1 text-sm">
                        {doctor.qualifications && (
                          <p className="text-muted-foreground flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            {doctor.qualifications}
                          </p>
                        )}
                        {doctor.specialty && <p className="font-medium text-primary">{doctor.specialty}</p>}
                        {doctor.experience_years && <p className="text-muted-foreground">{doctor.experience_years} years of experience</p>}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {doctor.consultation_fee && (
                        <div>
                          <p className="text-muted-foreground mb-1">Consultation Fee</p>
                          <p className="font-medium text-lg text-primary">₹{doctor.consultation_fee}</p>
                        </div>
                      )}
                      {doctor.bio && (
                        <div className="md:col-span-2">
                          <p className="text-muted-foreground mb-1">About</p>
                          <p className="text-sm">{doctor.bio}</p>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full md:w-auto"
                      onClick={() => handleBookAppointment(doctor)}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Book Appointment
                    </Button>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No doctors available at this clinic yet.</p>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ClinicDetail;
