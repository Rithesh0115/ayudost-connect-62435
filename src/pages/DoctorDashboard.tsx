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
import { supabase } from "@/integrations/supabase/client";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showConsultationDialog, setShowConsultationDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showPatientProfileDialog, setShowPatientProfileDialog] = useState(false);
  const [showEditScheduleDialog, setShowEditScheduleDialog] = useState(false);
  const [showEditPatientDialog, setShowEditPatientDialog] = useState(false);
  const [editPatientData, setEditPatientData] = useState<any>(null);

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

  const [patients, setPatients] = useState([
    { id: 1, name: "Rahul Mehta", age: 35, gender: "Male", lastVisit: "2024-01-15", phone: "+91 98765 43210", condition: "Diabetes" },
    { id: 2, name: "Priya Singh", age: 28, gender: "Female", lastVisit: "2024-01-20", phone: "+91 98765 43211", condition: "Hypertension" },
    { id: 3, name: "Amit Patel", age: 42, gender: "Male", lastVisit: "2024-01-10", phone: "+91 98765 43212", condition: "Asthma" },
    { id: 4, name: "Sneha Gupta", age: 31, gender: "Female", lastVisit: "2024-01-18", phone: "+91 98765 43213", condition: "Migraine" },
  ]);

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
                            setSelectedPatient(patient);
                            setShowPatientProfileDialog(true);
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
                    onClick={() => setShowEditScheduleDialog(true)}
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
            <Button onClick={async () => {
              // Mark consultation as completed in database
              if (selectedAppointment?.id) {
                try {
                  const { error } = await supabase
                    .from('appointments')
                    .update({ status: 'completed' })
                    .eq('id', selectedAppointment.id);

                  if (error) throw error;

                  toast({
                    title: "Consultation Completed",
                    description: `Consultation with ${selectedAppointment?.patient} has been marked as completed`,
                  });
                } catch (error: any) {
                  toast({
                    title: "Error",
                    description: error.message || "Failed to update appointment status",
                    variant: "destructive",
                  });
                }
              } else {
                toast({
                  title: "Consultation Started",
                  description: `Now consulting with ${selectedAppointment?.patient}`,
                });
              }
              setShowConsultationDialog(false);
            }}>
              Complete Consultation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Patient Profile Dialog */}
      <Dialog open={showPatientProfileDialog} onOpenChange={setShowPatientProfileDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Patient Profile</DialogTitle>
            <DialogDescription>Detailed medical history and information</DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="text-base font-semibold">{selectedPatient.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Age</p>
                  <p className="text-base font-semibold">{selectedPatient.age} years</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Gender</p>
                  <p className="text-base font-semibold">{selectedPatient.gender}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contact</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <p className="text-sm">{selectedPatient.phone}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">Primary Condition</p>
                <Badge variant="secondary" className="text-base">{selectedPatient.condition}</Badge>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-muted-foreground mb-3">Medical History</p>
                <div className="space-y-3">
                  <div className="p-3 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">Last Visit</p>
                      <p className="text-sm text-muted-foreground">{selectedPatient.lastVisit}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Routine checkup and medication review</p>
                  </div>
                  <div className="p-3 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">Medications</p>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Medication A - 500mg daily</li>
                      <li>• Medication B - 10mg twice daily</li>
                    </ul>
                  </div>
                  <div className="p-3 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">Allergies</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Penicillin, Sulfa drugs</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPatientProfileDialog(false)}>Close</Button>
            <Button onClick={() => {
              setEditPatientData({ ...selectedPatient });
              setShowEditPatientDialog(true);
              setShowPatientProfileDialog(false);
            }}>
              Edit Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Schedule Dialog */}
      <Dialog open={showEditScheduleDialog} onOpenChange={setShowEditScheduleDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Availability</DialogTitle>
            <DialogDescription>Manage your working hours and availability</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {weeklySchedule.map((day) => (
              <div key={day.day} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{day.day}</h3>
                  <Button variant="outline" size="sm">Add Slot</Button>
                </div>
                <div className="space-y-2">
                  {day.slots.map((slot, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{slot.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={slot.status === "Available" ? "default" : "secondary"} className="text-xs">
                          {slot.status}
                        </Badge>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditScheduleDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              setShowEditScheduleDialog(false);
              toast({
                title: "Schedule Updated",
                description: "Your availability has been saved successfully",
              });
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Patient Record Dialog */}
      <Dialog open={showEditPatientDialog} onOpenChange={setShowEditPatientDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Patient Record</DialogTitle>
            <DialogDescription>Update patient information and medical history</DialogDescription>
          </DialogHeader>
          {editPatientData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <input
                    type="text"
                    value={editPatientData.name}
                    onChange={(e) => setEditPatientData({ ...editPatientData, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Age</label>
                  <input
                    type="number"
                    value={editPatientData.age}
                    onChange={(e) => setEditPatientData({ ...editPatientData, age: parseInt(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Gender</label>
                  <select
                    value={editPatientData.gender}
                    onChange={(e) => setEditPatientData({ ...editPatientData, gender: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Contact</label>
                  <input
                    type="tel"
                    value={editPatientData.phone}
                    onChange={(e) => setEditPatientData({ ...editPatientData, phone: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Primary Condition</label>
                <input
                  type="text"
                  value={editPatientData.condition}
                  onChange={(e) => setEditPatientData({ ...editPatientData, condition: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditPatientDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              // Update the patient in the patients array
              const updatedPatients = patients.map(p => 
                p.id === editPatientData.id ? editPatientData : p
              );
              setPatients(updatedPatients);
              
              // Update selected patient if it's the same one
              if (selectedPatient?.id === editPatientData.id) {
                setSelectedPatient(editPatientData);
              }
              
              setShowEditPatientDialog(false);
              toast({
                title: "Patient Record Updated",
                description: `${editPatientData?.name}'s information has been saved successfully`,
              });
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorDashboard;
