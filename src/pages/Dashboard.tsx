import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, FileText, User, Bell, Heart, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [rescheduleDialog, setRescheduleDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    // Check if user is logged in
    if (localStorage.getItem("isLoggedIn") !== "true") {
      navigate("/auth");
      return;
    }

    // Load appointments from localStorage
    const savedAppointments = JSON.parse(localStorage.getItem("userAppointments") || "[]");
    setUpcomingAppointments(savedAppointments);
  }, [navigate]);

  const handleReschedule = (appointmentId: number) => {
    const appointment = upcomingAppointments.find(apt => apt.id === appointmentId);
    if (appointment) {
      setSelectedAppointment(appointment);
      setNewDate(appointment.date);
      setNewTime(appointment.time);
      setRescheduleDialog(true);
    }
  };

  const confirmReschedule = () => {
    if (!newDate || !newTime) {
      toast({
        title: "Error",
        description: "Please select both date and time",
        variant: "destructive",
      });
      return;
    }

    const updatedAppointments = upcomingAppointments.map(apt => 
      apt.id === selectedAppointment.id 
        ? { ...apt, date: newDate, time: newTime }
        : apt
    );
    
    setUpcomingAppointments(updatedAppointments);
    localStorage.setItem("userAppointments", JSON.stringify(updatedAppointments));
    
    toast({
      title: "Appointment Rescheduled",
      description: `Your appointment has been rescheduled to ${newDate} at ${newTime}`,
    });
    
    setRescheduleDialog(false);
    setSelectedAppointment(null);
  };

  const handleCancel = (appointmentId: number) => {
    const appointments = upcomingAppointments.filter(apt => apt.id !== appointmentId);
    setUpcomingAppointments(appointments);
    localStorage.setItem("userAppointments", JSON.stringify(appointments));
    toast({
      title: "Appointment Cancelled",
      description: "Your appointment has been cancelled successfully",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome back, John!
            </h1>
            <p className="text-muted-foreground">
              Manage your appointments and health records
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{upcomingAppointments?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Appointments</p>
                </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Records</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Medical records</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Active prescriptions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Family</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Family members</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="appointments" className="space-y-6">
            <TabsList>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="records">Medical Records</TabsTrigger>
              <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="appointments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Your scheduled consultations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg">
                        <div className="space-y-1 mb-4 sm:mb-0">
                          <h3 className="font-semibold">{appointment.doctor}</h3>
                          <p className="text-sm text-muted-foreground">{appointment.clinic}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{appointment.type}</Badge>
                            <Badge variant="secondary">{appointment.status}</Badge>
                          </div>
                        </div>
                        <div className="text-left sm:text-right space-y-2">
                          <p className="font-medium">{appointment.date}</p>
                          <p className="text-sm text-muted-foreground">{appointment.time}</p>
                          <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm" onClick={() => handleReschedule(appointment.id)}>Reschedule</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleCancel(appointment.id)}>Cancel</Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No appointments booked yet. Book your first appointment to get started!</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="records">
              <Card>
                <CardHeader>
                  <CardTitle>Medical Records</CardTitle>
                  <CardDescription>Your health history and documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Your medical records will appear here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prescriptions">
              <Card>
                <CardHeader>
                  <CardTitle>Prescriptions</CardTitle>
                  <CardDescription>Your active and past prescriptions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Your prescriptions will appear here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Manage your account information</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Profile settings coming soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      <Dialog open={rescheduleDialog} onOpenChange={setRescheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Change the date and time for your appointment with {selectedAppointment?.doctor}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newDate">New Date</Label>
              <Input
                id="newDate"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newTime">New Time</Label>
              <Input
                id="newTime"
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmReschedule}>
              Confirm Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
