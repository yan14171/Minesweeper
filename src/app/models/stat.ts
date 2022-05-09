import { DeclarationListEmitMode } from "@angular/compiler";

export interface Stat{
    name: string;
    date: Date;
    minesAtStart: number;
    minesLeft: number;
    secondsTaken: number;
}