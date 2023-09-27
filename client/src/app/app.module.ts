import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ProfileComponent } from './profile/profile.component';
import { GameComponent } from './game/game.component';
import { ChatComponent } from './chat/chat.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { UserListComponent } from './user-list/user-list.component';
import { SortByScorePipe } from './sort-by-score.pipe';
import { UserDataService } from './user-data.service';



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
		AppRoutingModule,
    FormsModule
	],
  providers: [UserDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
