import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary hover:text-primary/80 transition-colors">
          <Leaf className="h-6 w-6" />
          <span>AyuDost</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/clinics" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Find Clinics
          </Link>
          <Link to="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Contact
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/auth">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/auth?mode=signup">
            <Button>Sign Up</Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <div className="flex flex-col gap-4 mt-8">
              <Link to="/" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/clinics" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                Find Clinics
              </Link>
              <Link to="/about" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                Contact
              </Link>
              <div className="flex flex-col gap-2 mt-4">
                <Link to="/auth">
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
