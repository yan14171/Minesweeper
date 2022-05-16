import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private cookieService: CookieService) {
  }
  public isAuthorized() : boolean{
    return this.cookieService.check("auth_token");
  }
  public logOut(): void{
    if (confirm("Are you sure you want to log out?"))
      this.cookieService.delete("auth_token");
  }
}
