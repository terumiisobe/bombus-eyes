import { LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface UserProfileProps {
  userEmail: string | null;
  onLogout: () => void;
}

export function UserProfile({ userEmail, onLogout }: UserProfileProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="space-y-6 pt-6">
          {/* Email Display */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-amber-900">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={userEmail || ''}
              readOnly
              disabled
              className="bg-yellow-100 border-0 cursor-not-allowed"
            />
          </div>

          {/* Logout Button with Confirmation */}
          <div className="pt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair da Conta
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-amber-50 border-amber-200">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-amber-900">
                    Confirmar Logout
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-amber-700">
                    Tem certeza que deseja sair da sua conta? Você precisará fazer login novamente para acessar o sistema.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={onLogout}>
                    Sair
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

