import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public isloggedIn: boolean = false;
  public isLoading: boolean = false;
  public errorMessage: string | undefined = undefined;

  constructor(private loginService: LoginService,
              private cookieService: CookieService) {
        //check the login status here
   }

  ngOnInit(): void {}
  
  onLogin(form: NgForm)
  {
    console.log(form.value);
    console.log(form.valid);
      form.reset();
    this.isLoading = true;
      
    let loginObs = this.loginService
      .login(form.value.email, form.value.password);

    loginObs.subscribe({
      next: (res) =>{
        this.isLoading = false;
        this.isloggedIn = true;
        this.errorMessage = undefined;
        this.cookieService.set('auth_token', res.token);
        alert(`Logged in`);
      },
      error: (err) =>{
        this.isLoading = false;
        this.isloggedIn = false;
        this.errorMessage = err.errorMessage;
      }
    });
  }
}
