import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  User
} from "lucide-react";

const Results = () => {
  const [analysisData] = useState({
    overallScore: 85,
    exercise: "Sentadillas",
    duration: "45 segundos",
    frameCount: 135,
    issues: [
      { type: "Rodillas hacia adentro", severity: "alto", frame: 23 },
      { type: "Inclinación excesiva", severity: "medio", frame: 67 },
      { type: "Desalineación de cadera", severity: "bajo", frame: 89 }
    ],
    improvements: [
      "Mantén las rodillas alineadas con los pies",
      "Reduce la inclinación del torso hacia adelante",
      "Fortalece los músculos del core para mejor estabilidad"
    ],
    bodyMetrics: {
      leftKnee: 78,
      rightKnee: 82,
      hipAlignment: 75,
      spineAngle: 88,
      shoulderLevel: 92
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'alto': return 'destructive';
      case 'medio': return 'warning';
      case 'bajo': return 'secondary';
      default: return 'secondary';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 75) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Análisis Postural Completado
        </h1>
        <p className="text-lg text-muted-foreground">
          Resultados detallados de tu ejercicio de {analysisData.exercise}
        </p>
      </div>

      {/* Score Overview */}
      <Card className="mb-8 shadow-large">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(analysisData.overallScore)} mb-2`}>
                {analysisData.overallScore}%
              </div>
              <p className="text-sm text-muted-foreground">Puntuación General</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-foreground mb-2">
                {analysisData.duration}
              </div>
              <p className="text-sm text-muted-foreground">Duración</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-foreground mb-2">
                {analysisData.frameCount}
              </div>
              <p className="text-sm text-muted-foreground">Frames Analizados</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-destructive mb-2">
                {analysisData.issues.length}
              </div>
              <p className="text-sm text-muted-foreground">Problemas Detectados</p>
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
                  <div className="text-center">
                    <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Vista previa del video</p>
                    <Button variant="outline" className="mt-4">
                      Reproducir Análisis
                    </Button>
                  </div>
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
              <CardContent className="space-y-4">
                {analysisData.issues.map((issue, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{issue.type}</p>
                      <p className="text-sm text-muted-foreground">Frame {issue.frame}</p>
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
              {Object.entries(analysisData.bodyMetrics).map(([part, score]) => (
                <div key={part} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium capitalize">
                      {part.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className={`font-semibold ${getScoreColor(score)}`}>
                      {score}%
                    </span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              ))}
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
                  <p className="text-muted-foreground">Gráfico de progresión temporal</p>
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
              {analysisData.improvements.map((improvement, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-success/5 border border-success/20 rounded-lg">
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
        <Button variant="hero" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Descargar Reporte
        </Button>
        <Button variant="gradient" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Compartir con Entrenador
        </Button>
        <Button variant="outline">
          Analizar Otro Video
        </Button>
      </div>
    </div>
  );
};

export default Results;