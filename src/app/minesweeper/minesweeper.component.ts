import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BoardService, Cell } from '../services/board.service';

@Component({
  selector: 'app-minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.css'],
  providers: [BoardService]
})
export class MinesweeperComponent implements OnInit, OnDestroy {
  constructor(public gameService: BoardService) {
    this.gameService.isGameOver = false;
   }
  ngOnDestroy(): void {
    this.gameService.stats.stop();
  }
  ngOnInit(): void {
    this.gameService.isGameOver = false;
  }
  public getRows(): Cell[][]
  {
    return this.gameService.getRows();
  }
  format(date: Date, a:string, b:string) : string
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
}
