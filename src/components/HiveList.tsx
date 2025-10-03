import { HiveCard } from "./HiveCard";
import { Colmeia } from "../types";

interface HiveListProps {
  hives: Colmeia[];
  searchTerm: string;
}

export function HiveList({ hives, searchTerm }: HiveListProps) {
  const filteredHives = hives.filter(hive => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (hive.Code && hive.Code.toString().includes(searchLower)) ||
      hive.Species.CommonName.toLowerCase().includes(searchLower) ||
      hive.Species.ScientificName.toLowerCase().includes(searchLower) ||
      hive.Status.toLowerCase().includes(searchLower)
    );
  });

  if (filteredHives.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-2">
          {searchTerm ? "Nenhuma colmeia encontrada" : "Nenhuma colmeia cadastrada"}
        </div>
        {searchTerm && (
          <p className="text-sm text-muted-foreground">
            Tente pesquisar por outro termo
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredHives.map((hive) => (
        <HiveCard key={hive.ID} hive={hive} />
      ))}
    </div>
  );
}