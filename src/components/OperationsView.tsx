import { useState } from "react";
import { Plus, Split, ClipboardCheck, Package } from "lucide-react";
import { Button } from "./ui/button";
import { AddHiveDialog } from "./AddHiveDialog";
import { toast } from "sonner";
import { SpeciesInfo, HiveStatus } from "../types";
import { MultiplicationDialog } from "./MultiplicationDialog";
import { apiService } from "../services/apiService";

interface OperationsViewProps {
  onAddHive: (hive: {
    code?: number;
    species: SpeciesInfo;
    status: HiveStatus;
  }) => void;
}

export function OperationsView({ onAddHive }: OperationsViewProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [multiplicationOpen, setMultiplicationOpen] = useState(false);

  const handleMultiplication = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    setMultiplicationOpen(true);
  };

  const handleInspection = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    toast.info("Funcionalidade em desenvolvimento");
  };

  const handleHarvest = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    toast.info("Funcionalidade em desenvolvimento");
  };

  const operations = [
    {
      id: 'addition',
      title: 'Adição',
      icon: Plus,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.blur();
        setAddDialogOpen(true);
      }
    },
    {
      id: 'multiplication',
      title: 'Multiplicação',
      icon: Split,
      onClick: handleMultiplication
    },
    {
      id: 'inspection',
      title: 'Inspeção',
      icon: ClipboardCheck,
      onClick: handleInspection
    },
    {
      id: 'harvest',
      title: 'Colheita',
      icon: Package,
      onClick: handleHarvest
    }
  ];

  return (
    <div className="max-w-2xl mx-auto px-4">
      <h2 className="text-amber-900 mb-8 text-center">Operações</h2>

      <div className="grid grid-cols-2 gap-6 sm:gap-8">
        {operations.map((operation) => {
          const Icon = operation.icon;
          
          return (
            <button
              key={operation.id}
              onClick={operation.onClick}
              className="flex flex-col items-center gap-4 p-6 sm:p-8 bg-yellow-100 hover:bg-amber-100 border-2 border-amber-200 rounded-2xl shadow-md hover:shadow-lg active:shadow-sm active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 transition-all duration-200"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-amber-700" />
              </div>
              <span className="text-amber-900">{operation.title}</span>
            </button>
          );
        })}
      </div>

      <AddHiveDialog 
        onAddHive={(hive) => {
          onAddHive(hive);
          setAddDialogOpen(false);
        }}
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />

      <MultiplicationDialog
        open={multiplicationOpen}
        onOpenChange={setMultiplicationOpen}
        onAddMultiplication={async (formData: any) => {
          // Map dialog form to API payload
          const method = (formData.method || '').toString().toLowerCase();
          const apiMethod = method.includes('disco')
            ? 'DISCO'
            : (method.includes('módulo') || method.includes('modulo'))
              ? 'MODULO'
              : (method.includes('generico') || method.includes('genérico'))
                ? 'GENERICO'
                : 'GENERICO';

          const codeRaw = formData.newHiveCode;
          const codeNum = Number(codeRaw);
          const newborn_colmeia_code = Number.isFinite(codeNum) ? codeNum : codeRaw;

          // Format executed_at in Brazil time (America/Sao_Paulo) with offset
          const toBrazilIso = (localDateTime: string): string => {
            const d = new Date(localDateTime);
            // Get parts in Sao Paulo TZ
            const fmt = new Intl.DateTimeFormat('en-CA', {
              timeZone: 'America/Sao_Paulo',
              year: 'numeric', month: '2-digit', day: '2-digit',
              hour: '2-digit', minute: '2-digit', second: '2-digit',
              hour12: false,
            });
            const parts = fmt.formatToParts(d).reduce<Record<string, string>>((acc, p) => { acc[p.type] = p.value; return acc; }, {} as any);
            const yyyy = parts.year, MM = parts.month, dd = parts.day;
            const HH = parts.hour, mm = parts.minute, ss = parts.second;
            // Determine offset for Sao Paulo at this time
            const tzDate = new Date(`${yyyy}-${MM}-${dd}T${HH}:${mm}:${ss}`);
            const spNow = new Date(tzDate.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
            const utcNow = new Date(tzDate.toLocaleString('en-US', { timeZone: 'UTC' }));
            const diffMin = Math.round((spNow.getTime() - utcNow.getTime()) / 60000);
            const sign = diffMin >= 0 ? '+' : '-';
            const abs = Math.abs(diffMin);
            const offH = String(Math.floor(abs / 60)).padStart(2, '0');
            const offM = String(abs % 60).padStart(2, '0');
            return `${yyyy}-${MM}-${dd}T${HH}:${mm}:${ss}${sign}${offH}:${offM}`;
          };
          const executed_at = toBrazilIso(formData.dateTime);

          let resources: Array<{ colmeia_doner_id: number | string; resource_type: string }> = [];
          if (Array.isArray(formData.resources)) {
            resources = formData.resources.map((r: { donor?: string; donorId?: string; type: string }) => ({
              colmeia_doner_id: r.donorId ? r.donorId : (Number.isFinite(Number(r.donor)) ? Number(r.donor as string) : (r.donor as string)),
              resource_type: (r.type || '').toString().toUpperCase(),
            }));
          } else {
            // Fallback to old mapping if needed
            if (apiMethod === 'DISCO') {
              const donors: string[] = Array.isArray(formData.discDonors) ? formData.discDonors : [];
              resources = [
                ...donors.map((d) => ({ colmeia_doner_id: Number.isFinite(Number(d)) ? Number(d) : d, resource_type: 'DISCO' })),
                ...(formData.foragerDonor ? [{ colmeia_doner_id: Number.isFinite(Number(formData.foragerDonor)) ? Number(formData.foragerDonor) : formData.foragerDonor, resource_type: 'CAMPEIRA' }] : []),
              ];
            } else if (apiMethod === 'MODULO') {
              if (formData.moduleDonorCode) {
                const donor = formData.moduleDonorCode;
                resources = [{ colmeia_doner_id: Number.isFinite(Number(donor)) ? Number(donor) : donor, resource_type: 'MODULO' }];
              }
            }
          }

          const payload = {
            newborn_colmeia_code,
            newborn_colmeia_species: { id: formData.species?.ID ?? 1 },
            executed_at,
            method: apiMethod,
            resources,
          };

          const result = await apiService.createMultiplicationOperation(payload);
          if (result.success) {
            toast.success('Multiplicação registrada!');
            setMultiplicationOpen(false);
            return true;
          } else if (result.error) {
            toast.error(result.error);
            return false;
          }
        }}
      />
    </div>
  );
}
