import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { CookedRawString } from "@angular/compiler/src/output/output_ast";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private cookieService: CookieService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler)
        : Observable<HttpEvent<any>> {
        const accessToken: string = this.cookieService.get("auth_token");
        // set global application headers.
        req = req.clone({
            setHeaders: {
                'Content-Type': 'application/json; charset=utf-8',
                Accept: 'application/json',
                'X-AppName': 'minesweeper_',
                'X-Locale': 'en'
            }
        });
        // Set headers for requests that require authorization.
        if (accessToken) {
            const authenticatedRequest = req.clone({
                headers: req.headers.set(
                    'Authorization',
                    `bearer ${accessToken}`
                )
            });
            // Request with authorization headers
            return next.handle(authenticatedRequest);
        } else {
            // Request without authorization header
            return next.handle(req);
        }
    }
}
