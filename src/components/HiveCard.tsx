import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, Hexagon, Activity } from "lucide-react";
import { Colmeia, HiveStatus } from "../types";
import { STATUS_CONFIG } from "../utils/constants";

interface HiveCardProps {
  hive: Colmeia;
}

export function HiveCard({ hive }: HiveCardProps) {
  const statusConfig = STATUS_CONFIG[hive.Status as HiveStatus];
  
  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border-border">
      <CardHeader className="pb-3 pt-3">
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-2 -mx-2 mb-4">
            <h3 className="font-medium text-lg">
              {hive.Code ? `Colmeia ${hive.Code}` : 'Colmeia sem código'}
            </h3>
            <Badge 
              variant="outline" 
              className={`${statusConfig?.color || 'bg-gray-100 text-gray-800'} border flex items-center gap-1 flex-shrink-0 text-xs`}
            >
              <Activity className="w-3 h-3" />
              <span className="whitespace-nowrap">{statusConfig?.label || hive.Status}</span>
            </Badge>
          </div>
          <div className="flex flex-col justify-center space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Hexagon className="w-4 h-4 flex-shrink-0" />
              <span className="text-base">{hive.Species.CommonName} ({hive.Species.ScientificName})</span>
            </div>
            <div className="flex items-center gap-2 text-base text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Criada em {hive.StartingDate}</span>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}