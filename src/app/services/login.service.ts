import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { interval, Observable, take, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LOGIN_URL } from '../app.module';
import { AppConfigService } from './app-config.service';

interface LogInResult {
  isSuccess: boolean,
  messages: string[],
  token: string
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginUrl: string;
  private logoutTimeout: any;

  constructor(private httpClient: HttpClient,
    private cookieService: CookieService,
    @Inject(LOGIN_URL) loginURL: string,
    configService: AppConfigService,) {
    this.loginUrl = configService.apiBaseUrl + loginURL;
  }

  public login(email: string,
    password: string): Observable<LogInResult> {
    console.log(this.loginUrl);
    
    let requestObj = {
      email: email,
      password: password
    };

    let obs: Observable<LogInResult> = 
      this.httpClient.post<LogInResult>(this.loginUrl, requestObj)
      .pipe(take(1),
        tap(res => {
          this.cookieService.set('auth_token', res.token, 0.0208333);
          this.logoutTimeout = setTimeout(() => {
            this.logout();
          }, 30 * 60 * 1000);
        }),
        catchError(err => {
          console.log(err);
          return throwError(() => err.error);
        }));
    return obs;
  }

  public logout(): void{
    this.cookieService.delete("auth_token");
    clearTimeout(this.logoutTimeout);
  }

  public isAuthorized(): boolean{
    return this.cookieService.check("auth_token");
  }
}
