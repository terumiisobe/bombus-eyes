import { Search, QrCode } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onQRScan: () => void;
}

export function SearchBar({ searchTerm, onSearchChange, onQRScan }: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Digitar código da colmeia"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-input-background border-border"
        />
      </div>
      <Button 
        onClick={onQRScan}
        className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 flex items-center gap-2"
      >
        <QrCode className="w-4 h-4" />
        Escanear QR Code
      </Button>
    </div>
  );
}