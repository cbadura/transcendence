import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ProfileComponent } from './profile/profile.component';
import { GameComponent } from './game/game.component';
import { ChatComponent } from './chat/chat.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { UserListComponent } from './user-list/user-list.component';
import { SortByScorePipe } from './sort-by-score.pipe';
import { UserDataService } from './user-data.service';
import { BodyComponent } from './body/body.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProfileComponent,
    GameComponent,
    ChatComponent,
    LeaderboardComponent,
    UserListComponent,
    SortByScorePipe,
    BodyComponent
  ],
  imports: [
    BrowserModule,
		AppRoutingModule,
    FormsModule
	],
  providers: [
    UserDataService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
