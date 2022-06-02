import { Inject, Injectable, OnDestroy } from "@angular/core";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
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

    constructor(
        @Inject(GAME_HUB_URL) hubURL: string,
        configService: AppConfigService) 
    { 
        this._connection = new HubConnectionBuilder()
        .withUrl(configService.apiBaseUrl + hubURL)
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build();

        this._connection.serverTimeoutInMilliseconds = 180_000;

        this._connection.on("StateChange", 
            board => this._stateChanged.next(board));
    }
    public get IsConnected(): boolean
    {
        return this._connection.state == "Connected";
    }
    public start(): Promise<any>{
        let con = new Promise<any>(d => console.log(d));
        try {
            con = this._connection.start(); 
            console.log("SignalR Connected.");
        } catch (err) {
            console.log(err);
        }
        return con;
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