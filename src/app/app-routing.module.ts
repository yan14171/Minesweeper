import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MinesweeperComponent } from './minesweeper/minesweeper.component';

const routes: Routes = [
  {
    path: 'minesweeper', component: MinesweeperComponent,
    children:[]
  },
  {
    path: 'home', component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
