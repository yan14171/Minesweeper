import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
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
  public Message: string | undefined = undefined;

  constructor(private loginService: LoginService,
              private router: Router) {
        //check the login status here
   }

  ngOnInit(): void {}
  
  onLogin(form: NgForm)
  {
    this.isLoading = true;
      
    let loginObs = this.loginService
      .login(form.value.email, form.value.password);
    
    loginObs.subscribe({
      next: (res) =>{
        this.isloggedIn = true;
        this.Message = `Succesfully logged in <br>${res.messages[res.messages.length-1]}`;
        setTimeout(() => {
          this.router.navigate(['/minesweeper'])
        }, 1000);
      },
      error: (err) =>{
        this.isloggedIn = false;
        this.Message = err.messages.join('<br>');
        this.isLoading = false;
      },
      complete: () =>{
        form.reset();
        this.isLoading = false;
      }
    });
  }
}
