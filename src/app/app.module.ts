import { APP_INITIALIZER, InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule, MULTI_PLAYER, SINGLE_PLAYER } from './app-routing.module';
import { AppComponent } from './app.component';
import { MinesweeperComponent } from './minesweeper/minesweeper.component';
import { EndgameComponent } from './endgame/endgame.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { AppConfigService } from './services/app-config.service';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { MinesweeperTwoPieceComponent } from './minesweeper/minesweeper-two-piece.component';
import { BoardService } from './services/board.service';
import { BoardOnlineService } from './services/board-online.service';

export const STATS_URL = new InjectionToken<string>('STATS_URL');
export const LOGIN_URL = new InjectionToken<string>('LOGIN_URL');
export const GAME_HUB_URL = new InjectionToken<string>('GAME_HUB_URL');

@NgModule({
  declarations: [
    AppComponent,
    MinesweeperComponent,
    EndgameComponent,
    HomeComponent,
    LoginComponent,
    MinesweeperTwoPieceComponent
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
       useFactory : (appConfigService : AppConfigService) => {
        return () => appConfigService.loadAppConfig();
       } 
    },
    {
    provide: STATS_URL,
    useValue: "/stats"
    },
    {
      provide: LOGIN_URL,
      useValue: "/auth"
    },
    {
      provide: GAME_HUB_URL,
      useValue: "/game"
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    {
      provide: SINGLE_PLAYER,
      useClass: BoardService
    },
    {
      provide: MULTI_PLAYER,
      useClass: BoardOnlineService
    }],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
