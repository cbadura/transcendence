import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ProfileComponent } from './profile/profile.component';
import { GameComponent } from './game/game.component';
import { ChatComponent } from './chat/chat.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { UserListComponent } from './user-list/user-list.component';
import { SortByScorePipe } from './sort-by-score.pipe';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProfileComponent,
    GameComponent,
    ChatComponent,
    LeaderboardComponent,
    UserListComponent,
    SortByScorePipe
  ],
  imports: [
    BrowserModule,
		AppRoutingModule
	],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
