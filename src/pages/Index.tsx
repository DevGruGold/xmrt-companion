
import React, { useState, useEffect } from 'react';
import { Camera, MessageSquare, Map, Globe, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CameraView from '@/components/CameraView';
import WaterSafety from '@/components/WaterSafety';
import { useToast } from '@/hooks/use-toast';
import { analyzeItinerary, generateTravelPlan, TravelSuggestions } from '@/services/travelPlannerService';
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
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
      setIsAnalyzing(true);
      const text = await file.text();
      const analysis = await analyzeItinerary(text);
      setAiAnalysis(analysis);
      
      toast({
        title: "Itinerary Analyzed",
        description: "Your travel itinerary has been analyzed by AI. Check the suggestions below.",
      });
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Error",
        description: "Failed to analyze itinerary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTravelAssistant = async () => {
    try {
      const suggestions = await generateTravelPlan(
        currentCountry,
        "5 days", // You could make this configurable
        ["sightseeing", "local food", "culture"] // You could make this configurable
      );

      setAiAnalysis(JSON.stringify(suggestions, null, 2));
      toast({
        title: "Travel Plan Generated",
        description: "Your AI travel plan is ready. Check the suggestions below.",
      });
    } catch (error) {
      console.error('Travel planning error:', error);
      toast({
        title: "Planning Error",
        description: "Failed to generate travel plan. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    detectLocation();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F0FB]">
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
              <h2 className="text-2xl font-bold text-[#6E59A5]">Travel XMRT</h2>
              <p className="text-sm text-[#8E9196]">Your AI Travel Companion</p>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2 hover:bg-[#E5DEFF]">
                    <Upload className="h-4 w-4" />
                    Import Itinerary
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-[#1A1F2C]">Import Travel Itinerary</DialogTitle>
                    <DialogDescription className="text-[#8A898C]">
                      Upload your TripIt or other travel itinerary file to get personalized AI suggestions.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="itinerary" className="text-sm font-medium text-[#1A1F2C]">
                        Choose File
                      </label>
                      <input
                        id="itinerary"
                        type="file"
                        accept=".csv,.json,.txt"
                        onChange={handleFileUpload}
                        className="cursor-pointer rounded-lg border border-[#C8C8C9] px-3 py-2 text-sm"
                        disabled={isAnalyzing}
                      />
                    </div>
                    <p className="text-xs text-[#8A898C]">
                      Supported formats: CSV, JSON, TXT
                    </p>
                    {isAnalyzing && (
                      <p className="text-sm text-[#8A898C] animate-pulse">
                        Analyzing your itinerary...
                      </p>
                    )}
                    {aiAnalysis && (
                      <div className="mt-4 p-4 bg-[#F1F0FB] rounded-lg">
                        <h3 className="font-medium mb-2 text-[#1A1F2C]">AI Analysis & Suggestions</h3>
                        <pre className="whitespace-pre-wrap text-sm text-[#221F26]">{aiAnalysis}</pre>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                className="gap-2 hover:bg-[#E5DEFF]"
                onClick={detectLocation}
              >
                <Globe className="h-4 w-4" />
                {currentCountry}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              className="h-32 flex flex-col gap-2 bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
              onClick={() => setShowCamera(true)}
            >
              <Camera className="h-8 w-8" />
              <span>Scan & Translate</span>
            </Button>
            <Button
              className="h-32 flex flex-col gap-2 bg-[#8B5CF6] hover:bg-[#7E69AB] text-white"
              onClick={handleTravelAssistant}
            >
              <MessageSquare className="h-8 w-8" />
              <span>Travel Assistant</span>
            </Button>
            <Button
              className="h-32 flex flex-col gap-2 bg-[#1EAEDB] hover:bg-[#33C3F0] text-white"
            >
              <Map className="h-8 w-8" />
              <span>Navigation</span>
            </Button>
          </div>

          {aiAnalysis && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-[#1A1F2C]">AI Travel Insights</h3>
              <pre className="whitespace-pre-wrap text-sm text-[#221F26]">{aiAnalysis}</pre>
            </div>
          )}

          <WaterSafety country={currentCountry} />
        </main>
      )}
      
      <Footer />
    </div>
  );
};

export default Index;
