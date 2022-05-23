import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { LoginService } from '../services/login.service';
import { StatsService } from '../services/stats.service';
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
  constructor(private loginService: LoginService,
              private statsService: StatsService) {}

  ngOnInit(): void {
  }
  public onClose(): void{
    this.close.emit();
  }
  share(): void{
    if(this.isAuthenticated())
      this.stats?.share()?.subscribe({
        complete: () => this.statsService.load()?.subscribe() 
    });
    this.onClose();
  }
  isAuthenticated(): boolean{
    return this.loginService.isAuthorized();
  }
}
