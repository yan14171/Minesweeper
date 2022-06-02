import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IBoardService } from '../services/interfaces/IBoardService';
import { Stat } from '../models/stat';
import { Cell } from '../services/board.service';

@Component({
  selector: 'app-minesweeper-two-piece',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.css']
})
export class MinesweeperTwoPieceComponent implements OnInit, OnDestroy {
  public gameService: IBoardService;
  constructor(route: ActivatedRoute, injector: Injector) {
    const modeToken = route.snapshot.data['gamemode']; 
    this.gameService = injector.get(modeToken);
    this.gameService.isGameOver = false;
  }
  public get isGameOver(){
    return this.gameService.isGameOver;
  }
  public get spentTime(){
    let unformattedTime = this.gameService.stats.timeSpent;
    return this.gameService.stats.toString(unformattedTime);
  }
  public get bombsLeft(){
    let unformattedBombsLeft = this.gameService.stats.bombsLeft;
    return this.gameService.stats.toString(unformattedBombsLeft);
  }
  public reveal(cell: Cell): void{
    this.gameService.reveal(cell);
  }
  public flag_(cell: Cell):boolean{
    this.gameService.flag(cell);
    return false;
  }
  revealAround(cell: Cell):void{
    this.gameService.revealAround(cell);
  }
  public getRows(): Cell[][]
  {
    return this.gameService.getRows();
  }
  public restartGame(): void{
    this.gameService.restartGame();
  }
  public getGlobalStats(): Stat[]{
    return this.gameService.getGlobalStats();
  }
  public format_time(date: Date, a:string, b:string) : string
  {
    var datenum: number; 
    //Local time converted to UTC
    console.log("Time: " + date);
    var localOffset = new Date(date).getTimezoneOffset() * 60000;
    var localTime = new Date(date).getTime();
        datenum = localTime - localOffset;
    var newdate = new Date(datenum);
    console.log("Converted time: " + date);
    return newdate.toLocaleTimeString();
  }
  ngOnDestroy(): void {
    this.gameService.stats.stop();
  }
  ngOnInit(): void {
    this.gameService.isGameOver = false;
  }
}
