import { useState } from "react";
import { Hexagon, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner";

interface ResetPasswordProps {
  onSuccess: () => void;
}

export function ResetPassword({ onSuccess }: ResetPasswordProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const passwordRequirements = [
    { met: password.length >= 8, text: "Mínimo de 8 caracteres" },
    { met: /[A-Z]/.test(password), text: "Uma letra maiúscula" },
    { met: /[a-z]/.test(password), text: "Uma letra minúscula" },
    { met: /[0-9]/.test(password), text: "Um número" },
  ];

  const allRequirementsMet = passwordRequirements.every(req => req.met);
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!allRequirementsMet) {
      toast.error("A senha não atende aos requisitos mínimos");
      return;
    }

    if (!passwordsMatch) {
      toast.error("As senhas não coincidem");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Senha redefinida com sucesso!");
    setIsLoading(false);
    
    // Wait a bit before redirecting
    setTimeout(() => {
      onSuccess();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
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

        {/* Reset Password Card */}
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="space-y-1">
            <CardTitle>Redefinir senha</CardTitle>
            <CardDescription className="text-amber-700">
              Escolha uma nova senha para sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nova senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input-background border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                  disabled={isLoading}
                />
              </div>

              {/* Password Requirements */}
              {password && (
                <div className="bg-amber-100 border border-amber-300 rounded-lg p-3 space-y-1">
                  <p className="text-amber-800 mb-2">Requisitos da senha:</p>
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        req.met ? 'bg-green-600' : 'bg-amber-300'
                      }`}>
                        {req.met && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className={req.met ? 'text-green-700' : 'text-amber-700'}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-input-background border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                  disabled={isLoading}
                />
              </div>

              {confirmPassword && (
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    passwordsMatch ? 'bg-green-600' : 'bg-red-600'
                  }`}>
                    {passwordsMatch && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={passwordsMatch ? 'text-green-700' : 'text-red-700'}>
                    {passwordsMatch ? 'As senhas coincidem' : 'As senhas não coincidem'}
                  </span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-amber-700 hover:bg-amber-800 text-white"
                disabled={isLoading || !allRequirementsMet || !passwordsMatch}
              >
                {isLoading ? "Redefinindo..." : "Redefinir senha"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center mt-6 text-amber-700">
          © 2025 BOMBUS. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
