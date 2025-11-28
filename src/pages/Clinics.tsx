import { useSearchParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, Phone } from "lucide-react";

// Mock clinic data - dynamically generated based on location
const getClinicsByLocation = (taluk: string) => {
  const allClinics = [
    // Dakshina Kannada - Puttur
    {
      id: 1,
      name: "Vedic Ayurveda Center",
      address: "123 Wellness Street, Puttur",
      rating: 4.8,
      reviews: 234,
      services: ["Panchakarma", "Consultation", "Massage Therapy"],
      timings: "9:00 AM - 8:00 PM",
      phone: "+91 98765 43210",
      taluk: "Puttur",
    },
    {
      id: 2,
      name: "Nature's Healing Clinic",
      address: "456 Health Avenue, Puttur",
      rating: 4.6,
      reviews: 189,
      services: ["Herbal Medicine", "Yoga Therapy", "Diet Consultation"],
      timings: "8:00 AM - 6:00 PM",
      phone: "+91 98765 43211",
      taluk: "Puttur",
    },
    // Dakshina Kannada - Mangaluru
    {
      id: 3,
      name: "Coastal Ayurveda Hospital",
      address: "78 MG Road, Mangaluru",
      rating: 4.9,
      reviews: 456,
      services: ["Panchakarma", "Surgery", "Consultation"],
      timings: "8:00 AM - 9:00 PM",
      phone: "+91 98765 43212",
      taluk: "Mangaluru",
    },
    {
      id: 4,
      name: "Mangalore Ayurvedic Clinic",
      address: "45 Lighthouse Hill Road, Mangaluru",
      rating: 4.7,
      reviews: 298,
      services: ["Marma Therapy", "Herbal Medicine", "Detox Programs"],
      timings: "9:00 AM - 7:00 PM",
      phone: "+91 98765 43213",
      taluk: "Mangaluru",
    },
    // Dakshina Kannada - Bantwal
    {
      id: 5,
      name: "Bantwal Ayurveda Center",
      address: "12 BC Road, Bantwal",
      rating: 4.5,
      reviews: 167,
      services: ["Consultation", "Herbal Medicine", "Massage Therapy"],
      timings: "9:00 AM - 6:00 PM",
      phone: "+91 98765 43214",
      taluk: "Bantwal",
    },
    // Dakshina Kannada - Sullia
    {
      id: 6,
      name: "Sullia Nature Cure",
      address: "34 Temple Street, Sullia",
      rating: 4.6,
      reviews: 145,
      services: ["Panchakarma", "Diet Consultation", "Yoga Therapy"],
      timings: "8:00 AM - 7:00 PM",
      phone: "+91 98765 43215",
      taluk: "Sullia",
    },
    // Dakshina Kannada - Belthangady
    {
      id: 7,
      name: "Belthangady Wellness Clinic",
      address: "56 Market Road, Belthangady",
      rating: 4.4,
      reviews: 123,
      services: ["Consultation", "Herbal Medicine", "Women's Health"],
      timings: "9:00 AM - 6:00 PM",
      phone: "+91 98765 43216",
      taluk: "Belthangady",
    },
    // Udupi - Udupi
    {
      id: 8,
      name: "Krishna Ayurveda Hospital",
      address: "89 Temple Street, Udupi",
      rating: 4.8,
      reviews: 412,
      services: ["Panchakarma", "Surgery", "Consultation"],
      timings: "8:00 AM - 8:00 PM",
      phone: "+91 98765 43217",
      taluk: "Udupi",
    },
    {
      id: 9,
      name: "Manipal Ayurvedic Center",
      address: "23 University Road, Udupi",
      rating: 4.7,
      reviews: 356,
      services: ["Consultation", "Marma Therapy", "Herbal Medicine"],
      timings: "9:00 AM - 7:00 PM",
      phone: "+91 98765 43218",
      taluk: "Udupi",
    },
    // Udupi - Kundapura
    {
      id: 10,
      name: "Kundapura Healing Center",
      address: "67 Main Road, Kundapura",
      rating: 4.6,
      reviews: 189,
      services: ["Panchakarma", "Massage Therapy", "Diet Consultation"],
      timings: "8:00 AM - 6:00 PM",
      phone: "+91 98765 43219",
      taluk: "Kundapura",
    },
    // Udupi - Karkala
    {
      id: 11,
      name: "Karkala Ayurveda Clinic",
      address: "12 Church Road, Karkala",
      rating: 4.5,
      reviews: 167,
      services: ["Consultation", "Herbal Medicine", "Yoga Therapy"],
      timings: "9:00 AM - 6:00 PM",
      phone: "+91 98765 43220",
      taluk: "Karkala",
    },
    // Hassan - Hassan
    {
      id: 12,
      name: "Hassan Heritage Ayurveda",
      address: "34 BM Road, Hassan",
      rating: 4.7,
      reviews: 289,
      services: ["Panchakarma", "Surgery", "Consultation"],
      timings: "8:00 AM - 8:00 PM",
      phone: "+91 98765 43221",
      taluk: "Hassan",
    },
    {
      id: 13,
      name: "Malnad Ayurvedic Hospital",
      address: "78 Gandhinagar, Hassan",
      rating: 4.6,
      reviews: 234,
      services: ["Marma Therapy", "Herbal Medicine", "Detox Programs"],
      timings: "9:00 AM - 7:00 PM",
      phone: "+91 98765 43222",
      taluk: "Hassan",
    },
    // Hassan - Belur
    {
      id: 14,
      name: "Belur Temple Town Ayurveda",
      address: "45 Temple Road, Belur",
      rating: 4.5,
      reviews: 178,
      services: ["Consultation", "Massage Therapy", "Herbal Medicine"],
      timings: "8:00 AM - 6:00 PM",
      phone: "+91 98765 43223",
      taluk: "Belur",
    },
    // Hassan - Sakleshpur
    {
      id: 15,
      name: "Sakleshpur Hills Ayurveda",
      address: "23 Coffee Estate Road, Sakleshpur",
      rating: 4.8,
      reviews: 312,
      services: ["Panchakarma", "Diet Consultation", "Yoga Therapy"],
      timings: "9:00 AM - 7:00 PM",
      phone: "+91 98765 43224",
      taluk: "Sakleshpur",
    },
    // Hassan - Arkalgud
    {
      id: 16,
      name: "Arkalgud Wellness Center",
      address: "56 Main Street, Arkalgud",
      rating: 4.4,
      reviews: 145,
      services: ["Consultation", "Herbal Medicine", "Women's Health"],
      timings: "8:00 AM - 6:00 PM",
      phone: "+91 98765 43225",
      taluk: "Arkalgud",
    },
    // Kodagu - Madikeri
    {
      id: 17,
      name: "Coorg Ayurveda Retreat",
      address: "89 Raja's Seat Road, Madikeri",
      rating: 4.9,
      reviews: 478,
      services: ["Panchakarma", "Detox Programs", "Massage Therapy"],
      timings: "8:00 AM - 8:00 PM",
      phone: "+91 98765 43226",
      taluk: "Madikeri",
    },
    {
      id: 18,
      name: "Madikeri Nature Cure",
      address: "34 Abbey Falls Road, Madikeri",
      rating: 4.7,
      reviews: 356,
      services: ["Consultation", "Herbal Medicine", "Yoga Therapy"],
      timings: "9:00 AM - 7:00 PM",
      phone: "+91 98765 43227",
      taluk: "Madikeri",
    },
    // Kodagu - Somwarpet
    {
      id: 19,
      name: "Somwarpet Healing Hub",
      address: "67 Market Road, Somwarpet",
      rating: 4.5,
      reviews: 198,
      services: ["Panchakarma", "Massage Therapy", "Diet Consultation"],
      timings: "8:00 AM - 6:00 PM",
      phone: "+91 98765 43228",
      taluk: "Somwarpet",
    },
    // Kodagu - Virajpet
    {
      id: 20,
      name: "Virajpet Ayurveda Clinic",
      address: "12 Coffee Estate, Virajpet",
      rating: 4.6,
      reviews: 212,
      services: ["Consultation", "Herbal Medicine", "Marma Therapy"],
      timings: "9:00 AM - 6:00 PM",
      phone: "+91 98765 43229",
      taluk: "Virajpet",
    },
    // Chikkamagalur - Chikkamagalur
    {
      id: 21,
      name: "Chikkamagalur Ayurvedic Hospital",
      address: "78 MG Road, Chikkamagalur",
      rating: 4.8,
      reviews: 423,
      services: ["Panchakarma", "Surgery", "Consultation"],
      timings: "8:00 AM - 8:00 PM",
      phone: "+91 98765 43230",
      taluk: "Chikkamagalur",
    },
    {
      id: 22,
      name: "Coffee Land Ayurveda",
      address: "45 Mullayangiri Road, Chikkamagalur",
      rating: 4.7,
      reviews: 367,
      services: ["Marma Therapy", "Herbal Medicine", "Detox Programs"],
      timings: "9:00 AM - 7:00 PM",
      phone: "+91 98765 43231",
      taluk: "Chikkamagalur",
    },
    // Chikkamagalur - Koppa
    {
      id: 23,
      name: "Koppa Nature Cure",
      address: "23 Temple Street, Koppa",
      rating: 4.5,
      reviews: 178,
      services: ["Consultation", "Massage Therapy", "Yoga Therapy"],
      timings: "8:00 AM - 6:00 PM",
      phone: "+91 98765 43232",
      taluk: "Koppa",
    },
    // Chikkamagalur - Mudigere
    {
      id: 24,
      name: "Mudigere Wellness Center",
      address: "56 Market Road, Mudigere",
      rating: 4.6,
      reviews: 234,
      services: ["Panchakarma", "Diet Consultation", "Herbal Medicine"],
      timings: "9:00 AM - 6:00 PM",
      phone: "+91 98765 43233",
      taluk: "Mudigere",
    },
    // Chikkamagalur - Tarikere
    {
      id: 25,
      name: "Tarikere Ayurveda Clinic",
      address: "89 Main Street, Tarikere",
      rating: 4.4,
      reviews: 156,
      services: ["Consultation", "Herbal Medicine", "Women's Health"],
      timings: "8:00 AM - 6:00 PM",
      phone: "+91 98765 43234",
      taluk: "Tarikere",
    },
  ];
  
  return allClinics.filter(clinic => 
    taluk ? clinic.taluk.toLowerCase() === taluk.toLowerCase() : true
  );
};

const Clinics = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const state = searchParams.get("state");
  const district = searchParams.get("district");
  const taluk = searchParams.get("taluk");
  
  
  const mockClinics = getClinicsByLocation(taluk || "");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Ayurvedic Clinics in {taluk}, {district}
            </h1>
            <p className="text-muted-foreground">
              {state} • {mockClinics.length} clinics found
            </p>
          </div>

          <div className="grid gap-6">
            {mockClinics.map((clinic) => (
              <Card key={clinic.id} className="hover:shadow-[var(--shadow-medium)] transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl mb-2">{clinic.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-base">
                        <MapPin className="h-4 w-4" />
                        {clinic.address}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1 bg-accent/10 px-3 py-1 rounded-lg">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="font-semibold">{clinic.rating}</span>
                      <span className="text-sm text-muted-foreground">({clinic.reviews})</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {clinic.services.map((service) => (
                        <Badge key={service} variant="secondary">
                          {service}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {clinic.timings}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {clinic.phone}
                      </div>
                    </div>

                    <Link to={`/clinic/${clinic.id}`}>
                      <Button className="w-full sm:w-auto">
                        View Doctors & Book Appointment
                      </Button>
                    </Link>
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

export default Clinics;
