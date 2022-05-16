import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, Observable, take, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface LogInResult{
  isSuccess: boolean,
  errorMessage: string,
  token: string
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  constructor(private httpClient: HttpClient) { }

  public login(email: string,
               password: string) : Observable<LogInResult>{
    let obs: Observable<LogInResult> = interval(1000)
    .pipe(take(1),
          map(_ => 
            {
              return {
              isSuccess: true,
              errorMessage: '',
              token: 'NNNNNNNNN'}
            }),
          catchError(_ =>
            {
               let errResult: LogInResult ={
                isSuccess: false,
                errorMessage: 'Error',
                token: ''}
                return throwError(() => errResult);
            }));
    return obs;
  }
}
