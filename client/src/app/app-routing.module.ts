import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameComponent } from './components/game/game.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { ChatComponent } from './components/chat/chat.component';
// import { EditProfileComponent } from './components/profile-components/edit-profile/edit-profile.component';
import { ProfileComponent } from './components/profile-components/profile/profile.component';
import { CreateProfileComponent } from './components/profile-components/create-profile/create-profile.component';
import { HomeComponent } from './components/home/home.component';
import { ChannelsComponent } from './components/channels/channels.component';
import { EditChannelComponent } from './components/channels/edit-channel/edit-channel.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game', component: GameComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'profile', component: ProfileComponent },
  // { path: 'edit-profile', component: EditProfileComponent },
  { path: 'create-profile', component: CreateProfileComponent },
  { path: 'channels', component: ChannelsComponent },
  { path: 'channels/edit/:channel', component: EditChannelComponent },
  { path: 'channels/edit', component: EditChannelComponent },
  // { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
