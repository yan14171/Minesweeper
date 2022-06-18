import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { BoardState } from '../models/state';
import { AppConfigService } from '../services/app-config.service';
import GameHub from '../services/hubs/gamehub';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
