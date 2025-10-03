import { Colmeia } from './types';

// Mock data for local development
export const mockColmeiasData: Colmeia[] = [
  {
    colmeia_id: "001",
    code: "001",
    species: {
      id: 4,
      commonName: "Mandaçaia",
      scientificName: "Melipona Quadrifasciata"
    },
    starting_date: "2023-01-15",
    status: "EM_DESENVOLVIMENTO"
  },
  {
    colmeia_id: "002",
    code: "002",
    species: {
      id: 3,
      commonName: "Mirim-guaçu",
      scientificName: "Plebeia Gigantea"
    },
    starting_date: "2023-02-20",
    status: "EM_DESENVOLVIMENTO"
  },
  {
    colmeia_id: "003",
    code: "003",
    species: {
      id: 5,
      commonName: "Guaraipo",
      scientificName: "Melipona Bicolor"
    },
    starting_date: "2023-03-10",
    status: "EM_DESENVOLVIMENTO"
  },
  {
    colmeia_id: "004",
    code: "004",
    species: {
      id: 8,
      commonName: "Tubuna",
      scientificName: "Scaptotrigona Bipunctata"
    },
    starting_date: "2023-04-05",
    status: "VAZIA"
  },
  {
    colmeia_id: "005",
    code: "005",
    species: {
      id: 1,
      commonName: "Jataí",
      scientificName: "Tetragosnisca Angustula"
    },
    starting_date: "2023-05-12",
    status: "INDUZIDA"
  },
  {
    colmeia_id: "006",
    code: "006",
    species: {
      id: 9,
      commonName: "Canudo",
      scientificName: "Scaptotrigona Depilis"
    },
    starting_date: "2023-06-18",
    status: "MOVIDA"
  },
  {
    colmeia_id: "007",
    code: "007",
    species: {
      id: 2,
      commonName: "Mirim-emerina",
      scientificName: "Plebeia Emerina"
    },
    starting_date: "2023-07-22",
    status: "PRONTO_PARA_MELGUEIRA"
  },
  {
    colmeia_id: "008",
    code: "008",
    species: {
      id: 6,
      commonName: "Manduri",
      scientificName: "Melipona Marginata"
    },
    starting_date: "2023-08-30",
    status: "GARRAFA_PET"
  },
  {
    colmeia_id: "009",
    code: "009",
    species: {
      id: 4,
      commonName: "Mandaçaia",
      scientificName: "Melipona Quadrifasciata"
    },
    starting_date: "2023-09-14",
    status: "PRONTA_PARA_COLHEITA"
  },
  {
    colmeia_id: "010",
    code: "010",
    species: {
      id: 3,
      commonName: "Mirim-guaçu",
      scientificName: "Plebeia Gigantea"
    },
    starting_date: "2023-10-08",
    status: "PRONTO_PARA_MELGUEIRA"
  }
];

// Helper function to simulate API delay
export const simulateApiDelay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
}; 