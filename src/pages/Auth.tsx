import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import intrucksLogo from "@/assets/intrucks-logo-family.png";
import authBackground from "@/assets/auth-background.jpg";

const ALLOWED_EMAILS = [
  'jorge@intruckscorp.com',
  'procesos@intruckscorp.com',
  'paula.venegas@intruckscorp.com',
  'david@intruckscorp.com',
  'it@intruckscorp.com'
];

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    // Validate email is in the allowed list
    if (!ALLOWED_EMAILS.includes(email.toLowerCase())) {
      toast.error("Este correo no está autorizado. Contacta al administrador.");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Credenciales inválidas");
          } else {
            toast.error(error.message);
          }
          return;
        }

        toast.success("¡Bienvenido!");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (error) {
          if (error.message.includes("User already registered")) {
            toast.error("Este correo ya está registrado");
          } else {
            toast.error(error.message);
          }
          return;
        }

        toast.success("¡Cuenta creada exitosamente!");
      }
    } catch (error: any) {
      toast.error("Error al procesar la solicitud");
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
            className="h-24 mb-8 drop-shadow-2xl hover:drop-shadow-[0_20px_35px_rgba(0,0,0,0.35)] transition-all duration-300 animate-[float_3s_ease-in-out_infinite]" 
            style={{ 
              filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.3))',
              WebkitBoxReflect: 'below 2px linear-gradient(transparent, transparent 40%, rgba(255, 255, 255, 0.2))'
            }}
          />
          <h1 className="text-2xl font-bold text-center">
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </h1>
          <p className="text-muted-foreground text-center mt-2">
            Generador de Firmas InTrucks Corp
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <Label htmlFor="email">Correo Electrónico Autorizado</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@intruckscorp.com"
              disabled={loading}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Solo correos autorizados pueden acceder
            </p>
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
              <>{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-primary hover:underline"
            disabled={loading}
          >
            {isLogin
              ? "¿No tienes cuenta? Regístrate"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </Card>
    </div>
  );
}