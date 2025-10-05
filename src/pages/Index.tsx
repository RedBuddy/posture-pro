import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Camera, 
  BarChart3, 
  Shield, 
  Zap, 
  Users, 
  Award,
  CheckCircle,
  Upload,
  Activity,
  LogOut,
  User
} from "lucide-react";
import heroImage from "@/assets/hero-exercise-analysis.jpg";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const features = [
    {
      icon: Camera,
      title: "Análisis de Video IA",
      description: "Tecnología de visión artificial avanzada para detectar posturas en tiempo real"
    },
    {
      icon: BarChart3,
      title: "Métricas Detalladas",
      description: "Análisis completo con puntuaciones y recomendaciones personalizadas"
    },
    {
      icon: Shield,
      title: "Prevención de Lesiones",
      description: "Identifica problemas posturales antes de que se conviertan en lesiones"
    },
    {
      icon: Zap,
      title: "Resultados Instantáneos",
      description: "Procesamiento rápido con feedback inmediato sobre tu técnica"
    }
  ];

  const stats = [
    { number: "95%", label: "Precisión en detección" },
    { number: "1000+", label: "Ejercicios analizados" },
    { number: "50+", label: "Tipos de ejercicios" },
    { number: "24/7", label: "Disponibilidad" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                PostureAI
              </span>
            </div>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{user?.name || user?.email}</span>
                  </div>
                  <Link to="/upload">
                    <Button variant="outline">Subir Video</Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={logout}>
                    <LogOut className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="outline">Iniciar Sesión</Button>
                  </Link>
                  <Link to="/auth">
                    <Button variant="default">Registrarse</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  🚀 Proyecto de Tesis - Universidad
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Análisis Postural
                  <span className="block bg-gradient-hero bg-clip-text text-transparent">
                    Inteligente
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Sistema basado en visión artificial para analizar tu postura durante ejercicios físicos. 
                  Obtén feedback instantáneo y recomendaciones personalizadas.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/upload">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto">
                    <Upload className="mr-2 h-5 w-5" />
                    Comenzar Análisis
                  </Button>
                </Link>
                <Link to="/results">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Ver Ejemplo
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Gratis para estudiantes
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Sin registro requerido
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-large">
                <img 
                  src={heroImage} 
                  alt="Análisis de postura con IA"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-primary/20"></div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground p-3 rounded-full shadow-medium">
                <Camera className="h-6 w-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-secondary text-secondary-foreground p-3 rounded-full shadow-medium">
                <BarChart3 className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Tecnología de
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Vanguardia</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Utilizamos algoritmos avanzados de visión artificial para proporcionar 
              análisis precisos y recomendaciones personalizadas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-medium hover:shadow-large transition-smooth border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">¿Cómo Funciona?</h2>
            <p className="text-xl text-muted-foreground">
              Proceso simple en 3 pasos para analizar tu postura
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-medium">
                <Upload className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Subir Video</h3>
              <p className="text-muted-foreground">
                Carga tu video de ejercicio en formato MP4, AVI o MOV
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-medium">
                <Camera className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. Análisis IA</h3>
              <p className="text-muted-foreground">
                Nuestro sistema procesa cada frame detectando posturas clave
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-medium">
                <Award className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Resultados</h3>
              <p className="text-muted-foreground">
                Recibe tu puntuación, métricas detalladas y recomendaciones
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className="shadow-large border-0 bg-gradient-hero text-primary-foreground">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold mb-4">
                ¿Listo para Mejorar tu Técnica?
              </h2>
              <p className="text-xl mb-8 text-primary-foreground/80">
                Comienza ahora y descubre cómo perfeccionar tu forma de ejercitarte
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/upload">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    <Upload className="mr-2 h-5 w-5" />
                    Subir Mi Video
                  </Button>
                </Link>
                <Link to="/results">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    Ver Demo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">PostureAI</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Sistema de análisis postural desarrollado como proyecto de tesis universitaria
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            © 2024 - Desarrollo de un sistema basado en visión artificial
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
