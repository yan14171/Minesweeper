import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Lobby } from 'src/app/models/lobby';
import { LobbyService } from 'src/app/services/lobby.service';

@Component({
  selector: 'app-lobby-detail',
  templateUrl: './lobby-detail.component.html',
  styleUrls: ['./lobby-detail.component.css'],
})
export class LobbyDetailComponent{

  public errorJoining: boolean = false;
  public errorMessage: string = '';

  constructor(private _lobbyService: LobbyService,
              private router: Router){
            }
  onJoin(isAI = false): void{
    let joinreq = this._lobbyService.join(this.lobby!.id);
    joinreq.subscribe({
      next: l =>{
        if(l.id != undefined)
        {
          if(isAI)
            this.router.navigate(['lobbies',l.id,{ai: 'ai'}]);
          else
            this.router.navigate(['lobbies',l.id]);
        }
      },
      error: (x: HttpErrorResponse) =>{
        let message = 'Error joining:\n';
        if(x.message.includes("Unknown") || x.message.includes('401'))
          message += "You need to authorize to join a lobby \n";
        if(x.error?.messages.length > 0)
          message += x.error.messages.filter((x:string) => !x.toLowerCase().includes("inner")).join(', \n')
        this.showError(message);
      }
    });  
  }
  onDisconnect(): void{
    this._lobbyService.disconnect(this.lobby!.id).subscribe(
      {
        error: (x: HttpErrorResponse)=>{
          let message = 'Error joining:\n';
          if(x.message.includes("Unknown") || x.message.includes('401'))
            message += "You need to authorize to disconnect from a lobby \n";
          if(x.error?.messages.length > 0)
            message += x.error.messages.filter((x:string) => !x.toLowerCase().includes("inner")).join(', \n')
          this.showError(message);
        }
      }
    )
  }
  onClose(): void{
    this._lobbyService.close(this.lobby!.id).subscribe(
      {
        error: (x: HttpErrorResponse)=>{
          let message = 'Error joining:\n';
          if(x.message.includes("Unknown") || x.message.includes('401'))
            message += "Don't have enough access to close a lobby \n";
          if(x.error?.messages.length > 0)
            message += x.error.messages.filter((x:string) => !x.toLowerCase().includes("inner")).join(', \n')
          this.showError(message);
        }
      }
    )
  }
  showError(message: string): void{
    this.errorMessage = message;
    this.errorJoining = true;
    setTimeout(() => this.errorJoining = false, 4000);
  }
  public get lobby():Lobby | undefined{
    return this._lobbyService.selectedLobby;
  }
  public get canJoin(): boolean{
    if(this.lobby!.userIdentities.length > 1)
      return false;
    if(this.joinedLobby?.id != this.lobby?.id)
      return true;
    return false;
  }
  public get canDisconnect(): boolean{
    if(this.lobby!.userIdentities.length < 1)
      return false;
    if(this.joinedLobby?.id == this.lobby?.id)
      return true;
    if(this.joinedLobby?.id != undefined)
      return false;
    return true;
  }
  private get joinedLobby()
  {
     return this._lobbyService.joinedLobby;
  }
}
