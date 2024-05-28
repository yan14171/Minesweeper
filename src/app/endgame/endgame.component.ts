import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { LoginService } from '../services/login.service';
import { StatsService } from '../services/stats.service';
import { AiStat } from '../models/AIStat';
import { AIStatService } from '../services/aistat.service';
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
  private aiStat: AIStatService | undefined;
  constructor(private loginService: LoginService,
              private statsService: StatsService) {}

  ngOnInit(): void {
    if(this.stats?.isAi)
      this.aiStat = new AIStatService(this.stats.revealMovesMade, this.stats.flagMovesMade, this.stats.timeSpent, this.stats.bombsStarted-this.stats.bombsLeft);
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

  getEfficiencyMetric(): number {
    return this.aiStat?.getEfficiencyMetric() || 0;
  }
  getTotalMoves(): number {
    return this.aiStat?.getTotalMoves() || 0;
  }
  getMovesPerSecond(): number {
    return this.aiStat?.getMovesPerSecond() || 0;
  }
  getMinesPerSecond(): number {
    return this.aiStat?.getMinesPerSecond() || 0;
  }
  getAccuracy(): number {
    return this.aiStat?.getAccuracy() || 0;
  }
  getPerformanceOverview(): string {
    return this.aiStat?.getPerformanceOverview() || 'The performance overview is not available.';
  }
}
