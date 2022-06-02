import { Cell } from "../services/board.service";

export interface BoardState {
    grid: Cell[][];
    bombsGenerated: number;
    bombsLeft: number;
    isGameOver: boolean;
    isStarted: boolean;
}