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
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-medium">
              {hive.Code ? `Colmeia ${hive.Code}` : 'Colmeia sem código'}
            </h3>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Hexagon className="w-4 h-4" />
              <span className="text-sm">{hive.Species.CommonName} ({hive.Species.ScientificName})</span>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={`${statusConfig?.color || 'bg-gray-100 text-gray-800'} border flex items-center gap-1`}
          >
            <Activity className="w-3 h-3" />
            {statusConfig?.label || hive.Status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Criada em {hive.StartingDate}</span>
        </div>
      </CardContent>
    </Card>
  );
}