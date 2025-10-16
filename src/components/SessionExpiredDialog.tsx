import { AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";

interface SessionExpiredDialogProps {
  open: boolean;
  onContinue: () => void;
}

export function SessionExpiredDialog({ open, onContinue }: SessionExpiredDialogProps) {
  return (
    <Dialog open={open} modal>
      <DialogContent 
        className="sm:max-w-md bg-amber-50 border-amber-200"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        hideClose={true}
        blur={true}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-700" />
            Sessão Expirada
          </DialogTitle>
          <DialogDescription className="text-amber-700 pt-2">
            Sua sessão expirou! Refaça o login para continuar.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={onContinue}
            className="w-full bg-amber-700 hover:bg-amber-800 text-white"
          >
            Ir para Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

