import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    // Predefined credentials
    if (username === "Ayudost" && password === "Ayudost@123") {
      setTimeout(() => {
        localStorage.setItem("isAdminLoggedIn", "true");
        setIsLoading(false);
        toast({
          title: "Admin Access Granted",
          description: "Welcome to the admin dashboard",
        });
        navigate("/admin");
      }, 1000);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Access Denied",
          description: "Invalid admin credentials",
          variant: "destructive",
        });
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 bg-gradient-to-b from-muted/30 to-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Admin Portal</CardTitle>
            <CardDescription>
              Secure access for platform administrators only
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter admin username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Sign In as Admin"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default AdminAuth;
