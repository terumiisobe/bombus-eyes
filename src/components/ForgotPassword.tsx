import { useState } from "react";
import { Hexagon, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner";

interface ForgotPasswordProps {
  onBack: () => void;
  onResetPassword?: () => void;
}

export function ForgotPassword({ onBack, onResetPassword }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Por favor, digite seu email");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setEmailSent(true);
    setIsLoading(false);
    toast.success("Email de recuperação enviado!");
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

        {/* Forgot Password Card */}
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="space-y-1">
            <CardTitle>Recuperar senha</CardTitle>
            <CardDescription className="text-amber-700">
              {emailSent 
                ? "Verifique seu email para continuar"
                : "Digite seu email para receber o link de recuperação"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emailSent ? (
              <div className="space-y-4">
                <div className="bg-amber-100 border border-amber-300 rounded-lg p-4">
                  <p className="text-amber-800">
                    Enviamos um link de recuperação para <strong>{email}</strong>.
                    Verifique sua caixa de entrada e spam.
                  </p>
                </div>
                <p className="text-amber-700">
                  O link expira em 1 hora. Se não receber o email, você pode solicitar um novo.
                </p>
                {onResetPassword && (
                  <div className="bg-amber-100 border border-amber-300 rounded-lg p-3">
                    <p className="text-amber-800 mb-2">
                      Para fins de demonstração:
                    </p>
                    <Button
                      onClick={onResetPassword}
                      className="w-full bg-amber-700 hover:bg-amber-800 text-white"
                    >
                      Acessar página de redefinição
                    </Button>
                  </div>
                )}
                <Button
                  onClick={() => setEmailSent(false)}
                  variant="outline"
                  className="w-full border-amber-700 text-amber-700 hover:bg-amber-50"
                >
                  Reenviar email
                </Button>
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="w-full border-amber-700 text-amber-700 hover:bg-amber-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-input-background border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-amber-700 hover:bg-amber-800 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar link de recuperação"}
                </Button>

                <Button
                  type="button"
                  onClick={onBack}
                  variant="outline"
                  className="w-full border-amber-700 text-amber-700 hover:bg-amber-50"
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao login
                </Button>
              </form>
            )}
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
