import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Activity } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("login");

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/upload");
    }

    const token = searchParams.get("reset_token");
    if (token) {
      setResetToken(token);
      setShowResetForm(true);
      setActiveTab("forgot");
    }
  }, [isAuthenticated, navigate, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(loginEmail, loginPassword);
      toast({
        title: "Bienvenido",
        description: "Has iniciado sesión correctamente",
      });
      navigate("/upload");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error al iniciar sesión",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    if (registerPassword.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await register(registerEmail, registerPassword, registerName);
      toast({
        title: "¡Cuenta creada!",
        description: "Tu cuenta ha sido creada correctamente",
      });
      navigate("/upload");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error al crear cuenta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await AuthAPI.forgotPassword(forgotEmail);
      toast({
        title: "Correo enviado",
        description: "Revisa tu correo para restablecer tu contraseña",
      });
      setForgotEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error al enviar correo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await AuthAPI.resetPassword(resetToken, newPassword);
      toast({
        title: "Contraseña actualizada",
        description: "Ahora puedes iniciar sesión con tu nueva contraseña",
      });
      setShowResetForm(false);
      setActiveTab("login");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al restablecer contraseña",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <Activity className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Análisis de Postura</h1>
          <p className="text-muted-foreground mt-2">Mejora tu técnica con IA</p>
        </div>

        <Card>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registro</TabsTrigger>
              <TabsTrigger value="forgot">Recuperar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle>Iniciar Sesión</CardTitle>
                  <CardDescription>
                    Ingresa tus credenciales para continuar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Iniciar Sesión
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <CardHeader>
                  <CardTitle>Crear Cuenta</CardTitle>
                  <CardDescription>
                    Regístrate para comenzar a analizar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nombre</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Tu nombre"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirmar Contraseña
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Crear Cuenta
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="forgot">
              {showResetForm ? (
                <form onSubmit={handleResetPassword}>
                  <CardHeader>
                    <CardTitle>Nueva Contraseña</CardTitle>
                    <CardDescription>
                      Ingresa tu nueva contraseña
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nueva Contraseña</Label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Restablecer Contraseña
                    </Button>
                  </CardFooter>
                </form>
              ) : (
                <form onSubmit={handleForgotPassword}>
                  <CardHeader>
                    <CardTitle>Recuperar Contraseña</CardTitle>
                    <CardDescription>
                      Te enviaremos un correo para restablecer tu contraseña
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email">Email</Label>
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Enviar Correo
                    </Button>
                  </CardFooter>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
