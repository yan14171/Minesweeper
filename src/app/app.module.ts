import { APP_INITIALIZER, InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MinesweeperComponent } from './minesweeper/minesweeper.component';
import { EndgameComponent } from './endgame/endgame.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { AppConfigService } from './services/app-config.service';

export const STATS_URL = new InjectionToken<string>('STATS_URL');

@NgModule({
  declarations: [
    AppComponent,
    MinesweeperComponent,
    EndgameComponent,
    HomeComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    { 
      provide : APP_INITIALIZER, 
      multi : true, 
       deps : [AppConfigService], 
       useFactory : (appConfigService : AppConfigService) =>  () => appConfigService.loadAppConfig()
    },
    {
    provide: STATS_URL,
    useValue: "/stats"
  }],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
