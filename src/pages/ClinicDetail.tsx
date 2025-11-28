import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, Phone, Award, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Mock clinic and doctor data
const mockClinic = {
  id: 1,
  name: "Vedic Ayurveda Center",
  address: "123 Wellness Street, Puttur, Mangalore",
  rating: 4.8,
  reviews: 234,
  services: ["Panchakarma", "Consultation", "Massage Therapy"],
  timings: "9:00 AM - 8:00 PM",
  phone: "+91 98765 43210",
};

const mockDoctors = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    qualification: "BAMS, MD (Kayachikitsa)",
    specialization: "Panchakarma & General Medicine",
    experience: "15 years",
    rating: 4.9,
    reviews: 156,
    languages: ["English", "Hindi", "Kannada"],
    consultationFee: "₹500",
    availability: "Mon-Sat",
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    qualification: "BAMS, MD (Shalya Tantra)",
    specialization: "Ksharasutra & Surgery",
    experience: "12 years",
    rating: 4.7,
    reviews: 123,
    languages: ["English", "Hindi"],
    consultationFee: "₹600",
    availability: "Mon-Fri",
  },
  {
    id: 3,
    name: "Dr. Ananya Rao",
    qualification: "BAMS, MD (Prasuti Tantra)",
    specialization: "Women's Health & Fertility",
    experience: "10 years",
    rating: 4.8,
    reviews: 98,
    languages: ["English", "Kannada", "Tulu"],
    consultationFee: "₹550",
    availability: "Tue-Sat",
  },
  {
    id: 4,
    name: "Dr. Vikram Bhat",
    qualification: "BAMS, MD (Shalakya Tantra)",
    specialization: "ENT & Ophthalmology",
    experience: "8 years",
    rating: 4.6,
    reviews: 87,
    languages: ["English", "Kannada"],
    consultationFee: "₹450",
    availability: "Mon-Sat",
  },
  {
    id: 5,
    name: "Dr. Meera Nair",
    qualification: "BAMS, MD (Bala Roga)",
    specialization: "Pediatrics & Child Care",
    experience: "11 years",
    rating: 4.9,
    reviews: 142,
    languages: ["English", "Malayalam", "Kannada"],
    consultationFee: "₹500",
    availability: "Mon-Fri",
  },
  {
    id: 6,
    name: "Dr. Suresh Shenoy",
    qualification: "BAMS, PhD (Dravyaguna)",
    specialization: "Herbal Medicine & Nutrition",
    experience: "18 years",
    rating: 4.8,
    reviews: 178,
    languages: ["English", "Kannada", "Tulu"],
    consultationFee: "₹700",
    availability: "Mon-Sat",
  },
  {
    id: 7,
    name: "Dr. Lakshmi Kamath",
    qualification: "BAMS, MD (Manas Roga)",
    specialization: "Mental Health & Stress Management",
    experience: "9 years",
    rating: 4.7,
    reviews: 91,
    languages: ["English", "Hindi", "Kannada"],
    consultationFee: "₹600",
    availability: "Tue-Sat",
  },
  {
    id: 8,
    name: "Dr. Arun Hegde",
    qualification: "BAMS, MD (Rasashastra)",
    specialization: "Toxicology & Rejuvenation",
    experience: "14 years",
    rating: 4.8,
    reviews: 134,
    languages: ["English", "Kannada"],
    consultationFee: "₹550",
    availability: "Mon-Sat",
  },
];

const ClinicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

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

    // Navigate to booking page with doctor details
    navigate(`/book-appointment/${doctor.id}?clinicId=${id}&doctorName=${encodeURIComponent(doctor.name)}&qualification=${encodeURIComponent(doctor.qualification)}&specialization=${encodeURIComponent(doctor.specialization)}&experience=${encodeURIComponent(doctor.experience)}&rating=${doctor.rating}&reviews=${doctor.reviews}&fee=${encodeURIComponent(doctor.consultationFee)}`);
  };

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
                  <CardTitle className="text-3xl mb-3">{mockClinic.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-base mb-2">
                    <MapPin className="h-4 w-4" />
                    {mockClinic.address}
                  </CardDescription>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {mockClinic.timings}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {mockClinic.phone}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-accent/10 px-4 py-2 rounded-lg">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="font-semibold text-lg">{mockClinic.rating}</span>
                  <span className="text-sm text-muted-foreground">({mockClinic.reviews})</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockClinic.services.map((service) => (
                  <Badge key={service} variant="secondary" className="text-sm">
                    {service}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Doctors List */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Available Doctors</h2>
            <p className="text-muted-foreground">Choose from our team of experienced Ayurvedic practitioners</p>
          </div>

          <div className="grid gap-6">
            {mockDoctors.map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-[var(--shadow-medium)] transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{doctor.name}</CardTitle>
                      <div className="space-y-1 text-sm">
                        <p className="text-muted-foreground flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          {doctor.qualification}
                        </p>
                        <p className="font-medium text-primary">{doctor.specialization}</p>
                        <p className="text-muted-foreground">{doctor.experience} of experience</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-accent/10 px-3 py-1 rounded-lg">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="font-semibold">{doctor.rating}</span>
                      <span className="text-sm text-muted-foreground">({doctor.reviews})</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Languages</p>
                        <p className="font-medium">{doctor.languages.join(", ")}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Consultation Fee</p>
                        <p className="font-medium text-lg text-primary">{doctor.consultationFee}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Availability</p>
                        <p className="font-medium">{doctor.availability}</p>
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ClinicDetail;
