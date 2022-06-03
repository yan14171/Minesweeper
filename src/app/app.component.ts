import { Component } from '@angular/core';
import  Popper from 'popper.js';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private loginService: LoginService) {  }
  public isAuthorized() : boolean{
    return this.loginService.isAuthorized();
  }
  public logout(): void{
    if (confirm("Are you sure you want to log out?"))
      this.loginService.logout();
  }
}
