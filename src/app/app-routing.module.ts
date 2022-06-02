import { InjectionToken, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MinesweeperTwoPieceComponent } from './minesweeper/minesweeper-two-piece.component';
import { MinesweeperComponent } from './minesweeper/minesweeper.component';
import { AuthGuard } from './services/auth.guard';

export const SINGLE_PLAYER = new InjectionToken<string>('BoardService');
export const MULTI_PLAYER = new InjectionToken<string>('BoardOnlineService');

const routes: Routes = [
  {
    path: 'minesweeper', component: MinesweeperComponent,
    data: { gamemode: SINGLE_PLAYER },
    children:[]
  },
  {
    path: 'minesweeper/twopiece', component: MinesweeperTwoPieceComponent,
    data: { gamemode: MULTI_PLAYER },
  },
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'login', component: LoginComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '', pathMatch: 'full', redirectTo: '/home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
