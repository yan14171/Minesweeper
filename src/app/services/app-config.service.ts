import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private appConfig: any;
  private http : HttpClient;
  
  constructor(http: HttpClient) {
	this.http = http;
  }
  loadAppConfig() {
    return this.http.get('/assets/config/app-settings.json')
      .toPromise()
      .then(config => {
        this.appConfig = config;
      });
  }
  get apiBaseUrl() : string {
    if(environment.production)
      return this.appConfig.apiBaseUrl;
    else 
      return this.appConfig.apiBaseUrl_local;
  }
}