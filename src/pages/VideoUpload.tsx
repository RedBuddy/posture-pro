import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, Video, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VideoUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simular progreso de subida
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            toast({
              title: "Video subido exitosamente",
              description: "Tu video está listo para análisis postural.",
            });
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.wmv']
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: false
  });

  const resetUpload = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Subir Video para Análisis
        </h1>
        <p className="text-lg text-muted-foreground">
          Sube tu video de ejercicio y obtén un análisis detallado de tu postura
        </p>
      </div>

      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            Seleccionar Video
          </CardTitle>
          <CardDescription>
            Formatos soportados: MP4, AVI, MOV, WMV (máximo 100MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!uploadedFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-smooth
                ${isDragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              {isDragActive ? (
                <p className="text-lg font-medium text-primary">
                  Suelta el video aquí...
                </p>
              ) : (
                <div>
                  <p className="text-lg font-medium mb-2">
                    Arrastra y suelta tu video aquí, o haz clic para seleccionar
                  </p>
                  <p className="text-sm text-muted-foreground">
                    El video será analizado para detectar la postura durante el ejercicio
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Video className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                {uploadProgress === 100 ? (
                  <CheckCircle className="h-6 w-6 text-success" />
                ) : isUploading ? (
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-warning" />
                )}
              </div>
              
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subiendo video...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
              
              <div className="flex gap-3">
                {uploadProgress === 100 ? (
                  <Button variant="hero" className="flex-1">
                    Iniciar Análisis Postural
                  </Button>
                ) : (
                  <Button variant="outline" onClick={resetUpload} className="flex-1">
                    Seleccionar otro video
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center shadow-soft">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">1. Subir Video</h3>
            <p className="text-sm text-muted-foreground">
              Selecciona tu video de ejercicio para comenzar el análisis
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center shadow-soft">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="font-semibold mb-2">2. Análisis IA</h3>
            <p className="text-sm text-muted-foreground">
              Nuestro sistema analiza tu postura frame por frame
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center shadow-soft">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">3. Resultados</h3>
            <p className="text-sm text-muted-foreground">
              Recibe recomendaciones personalizadas para mejorar
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoUpload;