import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IBoardService } from '../services/interfaces/IBoardService';
import { Stat } from '../models/stat';
import { Cell } from '../services/board.service';
import { BoardOnlineService } from '../services/board-online.service';

@Component({
  selector: 'app-minesweeper-two-piece',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.css']
})
export class MinesweeperTwoPieceComponent implements OnInit, OnDestroy {
  public gameService: BoardOnlineService;
  constructor(route: ActivatedRoute, injector: Injector) {
    const modeToken = route.snapshot.data['gamemode'];
    this.gameService = (injector.get(modeToken) as BoardOnlineService);
    this.gameService.isGameOver = false;

    let lobbyid = route.snapshot.params["lobbyId"];
    this.start(lobbyid);
  }
  public async start(lobbyId: number){
    try
    {
      await this.gameService.start(lobbyId);
      await this.gameService.prepareGame();
    }
    catch(e)
    {
      alert(e);
    }
  }
  public get isGameOver() {
    return this.gameService.isGameOver;
  }
  public get spentTime() {
    let unformattedTime = this.gameService.stats.timeSpent;
    return this.gameService.stats.toString(unformattedTime);
  }
  public get bombsLeft() {
    let unformattedBombsLeft = this.gameService.stats.bombsLeft;
    return this.gameService.stats.toString(unformattedBombsLeft);
  }
  public reveal(cell: Cell): void {
    this.gameService.reveal(cell);
  }
  public flag_(cell: Cell): boolean {
    this.gameService.flag(cell);
    return false;
  }
  revealAround(cell: Cell): void {
    this.gameService.revealAround(cell);
  }
  public getRows(): Cell[][] {
    return this.gameService.getRows();
  }
  public restartGame(): void {
    this.gameService.restartGame();
  }
  public getGlobalStats(): Stat[] {
    return this.gameService.getGlobalStats();
  }
  public format_time(date: Date, a: string, b: string): string {
    var datenum: number;
    var localOffset = new Date(date).getTimezoneOffset() * 60000;
    var localTime = new Date(date).getTime();
    datenum = localTime - localOffset;
    var newdate = new Date(datenum);
    return newdate.toLocaleTimeString();
  }
  async ngOnDestroy(): Promise<void> {
    this.gameService.stats.stop();
    await this.gameService.stop();
  }
  ngOnInit(): void {
    this.gameService.isGameOver = false;
  }
}
