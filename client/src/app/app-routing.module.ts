import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameComponent } from './components/game/game.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { ChatComponent } from './components/chat/chat.component';
// import { EditProfileComponent } from './components/profile-components/edit-profile/edit-profile.component';
import { ProfileComponent } from './components/profile-components/profile/profile.component';
import { CreateProfileComponent } from './components/profile-components/create-edit-profile/create-edit-profile.component';
import { HomeComponent } from './components/home/home.component';
import { ChannelsComponent } from './components/channels/channels.component';
import { EditChannelComponent } from './components/channels/edit-channel/edit-channel.component';
import { SigninComponent } from './components/authentication/signin/signin.component';
import { TokenComponent } from './components/authentication/token/token.component';
import { TwofaComponent } from './components/authentication/twofa/twofa.component';
// import { SigninComponent } from './components/signin/signin.component';
import {ConfirmDeactivateGuard} from './guards/can-deactivate.guard';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game', component: GameComponent, canDeactivate: [ConfirmDeactivateGuard] },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'chat/:channel', component: ChatComponent },
  { path: 'profile/:profile', component: ProfileComponent },
  { path: 'profile', component: ProfileComponent },
  // { path: 'edit-profile', component: EditProfileComponent },
  { path: 'create-profile', component: CreateProfileComponent },
  { path: 'channels', component: ChannelsComponent },
  { path: 'channels/edit/:channel', component: EditChannelComponent },
  { path: 'channels/edit', component: EditChannelComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'signin/token', component: TokenComponent },
  { path: 'signin/2fa', component: TwofaComponent },
  // { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
