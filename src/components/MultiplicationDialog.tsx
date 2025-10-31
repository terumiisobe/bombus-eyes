import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Split, Hash, Calendar, ArrowRight, X, Archive, Asterisk, Plus } from "lucide-react";
import { toast } from "sonner";
import { SPECIES_LIST, SpeciesInfo, Colmeia } from "../types";
import { Hexagon } from "lucide-react";
import { apiService } from "../services/apiService";

interface MultiplicationDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAddMultiplication?: (data: any) => void;
}

export function MultiplicationDialog({ open, onOpenChange, onAddMultiplication }: MultiplicationDialogProps) {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<'módulo' | 'disco' | 'genérico'>('genérico');
  const [dateTime, setDateTime] = useState(() => {
    const now = new Date();
    // Format current time in Sao Paulo as YYYY-MM-DDTHH:mm for datetime-local input
    const fmt = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false,
    });
    const parts = fmt.formatToParts(now).reduce<Record<string, string>>((acc, p) => { acc[p.type] = p.value; return acc; }, {} as any);
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
  });
  const [newHiveCode, setNewHiveCode] = useState("");
  const [species, setSpecies] = useState<SpeciesInfo>({ ID: 0, CommonName: "", ScientificName: "" });
  
  // Módulo fields
  const [moduleDonorCode, setModuleDonorCode] = useState("");
  const [keepsQueen, setKeepsQueen] = useState(false);
  const [keepsLocation, setKeepsLocation] = useState(false);
  
  // Disco fields
  const [discDonors, setDiscDonors] = useState<string[]>([]);
  const [discDonorInput, setDiscDonorInput] = useState("");
  const [foragerDonor, setForagerDonor] = useState("");

  // Unified resources for step 2 (applies to all methods)
  const [resourceDonorInput, setResourceDonorInput] = useState("");
  const [resourceType, setResourceType] = useState<'disco' | 'módulo' | 'campeira' | 'genérico'>("genérico");
  const [resourcesUnified, setResourcesUnified] = useState<Array<{ donor: string; type: 'disco' | 'módulo' | 'campeira' | 'genérico' }>>([]);
  const [knownHives, setKnownHives] = useState<Colmeia[]>([]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      const res = await apiService.getHives();
      if (res.success && res.data) {
        setKnownHives(res.data);
      }
    })();
  }, [open]);

  const handleNext = () => {
    if (!newHiveCode.trim()) {
      toast.error("O código da nova colmeia é obrigatório");
      return;
    }
    if (!species || !species.ScientificName) {
      toast.error("A espécie é obrigatória");
      return;
    }
    setStep(2);
  };

  const handleNextToConfirmation = () => {
    setStep(3);
  };

  const handleAddResource = () => {
    const code = resourceDonorInput.trim();
    if (!code) return;
    const numericCode = Number(code);
    if (!Number.isFinite(numericCode)) {
      toast.error("Código deve ser numérico");
      return;
    }
    const exists = Number.isFinite(numericCode)
      ? knownHives.some(h => typeof h.Code === 'number' && h.Code === numericCode)
      : false;
    if (!exists) {
      toast.error("Código de doadora não encontrado");
      return;
    }
    setResourcesUnified([...resourcesUnified, { donor: String(numericCode), type: resourceType }]);
    setResourceDonorInput("");
  };

  const handleRemoveResource = (idxToRemove: number) => {
    setResourcesUnified(resourcesUnified.filter((_, idx) => idx !== idxToRemove));
  };

  const handleSubmit = async () => {
    const base = { method, dateTime, newHiveCode: newHiveCode.trim(), species };
    const resourcesWithIds = resourcesUnified.map((r) => {
      const codeNum = Number(r.donor);
      const match = knownHives.find(h => typeof h.Code === 'number' && h.Code === codeNum);
      return { donorId: match ? match.ID : undefined, type: r.type };
    });
    const data = { ...base, resources: resourcesWithIds };

    if (onAddMultiplication) {
      try {
        await onAddMultiplication(data);
      } catch (_) {
        // Parent handles error display; keep dialog open and do not reset
      }
    }
    // Do not close or reset here; parent decides based on API result
  };

  const handleCancel = () => {
    setStep(1);
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  // Reset form when dialog is opened
  useEffect(() => {
    if (open) {
      setStep(1);
      setMethod('genérico');
      // Reset datetime to current Sao Paulo local time for input value
      const now = new Date();
      const fmt = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false,
      });
      const parts = fmt.formatToParts(now).reduce<Record<string, string>>((acc, p) => { acc[p.type] = p.value; return acc; }, {} as any);
      setDateTime(`${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`);
      setNewHiveCode("");
      setSpecies({ ID: 0, CommonName: "", ScientificName: "" });
      setModuleDonorCode("");
      setKeepsQueen(false);
      setKeepsLocation(false);
      setDiscDonors([]);
      setDiscDonorInput("");
      setForagerDonor("");
      setResourcesUnified([]);
      setResourceDonorInput("");
      setResourceType("genérico");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Split className="w-5 h-5 text-amber-700" />
            Multiplicação
          </DialogTitle>
        </DialogHeader>

        {step === 2 && (
          <div className="bg-yellow-50 border border-amber-200 rounded-lg p-4 space-y-2 mt-2 mb-4">
            {(() => {
              const d = new Date(dateTime);
              const weekdayLong = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', timeZone: 'America/Sao_Paulo' }).format(d);
              const weekday = weekdayLong.replace('-feira', '').trim();
              const dateStr = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo' }).format(d);
              const timeStr = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', hour12: false }).format(d);
              return (
                <>
                  <div className="text-sm flex items-center gap-2">
                    <Hash className="w-4 h-4 text-amber-700" />
                    <span className="font-medium text-amber-800">Nova colmeia:</span>
                    <span className="text-amber-700">{newHiveCode || '-'}</span>
                    <span className="text-amber-700">(<i>{species.CommonName || '—'}</i>)</span>
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    <span className="font-medium text-amber-800">Data:</span>
                    <span className="text-amber-700">{dateStr} - {timeStr} (<i>{weekday}</i>)</span>
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    <Split className="w-4 h-4 text-amber-700" />
                    <span className="font-medium text-amber-800">Método:</span>
                    <span className="text-amber-700">{method === 'módulo' ? 'Módulo' : method === 'disco' ? 'Disco' : 'Genérico'}</span>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newHiveCode" className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Código da Nova Colmeia *
              </Label>
              <Input
                id="newHiveCode"
                placeholder="Ex: 002, 123, etc."
                value={newHiveCode}
                onChange={(e) => setNewHiveCode(e.target.value)}
                className="bg-yellow-100 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Hexagon className="w-4 h-4" />
                Espécie *
              </Label>
              <Select
                value={species.ScientificName}
                onValueChange={(value) => {
                  const selected = SPECIES_LIST.find(s => s.scientificName === value);
                  if (selected) {
                    setSpecies({ ID: selected.id, CommonName: selected.commonName, ScientificName: selected.scientificName });
                  }
                }}
              >
                <SelectTrigger className="bg-yellow-100 border-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                  <SelectValue placeholder="Selecione uma espécie" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIES_LIST.map(s => (
                    <SelectItem key={s.id} value={s.scientificName}>
                      {s.commonName} ({s.scientificName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateTime" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Data e Hora
              </Label>
              <Input
                id="dateTime"
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="bg-yellow-100 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Split className="w-4 h-4" />
                Método
              </Label>
              <Select value={method} onValueChange={(value: 'módulo' | 'disco' | 'genérico') => setMethod(value)}>
                <SelectTrigger className="bg-yellow-100 border-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="genérico">Genérico</SelectItem>
                  <SelectItem value="módulo">Módulo</SelectItem>
                  <SelectItem value="disco">Disco</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-amber-700 hover:bg-amber-800 text-white flex items-center justify-center gap-2"
              >
                Próximo
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        ) : step === 2 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Archive className="w-4 h-4 text-amber-700" />
                Recursos:
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: 001, A01, etc."
                  
                  value={resourceDonorInput}
                  onChange={(e) => setResourceDonorInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddResource();
                    }
                  }}
                  type="number"
                  inputMode="numeric"
                  onKeyDown={(e) => {
                    if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="bg-transparent flex-1 border border-amber-300 focus-visible:ring-amber-400 focus-visible:ring-1 rounded-md"
                />
                <Select value={resourceType} onValueChange={(v: 'disco' | 'módulo' | 'campeira' | 'genérico') => setResourceType(v)}>
                  <SelectTrigger className="bg-transparent w-[150px] border border-amber-300 focus-visible:ring-amber-400 focus-visible:ring-1 rounded-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disco">Disco</SelectItem>
                    <SelectItem value="módulo">Módulo</SelectItem>
                    <SelectItem value="campeira">Campeira</SelectItem>
                    <SelectItem value="genérico">Genérico</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={handleAddResource}
                  className="bg-amber-700 hover:bg-amber-800 text-white"
                  aria-label="Adicionar recurso"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
                  {resourcesUnified.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {resourcesUnified.map((res, idx) => (
                    <Badge key={`${res.donor}-${idx}`} variant="secondary" className="flex items-center gap-2">
                      <span className="text-amber-900">{res.donor}</span>
                      <span className="text-amber-700 text-xs">({res.type})</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveResource(idx)}
                        className="ml-1 hover:bg-amber-200 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setStep(1)}
              >
                Voltar
              </Button>
              <Button
                type="button"
                onClick={handleNextToConfirmation}
                className="flex-1 bg-amber-700 hover:bg-amber-800 text-white flex items-center justify-center gap-2"
              >
                Próximo
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-amber-200 rounded-lg p-4 space-y-2 mt-2">
                {(() => {
                  const d = new Date(dateTime);
              const weekdayLong = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', timeZone: 'America/Sao_Paulo' }).format(d);
              const weekday = weekdayLong.replace('-feira', '').trim();
              const dateStr = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo' }).format(d);
              const timeStr = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', hour12: false }).format(d);
                  return (
                    <>
                      <div className="text-sm flex items-center gap-2">
                        <Hash className="w-4 h-4 text-amber-700" />
                        <span className="font-medium text-amber-800">Nova colmeia:</span>
                        <span className="text-amber-700">{newHiveCode || '-'}</span>
                        <span className="text-amber-700">(<i>{species.CommonName || '—'}</i>)</span>
                      </div>
                      <div className="text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-700" />
                        <span className="font-medium text-amber-800">Data:</span>
                        <span className="text-amber-700">{dateStr} - {timeStr} (<i>{weekday}</i>)</span>
                      </div>
                      <div className="text-sm flex items-center gap-2">
                        <Split className="w-4 h-4 text-amber-700" />
                        <span className="font-medium text-amber-800">Método:</span>
                        <span className="text-amber-700">{method === 'módulo' ? 'Módulo' : method === 'disco' ? 'Disco' : 'Genérico'}</span>
                      </div>
                    </>
                  );
                })()}
                <div className="pt-2 space-y-2">
                  <div className="text-sm flex items-center gap-2">
                    <Archive className="w-4 h-4 text-amber-700" />
                    <span className="font-medium text-amber-800">Recursos:</span>
                  </div>
                  {resourcesUnified.length === 0 ? (
                    <div className="text-sm text-amber-700">Nenhum recurso adicionado.</div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {resourcesUnified.map((res, idx) => (
                        <Badge key={`${res.donor}-${idx}`} variant="secondary" className="flex items-center gap-2">
                          <span className="text-amber-900">{res.donor}</span>
                          <span className="text-amber-700 text-xs">({res.type})</span>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setStep(2)}
              >
                Voltar
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                className="flex-1 bg-amber-700 hover:bg-amber-800 text-white"
              >
                Confirmar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
