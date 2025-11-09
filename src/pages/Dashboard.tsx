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
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    address: "123 Main Street, Puttur",
    dateOfBirth: "1990-01-01",
    bloodGroup: "O+",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [addRecordDialog, setAddRecordDialog] = useState(false);
  const [addPrescriptionDialog, setAddPrescriptionDialog] = useState(false);
  const [newRecord, setNewRecord] = useState({ title: "", date: "", type: "", notes: "" });
  const [newPrescription, setNewPrescription] = useState({ medicine: "", dosage: "", frequency: "", duration: "", prescribedBy: "", date: "" });

  useEffect(() => {
    // Check if user is logged in
    if (localStorage.getItem("isLoggedIn") !== "true") {
      navigate("/auth");
      return;
    }

    // Load appointments from localStorage
    const savedAppointments = JSON.parse(localStorage.getItem("userAppointments") || "[]");
    setUpcomingAppointments(savedAppointments);

    // Load profile from localStorage
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    // Load medical records and prescriptions
    const savedRecords = localStorage.getItem("medicalRecords");
    if (savedRecords) {
      setMedicalRecords(JSON.parse(savedRecords));
    }

    const savedPrescriptions = localStorage.getItem("prescriptions");
    if (savedPrescriptions) {
      setPrescriptions(JSON.parse(savedPrescriptions));
    }
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

  const handleSaveProfile = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    setIsEditingProfile(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully",
    });
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAddRecord = () => {
    if (!newRecord.title || !newRecord.date || !newRecord.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const record = {
      id: Date.now(),
      ...newRecord,
    };

    const updatedRecords = [...medicalRecords, record];
    setMedicalRecords(updatedRecords);
    localStorage.setItem("medicalRecords", JSON.stringify(updatedRecords));

    toast({
      title: "Record Added",
      description: "Medical record has been added successfully",
    });

    setNewRecord({ title: "", date: "", type: "", notes: "" });
    setAddRecordDialog(false);
  };

  const handleAddPrescription = () => {
    if (!newPrescription.medicine || !newPrescription.dosage || !newPrescription.frequency || !newPrescription.duration) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const prescription = {
      id: Date.now(),
      ...newPrescription,
      status: "Active",
    };

    const updatedPrescriptions = [...prescriptions, prescription];
    setPrescriptions(updatedPrescriptions);
    localStorage.setItem("prescriptions", JSON.stringify(updatedPrescriptions));

    toast({
      title: "Prescription Added",
      description: "Prescription has been added successfully",
    });

    setNewPrescription({ medicine: "", dosage: "", frequency: "", duration: "", prescribedBy: "", date: "" });
    setAddPrescriptionDialog(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome back, {profile.name.split(' ')[0]}!
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
                          <div>
                            <h3 className="font-semibold">{record.title}</h3>
                            <p className="text-sm text-muted-foreground">{record.date}</p>
                          </div>
                          <Badge variant="secondary">{record.type}</Badge>
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
                          <div>
                            <h3 className="font-semibold text-lg">{prescription.medicine}</h3>
                            {prescription.prescribedBy && (
                              <p className="text-sm text-muted-foreground">Prescribed by {prescription.prescribedBy}</p>
                            )}
                          </div>
                          <Badge variant={prescription.status === "Active" ? "default" : "secondary"}>
                            {prescription.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Dosage:</span> {prescription.dosage}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Frequency:</span> {prescription.frequency}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duration:</span> {prescription.duration}
                          </div>
                          {prescription.date && (
                            <div>
                              <span className="text-muted-foreground">Date:</span> {prescription.date}
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

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Profile Settings</CardTitle>
                      <CardDescription>Manage your account information</CardDescription>
                    </div>
                    {!isEditingProfile ? (
                      <Button onClick={() => setIsEditingProfile(true)}>
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveProfile}>
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => handleProfileChange("name", e.target.value)}
                        disabled={!isEditingProfile}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleProfileChange("email", e.target.value)}
                        disabled={!isEditingProfile}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => handleProfileChange("phone", e.target.value)}
                        disabled={!isEditingProfile}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={profile.address}
                        onChange={(e) => handleProfileChange("address", e.target.value)}
                        disabled={!isEditingProfile}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input
                          id="dob"
                          type="date"
                          value={profile.dateOfBirth}
                          onChange={(e) => handleProfileChange("dateOfBirth", e.target.value)}
                          disabled={!isEditingProfile}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bloodGroup">Blood Group</Label>
                        <Input
                          id="bloodGroup"
                          value={profile.bloodGroup}
                          onChange={(e) => handleProfileChange("bloodGroup", e.target.value)}
                          disabled={!isEditingProfile}
                        />
                      </div>
                    </div>
                  </div>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddRecordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRecord}>
              Add Record
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
    </div>
  );
};

export default Dashboard;
