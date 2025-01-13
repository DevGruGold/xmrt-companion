import React, { useState } from 'react';
import { Camera, MessageSquare, Map, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CameraView from '@/components/CameraView';
import WaterSafety from '@/components/WaterSafety';

const Index = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [currentCountry, setCurrentCountry] = useState("Japan"); // Example country

  return (
    <div className="min-h-screen bg-muted">
      {showCamera ? (
        <CameraView onClose={() => setShowCamera(false)} />
      ) : (
        <div className="container py-6 space-y-6">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">XMRT Traveler</h1>
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
          </header>

          <div className="grid grid-cols-2 gap-4">
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
        </div>
      )}
    </div>
  );
};

export default Index;