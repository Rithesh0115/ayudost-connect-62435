import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Users, FileText, TrendingUp, Clock, Phone, Mail, MapPin, Activity, BarChart3, User, Briefcase, Building, DollarSign, Award, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showConsultationDialog, setShowConsultationDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showPatientProfileDialog, setShowPatientProfileDialog] = useState(false);
  const [showEditScheduleDialog, setShowEditScheduleDialog] = useState(false);
  const [showEditPatientDialog, setShowEditPatientDialog] = useState(false);
  const [editPatientData, setEditPatientData] = useState<any>(null);
  const [showSlotDialog, setShowSlotDialog] = useState(false);
  const [slotEditMode, setSlotEditMode] = useState<'add' | 'edit'>('add');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [slotData, setSlotData] = useState({ time: '', status: 'Available' });
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorProfile, setDoctorProfile] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/doctor-auth");
        return;
      }

      // Verify user has doctor role
      const { data: roleData, error: roleError } = await supabase.rpc('get_user_role', {
        _user_id: session.user.id
      });

      if (roleError || roleData !== 'doctor') {
        toast({
          title: "Access Denied",
          description: "You must be a doctor to access this dashboard",
          variant: "destructive",
        });
        navigate("/doctor-auth");
        return;
      }

      setSession(session);
      await fetchDoctorData(session.user.id);
    };

    checkAuth();
  }, [navigate, toast]);

  const fetchDoctorData = async (doctorId: string) => {
    try {
      setLoading(true);

      // Fetch today's appointments
      const today = new Date().toISOString().split('T')[0];
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', doctorId)
        .eq('date', today)
        .in('status', ['upcoming', 'confirmed']);

      if (appointmentsError) throw appointmentsError;
      setTodayAppointments(appointmentsData || []);

      // Fetch patients
      const { data: patientsData, error: patientsError } = await supabase
        .from('doctor_patients')
        .select('*')
        .eq('doctor_id', doctorId)
        .order('last_visit', { ascending: false });

      if (patientsError) throw patientsError;
      setPatients(patientsData || []);

      // Fetch doctor profile
      const { data: profileData, error: profileError } = await supabase
        .from('doctor_profiles')
        .select('*')
        .eq('id', doctorId)
        .single();

      if (profileError) throw profileError;
      setDoctorProfile(profileData);

    } catch (error: any) {
      console.error('Error fetching doctor data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  const [weeklySchedule, setWeeklySchedule] = useState([
    { day: "Monday", slots: [{ time: "9:00 AM - 12:00 PM", status: "Available" }, { time: "2:00 PM - 6:00 PM", status: "Available" }] },
    { day: "Tuesday", slots: [{ time: "9:00 AM - 12:00 PM", status: "Available" }, { time: "2:00 PM - 6:00 PM", status: "Booked" }] },
    { day: "Wednesday", slots: [{ time: "9:00 AM - 12:00 PM", status: "Available" }, { time: "2:00 PM - 6:00 PM", status: "Available" }] },
    { day: "Thursday", slots: [{ time: "9:00 AM - 12:00 PM", status: "Booked" }, { time: "2:00 PM - 6:00 PM", status: "Available" }] },
    { day: "Friday", slots: [{ time: "9:00 AM - 12:00 PM", status: "Available" }, { time: "2:00 PM - 6:00 PM", status: "Available" }] },
    { day: "Saturday", slots: [{ time: "9:00 AM - 1:00 PM", status: "Available" }] },
  ]);

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
                  {loading ? (
                    <p className="text-muted-foreground text-center py-8">Loading appointments...</p>
                  ) : todayAppointments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No appointments scheduled for today</p>
                  ) : (
                    todayAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg">
                        <div className="space-y-1 mb-4 sm:mb-0">
                          <h3 className="font-semibold">Patient</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">In-Person</Badge>
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
                    ))
                  )}
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
                  {loading ? (
                    <p className="text-muted-foreground text-center py-8">Loading patients...</p>
                  ) : patients.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No patient records found</p>
                  ) : (
                    patients.map((patient) => (
                      <div key={patient.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg">
                        <div className="space-y-2 mb-4 sm:mb-0">
                          <h3 className="font-semibold text-lg">{patient.patient_name}</h3>
                          <div className="flex flex-wrap gap-2">
                            {patient.patient_age && <Badge variant="outline">{patient.patient_age} years</Badge>}
                            {patient.patient_gender && <Badge variant="outline">{patient.patient_gender}</Badge>}
                            {patient.patient_condition && <Badge variant="secondary">{patient.patient_condition}</Badge>}
                          </div>
                          {patient.patient_phone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{patient.patient_phone}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-left sm:text-right space-y-2">
                          <p className="text-sm text-muted-foreground">Last Visit</p>
                          <p className="font-medium">{patient.last_visit ? new Date(patient.last_visit).toLocaleDateString() : 'N/A'}</p>
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
                    ))
                  )}
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
                <p className="text-sm font-medium text-muted-foreground">Doctor</p>
                <p className="text-base font-semibold">{selectedAppointment.doctor_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clinic</p>
                <p className="text-base font-semibold">{selectedAppointment.clinic_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Appointment Time</p>
                <p className="text-base font-semibold">{selectedAppointment.time}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p className="text-base font-semibold">{new Date(selectedAppointment.date).toLocaleDateString()}</p>
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
            <DialogDescription>Begin consultation for this appointment</DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Doctor</p>
                <p className="text-base font-semibold">{selectedAppointment.doctor_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clinic</p>
                <p className="text-base font-semibold">{selectedAppointment.clinic_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Time</p>
                <p className="text-base font-semibold">{selectedAppointment.time}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <textarea 
                  className="w-full min-h-[100px] p-3 border border-border rounded-md"
                  placeholder="Add consultation notes..."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConsultationDialog(false)}>Cancel</Button>
            <Button onClick={async () => {
              if (!selectedAppointment?.id || !session) return;
              
              try {
                const { error } = await supabase
                  .from('appointments')
                  .update({ status: 'completed' })
                  .eq('id', selectedAppointment.id)
                  .eq('doctor_id', session.user.id);

                if (error) throw error;

                toast({
                  title: "Consultation Completed",
                  description: "Appointment marked as completed",
                });
                setShowConsultationDialog(false);
                await fetchDoctorData(session.user.id);
              } catch (error: any) {
                toast({
                  title: "Error",
                  description: error.message || "Failed to update appointment",
                  variant: "destructive",
                });
              }
            }}>
              Complete Consultation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Patient Profile Dialog */}
      <Dialog open={showPatientProfileDialog} onOpenChange={setShowPatientProfileDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Patient Profile</DialogTitle>
            <DialogDescription>Detailed medical history and information</DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="text-base font-semibold">{selectedPatient.patient_name}</p>
                </div>
                {selectedPatient.patient_age && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Age</p>
                    <p className="text-base font-semibold">{selectedPatient.patient_age} years</p>
                  </div>
                )}
                {selectedPatient.patient_gender && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Gender</p>
                    <p className="text-base font-semibold">{selectedPatient.patient_gender}</p>
                  </div>
                )}
                {selectedPatient.patient_phone && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <p className="text-sm">{selectedPatient.patient_phone}</p>
                    </div>
                  </div>
                )}
              </div>

              {selectedPatient.patient_condition && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Primary Condition</p>
                  <Badge variant="secondary" className="text-base">{selectedPatient.patient_condition}</Badge>
                </div>
              )}

              {selectedPatient.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Medical Notes</p>
                  <p className="text-sm">{selectedPatient.notes}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">Last Visit</p>
                <p className="text-base">{selectedPatient.last_visit ? new Date(selectedPatient.last_visit).toLocaleDateString() : 'No previous visits'}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowPatientProfileDialog(false);
            }}>
              Close
            </Button>
            <Button onClick={() => {
              setEditPatientData(selectedPatient);
              setShowPatientProfileDialog(false);
              setShowEditPatientDialog(true);
            }}>
              Edit Profile
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedDay(day.day);
                      setSlotEditMode('add');
                      setSlotData({ time: '', status: 'Available' });
                      setShowSlotDialog(true);
                    }}
                  >
                    Add Slot
                  </Button>
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
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedDay(day.day);
                            setSelectedSlotIndex(idx);
                            setSlotEditMode('edit');
                            setSlotData({ time: slot.time, status: slot.status });
                            setShowSlotDialog(true);
                          }}
                        >
                          Edit
                        </Button>
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

      {/* Add/Edit Slot Dialog */}
      <Dialog open={showSlotDialog} onOpenChange={setShowSlotDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{slotEditMode === 'add' ? 'Add New' : 'Edit'} Time Slot</DialogTitle>
            <DialogDescription>
              {slotEditMode === 'add' ? 'Add a new time slot for' : 'Update time slot for'} {selectedDay}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Time Slot</label>
              <input
                type="text"
                placeholder="e.g., 9:00 AM - 12:00 PM"
                value={slotData.time}
                onChange={(e) => setSlotData({ ...slotData, time: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <select
                value={slotData.status}
                onChange={(e) => setSlotData({ ...slotData, status: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSlotDialog(false)}>Cancel</Button>
            {slotEditMode === 'edit' && (
              <Button 
                variant="destructive"
                onClick={() => {
                  const updatedSchedule = weeklySchedule.map(day => {
                    if (day.day === selectedDay) {
                      return {
                        ...day,
                        slots: day.slots.filter((_, idx) => idx !== selectedSlotIndex)
                      };
                    }
                    return day;
                  });
                  setWeeklySchedule(updatedSchedule);
                  setShowSlotDialog(false);
                  toast({
                    title: "Slot Deleted",
                    description: "Time slot has been removed from your schedule",
                  });
                }}
              >
                Delete Slot
              </Button>
            )}
            <Button onClick={() => {
              if (!slotData.time.trim()) {
                toast({
                  title: "Error",
                  description: "Please enter a time slot",
                  variant: "destructive",
                });
                return;
              }

              const updatedSchedule = weeklySchedule.map(day => {
                if (day.day === selectedDay) {
                  if (slotEditMode === 'add') {
                    return {
                      ...day,
                      slots: [...day.slots, slotData]
                    };
                  } else {
                    return {
                      ...day,
                      slots: day.slots.map((slot, idx) => 
                        idx === selectedSlotIndex ? slotData : slot
                      )
                    };
                  }
                }
                return day;
              });

              setWeeklySchedule(updatedSchedule);
              setShowSlotDialog(false);
              toast({
                title: slotEditMode === 'add' ? "Slot Added" : "Slot Updated",
                description: `Time slot has been ${slotEditMode === 'add' ? 'added to' : 'updated in'} your schedule`,
              });
            }}>
              {slotEditMode === 'add' ? 'Add Slot' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorDashboard;
