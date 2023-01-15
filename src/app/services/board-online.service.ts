import { Injectable, OnDestroy } from '@angular/core';
import { IBoardService } from './interfaces/IBoardService';
import { Stat } from '../models/stat';
import { Cell } from './board.service';
import { StatsService } from './stats.service';
import GameHub from './hubs/gamehub';
import { BoardState } from '../models/state';

@Injectable({
  providedIn: 'root'
})
export class BoardOnlineService implements IBoardService{

  public bombsGenerated: number = Infinity;
  public isGameOver: boolean = false;
  public isStarted: boolean = false;
  private _grid: Cell[][] = [];

  constructor(public stats: StatsService,
    private _hub: GameHub
  ) 
  { 
    this._hub.StateChanged()
    .subscribe(
      {
        next: state =>
          this.refreshState(state)
      });
  }
  public async start(lobbyId: number): Promise<void> {
    await this._hub.start(lobbyId);
  }
  public getAIUrl(lobbyID: number){
    return this._hub.getAIUrl(lobbyID);
  }
  public async stop(): Promise<void>{
    await this._hub.stop();
  }
  public getRows(): Cell[][] {
    return this._grid;
  }
  public async restartGame(): Promise<void> {
    await this.endGame();
    await this.prepareGame();
  }
  public getGlobalStats(): Stat[] {
    return this.stats.globalStats;
  }
  public flag(cell: Cell): void {
    this._hub.flag(cell);
  }
  public revealAround(cell: Cell): void {
    this._hub.revealAround(cell);
  }
  public reveal(cell: Cell): void {
    this._hub.reveal(cell);
  }
  public async prepareGame() {
    await this._hub.prepareGame();
  }
  private async endGame(): Promise<void> {
    await this._hub.endGame();
  }
  private refreshState(state: BoardState) {
    this._grid = state.grid;

    if (state.isGameOver)
      this.stats.stop();

    if (!this.isStarted && state.isStarted)
      this.stats.start(state.bombsGenerated);

    this.bombsGenerated = state.bombsGenerated;
    this.stats.bombsLeft = state.bombsLeft;
    this.isGameOver = state.isGameOver;
    this.isStarted = state.isStarted;
  }
}
