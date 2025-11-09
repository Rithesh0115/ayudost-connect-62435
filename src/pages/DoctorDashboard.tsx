import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Users, FileText, TrendingUp, Clock, Phone, Mail, MapPin, Activity, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showConsultationDialog, setShowConsultationDialog] = useState(false);

  useEffect(() => {
    // Check if doctor is logged in
    if (localStorage.getItem("isDoctorLoggedIn") !== "true") {
      navigate("/doctor-auth");
    }
  }, [navigate]);

  const todayAppointments = [
    { id: 1, patient: "Rahul Mehta", time: "10:00 AM", type: "In-Person", status: "Confirmed" },
    { id: 2, patient: "Priya Singh", time: "11:30 AM", type: "Teleconsultation", status: "Confirmed" },
    { id: 3, patient: "Amit Patel", time: "2:00 PM", type: "In-Person", status: "Pending" },
  ];

  const patients = [
    { id: 1, name: "Rahul Mehta", age: 35, gender: "Male", lastVisit: "2024-01-15", phone: "+91 98765 43210", condition: "Diabetes" },
    { id: 2, name: "Priya Singh", age: 28, gender: "Female", lastVisit: "2024-01-20", phone: "+91 98765 43211", condition: "Hypertension" },
    { id: 3, name: "Amit Patel", age: 42, gender: "Male", lastVisit: "2024-01-10", phone: "+91 98765 43212", condition: "Asthma" },
    { id: 4, name: "Sneha Gupta", age: 31, gender: "Female", lastVisit: "2024-01-18", phone: "+91 98765 43213", condition: "Migraine" },
  ];

  const weeklySchedule = [
    { day: "Monday", slots: [{ time: "9:00 AM - 12:00 PM", status: "Available" }, { time: "2:00 PM - 6:00 PM", status: "Available" }] },
    { day: "Tuesday", slots: [{ time: "9:00 AM - 12:00 PM", status: "Available" }, { time: "2:00 PM - 6:00 PM", status: "Booked" }] },
    { day: "Wednesday", slots: [{ time: "9:00 AM - 12:00 PM", status: "Available" }, { time: "2:00 PM - 6:00 PM", status: "Available" }] },
    { day: "Thursday", slots: [{ time: "9:00 AM - 12:00 PM", status: "Booked" }, { time: "2:00 PM - 6:00 PM", status: "Available" }] },
    { day: "Friday", slots: [{ time: "9:00 AM - 12:00 PM", status: "Available" }, { time: "2:00 PM - 6:00 PM", status: "Available" }] },
    { day: "Saturday", slots: [{ time: "9:00 AM - 1:00 PM", status: "Available" }] },
  ];

  const analyticsData = [
    { metric: "Total Consultations", value: "234", change: "+12%", icon: Users },
    { metric: "Patient Satisfaction", value: "4.8/5", change: "+0.3", icon: TrendingUp },
    { metric: "Avg. Consultation Time", value: "25 min", change: "-5 min", icon: Clock },
    { metric: "Revenue This Month", value: "₹1.2L", change: "+18%", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Doctor Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your appointments and patient records
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Today</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayAppointments.length}</div>
                <p className="text-xs text-muted-foreground">Appointments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Patients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">234</div>
                <p className="text-xs text-muted-foreground">Total patients</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹1.2L</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="appointments" className="space-y-6">
            <TabsList>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="appointments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Appointments</CardTitle>
                  <CardDescription>Manage your consultations for today</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg">
                      <div className="space-y-1 mb-4 sm:mb-0">
                        <h3 className="font-semibold">{appointment.patient}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{appointment.type}</Badge>
                          <Badge variant="secondary">{appointment.status}</Badge>
                        </div>
                      </div>
                      <div className="text-left sm:text-right space-y-2">
                        <div className="flex items-center gap-2 sm:justify-end">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{appointment.time}</p>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button 
                            size="sm"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowConsultationDialog(true);
                            }}
                          >
                            Start Consultation
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setShowDetailsDialog(true);
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="patients">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Records</CardTitle>
                  <CardDescription>View and manage patient information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {patients.map((patient) => (
                    <div key={patient.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg">
                      <div className="space-y-2 mb-4 sm:mb-0">
                        <h3 className="font-semibold text-lg">{patient.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{patient.age} years</Badge>
                          <Badge variant="outline">{patient.gender}</Badge>
                          <Badge variant="secondary">{patient.condition}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{patient.phone}</span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right space-y-2">
                        <p className="text-sm text-muted-foreground">Last Visit</p>
                        <p className="font-medium">{patient.lastVisit}</p>
                        <Button 
                          size="sm" 
                          onClick={() => {
                            toast({
                              title: "Patient Profile",
                              description: `Viewing ${patient.name}'s medical history`,
                            });
                          }}
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle>Schedule Management</CardTitle>
                  <CardDescription>Set your availability and working hours</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {weeklySchedule.map((day) => (
                    <div key={day.day} className="space-y-2">
                      <h3 className="font-semibold text-lg">{day.day}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {day.slots.map((slot, idx) => (
                          <div 
                            key={idx} 
                            className={`p-4 border rounded-lg flex items-center justify-between ${
                              slot.status === "Available" ? "border-primary/30 bg-primary/5" : "border-border bg-muted/50"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{slot.time}</span>
                            </div>
                            <Badge variant={slot.status === "Available" ? "default" : "secondary"}>
                              {slot.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Button 
                    className="w-full mt-4"
                    onClick={() => {
                      toast({
                        title: "Edit Schedule",
                        description: "Schedule editor will open here",
                      });
                    }}
                  >
                    Edit Availability
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                  <CardDescription>Track your practice metrics and performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analyticsData.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div key={idx} className="p-6 border border-border rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-muted-foreground">{item.metric}</p>
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-3xl font-bold">{item.value}</p>
                            <p className="text-sm text-primary font-medium">{item.change} from last month</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="border border-border rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-4">Monthly Consultation Trend</h3>
                    <div className="space-y-3">
                      {["Jan", "Feb", "Mar", "Apr", "May"].map((month, idx) => {
                        const value = [65, 75, 82, 88, 95][idx];
                        return (
                          <div key={month} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">{month}</span>
                              <span className="text-muted-foreground">{value} consultations</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all" 
                                style={{ width: `${value}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* View Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>Complete information about this appointment</DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Patient Name</p>
                <p className="text-base font-semibold">{selectedAppointment.patient}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Appointment Time</p>
                <p className="text-base font-semibold">{selectedAppointment.time}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Consultation Type</p>
                <p className="text-base font-semibold">{selectedAppointment.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant="secondary">{selectedAppointment.status}</Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Start Consultation Dialog */}
      <Dialog open={showConsultationDialog} onOpenChange={setShowConsultationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Consultation</DialogTitle>
            <DialogDescription>Begin consultation with {selectedAppointment?.patient}</DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You are about to start a {selectedAppointment.type} consultation with {selectedAppointment.patient} scheduled for {selectedAppointment.time}.
              </p>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Quick Actions:</p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Review patient history</li>
                  <li>• Prepare consultation notes</li>
                  <li>• Have prescription pad ready</li>
                </ul>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConsultationDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              setShowConsultationDialog(false);
              toast({
                title: "Consultation Started",
                description: `Now consulting with ${selectedAppointment?.patient}`,
              });
            }}>
              Begin Consultation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorDashboard;
