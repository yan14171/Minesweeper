import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BoardService, Cell } from '../board.service';

@Component({
  selector: 'app-minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.css'],
  providers: [BoardService]
})
export class MinesweeperComponent implements OnInit {
  constructor(public gameService: BoardService) {
    this.gameService.isGameOver = false;
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
    return formatDate(date,a,b);
  }
}
