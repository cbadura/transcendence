import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameComponent } from './game/game.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { ChatComponent } from './chat/chat.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: 'game', component: GameComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'profile', component: ProfileComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
