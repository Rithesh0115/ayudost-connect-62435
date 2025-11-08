import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LocationSearch from "@/components/LocationSearch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Shield, Users, Star, MapPin, Clock } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background pt-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Your Trusted Partner in <span className="text-primary">Ayurvedic Healthcare</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Discover certified Ayurvedic practitioners, book appointments seamlessly, and embrace holistic wellness with AyuDost.
            </p>
          </div>
          
          <LocationSearch />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Select Location</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Choose your state, district, and taluk to find nearby clinics
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Browse Doctors</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  View profiles, specializations, and reviews of certified Ayurvedic doctors
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Book Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Choose your preferred date, time slot, and consultation mode
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Get Treatment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Receive personalized Ayurvedic care and track your wellness journey
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Why Choose AyuDost?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Star className="h-10 w-10 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Practitioners</h3>
              <p className="text-muted-foreground">
                All doctors are certified and verified Ayurvedic practitioners with proven expertise
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-10 w-10 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-muted-foreground">
                Book appointments at your convenience with easy rescheduling and reminders
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-10 w-10 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your health data is encrypted and protected with industry-leading security
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Begin Your Wellness Journey?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Join thousands of satisfied users who have discovered the power of authentic Ayurvedic healthcare
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth?mode=signup">
              <Button size="lg" variant="secondary" className="min-w-[200px]">
                Sign Up Now
              </Button>
            </Link>
            <Link to="/clinics">
              <Button size="lg" variant="outline" className="min-w-[200px] bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Browse Clinics
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
