import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MinesweeperComponent } from './minesweeper/minesweeper.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: 'minesweeper', component: MinesweeperComponent,
    children:[]
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
