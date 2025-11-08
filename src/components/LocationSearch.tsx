import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data - in production, this would come from an API
const locationData = {
  states: ["Maharashtra", "Karnataka", "Kerala", "Tamil Nadu"],
  districts: {
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    Karnataka: ["Bangalore", "Mysore", "Mangalore"],
    Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  },
  taluks: {
    Mumbai: ["Andheri", "Bandra", "Borivali"],
    Pune: ["Haveli", "Mulshi", "Bhor"],
    Bangalore: ["Bangalore North", "Bangalore South", "Anekal"],
    Mangalore: ["Puttur", "Bantwal", "Belthangady"],
    Mysore: ["Mysore City", "H.D. Kote", "Nanjangud"],
  },
};

const LocationSearch = () => {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTaluk, setSelectedTaluk] = useState("");

  const handleSearch = () => {
    if (selectedState && selectedDistrict && selectedTaluk) {
      navigate(`/clinics?state=${selectedState}&district=${selectedDistrict}&taluk=${selectedTaluk}`);
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-[var(--shadow-medium)] p-6 md:p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
        Find Ayurvedic Clinics Near You
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Select State
          </label>
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Choose state" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              {locationData.states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Select District
          </label>
          <Select
            value={selectedDistrict}
            onValueChange={setSelectedDistrict}
            disabled={!selectedState}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Choose district" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              {selectedState &&
                locationData.districts[selectedState as keyof typeof locationData.districts]?.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Select Taluk
          </label>
          <Select
            value={selectedTaluk}
            onValueChange={setSelectedTaluk}
            disabled={!selectedDistrict}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Choose taluk" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              {selectedDistrict &&
                locationData.taluks[selectedDistrict as keyof typeof locationData.taluks]?.map((taluk) => (
                  <SelectItem key={taluk} value={taluk}>
                    {taluk}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={handleSearch}
        className="w-full"
        size="lg"
        disabled={!selectedState || !selectedDistrict || !selectedTaluk}
      >
        <Search className="mr-2 h-5 w-5" />
        Search Clinics
      </Button>
    </div>
  );
};

export default LocationSearch;
