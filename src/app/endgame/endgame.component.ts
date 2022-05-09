import { HttpClient, HttpHandler } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { StatsService } from '../stats.service';
@Component({
  selector: 'app-endgame',
  templateUrl: './endgame.component.html',
  styleUrls: ['./endgame.component.css']
})
export class EndgameComponent implements OnInit {
  
  public message: string = "Game Over!";
  @Input()
  public stats: StatsService | undefined;
  @Output()
  public close: EventEmitter<void> = new EventEmitter<void>()
  constructor() { }

  ngOnInit(): void {
  }

  public onClose(): void{
    this.close.emit();
  }

  share(): void{
    this.stats?.share();
  }
}
