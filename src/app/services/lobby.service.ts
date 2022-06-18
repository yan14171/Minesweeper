import { Inject, Injectable, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LOBBY_URL, STATS_URL } from '../app.module';
import { Lobby } from '../models/lobby';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class LobbyService implements OnInit{
  
  private _lobbys: Lobby[] = [];
  private _lobbyGetCall: Observable<Lobby[]>; 
  private _lobbyPostCall: Observable<Lobby> = new Observable<Lobby>();
  private _lobbyJoinCall: Observable<Lobby> = new Observable<Lobby>();
  private _lobbyDisconnectCall: Observable<Lobby> = new Observable<Lobby>();
  private _getUrl = '';
  private _selectedLobbyId: number | undefined;
  private _joinedLobbyId: number | undefined;

  constructor(private _http: HttpClient,
              @Inject(LOBBY_URL) lobbyUrl: string,
              configService: AppConfigService, ) {
    this._getUrl = configService.apiBaseUrl + lobbyUrl;

    this._lobbyGetCall = this._http.get<Lobby[]>(this._getUrl)
    .pipe(
      tap((x: Lobby[]) => {
        this._lobbys = x;
    })); 
  }
  ngOnInit(): void {
  }
  public get Lobbys(): Lobby[]{
    return this._lobbys;
  }
  public refresh(): Observable<Lobby[]>{
    return this._lobbyGetCall;
  }
  public post(lobby: Lobby):Observable<Lobby>{
    this._lobbyPostCall = this._http.post<Lobby>(this._getUrl, lobby);
    return this._lobbyPostCall;
  }
  public select(lobby: Lobby):void{
    if(this._lobbys.find(x => x.id == lobby.id))
      this._selectedLobbyId = lobby.id;
  }
  public join(id: number): Observable<Lobby>{
    this._lobbyJoinCall = this._http.patch<Lobby>(this._getUrl, id)
    .pipe(
      tap(x => 
        {
          this._joinedLobbyId = x.id;
          this.refresh().subscribe();
    }));
    return this._lobbyJoinCall;
  }
  public disconnect(id: number): Observable<Lobby>{
    this._lobbyDisconnectCall = this._http.delete<Lobby>(this._getUrl, {
      body: id
    }).pipe(
      tap(x =>
        {
          this._joinedLobbyId = undefined;
          this.refresh().subscribe();
    }));
    return this._lobbyDisconnectCall;
  }
  public tryCurrentDisconnect(): void{
    if(this._joinedLobbyId)
      this.disconnect(this._joinedLobbyId).subscribe();
  }
  public close(id: number): Observable<Lobby>{
    let lobbyCloseCall = this._http.delete<Lobby>(this._getUrl+"/close", {
      body: id
    }).pipe(
      tap(l => {
        this._lobbys.splice(this._lobbys.indexOf(l), 1);
      }));
    return lobbyCloseCall;
  }
  public get selectedLobby(): Lobby | undefined{
    if(this._selectedLobbyId == undefined)
      return undefined;
    return this._lobbys.find(x => x.id == this._selectedLobbyId);
  } 
  public get joinedLobby(): Lobby | undefined{
    if(this._joinedLobbyId == undefined)
    return undefined;
  return this._lobbys.find(x => x.id == this._joinedLobbyId);
  }
  public set joinedLobby(lobby: Lobby | undefined){
    this._joinedLobbyId = lobby?.id ?? undefined;
  }
}
