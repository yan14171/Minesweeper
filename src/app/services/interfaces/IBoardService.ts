import { Stat } from "../../models/stat";
import { Cell } from "../board.service";
import { StatsService } from "../stats.service";

export interface IBoardService{
    bombsGenerated: number;
    isGameOver: boolean;
    isStarted: boolean;
    stats: StatsService;
    getRows(): Cell[][];
    restartGame(): void;
    getGlobalStats():Stat[];
    flag(cell: Cell): void;
    revealAround(cell: Cell): void;
    reveal(cell: Cell): void;
}