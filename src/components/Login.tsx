import { useState } from "react";
import { Hexagon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Card, CardContent } from "./ui/card";
import { toast } from "sonner";
import { apiService } from "../services/apiService";

interface LoginProps {
  onLogin: (email: string) => void;
  onForgotPassword: () => void;
}

export function Login({ onLogin, onForgotPassword }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await apiService.authenticate(email, password);
      
      if (result.success) {
        onLogin(email);
        toast.success("Login realizado com sucesso!");
      } else {
        toast.error(result.error || "Email ou senha inválidos");
      }
    } catch (error) {
      toast.error("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-4">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-4">
              <Hexagon className="w-12 h-12 text-amber-700" />
            </div>
            <h1 className="text-5xl font-bold mb-2">B O M B U S</h1>
            <p className="text-amber-700">
              Sistema de gerenciamento de colmeias
            </p>
          </div>

          {/* Login Card */}
          <Card className="bg-amber-50 border-amber-200">

            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-yellow-100 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-yellow-100 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      disabled={isLoading}
                      className="bg-yellow-100 border-0 data-[state=checked]:bg-amber-700"
                    />
                    <Label
                      htmlFor="remember"
                      className="cursor-pointer select-none"
                    >
                      Lembrar de mim
                    </Label>
                  </div>
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-amber-700 hover:text-amber-800 underline"
                    disabled={isLoading}
                  >
                    Esqueceu a senha?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-amber-700 hover:bg-amber-800 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center py-6 text-amber-700">
        © 2025 BOMBUS. Todos os direitos reservados.
      </p>
    </div>
  );
}
