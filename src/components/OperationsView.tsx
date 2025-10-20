import { useState } from "react";
import { Plus, Split, ClipboardCheck, Package } from "lucide-react";
import { Button } from "./ui/button";
import { AddHiveDialog } from "./AddHiveDialog";
import { toast } from "sonner";
import { SpeciesInfo, HiveStatus } from "../types";

interface OperationsViewProps {
  onAddHive: (hive: {
    code?: number;
    species: SpeciesInfo;
    status: HiveStatus;
  }) => void;
}

export function OperationsView({ onAddHive }: OperationsViewProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleMultiplication = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    toast.info("Funcionalidade em desenvolvimento");
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
    </div>
  );
}
