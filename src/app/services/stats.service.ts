import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { STATS_URL } from '../app.module';
import { Stat } from '../models/stat';
import { AppConfigService } from './app-config.service';
import { AiStat } from '../models/AIStat';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  public timeSpent: number = 0;
  public bombsLeft: number = Infinity;
  public bombsStarted: number = Infinity;
  public revealMovesMade: number = 0;
  public flagMovesMade: number = 0;
  public globalStats: Stat[] = [];
  public statsRequest: Observable<Stat[]> = new Observable<Stat[]>();
  public isAi: boolean = false;

  private interval: any = undefined;
  private statsUrl: string = '';
  constructor(
    @Inject(STATS_URL) statsURL: string,
    configServce: AppConfigService,
    private httpClient?: HttpClient) {
    this.statsUrl = configServce.apiBaseUrl + statsURL;
    this.load()?.subscribe();
  }
  start(bombsStarted: number): void {
    if(this.interval)
      return;
    this.bombsStarted = bombsStarted;
    this.bombsLeft = bombsStarted;
    this.timeSpent = 0;
    this.interval = setInterval(() => this.timeSpent++, 1000);
  }
  stop(): void {
    if (this.interval)
    {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }
  addBomb(): void {
    this.bombsLeft++;
  }
  removeBomb(): void {
    this.bombsLeft--;
  }
  toString(num: number): string {
    let res = num.toString();
    while (res.length < 3)
      res = '0' + res;
    return res;
  }
  share(): Observable<Stat> | undefined {
    let stat = this.getCurStat();
    var obs = this.httpClient?.post<Stat>(this.statsUrl, stat);
    return obs;
  }
  load(): Observable<Stat[]> | undefined {
    if (this.httpClient) {
      this.statsRequest = this.httpClient!.get<Stat[]>(this.statsUrl);
      var obs = this.statsRequest?.pipe(
        tap(v => {
          this.globalStats = v;
        }));
      return obs;
    }
    return undefined;
  }
  loadAIstats(lobbyId: number) : Observable<AiStat> | undefined{
    let aiStatRequest: Observable<AiStat> | undefined;
    if (this.httpClient) {
      aiStatRequest = this.httpClient.get<AiStat>(this.statsUrl + '/ai?lobbyId=' + lobbyId);

      aiStatRequest
      .subscribe({next:  AiStat => {
        this.revealMovesMade = AiStat.revealMovesMade;
        this.flagMovesMade = AiStat.flagMovesMade;
      }});
    }

    return aiStatRequest;
  }
  private getCurStat() : Stat {
    return {
      date: new Date(),
      minesAtStart: this.bombsStarted,
      minesLeft: this.bombsLeft,
      secondsTaken: this.timeSpent,
      revealMovesMade: this.revealMovesMade,
      flagMovesMade: this.flagMovesMade,
    } as Stat;
  }
}
