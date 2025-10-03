import { Colmeia } from './types';

// Mock data for local development
export const mockColmeiasData: Colmeia[] = [
  {
    colmeia_id: "001",
    species: "Melipona Quadrifasciata",
    starting_date: "2023-01-15",
    status: "Ativa"
  },
  {
    colmeia_id: "002",
    species: "Plebeia Gigantea",
    starting_date: "2023-02-20",
    status: "Ativa"
  },
  {
    colmeia_id: "003",
    species: "Melipona Bicolor",
    starting_date: "2023-03-10",
    status: "Inativa"
  },
  {
    colmeia_id: "004",
    species: "Scaptotrigona Bipunctata",
    starting_date: "2023-04-05",
    status: "Ativa"
  },
  {
    colmeia_id: "005",
    species: "Tetragosnisca Angustula",
    starting_date: "2023-05-12",
    status: "Ativa"
  },
  {
    colmeia_id: "006",
    species: "Scaptotrigona Depilis",
    starting_date: "2023-06-18",
    status: "Ativa"
  },
  {
    colmeia_id: "007",
    species: "Plebeia Emerina",
    starting_date: "2023-07-22",
    status: "Inativa"
  },
  {
    colmeia_id: "008",
    species: "Melipona Marginata",
    starting_date: "2023-08-30",
    status: "Ativa"
  },
  {
    colmeia_id: "009",
    species: "Melipona Quadrifasciata",
    starting_date: "2023-09-14",
    status: "Ativa"
  },
  {
    colmeia_id: "010",
    species: "Plebeia Gigantea",
    starting_date: "2023-10-08",
    status: "Ativa"
  }
];

// Helper function to simulate API delay
export const simulateApiDelay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
}; 