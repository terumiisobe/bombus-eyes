import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Hexagon, Hash, Activity, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";
import { SPECIES_LIST, SpeciesInfo, STATUS_LIST, HiveStatus } from "../types";
import { apiService } from "../services/apiService";
import { Value } from "@radix-ui/react-select";

interface AddHiveDialogProps {
  onAddHive: (hive: {
    code?: number;
    species: SpeciesInfo;
    status: HiveStatus;
  }) => void;
}

export function AddHiveDialog({ onAddHive }: AddHiveDialogProps) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState<number | undefined>(undefined);
  const [species, setSpecies] = useState<SpeciesInfo>({
    ID: 0,
    CommonName: "",
    ScientificName: ""
  });
  const [status, setStatus] = useState<HiveStatus>('EM_DESENVOLVIMENTO');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(apiService.isOnlineStatus());

  // Listen for online/offline status changes
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(apiService.isOnlineStatus());
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!species.ScientificName) {
      toast.error("A espécie é obrigatória");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await apiService.createHive({
        code: code || undefined,
        species: {
          ID: species.ID,
          CommonName: species.CommonName,
          ScientificName: species.ScientificName
        },
        status
      });

      if (result.success) {
        // Add to local state immediately for UI responsiveness
        onAddHive({
          code: code || undefined,
          species: {
            ID: species.ID,
            CommonName: species.CommonName,
            ScientificName: species.ScientificName
          },
          status
        });

        // Reset form
        setCode(undefined);
        setSpecies({
          ID: 0,
          CommonName: "",
          ScientificName: ""
        });
        setStatus('EM_DESENVOLVIMENTO');
        setOpen(false);
        
        if (isOnline) {
          toast.success("Colmeia adicionada com sucesso!");
        } else {
          toast.success("Colmeia adicionada! Será sincronizada quando a conexão for restabelecida.");
        }
      } else {
        toast.error(`Erro ao adicionar colmeia: ${result.error}`);
      }
    } catch (error) {
      toast.error("Erro inesperado ao adicionar colmeia");
      console.error("Error creating hive:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-amber-700 hover:bg-amber-800 text-white flex items-center gap-2 mx-auto">
          <Plus className="w-4 h-4" />
          Adicionar Colmeia
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Hexagon className="w-5 h-5 text-amber-700" />
            Nova Colmeia
          </DialogTitle>
          <div className="flex items-center gap-1 text-sm mt-2">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-green-600" />
                <span className="text-green-600">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-orange-600" />
                <span className="text-orange-600">Offline</span>
              </>
            )}
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code" className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Código da Colmeia (opcional)
            </Label>
            <Input
              id="code"
              placeholder="Ex: 001, 1, etc."
              value={code}
              onChange={(e) => setCode(Number(e.target.value))}
              className="bg-input-background"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Hexagon className="w-4 h-4" />
              Espécie *
            </Label>
            <Select value={species.ScientificName} onValueChange={(value) => {
              const selectedSpecies = SPECIES_LIST.find(s => s.scientificName === value);
              if (selectedSpecies) {
                setSpecies({
                  ID: selectedSpecies.id,
                  CommonName: selectedSpecies.commonName,
                  ScientificName: selectedSpecies.scientificName
                });
              }
            }}>
              <SelectTrigger className="bg-input-background">
                <SelectValue placeholder="Selecione uma espécie" />
              </SelectTrigger>
              <SelectContent>
                {SPECIES_LIST.map((species) => (
                  <SelectItem key={species.id} value={species.scientificName}>
                    {species.commonName} ({species.scientificName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Status
            </Label>
            <Select value={status} onValueChange={(value: HiveStatus) => setStatus(value)}>
              <SelectTrigger className="bg-input-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_LIST.map((statusItem) => (
                  <SelectItem key={statusItem.value} value={statusItem.value}>
                    {statusItem.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50"
              disabled={isSubmitting}
              onClick={async () => {
                // Add hive without closing dialog
                if (!species.ScientificName) {
                  toast.error("A espécie é obrigatória");
                  return;
                }

                setIsSubmitting(true);

                try {
                  const result = await apiService.createHive({
                    code: code || undefined,
                    species: {
                      ID: species.ID,
                      CommonName: species.CommonName,
                      ScientificName: species.ScientificName
                    },
                    status
                  });

                  if (result.success) {
                    // Add to local state immediately for UI responsiveness
                    onAddHive({
                      code: code || undefined,
                      species: {
                        ID: species.ID,
                        CommonName: species.CommonName,
                        ScientificName: species.ScientificName
                      },
                      status
                    });

                    // Reset form but keep dialog open
                    setCode(undefined);
                    setSpecies({
                      ID: 0,
                      CommonName: "",
                      ScientificName: ""
                    });
                    setStatus('EM_DESENVOLVIMENTO');
                    
                    if (isOnline) {
                      toast.success("Colmeia adicionada com sucesso!");
                    } else {
                      toast.success("Colmeia adicionada! Será sincronizada quando a conexão for restabelecida.");
                    }
                  } else {
                    toast.error(`Erro ao adicionar colmeia: ${result.error}`);
                  }
                } catch (error) {
                  toast.error("Erro inesperado ao adicionar colmeia");
                  console.error("Error creating hive:", error);
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              {isSubmitting ? "Adicionando..." : "Adicionar outra"}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-amber-700 hover:bg-amber-800 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adicionando..." : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}