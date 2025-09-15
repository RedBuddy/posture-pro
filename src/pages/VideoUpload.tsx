import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, Video, CheckCircle, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { VideoAnalysisAPI, ExerciseType } from "@/services/api";
import { useAnalysis } from "@/contexts/AnalysisContext";

const VideoUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string>("sentadilla");
  const [isApiConnected, setIsApiConnected] = useState<boolean | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setAnalysisData } = useAnalysis();

  useEffect(() => {
    const checkApiAndLoadExercises = async () => {
      try {
        const [connected, types] = await Promise.all([
          VideoAnalysisAPI.healthCheck(),
          VideoAnalysisAPI.getExerciseTypes()
        ]);
        
        setIsApiConnected(connected);
        setExerciseTypes(types);
        
        toast({
          title: "MediaPipe JS Activo",
          description: "Análisis de postura en tiempo real listo.",
          variant: "default"
        });
      } catch (error) {
        setIsApiConnected(false);
        setExerciseTypes([
          { id: 'sentadilla', name: 'SENTADILLA', description: 'Análisis de sentadillas' },
          { id: 'peso_muerto', name: 'PESO MUERTO', description: 'Análisis de peso muerto' },
          { id: 'press_banca', name: 'PRESS BANCA', description: 'Análisis de press banca' }
        ]);
      }
    };

    checkApiAndLoadExercises();
  }, [toast]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: "Video seleccionado",
        description: `${file.name} listo para análisis.`,
      });
    }
  }, [toast]);

  const startAnalysis = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      setAnalysisData({ 
        isAnalyzing: true, 
        videoFile: uploadedFile, 
        exerciseType: selectedExercise 
      });

      const { videoBlob, stats } = await VideoAnalysisAPI.uploadAndAnalyze(
        uploadedFile,
        selectedExercise,
        (progress) => setUploadProgress(progress)
      );

      setAnalysisData({
        analyzedVideoBlob: videoBlob,
        stats: stats,
        isAnalyzing: false
      });

      toast({
        title: "Análisis completado",
        description: "Video analizado con MediaPipe JS.",
      });

      setTimeout(() => navigate('/results'), 1000);
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      setAnalysisData({ isAnalyzing: false });
      
      toast({
        title: "Error en el análisis",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive"
      });
    }
  };

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
        <div className="flex items-center justify-center gap-2 mb-4">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Subir Video para Análisis
          </h1>
          {isApiConnected !== null && (
            <Badge variant={isApiConnected ? "secondary" : "destructive"} className="ml-2">
              <>
                <Wifi className="h-3 w-3 mr-1" />
                MediaPipe JS Activo
              </>
            </Badge>
          )}
        </div>
        <p className="text-lg text-muted-foreground">
          Sube tu video de ejercicio y obtén un análisis detallado de tu postura
        </p>
      </div>

      {/* Selector de Ejercicio */}
      <Card className="shadow-medium mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            Tipo de Ejercicio
          </CardTitle>
          <CardDescription>
            Selecciona el tipo de ejercicio que vas a realizar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedExercise} onValueChange={setSelectedExercise}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un ejercicio" />
            </SelectTrigger>
            <SelectContent>
              {exerciseTypes.map((exercise) => (
                <SelectItem key={exercise.id} value={exercise.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{exercise.name}</span>
                    <span className="text-sm text-muted-foreground">{exercise.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
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
                  <Button variant="outline" onClick={resetUpload} className="flex-1">
                    Analizar Otro Video
                  </Button>
                ) : isUploading ? (
                  <Button disabled className="flex-1">
                    Analizando...
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={resetUpload} className="flex-1">
                      Seleccionar Otro Video
                    </Button>
                    <Button variant="hero" onClick={startAnalysis} className="flex-1">
                      Iniciar Análisis Postural
                    </Button>
                  </>
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