import React, { useState } from 'react';
import { Camera, MessageSquare, Map, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CameraView from '@/components/CameraView';
import WaterSafety from '@/components/WaterSafety';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [currentCountry, setCurrentCountry] = useState("Japan");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const { toast } = useToast();

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
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setCurrentCountry("Japan")}
            >
              <Globe className="h-4 w-4" />
              {currentCountry}
            </Button>
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