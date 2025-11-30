import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star, MapPin, Award, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const BookAppointment = () => {
  const { doctorId } = useParams();
  const [searchParams] = useSearchParams();
  const clinicId = searchParams.get("clinicId");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

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

  const handleOpenConfirmDialog = () => {
    if (!selectedDate || !selectedTimeSlot) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time slot",
        variant: "destructive",
      });
      return;
    }
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmBooking = async () => {
    try {
      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please login to book an appointment",
          variant: "destructive",
        });
        navigate("/patient-auth");
        return;
      }

      // Save appointment to database
      const { error } = await supabase
        .from('patient_appointments')
        .insert({
          user_id: session.user.id,
          doctor_name: doctor.name,
          clinic_name: doctor.clinic.name,
          date: selectedDate!.toLocaleDateString('en-CA'), // YYYY-MM-DD format
          time: selectedTimeSlot,
          status: 'upcoming',
        });

      if (error) throw error;

      setIsConfirmDialogOpen(false);
      
      toast({
        title: "Appointment Booked!",
        description: `Your appointment with ${doctor.name} has been confirmed for ${selectedDate!.toLocaleDateString()} at ${selectedTimeSlot}`,
      });
      
      // Navigate to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to book appointment",
        variant: "destructive",
      });
    }
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
                    onClick={handleOpenConfirmDialog}
                    disabled={!selectedDate || !selectedTimeSlot}
                  >
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Confirmation Dialog */}
          <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Appointment</DialogTitle>
                <DialogDescription>
                  Please review your appointment details
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Doctor</p>
                  <p className="font-semibold">{doctor.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <p className="font-semibold">
                    {selectedDate?.toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Time</p>
                  <p className="font-semibold">{selectedTimeSlot}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Consultation Fee</p>
                  <p className="font-semibold text-primary text-lg">{doctor.consultationFee}</p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmBooking}>
                  Confirm Booking
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookAppointment;
