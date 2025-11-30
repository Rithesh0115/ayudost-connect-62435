import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Briefcase, Building, DollarSign, Award, Stethoscope, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [doctorProfile, setDoctorProfile] = useState<any>(null);
  const [showEditProfileDialog, setShowEditProfileDialog] = useState(false);
  const [editProfileData, setEditProfileData] = useState<any>(null);

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
          description: "You must be a doctor to access this page",
          variant: "destructive",
        });
        navigate("/doctor-auth");
        return;
      }

      setSession(session);
      await fetchDoctorProfile(session.user.id);
    };

    checkAuth();
  }, [navigate, toast]);

  // Check for edit query parameter
  useEffect(() => {
    const editParam = searchParams.get('edit');
    if (editParam === 'true' && doctorProfile) {
      setEditProfileData(doctorProfile);
      setShowEditProfileDialog(true);
      // Clean up query parameter
      searchParams.delete('edit');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, doctorProfile]);

  const fetchDoctorProfile = async (doctorId: string) => {
    try {
      setLoading(true);
      const { data: profileData, error: profileError } = await supabase
        .from('doctor_profiles')
        .select('*')
        .eq('id', doctorId)
        .single();

      if (profileError) throw profileError;
      setDoctorProfile(profileData);
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "D";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Doctor Profile
            </h1>
            <p className="text-muted-foreground">
              View and manage your professional profile
            </p>
          </div>

          {/* Profile Header Card */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-green-600 text-white text-2xl">
                    {getInitials(doctorProfile?.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-foreground mb-1">
                    {doctorProfile?.full_name || "Doctor"}
                  </h2>
                  <p className="text-muted-foreground mb-2">
                    {doctorProfile?.specialty || "Medical Professional"}
                  </p>
                  <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                    <Mail className="h-4 w-4" />
                    {doctorProfile?.email || session?.user?.email}
                  </p>
                </div>
                <Button 
                  onClick={() => {
                    setEditProfileData(doctorProfile);
                    setShowEditProfileDialog(true);
                  }}
                >
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>Your professional details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!doctorProfile ? (
                <p className="text-muted-foreground text-center py-8">Profile not found</p>
              ) : (
                <>
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                        <p className="text-base font-semibold">{doctorProfile.full_name || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <p className="text-base">{doctorProfile.email || 'Not provided'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Phone</p>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <p className="text-base">{doctorProfile.phone || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Details */}
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      Professional Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Specialty</p>
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4 text-muted-foreground" />
                          <p className="text-base">{doctorProfile.specialty || 'Not specified'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Years of Experience</p>
                        <p className="text-base">{doctorProfile.experience_years ? `${doctorProfile.experience_years} years` : 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Qualifications</p>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-muted-foreground" />
                          <p className="text-base">{doctorProfile.qualifications || 'Not provided'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Consultation Fee</p>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <p className="text-base">{doctorProfile.consultation_fee ? `₹${doctorProfile.consultation_fee}` : 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clinic Information */}
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Building className="h-5 w-5 text-primary" />
                      Clinic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Clinic Name</p>
                        <p className="text-base">{doctorProfile.clinic_name || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Clinic Address</p>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <p className="text-base">{doctorProfile.clinic_address || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Professional Bio
                    </h3>
                    <p className="text-base text-muted-foreground">
                      {doctorProfile.bio || 'No bio provided yet. Click "Edit Profile" to add your professional biography.'}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />

      {/* Edit Profile Dialog */}
      <Dialog open={showEditProfileDialog} onOpenChange={setShowEditProfileDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your professional profile information</DialogDescription>
          </DialogHeader>
          {editProfileData && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name *</label>
                  <input
                    type="text"
                    value={editProfileData.full_name || ''}
                    onChange={(e) => setEditProfileData({ ...editProfileData, full_name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                    placeholder="Dr. John Doe"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <input
                    type="tel"
                    value={editProfileData.phone || ''}
                    onChange={(e) => setEditProfileData({ ...editProfileData, phone: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                    placeholder="+91 1234567890"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email *</label>
                  <input
                    type="email"
                    value={editProfileData.email || ''}
                    onChange={(e) => setEditProfileData({ ...editProfileData, email: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                    placeholder="doctor@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Specialty</label>
                  <input
                    type="text"
                    value={editProfileData.specialty || ''}
                    onChange={(e) => setEditProfileData({ ...editProfileData, specialty: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                    placeholder="Cardiologist"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Qualifications</label>
                  <input
                    type="text"
                    value={editProfileData.qualifications || ''}
                    onChange={(e) => setEditProfileData({ ...editProfileData, qualifications: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                    placeholder="MBBS, MD"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Years of Experience</label>
                  <input
                    type="number"
                    value={editProfileData.experience_years || ''}
                    onChange={(e) => setEditProfileData({ ...editProfileData, experience_years: parseInt(e.target.value) || null })}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                    placeholder="10"
                    min="0"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    value={editProfileData.consultation_fee || ''}
                    onChange={(e) => setEditProfileData({ ...editProfileData, consultation_fee: parseFloat(e.target.value) || null })}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                    placeholder="500"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Clinic Name</label>
                  <input
                    type="text"
                    value={editProfileData.clinic_name || ''}
                    onChange={(e) => setEditProfileData({ ...editProfileData, clinic_name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                    placeholder="City Care Hospital"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Clinic Address</label>
                <input
                  type="text"
                  value={editProfileData.clinic_address || ''}
                  onChange={(e) => setEditProfileData({ ...editProfileData, clinic_address: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
                  placeholder="123 Main Street, City, State"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Professional Bio</label>
                <textarea
                  value={editProfileData.bio || ''}
                  onChange={(e) => setEditProfileData({ ...editProfileData, bio: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background min-h-[120px]"
                  placeholder="Tell patients about your experience, expertise, and approach to healthcare..."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditProfileDialog(false)}>Cancel</Button>
            <Button onClick={async () => {
              if (!editProfileData.full_name?.trim() || !editProfileData.email?.trim()) {
                toast({
                  title: "Validation Error",
                  description: "Full name and email are required fields",
                  variant: "destructive",
                });
                return;
              }

              if (!session) return;

              try {
                const { error } = await supabase
                  .from('doctor_profiles')
                  .update({
                    full_name: editProfileData.full_name,
                    email: editProfileData.email,
                    phone: editProfileData.phone,
                    specialty: editProfileData.specialty,
                    qualifications: editProfileData.qualifications,
                    clinic_name: editProfileData.clinic_name,
                    clinic_address: editProfileData.clinic_address,
                    bio: editProfileData.bio,
                    experience_years: editProfileData.experience_years,
                    consultation_fee: editProfileData.consultation_fee
                  })
                  .eq('id', session.user.id);

                if (error) throw error;

                setDoctorProfile(editProfileData);
                setShowEditProfileDialog(false);
                toast({
                  title: "Profile Updated",
                  description: "Your profile has been updated successfully",
                });
              } catch (error: any) {
                toast({
                  title: "Error",
                  description: error.message || "Failed to update profile",
                  variant: "destructive",
                });
              }
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorProfile;
