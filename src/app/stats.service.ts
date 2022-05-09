import { HttpClient } from '@angular/common/http';
import { Inject,Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';
import { STATS_URL } from './app.module';
import { Stat } from './models/stat';

@Injectable({
  providedIn:'root'
})
export class StatsService {
  public timeSpent: number = 0;
  public bombsLeft: number = Infinity;
  public bombsStarted: number = Infinity;
  public globalStats: Stat[] = [];
  public statsRequest: Observable<Stat[]> = new Observable<Stat[]>();
 
  private interval: any = undefined;
  private statsUrl: string = '';
  constructor(
    @Inject(STATS_URL)statsURL: string,
    configServce: AppConfigService,  
    private httpClient?: HttpClient)
  {
    this.statsUrl = configServce.apiBaseUrl + statsURL;
    if(this.httpClient)
    this.statsRequest = this.httpClient!.get<Stat[]>(this.statsUrl);
    this.statsRequest?.subscribe(s => {
      this.globalStats = s;
    })
  }
  start(bombsStarted: number): void {
    this.bombsStarted = bombsStarted;
    this.bombsLeft = bombsStarted;
    this.timeSpent = 0;
    this.interval = setInterval(() => this.timeSpent++, 1000);
  }
  stop(): void {
    if (this.interval)
      clearInterval(this.interval);
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
  share(): void{
    let stat = {
      name: "Player",
        date: new Date(Date.now()),
      minesAtStart: this.bombsStarted,
      minesLeft: this.bombsLeft,
      secondsTaken: this.timeSpent
    } as Stat;

    this.httpClient?.post<Stat>(this.statsUrl, stat)
    .subscribe(succ => {
      alert(`Sent: ${succ.name}`);
      console.log(succ);
    },
    err =>{
      alert(err.message);
      console.log(err);  
    })
    
  }
}
