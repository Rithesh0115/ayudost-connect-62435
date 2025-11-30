import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Clinics = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const state = searchParams.get("state");
  const district = searchParams.get("district");
  const taluk = searchParams.get("taluk");
  const [clinics, setClinics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchClinics = async () => {
      setLoading(true);
      
      let query = supabase
        .from('clinics')
        .select('*')
        .eq('status', 'active');
      
      if (taluk) {
        query = query.eq('taluk', taluk);
      }
      if (district) {
        query = query.eq('district', district);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (!error && data) {
        setClinics(data);
      }
      setLoading(false);
    };
    
    fetchClinics();
  }, [taluk, district]);

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
              {state} • {loading ? "Loading..." : `${clinics.length} clinics found`}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading clinics...</p>
            </div>
          ) : clinics.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No clinics found in this location</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {clinics.map((clinic) => (
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
                    {clinic.services && clinic.services.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {clinic.services.map((service: string, idx: number) => (
                          <Badge key={idx} variant="secondary">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
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
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Clinics;
