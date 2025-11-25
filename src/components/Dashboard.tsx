import { useEffect, useState } from "react";
import { Colmeia, FocusedActivity } from "../types";
import { countHivesByStatus } from "../utils/hiveUtils";
import { Hexagon, Search, Bean } from "lucide-react";
import { Badge } from "./ui/badge";
import { apiService } from "../services/apiService";
import { Separator } from "./ui/separator";

interface DashboardProps {
  hives: Colmeia[];
}

interface DisplayActivity {
  code: string;
  species: string;
  action: string;
  motive: string;
}

interface ActivityHistoryDay {
  date: string;
  dayOfWeek: string;
  activities: Array<{
    id: string;
    code: string;
    species: string;
    operation: string;
  }>;
}

export function Dashboard({ hives }: DashboardProps) {
  const [activitiesInFocus, setActivitiesInFocus] = useState<DisplayActivity[]>([]);
  const [activityHistory, setActivityHistory] = useState<ActivityHistoryDay[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const readyToHarvestHives = countHivesByStatus(hives, 'PRONTA_PARA_COLHEITA');
  const acceptsMelgueiraHives = countHivesByStatus(hives, 'PRONTO_PARA_MELGUEIRA');
  const developingHives = countHivesByStatus(hives, 'EM_DESENVOLVIMENTO');
  const inducedHives = countHivesByStatus(hives, 'INDUZIDA');
  const petBottleHives = countHivesByStatus(hives, 'GARRAFA_PET');
  const emptyHives = countHivesByStatus(hives, 'VAZIA');
  const movedHives = countHivesByStatus(hives, 'MOVIDA');
  const unknownHives = countHivesByStatus(hives, 'DESCONHECIDO');

  // Format date to Portuguese format
  const formatDate = (dateString: string): { date: string; dayOfWeek: string } => {
    const date = new Date(dateString);
    const daysOfWeek = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const dayOfWeek = daysOfWeek[date.getDay()];
    
    return {
      date: `${day} de ${month} de ${year}`,
      dayOfWeek: dayOfWeek,
    };
  };

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

          // Process activity history from the same data
          interface HistoryDayData {
            dateKey: string;
            formattedDate: { date: string; dayOfWeek: string };
            activities: Array<{ id: string; code: string; species: string; operation: string }>;
          }
          
          const historyMap = new Map<string, HistoryDayData>();
          
          result.data.forEach((item: FocusedActivity) => {
            if (!item.date) return;
            
            const formattedDate = formatDate(item.date);
            const dateKey = item.date.split('T')[0]; // Use date as key for grouping
            
            if (!historyMap.has(dateKey)) {
              historyMap.set(dateKey, {
                dateKey,
                formattedDate,
                activities: [],
              });
            }
            
            const day = historyMap.get(dateKey)!;
            const code = item.colmeia.Code ? String(item.colmeia.Code) : 'N/A';
            const species = item.colmeia.Species?.CommonName || 'Desconhecida';
            
            // Map motive to operation text
            let operation = '';
            if (item.motive === 'MULTIPLICACAO') {
              operation = 'Multiplicação';
            } else {
              // Map action to operation
              const actionMap: Record<string, string> = {
                'ALIMENTACAO': 'alimentação',
                'INSPECAO': 'inspeção',
              };
              const actionValue = String(item.action || '').trim();
              operation = actionMap[actionValue] || 'atividade';
            }
            
            day.activities.push({
              id: `${dateKey}-${code}-${day.activities.length}`,
              code,
              species,
              operation,
            });
          });
          
          // Convert map to array and sort by date (newest first)
          const historyArray = Array.from(historyMap.values())
            .map(day => ({
              date: day.formattedDate.date,
              dayOfWeek: day.formattedDate.dayOfWeek,
              activities: day.activities,
              dateKey: day.dateKey, // Keep for sorting
            }))
            .sort((a, b) => {
              return new Date(b.dateKey).getTime() - new Date(a.dateKey).getTime();
            })
            .map(({ dateKey, ...rest }) => rest); // Remove dateKey from final result
          
          setActivityHistory(historyArray);
        } else {
          setActivitiesInFocus([]);
          setActivityHistory([]);
        }
      } catch (error) {
        console.error('Error fetching focused activities:', error);
        setActivitiesInFocus([]);
        setActivityHistory([]);
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

      {/* Activities in Focus and Activity History - Side by Side */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Activities in Focus - New Section */}
        <div className="flex-1">
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

        {/* Activity History */}
        <div className="flex-1">
          <h2 className="mb-6 text-amber-900">Histórico de atividades</h2>
          <div className="bg-card rounded-xl border border-amber-200 p-6">
            {activityHistory.length === 0 ? (
              <div className="text-center py-8 text-amber-600">
                Nenhuma atividade registrada
              </div>
            ) : (
              <div className="space-y-3">
                {activityHistory.map((day, index) => (
                  <div key={index}>
                    <div className="bg-amber-100 px-3 py-2 rounded-lg mb-2">
                      <span className="text-amber-900">{day.date}</span>
                      <span className="text-amber-700 ml-2">• {day.dayOfWeek}</span>
                    </div>
                    <div className="pl-2">
                      {day.activities.map((activity, actIndex) => (
                        <div key={activity.id}>
                          <div className="py-1.5 px-2 hover:bg-amber-50 rounded transition-colors">
                            <span className="text-amber-900 text-sm capitalize">
                              {activity.operation} de {activity.species} (#{activity.code})
                            </span>
                          </div>
                          {actIndex < day.activities.length - 1 && (
                            <Separator className="bg-amber-100" />
                          )}
                        </div>
                      ))}
                    </div>
                    {index < activityHistory.length - 1 && (
                      <Separator className="mt-3 bg-amber-100" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
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