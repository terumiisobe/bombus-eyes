import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, Hexagon, Activity } from "lucide-react";
import { Colmeia } from "../types";


interface HiveCardProps {
  hive: Colmeia;
}

const statusColors = {
  PRONTA_PARA_COLHEITA: "bg-green-100 text-green-800 border-green-200",
  VAZIA: "bg-red-100 text-red-800 border-red-200",
  EM_DESENVOLVIMENTO: "bg-amber-100 text-amber-800 border-amber-200"
};

const statusIcons = {
  PRONTA_PARA_COLHEITA: <Activity className="w-3 h-3" />,
  VAZIA: <Activity className="w-3 h-3" />,
  EM_DESENVOLVIMENTO: <Activity className="w-3 h-3" />
};

export function HiveCard({ hive }: HiveCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-medium">
              {hive.code ? `Colmeia ${hive.code}` : 'Colmeia sem código'}
            </h3>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Hexagon className="w-4 h-4" />
              <span className="text-sm">{hive.species.commonName} ({hive.species.scientificName})</span>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={`${statusColors[hive.status as keyof typeof statusColors]} border flex items-center gap-1`}
          >
            {statusIcons[hive.status as keyof typeof statusIcons]}
            {hive.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Criada em {hive.starting_date}</span>
        </div>
      </CardContent>
    </Card>
  );
}