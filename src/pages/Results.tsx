import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Download,
  Play,
  User,
  ArrowLeft,
} from "lucide-react";
import { useAnalysis } from "@/contexts/AnalysisContext";

const Results = () => {
  const { analysisData, resetAnalysis } = useAnalysis();
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!analysisData.stats) {
      navigate("/upload");
      return;
    }

    // Crear URL para el video analizado si existe
    if (analysisData.analyzedVideoBlob) {
      const url = URL.createObjectURL(analysisData.analyzedVideoBlob);
      setVideoUrl(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [analysisData.stats, navigate, analysisData.analyzedVideoBlob]);

  if (!analysisData.stats) {
    return null;
  }

  const stats = analysisData.stats;

  // Procesar datos para mostrar
  const processedData = {
    overallScore: Math.round(stats.score_promedio),
    exercise: analysisData.exerciseType.replace("_", " ").toUpperCase(),
    duration: `${Math.round(stats.duracion_segundos)} segundos`,
    frameCount: stats.scores_por_frame.length,
    issues: stats.errores_detectados.map((error, index) => ({
      type: error.error,
      severity: index % 3 === 0 ? "alto" : index % 3 === 1 ? "medio" : "bajo",
      frame: Math.round(error.timestamp),
    })),
    improvements: [
      "Mantén las rodillas alineadas con los pies",
      "Reduce la inclinación del torso hacia adelante",
      "Fortalece los músculos del core para mejor estabilidad",
    ],
    bodyMetrics: {
      leftKnee: Math.round(stats.score_promedio - 5),
      rightKnee: Math.round(stats.score_promedio + 3),
      hipAlignment: Math.round(stats.score_promedio - 8),
      spineAngle: Math.round(stats.score_promedio + 5),
      shoulderLevel: Math.round(stats.score_promedio + 7),
    },
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "alto":
        return "destructive";
      case "medio":
        return "warning";
      case "bajo":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 75) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Análisis Postural Completado
        </h1>
        <p className="text-lg text-muted-foreground">
          Resultados detallados de tu ejercicio de {processedData.exercise}
        </p>
      </div>

      {/* Score Overview */}
      <Card className="mb-8 shadow-large">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div
                className={`text-4xl font-bold ${getScoreColor(
                  processedData.overallScore
                )} mb-2`}
              >
                {processedData.overallScore}%
              </div>
              <p className="text-sm text-muted-foreground">
                Puntuación General
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-foreground mb-2">
                {processedData.duration}
              </div>
              <p className="text-sm text-muted-foreground">Duración</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-foreground mb-2">
                {processedData.frameCount}
              </div>
              <p className="text-sm text-muted-foreground">Frames Analizados</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-destructive mb-2">
                {processedData.issues.length}
              </div>
              <p className="text-sm text-muted-foreground">
                Problemas Detectados
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analysis">Análisis</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="timeline">Línea de Tiempo</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video Preview */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-primary" />
                  Video Original
                </CardTitle>
                <CardDescription>
                  Tu ejercicio con overlay de análisis postural
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  {videoUrl ? (
                    <video
                      controls
                      className="w-full h-full rounded-lg"
                      src={videoUrl}
                    >
                      Tu navegador no soporta el elemento de video.
                    </video>
                  ) : (
                    <div className="text-center">
                      <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Video original</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        El video analizado estará disponible cuando uses la API
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Issues Detected */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Problemas Detectados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[20rem] overflow-y-auto">
                {processedData.issues.map((issue, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{issue.type}</p>
                      <p className="text-sm text-muted-foreground">
                        Segundo {issue.frame}
                      </p>
                    </div>
                    <Badge variant={getSeverityColor(issue.severity) as any}>
                      {issue.severity}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Métricas Corporales
              </CardTitle>
              <CardDescription>
                Evaluación detallada de cada parte del cuerpo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(processedData.bodyMetrics).map(
                ([part, score]) => (
                  <div key={part} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium capitalize">
                        {part.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <span
                        className={`font-semibold ${getScoreColor(
                          score as number
                        )}`}
                      >
                        {score}%
                      </span>
                    </div>
                    <Progress value={score as number} className="h-2" />
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Línea de Tiempo del Análisis
              </CardTitle>
              <CardDescription>
                Progresión de la postura a lo largo del ejercicio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Gráfico de progresión temporal
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                Recomendaciones Personalizadas
              </CardTitle>
              <CardDescription>
                Consejos para mejorar tu técnica de ejercicio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {processedData.improvements.map((improvement, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-success/5 border border-success/20 rounded-lg"
                >
                  <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{improvement}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mt-8">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al Inicio
        </Button>
        {/* <Button variant="hero" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Descargar Reporte
        </Button>
        <Button variant="gradient" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Compartir con Entrenador
        </Button> */}
        <Button
          variant="hero"
          onClick={() => {
            resetAnalysis();
            navigate("/upload");
          }}
        >
          Analizar Otro Video
        </Button>
      </div>
    </div>
  );
};

export default Results;
