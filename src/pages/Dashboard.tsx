import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, FileText, User, Bell, Heart, Users, Upload, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AppointmentCalendar } from "@/components/AppointmentCalendar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [rescheduleDialog, setRescheduleDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    date_of_birth: "",
    blood_group: "",
  });
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [addRecordDialog, setAddRecordDialog] = useState(false);
  const [addPrescriptionDialog, setAddPrescriptionDialog] = useState(false);
  const [viewRecordDialog, setViewRecordDialog] = useState(false);
  const [editRecordDialog, setEditRecordDialog] = useState(false);
  const [viewPrescriptionDialog, setViewPrescriptionDialog] = useState(false);
  const [editPrescriptionDialog, setEditPrescriptionDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
  const [newRecord, setNewRecord] = useState({ title: "", date: "", type: "", notes: "", document: null as File | null });
  const [newPrescription, setNewPrescription] = useState({ medicine: "", dosage: "", frequency: "", duration: "", prescribedBy: "", date: "" });
  const [uploadingFile, setUploadingFile] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeTab, setActiveTab] = useState("appointments");

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadUserData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Check for query parameters (edit mode for appointments)
  useEffect(() => {
    const editParam = searchParams.get('edit');
    
    if (editParam === 'true') {
      // This is now handled on the Profile page
      navigate('/profile?edit=true');
      return;
    }
  }, [searchParams, navigate]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUser(session.user);
    await loadUserData(session.user.id);
    setLoading(false);
  };

  const loadUserData = async (userId: string) => {
    try {
      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileData) {
        setProfile({
          full_name: profileData.full_name || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          address: profileData.address || "",
          date_of_birth: profileData.date_of_birth || "",
          blood_group: profileData.blood_group || "",
        });
      }

      // Load appointments
      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true });
      
      if (appointmentsData) {
        setUpcomingAppointments(appointmentsData);
      }

      // Load prescriptions
      const { data: prescriptionsData } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (prescriptionsData) {
        setPrescriptions(prescriptionsData);
      }

      // Load medical records from database
      const { data: recordsData } = await supabase
        .from('medical_records')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });
      
      if (recordsData) {
        setMedicalRecords(recordsData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };


  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const handleReschedule = (appointmentId: string) => {
    const appointment = upcomingAppointments.find(apt => apt.id === appointmentId);
    if (appointment) {
      setSelectedAppointment(appointment);
      setNewDate(appointment.date);
      setNewTime(appointment.time);
      setRescheduleDialog(true);
    }
  };

  const confirmReschedule = async () => {
    if (!newDate || !newTime) {
      toast({
        title: "Error",
        description: "Please select both date and time",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('appointments')
        .update({ date: newDate, time: newTime })
        .eq('id', selectedAppointment.id);

      if (error) throw error;

      await loadUserData(user.id);
      
      toast({
        title: "Appointment Rescheduled",
        description: `Your appointment has been rescheduled to ${newDate} at ${newTime}`,
      });
      
      setRescheduleDialog(false);
      setSelectedAppointment(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reschedule appointment",
        variant: "destructive",
      });
    }
  };

  const handleCancel = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId);

      if (error) throw error;

      await loadUserData(user.id);
      
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel appointment",
        variant: "destructive",
      });
    }
  };

  const handleAddRecord = async () => {
    if (!newRecord.title || !newRecord.date || !newRecord.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadingFile(true);
      let documentUrl = null;

      // Upload document if provided
      if (newRecord.document) {
        const fileExt = newRecord.document.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('medical-documents')
          .upload(fileName, newRecord.document);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('medical-documents')
          .getPublicUrl(fileName);
        
        documentUrl = publicUrl;
      }

      // Insert record into database
      const { error } = await supabase
        .from('medical_records')
        .insert({
          user_id: user.id,
          title: newRecord.title,
          type: newRecord.type,
          date: newRecord.date,
          notes: newRecord.notes || null,
          document_url: documentUrl,
        });

      if (error) throw error;

      await loadUserData(user.id);

      toast({
        title: "Record Added",
        description: "Medical record has been added successfully",
      });

      setNewRecord({ title: "", date: "", type: "", notes: "", document: null });
      setAddRecordDialog(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add medical record",
        variant: "destructive",
      });
    } finally {
      setUploadingFile(false);
    }
  };

  const handleAddPrescription = async () => {
    if (!newPrescription.medicine || !newPrescription.dosage || !newPrescription.frequency || !newPrescription.duration) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('prescriptions')
        .insert({
          user_id: user.id,
          medication: newPrescription.medicine,
          dosage: newPrescription.dosage,
          frequency: newPrescription.frequency,
          doctor: newPrescription.prescribedBy,
          start_date: newPrescription.date || new Date().toISOString().split('T')[0],
          end_date: null,
        });

      if (error) throw error;

      await loadUserData(user.id);

      toast({
        title: "Prescription Added",
        description: "Prescription has been added successfully",
      });

      setNewPrescription({ medicine: "", dosage: "", frequency: "", duration: "", prescribedBy: "", date: "" });
      setAddPrescriptionDialog(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add prescription",
        variant: "destructive",
      });
    }
  };

  const handleViewRecord = (record: any) => {
    setSelectedRecord(record);
    setViewRecordDialog(true);
  };

  const handleEditRecord = (record: any) => {
    setSelectedRecord(record);
    setNewRecord({
      title: record.title,
      date: record.date,
      type: record.type,
      notes: record.notes || "",
      document: null,
    });
    setEditRecordDialog(true);
  };

  const handleDownloadDocument = async (documentUrl: string) => {
    try {
      window.open(documentUrl, '_blank');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRecord = async () => {
    if (!newRecord.title || !newRecord.date || !newRecord.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadingFile(true);
      let documentUrl = selectedRecord.document_url;

      // Upload new document if provided
      if (newRecord.document) {
        const fileExt = newRecord.document.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('medical-documents')
          .upload(fileName, newRecord.document);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('medical-documents')
          .getPublicUrl(fileName);
        
        documentUrl = publicUrl;
      }

      const { error } = await supabase
        .from('medical_records')
        .update({
          title: newRecord.title,
          type: newRecord.type,
          date: newRecord.date,
          notes: newRecord.notes || null,
          document_url: documentUrl,
        })
        .eq('id', selectedRecord.id);

      if (error) throw error;

      await loadUserData(user.id);

      toast({
        title: "Record Updated",
        description: "Medical record has been updated successfully",
      });

      setNewRecord({ title: "", date: "", type: "", notes: "", document: null });
      setEditRecordDialog(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update medical record",
        variant: "destructive",
      });
    } finally {
      setUploadingFile(false);
    }
  };

  const handleViewPrescription = (prescription: any) => {
    setSelectedPrescription(prescription);
    setViewPrescriptionDialog(true);
  };

  const handleEditPrescription = (prescription: any) => {
    setSelectedPrescription(prescription);
    setNewPrescription({
      medicine: prescription.medication,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      duration: "",
      prescribedBy: prescription.doctor || "",
      date: prescription.start_date || "",
    });
    setEditPrescriptionDialog(true);
  };

  const handleUpdatePrescription = async () => {
    if (!newPrescription.medicine || !newPrescription.dosage || !newPrescription.frequency) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('prescriptions')
        .update({
          medication: newPrescription.medicine,
          dosage: newPrescription.dosage,
          frequency: newPrescription.frequency,
          doctor: newPrescription.prescribedBy,
          start_date: newPrescription.date || new Date().toISOString().split('T')[0],
        })
        .eq('id', selectedPrescription.id);

      if (error) throw error;

      await loadUserData(user.id);

      toast({
        title: "Prescription Updated",
        description: "Prescription has been updated successfully",
      });

      setNewPrescription({ medicine: "", dosage: "", frequency: "", duration: "", prescribedBy: "", date: "" });
      setEditPrescriptionDialog(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update prescription",
        variant: "destructive",
      });
    }
  };

  const totalAppointments = upcomingAppointments?.length || 0;
  const upcomingCount = upcomingAppointments.filter(apt => apt.status === 'upcoming' || apt.status === 'confirmed').length;
  const pastCount = upcomingAppointments.filter(apt => apt.status === 'completed').length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome back, {profile.full_name?.split(' ')[0] || 'User'}!
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
                  <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAppointments}</div>
                  <p className="text-xs text-muted-foreground">All appointments</p>
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
                 <div className="text-2xl font-bold">{medicalRecords.length}</div>
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
                 <div className="text-2xl font-bold">{prescriptions.length}</div>
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="appointments">My Appointments</TabsTrigger>
              <TabsTrigger value="records">Medical Records</TabsTrigger>
              <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            </TabsList>

            <TabsContent value="appointments" className="space-y-4">
              <div className="flex justify-end mb-4">
                <Button
                  variant={showCalendar ? "default" : "outline"}
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  {showCalendar ? "Show List View" : "Show Calendar View"}
                </Button>
              </div>

              {showCalendar ? (
                <AppointmentCalendar 
                  appointments={upcomingAppointments}
                  onAppointmentClick={(apt) => handleReschedule(apt.id)}
                />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>My Appointments</CardTitle>
                    <CardDescription>Your scheduled consultations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="upcoming">
                      <TabsList className="w-full">
                        <TabsTrigger value="upcoming" className="flex-1">Upcoming ({upcomingCount})</TabsTrigger>
                        <TabsTrigger value="past" className="flex-1">Past ({pastCount})</TabsTrigger>
                      </TabsList>

                    <TabsContent value="upcoming" className="space-y-4 mt-4">
                      {upcomingAppointments.filter(apt => apt.status === 'upcoming' || apt.status === 'confirmed').length > 0 ? (
                        upcomingAppointments.filter(apt => apt.status === 'upcoming' || apt.status === 'confirmed').map((appointment) => (
                          <div key={appointment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg">
                            <div className="space-y-1 mb-4 sm:mb-0">
                              <h3 className="font-semibold">{appointment.doctor_name}</h3>
                              <p className="text-sm text-muted-foreground">{appointment.clinic_name}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline">In-Person</Badge>
                                <Badge variant="secondary">Confirmed</Badge>
                              </div>
                            </div>
                            <div className="text-left sm:text-right space-y-2">
                              <p className="font-medium">{new Date(appointment.date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                              <p className="text-sm text-muted-foreground">{appointment.time}</p>
                              <div className="flex gap-2 mt-2">
                                <Button variant="outline" size="sm" onClick={() => handleReschedule(appointment.id)}>Reschedule</Button>
                                <Button variant="destructive" size="sm" onClick={() => handleCancel(appointment.id)}>Cancel</Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center py-8">No upcoming appointments. Book your first appointment to get started!</p>
                      )}
                    </TabsContent>

                    <TabsContent value="past" className="space-y-4 mt-4">
                      {upcomingAppointments.filter(apt => apt.status === 'completed').length > 0 ? (
                        upcomingAppointments.filter(apt => apt.status === 'completed').map((appointment) => (
                          <div key={appointment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg opacity-75">
                            <div className="space-y-1 mb-4 sm:mb-0">
                              <h3 className="font-semibold">{appointment.doctor_name}</h3>
                              <p className="text-sm text-muted-foreground">{appointment.clinic_name}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary">Completed</Badge>
                              </div>
                            </div>
                            <div className="text-left sm:text-right space-y-2">
                              <p className="font-medium">{new Date(appointment.date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                              <p className="text-sm text-muted-foreground">{appointment.time}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center py-8">No past appointments found.</p>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              )}
            </TabsContent>

            <TabsContent value="records">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Medical Records</CardTitle>
                      <CardDescription>Your health history and documents</CardDescription>
                    </div>
                    <Button onClick={() => setAddRecordDialog(true)}>
                      Add Record
                    </Button>
                  </div>
                </CardHeader>
                 <CardContent className="space-y-4">
                  {medicalRecords.length > 0 ? (
                     medicalRecords.map((record) => (
                       <div key={record.id} className="p-4 border border-border rounded-lg space-y-2">
                         <div className="flex items-start justify-between">
                           <div className="flex-1">
                             <h3 className="font-semibold">{record.title}</h3>
                             <p className="text-sm text-muted-foreground">{new Date(record.date).toLocaleDateString()}</p>
                             {record.document_url && (
                               <Button 
                                 variant="link" 
                                 size="sm" 
                                 className="p-0 h-auto mt-1" 
                                 onClick={() => handleDownloadDocument(record.document_url)}
                               >
                                 <Download className="h-4 w-4 mr-1" />
                                 Download Document
                               </Button>
                             )}
                           </div>
                           <div className="flex items-center gap-2">
                             <Badge variant="secondary">{record.type}</Badge>
                             <Button variant="outline" size="sm" onClick={() => handleViewRecord(record)}>View</Button>
                             <Button variant="outline" size="sm" onClick={() => handleEditRecord(record)}>Edit</Button>
                           </div>
                         </div>
                         {record.notes && (
                           <p className="text-sm text-muted-foreground">{record.notes}</p>
                         )}
                       </div>
                     ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No medical records yet. Add your first record to get started!</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prescriptions">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Prescriptions</CardTitle>
                      <CardDescription>Your active and past prescriptions</CardDescription>
                    </div>
                    <Button onClick={() => setAddPrescriptionDialog(true)}>
                      Add Prescription
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {prescriptions.length > 0 ? (
                    prescriptions.map((prescription) => (
                      <div key={prescription.id} className="p-4 border border-border rounded-lg space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{prescription.medication}</h3>
                            {prescription.doctor && (
                              <p className="text-sm text-muted-foreground">Prescribed by {prescription.doctor}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="default">Active</Badge>
                            <Button variant="outline" size="sm" onClick={() => handleViewPrescription(prescription)}>View</Button>
                            <Button variant="outline" size="sm" onClick={() => handleEditPrescription(prescription)}>Edit</Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Dosage:</span> {prescription.dosage}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Frequency:</span> {prescription.frequency}
                          </div>
                          {prescription.start_date && (
                            <div>
                              <span className="text-muted-foreground">Start Date:</span> {prescription.start_date}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No prescriptions yet. Add your first prescription to track your medications!</p>
                  )}
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

      <Dialog open={addRecordDialog} onOpenChange={setAddRecordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Medical Record</DialogTitle>
            <DialogDescription>
              Add a new medical record to your health history
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recordTitle">Title *</Label>
              <Input
                id="recordTitle"
                placeholder="e.g., Blood Test Results"
                value={newRecord.title}
                onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recordType">Type *</Label>
              <Input
                id="recordType"
                placeholder="e.g., Lab Test, X-Ray, Consultation"
                value={newRecord.type}
                onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recordDate">Date *</Label>
              <Input
                id="recordDate"
                type="date"
                value={newRecord.date}
                onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recordNotes">Notes</Label>
              <Input
                id="recordNotes"
                placeholder="Additional notes or observations"
                value={newRecord.notes}
                onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recordDocument">Upload Document (Optional)</Label>
              <Input
                id="recordDocument"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={(e) => setNewRecord({ ...newRecord, document: e.target.files?.[0] || null })}
              />
              <p className="text-xs text-muted-foreground">Supported formats: PDF, JPG, PNG, DOC, DOCX</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddRecordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRecord} disabled={uploadingFile}>
              {uploadingFile ? "Uploading..." : "Add Record"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addPrescriptionDialog} onOpenChange={setAddPrescriptionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Prescription</DialogTitle>
            <DialogDescription>
              Add a new prescription to track your medications
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="medicine">Medicine Name *</Label>
              <Input
                id="medicine"
                placeholder="e.g., Ashwagandha Churna"
                value={newPrescription.medicine}
                onChange={(e) => setNewPrescription({ ...newPrescription, medicine: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage *</Label>
              <Input
                id="dosage"
                placeholder="e.g., 500mg"
                value={newPrescription.dosage}
                onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency *</Label>
              <Input
                id="frequency"
                placeholder="e.g., Twice daily"
                value={newPrescription.frequency}
                onChange={(e) => setNewPrescription({ ...newPrescription, frequency: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration *</Label>
              <Input
                id="duration"
                placeholder="e.g., 30 days"
                value={newPrescription.duration}
                onChange={(e) => setNewPrescription({ ...newPrescription, duration: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prescribedBy">Prescribed By</Label>
              <Input
                id="prescribedBy"
                placeholder="Doctor's name"
                value={newPrescription.prescribedBy}
                onChange={(e) => setNewPrescription({ ...newPrescription, prescribedBy: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prescriptionDate">Date</Label>
              <Input
                id="prescriptionDate"
                type="date"
                value={newPrescription.date}
                onChange={(e) => setNewPrescription({ ...newPrescription, date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddPrescriptionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPrescription}>
              Add Prescription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewRecordDialog} onOpenChange={setViewRecordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Medical Record Details</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="font-semibold">Title</Label>
                <p className="text-sm">{selectedRecord.title}</p>
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Type</Label>
                <Badge variant="secondary">{selectedRecord.type}</Badge>
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Date</Label>
                <p className="text-sm">{selectedRecord.date}</p>
              </div>
              {selectedRecord.notes && (
                <div className="space-y-2">
                  <Label className="font-semibold">Notes</Label>
                  <p className="text-sm text-muted-foreground">{selectedRecord.notes}</p>
                </div>
              )}
              {selectedRecord.document_url && (
                <div className="space-y-2">
                  <Label className="font-semibold">Document</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDownloadDocument(selectedRecord.document_url)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Document
                  </Button>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewRecordDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editRecordDialog} onOpenChange={setEditRecordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Medical Record</DialogTitle>
            <DialogDescription>
              Update the medical record information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editRecordTitle">Title *</Label>
              <Input
                id="editRecordTitle"
                value={newRecord.title}
                onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editRecordType">Type *</Label>
              <Input
                id="editRecordType"
                value={newRecord.type}
                onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editRecordDate">Date *</Label>
              <Input
                id="editRecordDate"
                type="date"
                value={newRecord.date}
                onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editRecordNotes">Notes</Label>
              <Input
                id="editRecordNotes"
                value={newRecord.notes}
                onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editRecordDocument">Upload New Document (Optional)</Label>
              <Input
                id="editRecordDocument"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={(e) => setNewRecord({ ...newRecord, document: e.target.files?.[0] || null })}
              />
              <p className="text-xs text-muted-foreground">Leave empty to keep existing document</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRecordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRecord} disabled={uploadingFile}>
              {uploadingFile ? "Uploading..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewPrescriptionDialog} onOpenChange={setViewPrescriptionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Prescription Details</DialogTitle>
          </DialogHeader>
          {selectedPrescription && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="font-semibold">Medication</Label>
                <p className="text-lg">{selectedPrescription.medication}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-semibold">Dosage</Label>
                  <p className="text-sm">{selectedPrescription.dosage}</p>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Frequency</Label>
                  <p className="text-sm">{selectedPrescription.frequency}</p>
                </div>
              </div>
              {selectedPrescription.doctor && (
                <div className="space-y-2">
                  <Label className="font-semibold">Prescribed By</Label>
                  <p className="text-sm">{selectedPrescription.doctor}</p>
                </div>
              )}
              {selectedPrescription.start_date && (
                <div className="space-y-2">
                  <Label className="font-semibold">Start Date</Label>
                  <p className="text-sm">{selectedPrescription.start_date}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewPrescriptionDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editPrescriptionDialog} onOpenChange={setEditPrescriptionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Prescription</DialogTitle>
            <DialogDescription>
              Update the prescription information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editMedicine">Medicine Name *</Label>
              <Input
                id="editMedicine"
                value={newPrescription.medicine}
                onChange={(e) => setNewPrescription({ ...newPrescription, medicine: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDosage">Dosage *</Label>
              <Input
                id="editDosage"
                value={newPrescription.dosage}
                onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editFrequency">Frequency *</Label>
              <Input
                id="editFrequency"
                value={newPrescription.frequency}
                onChange={(e) => setNewPrescription({ ...newPrescription, frequency: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editPrescribedBy">Prescribed By</Label>
              <Input
                id="editPrescribedBy"
                value={newPrescription.prescribedBy}
                onChange={(e) => setNewPrescription({ ...newPrescription, prescribedBy: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editPrescriptionDate">Start Date</Label>
              <Input
                id="editPrescriptionDate"
                type="date"
                value={newPrescription.date}
                onChange={(e) => setNewPrescription({ ...newPrescription, date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPrescriptionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePrescription}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
