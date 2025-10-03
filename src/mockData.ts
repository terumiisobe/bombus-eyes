import { Colmeia } from './types';

// Mock data for local development
export const mockColmeiasData: Colmeia[] = [
  {
    ID: "001",
    Code: 1,
    Species: {
      ID: 4,
      CommonName: "Mandaçaia",
      ScientificName: "Melipona Quadrifasciata"
    },
    StartingDate: "2023-01-15",
    Status: "EM_DESENVOLVIMENTO"
  },
  {
    ID: "002",
    Code: 2,
    Species: {
      ID: 3,
      CommonName: "Mirim-guaçu",
      ScientificName: "Plebeia Gigantea"
    },
    StartingDate: "2023-02-20",
    Status: "EM_DESENVOLVIMENTO"
  },
  {
    ID: "003",
    Code: 3,
    Species: {
      ID: 5,
      CommonName: "Guaraipo",
      ScientificName: "Melipona Bicolor"
    },
    StartingDate: "2023-03-10",
    Status: "EM_DESENVOLVIMENTO"
  },
  {
    ID: "004",
    Code: 4,
    Species: {
      ID: 8,
      CommonName: "Tubuna",
      ScientificName: "Scaptotrigona Bipunctata"
    },
    StartingDate: "2023-04-05",
    Status: "VAZIA"
  },
  {
    ID: "005",
    Code: 5,
    Species: {
      ID: 1,
      CommonName: "Jataí",
      ScientificName: "Tetragosnisca Angustula"
    },
    StartingDate: "2023-05-12",
    Status: "INDUZIDA"
  },
  {
    ID: "006",
    Code: 6,
    Species: {
      ID: 9,
      CommonName: "Canudo",
      ScientificName: "Scaptotrigona Depilis"
    },
    StartingDate: "2023-06-18",
    Status: "MOVIDA"
  },
  {
    ID: "007",
    Code: 7,
    Species: {
      ID: 2,
      CommonName: "Mirim-emerina",
      ScientificName: "Plebeia Emerina"
    },
    StartingDate: "2023-07-22",
    Status: "PRONTO_PARA_MELGUEIRA"
  },
  {
    ID: "008",
    Code: 8,
    Species: {
      ID: 6,
      CommonName: "Manduri",
      ScientificName: "Melipona Marginata"
    },
    StartingDate: "2023-08-30",
    Status: "GARRAFA_PET"
  },
  {
    ID: "009",
    Code: 9,
    Species: {
      ID: 4,
      CommonName: "Mandaçaia",
      ScientificName: "Melipona Quadrifasciata"
    },
    StartingDate: "2023-09-14",
    Status: "PRONTA_PARA_COLHEITA"
  },
  {
    ID: "010",
    Code: 10,
    Species: {
      ID: 3,
      CommonName: "Mirim-guaçu",
      ScientificName: "Plebeia Gigantea"
    },
    StartingDate: "2023-10-08",
    Status: "PRONTO_PARA_MELGUEIRA"
  }
];

// Helper function to simulate API delay
export const simulateApiDelay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
}; 