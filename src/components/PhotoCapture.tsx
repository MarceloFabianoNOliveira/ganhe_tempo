
import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Camera, Upload, X, Images } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-mobile';

interface PhotoCaptureProps {
  photos?: string[]; // Agora recebendo múltiplas fotos
  addPhoto: (photo: string) => void;
  removePhoto: (index: number) => void;
}

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  photos = [],
  addPhoto,
  removePhoto,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: isMobile ? 720 : 1280 },
          height: { ideal: isMobile ? 480 : 720 },
          facingMode: 'environment'
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsStreamActive(true);
      }
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error);
      alert('Não foi possível acessar a câmera. Verifique as permissões.');
    }
  }, [isMobile]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsStreamActive(false);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const photoData = canvas.toDataURL('image/jpeg', 0.8);
        addPhoto(photoData);
        stopCamera();
        setIsOpen(false);
      }
    }
  }, [addPhoto, stopCamera]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          addPhoto(result);
          setIsOpen(false);
        };
        reader.readAsDataURL(file);
      });
    }
  }, [addPhoto]);

  const handleDialogOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      stopCamera();
    }
  };

  const CaptureContent = () => (
    <div className="space-y-4 p-4">
      {!isStreamActive ? (
        <div className="space-y-4">
          <Button onClick={startCamera} className="w-full">
            <Camera className="h-4 w-4 mr-2" />
            Abrir Câmera
          </Button>
          <div className="text-center text-sm text-muted-foreground">ou</div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Escolher da Galeria
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded-lg max-h-[60vh] object-cover"
            />
          </div>
          <div className="flex space-x-2">
            <Button onClick={capturePhoto} className="flex-1">
              Capturar
            </Button>
            <Button variant="outline" onClick={stopCamera} className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-2">
      <Label>Fotos do Item (Opcional)</Label>

      {/* Mostrar miniaturas das fotos já adicionadas */}
      {photos && photos.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-1">
          {photos.map((photo, idx) => (
            <div key={idx} className="relative inline-block">
              <img
                src={photo}
                alt={`Foto ${idx + 1}`}
                className="w-20 h-20 object-cover rounded border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={() => removePhoto(idx)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {isMobile ? (
        <Drawer open={isOpen} onOpenChange={handleDialogOpenChange}>
          <DrawerTrigger asChild>
            <Button type="button" variant="outline" className="w-full">
              <Images className="h-4 w-4 mr-2" />
              Adicionar Foto
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Capturar Foto</DrawerTitle>
            </DrawerHeader>
            <CaptureContent />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" className="w-full">
              <Images className="h-4 w-4 mr-2" />
              Adicionar Foto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Capturar Foto</DialogTitle>
            </DialogHeader>
            <CaptureContent />
          </DialogContent>
        </Dialog>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

// O arquivo está ficando grande. Considere pedir um refactor caso precise de mais funcionalidades.
