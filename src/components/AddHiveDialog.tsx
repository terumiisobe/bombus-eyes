import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Hexagon, Hash, Activity } from "lucide-react";
import { toast } from "sonner";
import { SPECIES_LIST, SpeciesInfo, STATUS_LIST } from "../types";
import { Value } from "@radix-ui/react-select";

interface AddHiveDialogProps {
  onAddHive: (hive: {
    code?: string;
    species: SpeciesInfo;
    status: 'EM_DESENVOLVIMENTO' | 'VAZIA' | 'PRONTA_PARA_COLHEITA';
  }) => void;
}

export function AddHiveDialog({ onAddHive }: AddHiveDialogProps) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [species, setSpecies] = useState<SpeciesInfo>({
    id: 0,
    commonName: "",
    scientificName: ""
  });
  const [status, setStatus] = useState<'EM_DESENVOLVIMENTO' | 'VAZIA' | 'PRONTA_PARA_COLHEITA'>('EM_DESENVOLVIMENTO');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!species) {
      toast.error("A espécie é obrigatória");
      return;
    }

    onAddHive({
      code: code.trim() || undefined,
      species: {
        id: species.id,
        commonName: species.commonName,
        scientificName: species.scientificName
      },
      status
    });

    // Reset form
    setCode("");
    setSpecies({
      id: 0,
      commonName: "",
      scientificName: ""
    });
    setStatus('EM_DESENVOLVIMENTO');
    setOpen(false);
    
    toast.success("Colmeia adicionada com sucesso!");
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
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code" className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Código da Colmeia (opcional)
            </Label>
            <Input
              id="code"
              placeholder="Ex: 001, A01, etc."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="bg-input-background"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Hexagon className="w-4 h-4" />
              Espécie *
            </Label>
            <Select value={species.scientificName} onValueChange={(value) => setSpecies({
              id: species.id,
              commonName: species.commonName,
              scientificName: value
            })}>
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
            <Select value={status} onValueChange={(value: 'EM_DESENVOLVIMENTO' | 'VAZIA' | 'PRONTA_PARA_COLHEITA') => setStatus(value)}>
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
              onClick={() => {
                // Add hive without closing dialog
                if (!species.scientificName) {
                  toast.error("A espécie é obrigatória");
                  return;
                }

                onAddHive({
                  code: code.trim() || undefined,
                  species: {
                    id: species.id,
                    commonName: species.commonName,
                    scientificName: species.scientificName
                  },
                  status
                });

                // Reset form but keep dialog open
                setCode("");
                setSpecies({
                  id: 0,
                  commonName: "",
                  scientificName: ""
                });
                setStatus('EM_DESENVOLVIMENTO');
                
                toast.success("Colmeia adicionada com sucesso!");
              }}
            >
              Adicionar outra
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-amber-700 hover:bg-amber-800 text-white"
            >
              Adicionar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}