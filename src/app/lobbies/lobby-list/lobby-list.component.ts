import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Lobby } from 'src/app/models/lobby';
import { LobbyService } from 'src/app/services/lobby.service';

@Component({
  selector: 'app-lobby-list',
  templateUrl: './lobby-list.component.html',
  styleUrls: ['./lobby-list.component.css']
})
export class LobbyListComponent implements OnInit {
  public isErrorLoading: boolean = false;
  public isRefreshDisabled: boolean = false;
  public isCreateDisabled: boolean = false;
  public isCreateViolated: boolean = false;
  public errorMessage = '';
  public lobbys: Lobby[] = [];
  public get selectedLobby(): Lobby | undefined {
    return undefined;
  }
  constructor(private _lobbyService: LobbyService) {
    this.refresh();
  }
  ngOnInit(): void {
  }
  onLobbySelected(lobby: Lobby) {
    this._lobbyService.select(lobby);
  }
  refresh() {
    this.isRefreshDisabled = true;
    this._lobbyService.refresh().subscribe({
      next: x => {
        this.lobbys = x;
        this.isErrorLoading = false;
      },
      error: x => {
        this.isErrorLoading = true;
        this.errorMessage = x.message;
      }
    });
    setTimeout(() => this.isRefreshDisabled = false, 2000);
  }
  trycreate() {
    if (this.isCreateDisabled) {
      this.isCreateViolated = true;
      setTimeout(() => {
        this.isCreateViolated = false
      }, 2000);
      return;
    }
    this.isCreateDisabled = true;
    this.create();
    setTimeout(() => {
      this.isCreateDisabled = false
    }, 5000);
  }
  private create(): void{
    this.isErrorLoading = false;
    let postreq = this._lobbyService.post({ id: 0, userIdentities: [], isStarted: false });
    postreq.subscribe({
      error: (x: Error) => {
        this.isErrorLoading = true;
        this.errorMessage = (x.message.includes('Unknown') || x.message.includes('401')) ? 'You need to authorize to create a lobby' : x.message;
      }
    });
  }
}
