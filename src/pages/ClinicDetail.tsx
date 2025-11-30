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

type Clinic = {
  id: string;
  name: string;
  address: string;
  rating: number | null;
  reviews_count: number | null;
  services: string[] | null;
  timings: string | null;
  phone: string | null;
};

const ClinicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [clinicLoading, setClinicLoading] = useState(true);

  // Fetch clinic data
  useEffect(() => {
    const fetchClinic = async () => {
      if (!id) return;
      
      setClinicLoading(true);
      try {
        const { data, error } = await supabase
          .from('clinics')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setClinic(data);
      } catch (error: any) {
        console.error('Error fetching clinic:', error);
        toast({
          title: "Error",
          description: "Failed to load clinic details",
          variant: "destructive",
        });
      } finally {
        setClinicLoading(false);
      }
    };

    fetchClinic();
  }, [id, toast]);

  // Fetch doctors assigned to this clinic
  useEffect(() => {
    const fetchDoctors = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Fetch clinic_doctors associations
        const { data: clinicDoctors, error: cdError } = await supabase
          .from('clinic_doctors')
          .select('doctor_id')
          .eq('clinic_id', id);

        if (cdError) throw cdError;

        if (clinicDoctors && clinicDoctors.length > 0) {
          const doctorIds = clinicDoctors.map(cd => cd.doctor_id);
          
          // Fetch doctor profiles
          const { data: doctorData, error: docError } = await supabase
            .from('public_doctor_profiles')
            .select('*')
            .in('id', doctorIds);

          if (docError) throw docError;
          setDoctors(doctorData || []);
        } else {
          setDoctors([]);
        }
      } catch (error: any) {
        console.error('Error fetching doctors:', error);
        toast({
          title: "Error",
          description: "Failed to load doctors",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [id, toast]);

  const handleBookAppointment = async (doctor: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please login to book an appointment",
        variant: "destructive",
      });
      navigate("/auth?mode=login");
      return;
    }

    // Navigate to booking page with doctor details (using real doctor UUID)
    navigate(`/book-appointment/${doctor.id}?clinicId=${id}&doctorName=${encodeURIComponent(doctor.full_name)}&qualification=${encodeURIComponent(doctor.qualifications || 'BAMS')}&specialization=${encodeURIComponent(doctor.specialty || 'General')}&experience=${doctor.experience_years ? `${doctor.experience_years} years` : '5 years'}&rating=${doctor.rating || 4.5}&reviews=${doctor.reviews || 0}&fee=${doctor.consultation_fee ? `₹${doctor.consultation_fee}` : '₹500'}&clinicName=${encodeURIComponent(doctor.clinic_name || clinic?.name || '')}&clinicAddress=${encodeURIComponent(doctor.clinic_address || clinic?.address || '')}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Clinic Info */}
          {clinicLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading clinic details...</p>
            </div>
          ) : clinic ? (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <CardTitle className="text-3xl mb-3">{clinic.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-base mb-2">
                      <MapPin className="h-4 w-4" />
                      {clinic.address}
                    </CardDescription>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {clinic.timings || 'Not specified'}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {clinic.phone || 'Not available'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-accent/10 px-4 py-2 rounded-lg">
                    <Star className="h-5 w-5 fill-accent text-accent" />
                    <span className="font-semibold text-lg">{clinic.rating || 0}</span>
                    <span className="text-sm text-muted-foreground">({clinic.reviews_count || 0})</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {clinic.services && clinic.services.length > 0 ? (
                    clinic.services.map((service) => (
                      <Badge key={service} variant="secondary" className="text-sm">
                        {service}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No services listed</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Clinic not found</p>
            </div>
          )}

          {/* Doctors List */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Available Doctors</h2>
            <p className="text-muted-foreground">Choose from our team of experienced Ayurvedic practitioners</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading doctors...</p>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No doctors available at this clinic</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-[var(--shadow-medium)] transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{doctor.full_name}</CardTitle>
                        <div className="space-y-1 text-sm">
                          <p className="text-muted-foreground flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            {doctor.qualifications || 'BAMS'}
                          </p>
                          <p className="font-medium text-primary">{doctor.specialty || 'General Practice'}</p>
                          <p className="text-muted-foreground">{doctor.experience_years ? `${doctor.experience_years} years` : '5+ years'} of experience</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1">Consultation Fee</p>
                          <p className="font-medium text-lg text-primary">₹{doctor.consultation_fee || 500}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Clinic</p>
                          <p className="font-medium">{doctor.clinic_name || clinic?.name || 'Not specified'}</p>
                        </div>
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
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ClinicDetail;
