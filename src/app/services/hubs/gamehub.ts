import { Inject, Injectable, OnDestroy } from "@angular/core";
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel, MessageHeaders } from "@microsoft/signalr";
import { CookieService } from "ngx-cookie-service";
import { Observable, Subject } from "rxjs";
import { GAME_HUB_URL } from "src/app/app.module";
import { BoardState } from "src/app/models/state";
import { AppConfigService } from "../app-config.service";
import { Cell } from "../board.service";

@Injectable({
        providedIn: 'root'
})
export default class GameHub implements OnDestroy
{
    private _stateChanged = new Subject<BoardState>();
    private _connection: HubConnection;
    private _connectionBuilder: HubConnectionBuilder;
    private _connectionBaseUrl: string;

    public get IsConnected(): boolean
    {
        return this._connection.state == "Connected";
    }   

    constructor(
        @Inject(GAME_HUB_URL) private hubURL: string,
        private configService: AppConfigService,
        private cookieService: CookieService) 
    {
        this._connectionBaseUrl = this.configService.apiBaseUrl + this.hubURL;

        this._connectionBuilder = new HubConnectionBuilder()
        .withUrl(this._connectionBaseUrl)
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect();
        this._connection = this._connectionBuilder.build();
    }
    
    public async start(lobbyId: number): Promise<any>{
        this._connectionBuilder.withUrl(this._connectionBaseUrl + `?lobbyId=${lobbyId}`,
        {
            accessTokenFactory :() =>
            {
                return this.cookieService.get('auth_token');
            } 
        });

        this._connection = this._connectionBuilder.build();
        this._connection.serverTimeoutInMilliseconds = 180_000;
        this._connection.on("StateChange", 
            board => this._stateChanged.next(board));
            
        let con = new Promise<any>(d => console.log(d));
        try {
            con = this._connection.start(); 
            console.log("SignalR Connected.");
        } catch (err) {
            console.log(err);
        }
        return con;
    }
    public async stop():Promise<any>{
        await this._connection.stop();
        if (this._connection.state != HubConnectionState.Disconnected)
            alert("didn't disconnect");
    }
    public StateChanged(): Observable<BoardState>
    {
        return this._stateChanged.asObservable();
    }
    public endGame(): Promise<void>
    {
        return this._connection.invoke("EndGame");
    }
    public prepareGame(): Promise<void>
    {
        return this._connection.invoke("PrepareGame");
    }
    public flag(cell: Cell): void
    {
        this._connection.send("Flag", cell);
    }
    public reveal(cell: Cell): void
    {
        this._connection.send("Reveal", cell);
    }
    public revealAround(cell: Cell): void
    {
        this._connection.send("RevealAround", cell);
    }
    ngOnDestroy(): void {
        this._stateChanged.complete();
        this._connection.stop().catch(e => console.log(e));
    }
}