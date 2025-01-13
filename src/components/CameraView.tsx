import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, FlipHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import LanguageSelector from './LanguageSelector';

interface CameraViewProps {
  onClose: () => void;
  userLanguage: string;
}

const CameraView: React.FC<CameraViewProps> = ({ onClose, userLanguage }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [selectedLanguage, setSelectedLanguage] = useState(userLanguage);

  const startCamera = async () => {
    try {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  useEffect(() => {
    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="relative h-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="h-full w-full object-cover"
        />
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={toggleCamera}
          >
            <FlipHorizontal className="h-6 w-6" />
          </Button>
        </div>
        {isStreaming && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
            <div className="text-white text-sm">
              Point camera at signs or landmarks for real-time translation
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraView;