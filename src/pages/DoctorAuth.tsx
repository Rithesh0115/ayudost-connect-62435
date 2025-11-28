import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const DoctorAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [otherLogin, setOtherLogin] = useState<string | null>(null);

  useEffect(() => {
    const checkOtherLogins = async () => {
      // Check if user is logged in via Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if they're a user (not a doctor)
        const { data: role } = await supabase.rpc('get_user_role', { _user_id: session.user.id });
        if (role === 'user') {
          setOtherLogin("User");
          return;
        }
      }
      
      // Check if admin is logged in
      if (localStorage.getItem("isAdminLoggedIn") === "true") {
        setOtherLogin("Admin");
      }
    };
    
    checkOtherLogins();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Verify user has 'doctor' role
      const { data: roleData } = await supabase.rpc('get_user_role', { _user_id: data.user.id });
      
      if (roleData !== 'doctor') {
        await supabase.auth.signOut();
        throw new Error("This account is not registered as a doctor");
      }

      // Set localStorage flag for backward compatibility
      localStorage.setItem("isDoctorLoggedIn", "true");
      
      toast({
        title: "Login Successful",
        description: "Welcome back, Doctor!",
      });
      
      navigate("/doctor-dashboard");
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phone = formData.get("phone") as string;
    const specialty = formData.get("specialty") as string;

    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/doctor-dashboard`,
          data: {
            full_name: fullName,
            is_doctor: true,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Insert doctor role
        await supabase.from('user_roles').insert({
          user_id: data.user.id,
          role: 'doctor',
        });

        // Create doctor profile
        await supabase.from('doctor_profiles').insert({
          id: data.user.id,
          full_name: fullName,
          email: email,
          phone: phone,
          specialty: specialty,
        });

        // Set localStorage flag for backward compatibility
        localStorage.setItem("isDoctorLoggedIn", "true");

        toast({
          title: "Account Created",
          description: "Welcome to AyuDost!",
        });
        
        navigate("/doctor-dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutOther = async () => {
    if (otherLogin === "User") {
      await supabase.auth.signOut();
    } else if (otherLogin === "Admin") {
      localStorage.removeItem("isAdminLoggedIn");
    }
    setOtherLogin(null);
    toast({
      title: "Logged Out",
      description: "You can now login as a doctor",
    });
  };

  if (otherLogin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="flex-1 flex items-center justify-center py-12 px-4 bg-gradient-to-b from-muted/30 to-background">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Stethoscope className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Already Logged In</CardTitle>
              <CardDescription>
                You are currently logged in as a {otherLogin}. Please logout first to access the Doctor portal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => navigate(otherLogin === "User" ? "/dashboard" : "/admin")} 
                className="w-full"
                variant="outline"
              >
                Go to {otherLogin} Dashboard
              </Button>
              <Button onClick={handleLogoutOther} className="w-full">
                Logout from {otherLogin}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 bg-gradient-to-b from-muted/30 to-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Stethoscope className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Doctor Portal</CardTitle>
            <CardDescription>
              Sign in to manage your appointments and patient records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-fullName">Full Name</Label>
                    <Input
                      id="signup-fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone Number</Label>
                    <Input
                      id="signup-phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-specialty">Specialty</Label>
                    <Input
                      id="signup-specialty"
                      name="specialty"
                      type="text"
                      placeholder="e.g., Kaya Chikitsa"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default DoctorAuth;
