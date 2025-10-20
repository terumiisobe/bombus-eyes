import { Colmeia } from "../types";
import { countHivesByStatus } from "../utils/hiveUtils";

interface DashboardProps {
  hives: Colmeia[];
}

export function Dashboard({ hives }: DashboardProps) {
  const readyToHarvestHives = countHivesByStatus(hives, 'PRONTA_PARA_COLHEITA');
  const acceptsMelgueiraHives = countHivesByStatus(hives, 'PRONTO_PARA_MELGUEIRA');
  const developingHives = countHivesByStatus(hives, 'EM_DESENVOLVIMENTO');
  const inducedHives = countHivesByStatus(hives, 'INDUZIDA');
  const petBottleHives = countHivesByStatus(hives, 'GARRAFA_PET');
  const emptyHives = countHivesByStatus(hives, 'VAZIA');
  const movedHives = countHivesByStatus(hives, 'MOVIDA');
  const unknownHives = countHivesByStatus(hives, 'DESCONHECIDO');

  return (
    <div className="space-y-8">
      {/* Stats Table */}
      <div>
        <h2 className="mb-6 text-2xl text-amber-900">Estatísticas do Meliponário</h2>
        <div className="bg-card rounded-xl border border-amber-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-amber-50">
              <tr>
                <th className="px-4 py-3 text-left text-base text-amber-900 font-semibold">Status</th>
                <th className="px-4 py-3 text-center text-base text-amber-900 font-semibold">Quantidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              <tr className="hover:bg-green-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-base text-green-700 font-medium">Pronta para Colheita</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-base text-green-700 font-semibold">{readyToHarvestHives}</td>
              </tr>
              <tr className="hover:bg-green-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-base text-green-700 font-medium">Pronto para Melgueira</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-base text-green-700 font-semibold">{acceptsMelgueiraHives}</td>
              </tr>
              <tr className="hover:bg-yellow-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-base text-yellow-700 font-medium">Em Desenvolvimento</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-base text-yellow-700 font-semibold">{developingHives}</td>
              </tr>
              <tr className="hover:bg-yellow-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-base text-yellow-700 font-medium">Induzidas</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-base text-yellow-700 font-semibold">{inducedHives}</td>
              </tr>
              <tr className="hover:bg-yellow-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-base text-yellow-700 font-medium">Garrafa Pet</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-base text-yellow-700 font-semibold">{petBottleHives}</td>
              </tr>
              <tr className="hover:bg-red-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-base text-red-700 font-medium">Vazias</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-base text-red-700 font-semibold">{emptyHives}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-base text-gray-700 font-medium">Movidas</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-base text-gray-700 font-semibold">{movedHives}</td>
              </tr>
              <tr className="hover:bg-gray-50">
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