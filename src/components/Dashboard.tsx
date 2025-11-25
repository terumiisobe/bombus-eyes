import { useEffect, useState } from "react";
import { Colmeia, FocusedActivity } from "../types";
import { countHivesByStatus } from "../utils/hiveUtils";
import { Hexagon, Search, Bean } from "lucide-react";
import { Badge } from "./ui/badge";
import { apiService } from "../services/apiService";

interface DashboardProps {
  hives: Colmeia[];
}

interface DisplayActivity {
  code: string;
  species: string;
  action: string;
  motive: string;
}

export function Dashboard({ hives }: DashboardProps) {
  const [activitiesInFocus, setActivitiesInFocus] = useState<DisplayActivity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const readyToHarvestHives = countHivesByStatus(hives, 'PRONTA_PARA_COLHEITA');
  const acceptsMelgueiraHives = countHivesByStatus(hives, 'PRONTO_PARA_MELGUEIRA');
  const developingHives = countHivesByStatus(hives, 'EM_DESENVOLVIMENTO');
  const inducedHives = countHivesByStatus(hives, 'INDUZIDA');
  const petBottleHives = countHivesByStatus(hives, 'GARRAFA_PET');
  const emptyHives = countHivesByStatus(hives, 'VAZIA');
  const movedHives = countHivesByStatus(hives, 'MOVIDA');
  const unknownHives = countHivesByStatus(hives, 'DESCONHECIDO');

  // Fetch focused activities from API
  useEffect(() => {
    const fetchFocusedActivities = async () => {
      setIsLoadingActivities(true);
      try {
        const result = await apiService.getFocusedActivities();
        if (result.success && result.data) {
          const displayActivities: DisplayActivity[] = result.data.map((item: FocusedActivity) => {
            // Map action enum to display text
            const actionMap: Record<string, string> = {
              'ALIMENTACAO': 'alimentação',
              'INSPECAO': 'inspeção',
            };
            
            // Map motive enum to display text
            const motiveMap: Record<string, string> = {
              'MULTIPLICACAO': 'multiplicação recente',
              'BAIXA_ATIVIDADE': 'baixa atividade',
              'ATAQUE_ABELHA_LIMAO': 'ataque abelha limão',
            };
            
            // Trim and normalize the values from API
            const actionValue = String(item.action || '').trim();
            const motiveValue = String(item.motive || '').trim();
            
            const mappedAction = actionMap[actionValue] || 'Atividade desconhecida';
            const mappedMotive = motiveMap[motiveValue] || 'Motivo desconhecido';
            
            return {
              code: item.colmeia.Code ? String(item.colmeia.Code) : 'N/A',
              species: item.colmeia.Species?.CommonName || 'Desconhecida',
              action: mappedAction,
              motive: mappedMotive,
            };
          });
          setActivitiesInFocus(displayActivities);
        } else {
          setActivitiesInFocus([]);
        }
      } catch (error) {
        console.error('Error fetching focused activities:', error);
        setActivitiesInFocus([]);
      } finally {
        setIsLoadingActivities(false);
      }
    };

    fetchFocusedActivities();
  }, []);

    const getMotiveColor = (motive: string) => {
      switch (motive.toLowerCase()) {
        case 'multiplicação recente':
          return 'bg-yellow-100 text-yellow-700';
        case 'baixa atividade':
          return 'bg-yellow-100 text-yellow-700';
        case 'ataque abelha limão':
          return 'bg-red-100 text-red-700';
        default:
          return 'bg-gray-100 text-gray-700';
      }
    };
  
    const getActivityIcon = (action: string) => {
      switch (action) {
        case 'alimentação':
          return <Bean className="w-5 h-5 text-amber-600" />;
        case 'inspeção':
          return <Search className="w-5 h-5 text-amber-600" />;
        default:
          return <Hexagon className="w-5 h-5 text-amber-600" />;
      }
    };

  return (
    <div className="space-y-8">

      {/* Activities in Focus - New Section */}
      <div>
        <h2 className="mb-6 text-amber-900">Atividades em foco</h2>
        <div className="bg-card rounded-xl border border-amber-200 p-6">
          {isLoadingActivities ? (
            <div className="text-center py-8 text-amber-600">
              Carregando...
            </div>
          ) : activitiesInFocus.length === 0 ? (
            <div className="text-center py-8 text-amber-600">
              Nenhuma atividade requer atenção especial
            </div>
          ) : (
            <div className="space-y-4">
              {activitiesInFocus.map((item) => (
                <div 
                  key={item.code} 
                  className="flex items-start gap-4 p-4 bg-amber-50 rounded-lg border border-amber-100"
                >
                  <div className="p-2 rounded-lg bg-amber-100">
                    {getActivityIcon(item.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-amber-900 mb-2 font-bold uppercase">{item.action}</div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-amber-900">Código {item.code}</span>
                      <span className="text-amber-400">•</span>
                      <span className="text-amber-700">{item.species}</span>
                    </div>
                    <Badge variant="outline" className={`${getMotiveColor(item.motive)} border-0`}>
                      {item.motive}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Table */}
      <div>
        <h2 className="mb-6 text-amber-900">Estatísticas do Meliponário</h2>
        <div className="bg-card rounded-xl border border-amber-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-amber-50">
              <tr>
                <th className="px-4 py-3 text-left text-base text-amber-900 font-semibold">Status</th>
                <th className="px-4 py-3 text-center text-base text-amber-900 font-semibold">Quantidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              <tr>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-base text-green-700 font-medium">Pronta para Colheita</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-base text-green-700 font-semibold">{readyToHarvestHives}</td>
              </tr>
              <tr>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-base text-green-700 font-medium">Pronto para Melgueira</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-base text-green-700 font-semibold">{acceptsMelgueiraHives}</td>
              </tr>
              <tr>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-base text-yellow-700 font-medium">Em Desenvolvimento</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-base text-yellow-700 font-semibold">{developingHives}</td>
              </tr>
              <tr>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-base text-yellow-700 font-medium">Induzidas</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-base text-yellow-700 font-semibold">{inducedHives}</td>
              </tr>
              <tr>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-base text-yellow-700 font-medium">Garrafa Pet</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-base text-yellow-700 font-semibold">{petBottleHives}</td>
              </tr>
              <tr>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-base text-red-700 font-medium">Vazias</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-base text-red-700 font-semibold">{emptyHives}</td>
              </tr>
              <tr>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-base text-gray-700 font-medium">Movidas</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-base text-gray-700 font-semibold">{movedHives}</td>
              </tr>
              <tr>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-base text-gray-700 font-medium">Desconhecido</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-base text-gray-700 font-semibold">{unknownHives}</td>
              </tr>
            </tbody>
            <tfoot className="bg-amber-100">
              <tr>
                <td className="px-4 py-3 font-semibold text-base text-amber-900">Total</td>
                <td className="px-4 py-3 text-center text-base font-bold text-amber-900">{hives.length}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}