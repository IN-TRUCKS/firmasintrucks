import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import intrucksLogo from "@/assets/intrucks-logo-family.png";
import authBackground from "@/assets/auth-background.jpg";

const loginSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .endsWith("@intruckscorp.com", "Debe usar correo corporativo"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate with Zod
    try {
      loginSchema.parse({ email, password });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    setLoading(true);

    try {
      await login(email, password);
      toast.success("¡Bienvenido!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${authBackground})` }}
    >
      <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm shadow-2xl border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <img 
            src={intrucksLogo} 
            alt="InTrucks Corp" 
            className="h-32 mb-8 drop-shadow-2xl hover:drop-shadow-[0_20px_35px_rgba(0,0,0,0.35)] transition-all duration-300" 
            style={{ 
              filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.3))',
              WebkitBoxReflect: 'below 2px linear-gradient(transparent, transparent 40%, rgba(255, 255, 255, 0.2))'
            }}
          />
          <h1 className="text-2xl font-bold text-center">
            Iniciar Sesión
          </h1>
          <p className="text-muted-foreground text-center mt-2">
            Generador de Firmas InTrucks Corp
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <Label htmlFor="email">Correo Electrónico Corporativo</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@intruckscorp.com"
              disabled={loading}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>Iniciar Sesión</>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
