import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, Calendar, DollarSign, TrendingUp, Activity, Mail, Phone, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { role, loading: roleLoading } = useUserRole();
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showAddDoctorDialog, setShowAddDoctorDialog] = useState(false);
  const [showAddClinicDialog, setShowAddClinicDialog] = useState(false);
  
  // View/Edit states
  const [showViewUserDialog, setShowViewUserDialog] = useState(false);
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editUserData, setEditUserData] = useState<any>(null);
  
  const [showViewDoctorDialog, setShowViewDoctorDialog] = useState(false);
  const [showEditDoctorDialog, setShowEditDoctorDialog] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [editDoctorData, setEditDoctorData] = useState<any>(null);
  
  const [showViewClinicDialog, setShowViewClinicDialog] = useState(false);
  const [showEditClinicDialog, setShowEditClinicDialog] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<any>(null);
  const [editClinicData, setEditClinicData] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/admin-auth");
      }
    };
    checkAuth();
  }, [navigate]);

  // Redirect if user doesn't have 'admin' role
  useEffect(() => {
    if (!roleLoading && role && role !== "admin") {
      if (role === "user") {
        navigate("/dashboard");
      } else if (role === "doctor") {
        navigate("/doctor-dashboard");
      }
    }
  }, [role, roleLoading, navigate]);

  const [users, setUsers] = useState([
    { id: 1, name: "Rahul Mehta", email: "rahul@example.com", role: "Patient", status: "Active", joined: "2024-01-15" },
    { id: 2, name: "Priya Singh", email: "priya@example.com", role: "Patient", status: "Active", joined: "2024-01-20" },
    { id: 3, name: "Amit Patel", email: "amit@example.com", role: "Patient", status: "Inactive", joined: "2024-01-10" },
  ]);

  const [doctors, setDoctors] = useState([
    { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiologist", email: "sarah@clinic.com", status: "Verified", patients: 89 },
    { id: 2, name: "Dr. Michael Chen", specialty: "Dermatologist", email: "michael@clinic.com", status: "Verified", patients: 156 },
    { id: 3, name: "Dr. Priya Sharma", specialty: "Pediatrician", email: "priya@clinic.com", status: "Pending", patients: 45 },
  ]);

  const [clinics, setClinics] = useState([
    { id: 1, name: "Apollo Clinic", location: "Mumbai", doctors: 12, rating: 4.8, status: "Active" },
    { id: 2, name: "Max Healthcare", location: "Delhi", doctors: 25, rating: 4.9, status: "Active" },
    { id: 3, name: "Fortis Hospital", location: "Bangalore", doctors: 18, rating: 4.7, status: "Active" },
  ]);

  const appointments = [
    { id: 1, patient: "Rahul Mehta", doctor: "Dr. Sarah Johnson", clinic: "Apollo Clinic", date: "2024-01-25", time: "10:00 AM", status: "Confirmed" },
    { id: 2, patient: "Priya Singh", doctor: "Dr. Michael Chen", clinic: "Max Healthcare", date: "2024-01-25", time: "2:00 PM", status: "Completed" },
    { id: 3, patient: "Amit Patel", doctor: "Dr. Priya Sharma", clinic: "Fortis Hospital", date: "2024-01-26", time: "11:30 AM", status: "Cancelled" },
  ];

  const payments = [
    { id: 1, patient: "Rahul Mehta", amount: "₹1,500", date: "2024-01-20", method: "Card", status: "Completed" },
    { id: 2, patient: "Priya Singh", amount: "₹2,000", date: "2024-01-22", method: "UPI", status: "Completed" },
    { id: 3, patient: "Amit Patel", amount: "₹1,200", date: "2024-01-23", method: "Card", status: "Refunded" },
  ];

  const handleAddUser = () => {
    setShowAddUserDialog(true);
  };

  const handleAddDoctor = () => {
    setShowAddDoctorDialog(true);
  };

  const handleAddClinic = () => {
    setShowAddClinicDialog(true);
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage platform users, clinics, and appointments
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+12% this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Doctors</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">+5 this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Clinics</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">+3 this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">567</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹8.5L</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Growth</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+18%</div>
                <p className="text-xs text-muted-foreground">vs last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="doctors">Doctors</TabsTrigger>
              <TabsTrigger value="clinics">Clinics</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>Manage all registered users</CardDescription>
                    </div>
                    <Button onClick={handleAddUser}>Add User</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg">
                      <div className="space-y-2 mb-4 sm:mb-0">
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{user.role}</Badge>
                          <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
                        </div>
                      </div>
                      <div className="text-left sm:text-right space-y-2">
                        <p className="text-sm text-muted-foreground">Joined {user.joined}</p>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditUserData({ ...user });
                              setShowEditUserDialog(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowViewUserDialog(true);
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="doctors">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Doctor Management</CardTitle>
                      <CardDescription>Verify and manage doctor profiles</CardDescription>
                    </div>
                    <Button onClick={handleAddDoctor}>Add Doctor</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {doctors.map((doctor) => (
                    <div key={doctor.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg">
                      <div className="space-y-2 mb-4 sm:mb-0">
                        <h3 className="font-semibold text-lg">{doctor.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span>{doctor.email}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{doctor.specialty}</Badge>
                          <Badge variant={doctor.status === "Verified" ? "default" : "secondary"}>{doctor.status}</Badge>
                        </div>
                      </div>
                      <div className="text-left sm:text-right space-y-2">
                        <p className="text-sm text-muted-foreground">{doctor.patients} patients</p>
                        <div className="flex gap-2">
                          <Button 
                            variant={doctor.status === "Verified" ? "secondary" : "default"}
                            size="sm"
                            onClick={() => {
                              const newStatus = doctor.status === "Verified" ? "Pending" : "Verified";
                              const updatedDoctors = doctors.map(d => 
                                d.id === doctor.id ? { ...d, status: newStatus } : d
                              );
                              setDoctors(updatedDoctors);
                              toast({
                                title: newStatus === "Verified" ? "Doctor Verified" : "Verification Removed",
                                description: `${doctor.name} has been ${newStatus === "Verified" ? "verified" : "marked as pending"}`,
                              });
                            }}
                          >
                            {doctor.status === "Verified" ? "Unverify" : "Verify"}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedDoctor(doctor);
                              setShowViewDoctorDialog(true);
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clinics">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Clinic Management</CardTitle>
                      <CardDescription>Manage clinic registrations and details</CardDescription>
                    </div>
                    <Button onClick={handleAddClinic}>Add Clinic</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {clinics.map((clinic) => (
                    <div key={clinic.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg">
                      <div className="space-y-2 mb-4 sm:mb-0">
                        <h3 className="font-semibold text-lg">{clinic.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{clinic.location}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{clinic.doctors} doctors</Badge>
                          <Badge variant="default">Rating: {clinic.rating}</Badge>
                        </div>
                      </div>
                      <div className="text-left sm:text-right space-y-2">
                        <Badge variant={clinic.status === "Active" ? "default" : "secondary"}>{clinic.status}</Badge>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditClinicData({ ...clinic });
                              setShowEditClinicDialog(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedClinic(clinic);
                              setShowViewClinicDialog(true);
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appointments">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Overview</CardTitle>
                  <CardDescription>Monitor all appointments across the platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border border-border rounded-lg">
                      <div className="space-y-2 mb-4 lg:mb-0">
                        <h3 className="font-semibold text-lg">{appointment.patient}</h3>
                        <p className="text-sm text-muted-foreground">with {appointment.doctor}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{appointment.clinic}</span>
                        </div>
                      </div>
                      <div className="text-left lg:text-right space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>{appointment.date} at {appointment.time}</span>
                        </div>
                        <Badge variant={
                          appointment.status === "Confirmed" ? "default" : 
                          appointment.status === "Completed" ? "secondary" : 
                          "destructive"
                        }>
                          {appointment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Management</CardTitle>
                  <CardDescription>Track payments and refunds</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg">
                      <div className="space-y-2 mb-4 sm:mb-0">
                        <h3 className="font-semibold text-lg">{payment.patient}</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{payment.method}</Badge>
                          <Badge variant={
                            payment.status === "Completed" ? "default" : 
                            payment.status === "Refunded" ? "destructive" : 
                            "secondary"
                          }>
                            {payment.status === "Completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {payment.status === "Refunded" && <XCircle className="h-3 w-3 mr-1" />}
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-left sm:text-right space-y-2">
                        <p className="text-2xl font-bold">{payment.amount}</p>
                        <p className="text-sm text-muted-foreground">{payment.date}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                  <CardDescription>Comprehensive platform performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 border border-border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">Monthly Active Users</p>
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-3xl font-bold">1,234</p>
                      <p className="text-sm text-primary font-medium">+12.5% from last month</p>
                    </div>
                    <div className="p-6 border border-border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">Total Appointments</p>
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-3xl font-bold">567</p>
                      <p className="text-sm text-primary font-medium">+8.3% from last month</p>
                    </div>
                    <div className="p-6 border border-border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">Platform Revenue</p>
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-3xl font-bold">₹8.5L</p>
                      <p className="text-sm text-primary font-medium">+18.2% from last month</p>
                    </div>
                    <div className="p-6 border border-border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-muted-foreground">Customer Satisfaction</p>
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-3xl font-bold">4.8/5</p>
                      <p className="text-sm text-primary font-medium">+0.2 from last month</p>
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-4">Monthly Growth Trends</h3>
                    <div className="space-y-3">
                      {["Users", "Doctors", "Appointments", "Revenue", "Satisfaction"].map((metric, idx) => {
                        const values = [
                          [78, 82, 85, 88, 92],
                          [65, 70, 72, 78, 85],
                          [70, 75, 80, 85, 90],
                          [60, 68, 75, 82, 88],
                          [85, 87, 88, 90, 92]
                        ][idx];
                        const currentValue = values[4];
                        return (
                          <div key={metric} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">{metric}</span>
                              <span className="text-muted-foreground">{currentValue}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all" 
                                style={{ width: `${currentValue}%` }}
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

      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Register a new user to the platform</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-name">Full Name</Label>
              <Input id="user-name" placeholder="Enter full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">Email</Label>
              <Input id="user-email" type="email" placeholder="Enter email address" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-phone">Phone Number</Label>
              <Input id="user-phone" placeholder="Enter phone number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-role">Role</Label>
              <Select>
                <SelectTrigger id="user-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              setShowAddUserDialog(false);
              toast({
                title: "User Added",
                description: "New user has been successfully registered",
              });
            }}>
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Doctor Dialog */}
      <Dialog open={showAddDoctorDialog} onOpenChange={setShowAddDoctorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Doctor</DialogTitle>
            <DialogDescription>Register a new doctor to the platform</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doctor-name">Full Name</Label>
              <Input id="doctor-name" placeholder="Dr. John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctor-email">Email</Label>
              <Input id="doctor-email" type="email" placeholder="doctor@clinic.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctor-specialty">Specialty</Label>
              <Select>
                <SelectTrigger id="doctor-specialty">
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardiology">Cardiologist</SelectItem>
                  <SelectItem value="dermatology">Dermatologist</SelectItem>
                  <SelectItem value="pediatrics">Pediatrician</SelectItem>
                  <SelectItem value="general">General Physician</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doctor-license">License Number</Label>
              <Input id="doctor-license" placeholder="Enter license number" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDoctorDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              setShowAddDoctorDialog(false);
              toast({
                title: "Doctor Added",
                description: "New doctor has been successfully registered for verification",
              });
            }}>
              Add Doctor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Clinic Dialog */}
      <Dialog open={showAddClinicDialog} onOpenChange={setShowAddClinicDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Clinic</DialogTitle>
            <DialogDescription>Register a new clinic to the platform</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clinic-name">Clinic Name</Label>
              <Input id="clinic-name" placeholder="Enter clinic name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinic-address">Address</Label>
              <Input id="clinic-address" placeholder="Enter full address" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinic-city">City</Label>
              <Input id="clinic-city" placeholder="Enter city" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinic-phone">Phone Number</Label>
              <Input id="clinic-phone" placeholder="Enter phone number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinic-email">Email</Label>
              <Input id="clinic-email" type="email" placeholder="clinic@example.com" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddClinicDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              setShowAddClinicDialog(false);
              toast({
                title: "Clinic Added",
                description: "New clinic has been successfully registered",
              });
            }}>
              Add Clinic
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={showViewUserDialog} onOpenChange={setShowViewUserDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Complete user information</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="text-base font-semibold">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Role</p>
                  <Badge variant="outline">{selectedUser.role}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={selectedUser.status === "Active" ? "default" : "secondary"}>{selectedUser.status}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Joined Date</p>
                  <p className="text-base">{selectedUser.joined}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewUserDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditUserDialog} onOpenChange={setShowEditUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          {editUserData && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={editUserData.name}
                  onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editUserData.email}
                  onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={editUserData.role} onValueChange={(value) => setEditUserData({ ...editUserData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Patient">Patient</SelectItem>
                    <SelectItem value="Doctor">Doctor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={editUserData.status} onValueChange={(value) => setEditUserData({ ...editUserData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditUserDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              const updatedUsers = users.map(u => u.id === editUserData.id ? editUserData : u);
              setUsers(updatedUsers);
              setShowEditUserDialog(false);
              toast({
                title: "User Updated",
                description: `${editUserData.name}'s information has been updated`,
              });
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Doctor Dialog */}
      <Dialog open={showViewDoctorDialog} onOpenChange={setShowViewDoctorDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Doctor Details</DialogTitle>
            <DialogDescription>Complete doctor information</DialogDescription>
          </DialogHeader>
          {selectedDoctor && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="text-base font-semibold">{selectedDoctor.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base">{selectedDoctor.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Specialty</p>
                  <Badge variant="outline">{selectedDoctor.specialty}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={selectedDoctor.status === "Verified" ? "default" : "secondary"}>{selectedDoctor.status}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                  <p className="text-base">{selectedDoctor.patients}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDoctorDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Doctor Dialog */}
      <Dialog open={showEditDoctorDialog} onOpenChange={setShowEditDoctorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Doctor</DialogTitle>
            <DialogDescription>Update doctor information</DialogDescription>
          </DialogHeader>
          {editDoctorData && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={editDoctorData.name}
                  onChange={(e) => setEditDoctorData({ ...editDoctorData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editDoctorData.email}
                  onChange={(e) => setEditDoctorData({ ...editDoctorData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Specialty</Label>
                <Input
                  value={editDoctorData.specialty}
                  onChange={(e) => setEditDoctorData({ ...editDoctorData, specialty: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={editDoctorData.status} onValueChange={(value) => setEditDoctorData({ ...editDoctorData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Verified">Verified</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDoctorDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              const updatedDoctors = doctors.map(d => d.id === editDoctorData.id ? editDoctorData : d);
              setDoctors(updatedDoctors);
              setShowEditDoctorDialog(false);
              toast({
                title: "Doctor Updated",
                description: `${editDoctorData.name}'s information has been updated`,
              });
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Clinic Dialog */}
      <Dialog open={showViewClinicDialog} onOpenChange={setShowViewClinicDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Clinic Details</DialogTitle>
            <DialogDescription>Complete clinic information</DialogDescription>
          </DialogHeader>
          {selectedClinic && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Clinic Name</p>
                  <p className="text-base font-semibold">{selectedClinic.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-base">{selectedClinic.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Doctors</p>
                  <p className="text-base">{selectedClinic.doctors}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rating</p>
                  <Badge variant="default">⭐ {selectedClinic.rating}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={selectedClinic.status === "Active" ? "default" : "secondary"}>{selectedClinic.status}</Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewClinicDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Clinic Dialog */}
      <Dialog open={showEditClinicDialog} onOpenChange={setShowEditClinicDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Clinic</DialogTitle>
            <DialogDescription>Update clinic information</DialogDescription>
          </DialogHeader>
          {editClinicData && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Clinic Name</Label>
                <Input
                  value={editClinicData.name}
                  onChange={(e) => setEditClinicData({ ...editClinicData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={editClinicData.location}
                  onChange={(e) => setEditClinicData({ ...editClinicData, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Rating</Label>
                <Input
                  type="number"
                  step="0.1"
                  max="5"
                  min="0"
                  value={editClinicData.rating}
                  onChange={(e) => setEditClinicData({ ...editClinicData, rating: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={editClinicData.status} onValueChange={(value) => setEditClinicData({ ...editClinicData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditClinicDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              const updatedClinics = clinics.map(c => c.id === editClinicData.id ? editClinicData : c);
              setClinics(updatedClinics);
              setShowEditClinicDialog(false);
              toast({
                title: "Clinic Updated",
                description: `${editClinicData.name}'s information has been updated`,
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

export default AdminDashboard;
