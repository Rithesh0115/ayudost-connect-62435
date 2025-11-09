import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Award, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const BookAppointment = () => {
  const { doctorId } = useParams();
  const [searchParams] = useSearchParams();
  const clinicId = searchParams.get("clinicId");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");

  // Get doctor data from URL params
  const doctor = {
    id: doctorId,
    name: searchParams.get("doctorName") || "Dr. Keshav Bhat",
    qualification: searchParams.get("qualification") || "BAMS, PG in Dermatology",
    specialization: searchParams.get("specialization") || "Kaya Chikitsa, Skin & Hair Care",
    experience: searchParams.get("experience") || "8 years",
    rating: parseFloat(searchParams.get("rating") || "4.6"),
    reviews: parseInt(searchParams.get("reviews") || "98"),
    consultationFee: searchParams.get("fee") || "₹450",
    clinic: {
      name: "Ayur Skin Clinic",
      address: "BC Road, Puttur - 574201",
    },
  };

  const timeSlots = [
    { time: "10:00", available: true },
    { time: "11:00", available: true },
    { time: "12:00", available: false },
    { time: "17:00", available: true },
    { time: "18:00", available: true },
    { time: "19:00", available: true },
  ];

  const workingHours = [
    { day: "Mon", hours: "10:00-14:00, 17:00-20:00" },
    { day: "Wed", hours: "10:00-14:00, 17:00-20:00" },
    { day: "Fri", hours: "10:00-14:00, 17:00-20:00" },
    { day: "Sat", hours: "10:00-13:00" },
  ];

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTimeSlot) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time slot",
        variant: "destructive",
      });
      return;
    }

    // Save appointment to localStorage
    const appointments = JSON.parse(localStorage.getItem("userAppointments") || "[]");
    const newAppointment = {
      id: Date.now(),
      doctor: doctor.name,
      clinic: doctor.clinic.name,
      date: selectedDate.toLocaleDateString(),
      time: selectedTimeSlot,
      type: "In-Person",
      status: "Confirmed",
    };
    appointments.push(newAppointment);
    localStorage.setItem("userAppointments", JSON.stringify(appointments));

    toast({
      title: "Appointment Booked!",
      description: `Your appointment with ${doctor.name} has been confirmed for ${selectedDate.toLocaleDateString()} at ${selectedTimeSlot}`,
    });
    
    // Navigate to dashboard
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Side - Doctor Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <CardTitle className="text-2xl mb-2">{doctor.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{doctor.qualification}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="font-semibold">{doctor.rating}</span>
                        <span className="text-sm text-muted-foreground">({doctor.reviews} reviews)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Consultation Fee</p>
                      <p className="text-2xl font-bold text-primary">{doctor.consultationFee}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Badge variant="secondary" className="mr-2">Kaya Chikitsa</Badge>
                    <Badge variant="secondary">Skin & Hair Care</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Award className="h-4 w-4" />
                      <span>Experience</span>
                    </div>
                    <p className="font-medium">{doctor.experience} in Ayurvedic practice</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <MapPin className="h-4 w-4" />
                      <span>Languages</span>
                    </div>
                    <p className="font-medium">Kannada, English</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <MapPin className="h-4 w-4" />
                      <span>{doctor.clinic.name}</span>
                    </div>
                    <p className="text-sm">{doctor.clinic.address}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Ayurvedic dermatologist specializing in natural treatments for skin and hair disorders. 
                    Uses herbal formulations for lasting results.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Working Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {workingHours.map((schedule) => (
                      <div key={schedule.day} className="flex justify-between text-sm">
                        <span className="font-medium">{schedule.day}</span>
                        <span className="text-muted-foreground">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Booking Interface */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Book Appointment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Select Date</h3>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Select Time Slot</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedTimeSlot === slot.time ? "default" : "outline"}
                          size="sm"
                          disabled={!slot.available}
                          onClick={() => setSelectedTimeSlot(slot.time)}
                          className={cn(
                            !slot.available && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleBookAppointment}
                    disabled={!selectedDate || !selectedTimeSlot}
                  >
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookAppointment;
