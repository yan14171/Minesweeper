import { Component, Input, OnInit } from '@angular/core';
import { Lobby } from 'src/app/models/lobby';

@Component({
  selector: 'app-lobby-item',
  templateUrl: './lobby-item.component.html',
  styleUrls: ['./lobby-item.component.css']
})
export class LobbyItemComponent implements OnInit {
  @Input() lobby: Lobby;
  constructor() {
    this.lobby = {id: 1, userIdentities: [], isStarted: false};
   }

  ngOnInit(): void {
  }

}
