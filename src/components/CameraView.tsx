import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, FlipHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import LanguageSelector from './LanguageSelector';
import { processImage } from '@/services/translationService';

interface CameraViewProps {
  onClose: () => void;
  userLanguage: string;
}

const CameraView: React.FC<CameraViewProps> = ({ onClose, userLanguage }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [selectedLanguage, setSelectedLanguage] = useState(userLanguage);
  const [translation, setTranslation] = useState<{ originalText: string; translation: string | null } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;

    setIsProcessing(true);
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL('image/jpeg');
      const result = await processImage(imageData, selectedLanguage);
      
      setTranslation(result);
      
      if (!result.translation) {
        toast({
          title: "No Translation Needed",
          description: "The text is already in your selected language.",
        });
      }
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Translation Error",
        description: "Failed to process the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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
        <canvas ref={canvasRef} className="hidden" />
        
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

        {translation && (
          <div className="absolute top-1/4 left-4 right-4 bg-black/70 p-4 rounded-lg">
            <p className="text-white/70 text-sm mb-2">Original Text:</p>
            <p className="text-white mb-4">{translation.originalText}</p>
            {translation.translation && (
              <>
                <p className="text-white/70 text-sm mb-2">Translation:</p>
                <p className="text-white">{translation.translation}</p>
              </>
            )}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
          <Button 
            className="w-full bg-primary hover:bg-primary/90"
            onClick={captureImage}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Capture & Translate"}
          </Button>
          <div className="text-white text-sm mt-2 text-center">
            Point camera at signs or landmarks for real-time translation
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraView;