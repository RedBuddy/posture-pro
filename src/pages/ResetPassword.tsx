import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Activity } from "lucide-react";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token =
    searchParams.get("reset_token") || searchParams.get("token") || "";
  const navigate = useNavigate();
  const { toast } = useToast();

  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If no token, we can show a helpful message
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast({
        title: "Token faltante",
        description:
          "El enlace de restablecimiento no contiene un token válido.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        title: "Contraseña inválida",
        description: "La contraseña debe tener al menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await AuthAPI.resetPassword(token, newPassword);
      toast({
        title: "Contraseña actualizada",
        description: "Ahora puedes iniciar sesión con tu nueva contraseña.",
      });
      navigate("/auth");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al restablecer contraseña";
      toast({ title: "Error", description: message, variant: "destructive" });
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
          <h1 className="text-3xl font-bold">Restablecer contraseña</h1>
          <p className="text-muted-foreground mt-2">
            Ingresa tu nueva contraseña
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Nueva Contraseña</CardTitle>
              <CardDescription>
                {token
                  ? "Ingresa una nueva contraseña para tu cuenta."
                  : "No se encontró token de restablecimiento en el enlace. Revisa tu correo o solicita otro restablecimiento desde la pantalla de recuperación."}
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
                  disabled={!token || isLoading}
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={!token || isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Restablecer Contraseña
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
