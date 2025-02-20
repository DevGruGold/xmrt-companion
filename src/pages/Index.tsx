
import React, { useState, useEffect } from 'react';
import { Camera, MessageSquare, Map, Globe, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CameraView from '@/components/CameraView';
import WaterSafety from '@/components/WaterSafety';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Index = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [currentCountry, setCurrentCountry] = useState("Loading...");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const { toast } = useToast();

  const detectLocation = async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();
      
      setCurrentCountry(data.countryName || "Unknown");
      toast({
        title: "Location Updated",
        description: `Your location has been set to ${data.countryName}`,
      });
    } catch (error) {
      console.error('Error getting location:', error);
      toast({
        title: "Location Error",
        description: "Unable to detect your location. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Here you would implement the actual file parsing logic
      // For now, we'll just show a success message
      toast({
        title: "Itinerary Imported",
        description: "Your travel itinerary has been successfully imported.",
      });
    } catch (error) {
      toast({
        title: "Import Error",
        description: "Failed to import itinerary. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    detectLocation();
  }, []);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    toast({
      title: "Language Updated",
      description: "Your preferred language has been updated.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Header />
      
      {showCamera ? (
        <CameraView 
          onClose={() => setShowCamera(false)} 
          userLanguage={selectedLanguage}
        />
      ) : (
        <main className="flex-grow container py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary">Welcome to XMRT Traveler</h2>
              <p className="text-sm text-gray-600">Your AI Travel Companion</p>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Import Itinerary
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import Travel Itinerary</DialogTitle>
                    <DialogDescription>
                      Upload your TripIt or other travel itinerary file to get personalized AI suggestions.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="itinerary" className="text-sm font-medium">
                        Choose File
                      </label>
                      <input
                        id="itinerary"
                        type="file"
                        accept=".csv,.json,.txt"
                        onChange={handleFileUpload}
                        className="cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-sm"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Supported formats: CSV, JSON, TXT
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                className="gap-2"
                onClick={detectLocation}
              >
                <Globe className="h-4 w-4" />
                {currentCountry}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              className="h-32 flex flex-col gap-2 bg-primary hover:bg-primary/90"
              onClick={() => setShowCamera(true)}
            >
              <Camera className="h-8 w-8" />
              <span>Scan & Translate</span>
            </Button>
            <Button
              className="h-32 flex flex-col gap-2 bg-secondary hover:bg-secondary/90"
            >
              <MessageSquare className="h-8 w-8" />
              <span>Travel Assistant</span>
            </Button>
            <Button
              className="h-32 flex flex-col gap-2 bg-accent hover:bg-accent/90"
            >
              <Map className="h-8 w-8" />
              <span>Navigation</span>
            </Button>
          </div>

          <WaterSafety country={currentCountry} />
        </main>
      )}
      
      <Footer />
    </div>
  );
};

export default Index;
