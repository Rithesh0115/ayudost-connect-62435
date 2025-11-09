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
    {
      id: 3,
      name: "Ayurvedic Wellness Hub",
      address: "789 Serenity Road, Puttur",
      rating: 4.9,
      reviews: 312,
      services: ["Panchakarma", "Marma Therapy", "Herbal Medicine"],
      timings: "10:00 AM - 9:00 PM",
      phone: "+91 98765 43212",
      taluk: "Puttur",
    },
    {
      id: 4,
      name: "Shanti Ayurveda Hospital",
      address: "12 Temple Road, Puttur",
      rating: 4.7,
      reviews: 178,
      services: ["Surgery", "Panchakarma", "Consultation"],
      timings: "8:00 AM - 8:00 PM",
      phone: "+91 98765 43213",
      taluk: "Puttur",
    },
    {
      id: 5,
      name: "Holistic Care Ayurveda",
      address: "34 Market Street, Puttur",
      rating: 4.5,
      reviews: 156,
      services: ["Women's Health", "Pediatrics", "Herbal Medicine"],
      timings: "9:00 AM - 7:00 PM",
      phone: "+91 98765 43214",
      taluk: "Puttur",
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
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  
  if (!isLoggedIn) {
    navigate("/auth?mode=login");
    return null;
  }
  
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
