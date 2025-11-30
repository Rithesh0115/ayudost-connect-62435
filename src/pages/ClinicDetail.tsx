import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, Phone, Award, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Mock clinic data mapping
const clinicsData: Record<string, any> = {
  "1": { id: 1, name: "Vedic Ayurveda Center", address: "123 Wellness Street, Puttur", rating: 4.8, reviews: 234, services: ["Panchakarma", "Consultation", "Massage Therapy"], timings: "9:00 AM - 8:00 PM", phone: "+91 98765 43210" },
  "2": { id: 2, name: "Nature's Healing Clinic", address: "456 Health Avenue, Puttur", rating: 4.6, reviews: 189, services: ["Herbal Medicine", "Yoga Therapy", "Diet Consultation"], timings: "8:00 AM - 6:00 PM", phone: "+91 98765 43211" },
  "3": { id: 3, name: "Coastal Ayurveda Hospital", address: "78 MG Road, Mangaluru", rating: 4.9, reviews: 456, services: ["Panchakarma", "Surgery", "Consultation"], timings: "8:00 AM - 9:00 PM", phone: "+91 98765 43212" },
  "4": { id: 4, name: "Mangalore Ayurvedic Clinic", address: "45 Lighthouse Hill Road, Mangaluru", rating: 4.7, reviews: 298, services: ["Marma Therapy", "Herbal Medicine", "Detox Programs"], timings: "9:00 AM - 7:00 PM", phone: "+91 98765 43213" },
  "5": { id: 5, name: "Bantwal Ayurveda Center", address: "12 BC Road, Bantwal", rating: 4.5, reviews: 167, services: ["Consultation", "Herbal Medicine", "Massage Therapy"], timings: "9:00 AM - 6:00 PM", phone: "+91 98765 43214" },
  "6": { id: 6, name: "Sullia Nature Cure", address: "34 Temple Street, Sullia", rating: 4.6, reviews: 145, services: ["Panchakarma", "Diet Consultation", "Yoga Therapy"], timings: "8:00 AM - 7:00 PM", phone: "+91 98765 43215" },
  "7": { id: 7, name: "Belthangady Wellness Clinic", address: "56 Market Road, Belthangady", rating: 4.4, reviews: 123, services: ["Consultation", "Herbal Medicine", "Women's Health"], timings: "9:00 AM - 6:00 PM", phone: "+91 98765 43216" },
  "8": { id: 8, name: "Krishna Ayurveda Hospital", address: "89 Temple Street, Udupi", rating: 4.8, reviews: 412, services: ["Panchakarma", "Surgery", "Consultation"], timings: "8:00 AM - 8:00 PM", phone: "+91 98765 43217" },
  "9": { id: 9, name: "Manipal Ayurvedic Center", address: "23 University Road, Udupi", rating: 4.7, reviews: 356, services: ["Consultation", "Marma Therapy", "Herbal Medicine"], timings: "9:00 AM - 7:00 PM", phone: "+91 98765 43218" },
  "10": { id: 10, name: "Kundapura Healing Center", address: "67 Main Road, Kundapura", rating: 4.6, reviews: 189, services: ["Panchakarma", "Massage Therapy", "Diet Consultation"], timings: "8:00 AM - 6:00 PM", phone: "+91 98765 43219" },
  "11": { id: 11, name: "Karkala Ayurveda Clinic", address: "12 Church Road, Karkala", rating: 4.5, reviews: 167, services: ["Consultation", "Herbal Medicine", "Yoga Therapy"], timings: "9:00 AM - 6:00 PM", phone: "+91 98765 43220" },
  "12": { id: 12, name: "Hassan Heritage Ayurveda", address: "34 BM Road, Hassan", rating: 4.7, reviews: 289, services: ["Panchakarma", "Surgery", "Consultation"], timings: "8:00 AM - 8:00 PM", phone: "+91 98765 43221" },
  "13": { id: 13, name: "Malnad Ayurvedic Hospital", address: "78 Gandhinagar, Hassan", rating: 4.6, reviews: 234, services: ["Marma Therapy", "Herbal Medicine", "Detox Programs"], timings: "9:00 AM - 7:00 PM", phone: "+91 98765 43222" },
  "14": { id: 14, name: "Belur Temple Town Ayurveda", address: "45 Temple Road, Belur", rating: 4.5, reviews: 178, services: ["Consultation", "Massage Therapy", "Herbal Medicine"], timings: "8:00 AM - 6:00 PM", phone: "+91 98765 43223" },
  "15": { id: 15, name: "Sakleshpur Hills Ayurveda", address: "23 Coffee Estate Road, Sakleshpur", rating: 4.8, reviews: 312, services: ["Panchakarma", "Diet Consultation", "Yoga Therapy"], timings: "9:00 AM - 7:00 PM", phone: "+91 98765 43224" },
  "16": { id: 16, name: "Arkalgud Wellness Center", address: "56 Main Street, Arkalgud", rating: 4.4, reviews: 145, services: ["Consultation", "Herbal Medicine", "Women's Health"], timings: "8:00 AM - 6:00 PM", phone: "+91 98765 43225" },
  "17": { id: 17, name: "Coorg Ayurveda Retreat", address: "89 Raja's Seat Road, Madikeri", rating: 4.9, reviews: 478, services: ["Panchakarma", "Detox Programs", "Massage Therapy"], timings: "8:00 AM - 8:00 PM", phone: "+91 98765 43226" },
  "18": { id: 18, name: "Madikeri Nature Cure", address: "34 Abbey Falls Road, Madikeri", rating: 4.7, reviews: 356, services: ["Consultation", "Herbal Medicine", "Yoga Therapy"], timings: "9:00 AM - 7:00 PM", phone: "+91 98765 43227" },
  "19": { id: 19, name: "Somwarpet Healing Hub", address: "67 Market Road, Somwarpet", rating: 4.5, reviews: 198, services: ["Panchakarma", "Massage Therapy", "Diet Consultation"], timings: "8:00 AM - 6:00 PM", phone: "+91 98765 43228" },
  "20": { id: 20, name: "Virajpet Ayurveda Clinic", address: "12 Coffee Estate, Virajpet", rating: 4.6, reviews: 212, services: ["Consultation", "Herbal Medicine", "Marma Therapy"], timings: "9:00 AM - 6:00 PM", phone: "+91 98765 43229" },
  "21": { id: 21, name: "Chikkamagalur Ayurvedic Hospital", address: "78 MG Road, Chikkamagalur", rating: 4.8, reviews: 423, services: ["Panchakarma", "Surgery", "Consultation"], timings: "8:00 AM - 8:00 PM", phone: "+91 98765 43230" },
  "22": { id: 22, name: "Coffee Land Ayurveda", address: "45 Mullayangiri Road, Chikkamagalur", rating: 4.7, reviews: 367, services: ["Marma Therapy", "Herbal Medicine", "Detox Programs"], timings: "9:00 AM - 7:00 PM", phone: "+91 98765 43231" },
  "23": { id: 23, name: "Koppa Nature Cure", address: "23 Temple Street, Koppa", rating: 4.5, reviews: 178, services: ["Consultation", "Massage Therapy", "Yoga Therapy"], timings: "8:00 AM - 6:00 PM", phone: "+91 98765 43232" },
  "24": { id: 24, name: "Mudigere Wellness Center", address: "56 Market Road, Mudigere", rating: 4.6, reviews: 234, services: ["Panchakarma", "Diet Consultation", "Herbal Medicine"], timings: "9:00 AM - 6:00 PM", phone: "+91 98765 43233" },
  "25": { id: 25, name: "Tarikere Ayurveda Clinic", address: "89 Main Street, Tarikere", rating: 4.4, reviews: 156, services: ["Consultation", "Herbal Medicine", "Women's Health"], timings: "8:00 AM - 6:00 PM", phone: "+91 98765 43234" },
};

// Doctor pool - each clinic gets 4-5 doctors
const allDoctors = [
  { id: 1, name: "Dr. Priya Sharma", qualification: "BAMS, MD (Kayachikitsa)", specialization: "Panchakarma & General Medicine", experience: "15 years", rating: 4.9, reviews: 156, languages: ["English", "Hindi", "Kannada"], consultationFee: "₹500", availability: "Mon-Sat" },
  { id: 2, name: "Dr. Rajesh Kumar", qualification: "BAMS, MD (Shalya Tantra)", specialization: "Ksharasutra & Surgery", experience: "12 years", rating: 4.7, reviews: 123, languages: ["English", "Hindi"], consultationFee: "₹600", availability: "Mon-Fri" },
  { id: 3, name: "Dr. Ananya Rao", qualification: "BAMS, MD (Prasuti Tantra)", specialization: "Women's Health & Fertility", experience: "10 years", rating: 4.8, reviews: 98, languages: ["English", "Kannada", "Tulu"], consultationFee: "₹550", availability: "Tue-Sat" },
  { id: 4, name: "Dr. Vikram Bhat", qualification: "BAMS, MD (Shalakya Tantra)", specialization: "ENT & Ophthalmology", experience: "8 years", rating: 4.6, reviews: 87, languages: ["English", "Kannada"], consultationFee: "₹450", availability: "Mon-Sat" },
  { id: 5, name: "Dr. Meera Nair", qualification: "BAMS, MD (Bala Roga)", specialization: "Pediatrics & Child Care", experience: "11 years", rating: 4.9, reviews: 142, languages: ["English", "Malayalam", "Kannada"], consultationFee: "₹500", availability: "Mon-Fri" },
  { id: 6, name: "Dr. Suresh Shenoy", qualification: "BAMS, PhD (Dravyaguna)", specialization: "Herbal Medicine & Nutrition", experience: "18 years", rating: 4.8, reviews: 178, languages: ["English", "Kannada", "Tulu"], consultationFee: "₹700", availability: "Mon-Sat" },
  { id: 7, name: "Dr. Lakshmi Kamath", qualification: "BAMS, MD (Manas Roga)", specialization: "Mental Health & Stress Management", experience: "9 years", rating: 4.7, reviews: 91, languages: ["English", "Hindi", "Kannada"], consultationFee: "₹600", availability: "Tue-Sat" },
  { id: 8, name: "Dr. Arun Hegde", qualification: "BAMS, MD (Rasashastra)", specialization: "Toxicology & Rejuvenation", experience: "14 years", rating: 4.8, reviews: 134, languages: ["English", "Kannada"], consultationFee: "₹550", availability: "Mon-Sat" },
  { id: 9, name: "Dr. Suma Pai", qualification: "BAMS, MD (Panchakarma)", specialization: "Detox & Cleansing Therapy", experience: "13 years", rating: 4.7, reviews: 165, languages: ["English", "Kannada", "Konkani"], consultationFee: "₹550", availability: "Mon-Sat" },
  { id: 10, name: "Dr. Ganesh Nayak", qualification: "BAMS, MD (Kayachikitsa)", specialization: "Chronic Diseases & Immunity", experience: "16 years", rating: 4.9, reviews: 201, languages: ["English", "Kannada", "Tulu"], consultationFee: "₹650", availability: "Mon-Fri" },
  { id: 11, name: "Dr. Kavitha Shetty", qualification: "BAMS, MD (Prasuti Tantra)", specialization: "Women's Wellness", experience: "10 years", rating: 4.8, reviews: 112, languages: ["English", "Kannada"], consultationFee: "₹500", availability: "Tue-Sat" },
  { id: 12, name: "Dr. Mohan Rao", qualification: "BAMS, MD (Shalakya)", specialization: "Eye & Ear Care", experience: "11 years", rating: 4.6, reviews: 89, languages: ["English", "Telugu", "Kannada"], consultationFee: "₹500", availability: "Mon-Sat" },
  { id: 13, name: "Dr. Deepa Bhandary", qualification: "BAMS, MD (Bala Roga)", specialization: "Child Health", experience: "9 years", rating: 4.8, reviews: 127, languages: ["English", "Hindi", "Kannada"], consultationFee: "₹450", availability: "Mon-Fri" },
  { id: 14, name: "Dr. Ashok Kumar", qualification: "BAMS, PhD (Rasa Shastra)", specialization: "Traditional Medicine", experience: "20 years", rating: 4.9, reviews: 234, languages: ["English", "Kannada"], consultationFee: "₹750", availability: "Mon-Sat" },
  { id: 15, name: "Dr. Nandini Rao", qualification: "BAMS, MD (Kayachikitsa)", specialization: "Lifestyle Diseases", experience: "12 years", rating: 4.7, reviews: 143, languages: ["English", "Kannada", "Tamil"], consultationFee: "₹600", availability: "Tue-Sat" },
];

// Function to get 4-5 doctors for a clinic
const getDoctorsByClinicId = (clinicId: string): typeof allDoctors => {
  const clinicIdNum = parseInt(clinicId);
  const startIndex = ((clinicIdNum - 1) * 4) % allDoctors.length;
  const count = 4 + (clinicIdNum % 2); // Alternates between 4 and 5 doctors
  
  const doctors = [];
  for (let i = 0; i < count; i++) {
    doctors.push(allDoctors[(startIndex + i) % allDoctors.length]);
  }
  return doctors;
};

const ClinicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const mockClinic = clinicsData[id || "1"] || clinicsData["1"];
  const mockDoctors = getDoctorsByClinicId(id || "1");

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
