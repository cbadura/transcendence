import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { EditProfileComponent } from './components/profile-components/edit-profile/edit-profile.component';
import { GameComponent } from './components/game/game.component';
import { ChatComponent } from './components/chat/chat.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { SortByScorePipe } from './pipes/sort-by-score.pipe';
import { UserDataService } from './services/user-data.service';
import { BodyComponent } from './components/body/body.component';
import { ProfileComponent } from './components/profile-components/profile/profile.component';
import { ProfileInfoComponent } from './components/profile-components/profile-info/profile-info.component';
import { ProfilePicComponent } from './components/profile-components/profile-pic/profile-pic.component';
import { CustomButtonComponent } from './components/shared-components/custom-button/custom-button.component';
import { StatsComponent } from './components/profile-components/stats/stats.component';
import { AchievementComponent } from './components/profile-components/achievement/achievement.component';
import { ThumbnailComponent } from './components/profile-components/thumbnail/thumbnail.component';
import { MatchComponent } from './components/profile-components/match/match.component';
import { MessageComponent } from './components/chat/message/message.component';

const config: SocketIoConfig = { url: 'http://10.19.242.229:3000/chat', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    EditProfileComponent,
    GameComponent,
    ChatComponent,
    LeaderboardComponent,
    UserListComponent,
    SortByScorePipe,
    BodyComponent,
    ProfileComponent,
    ProfileInfoComponent,
    ProfilePicComponent,
    CustomButtonComponent,
    StatsComponent,
    AchievementComponent,
    ThumbnailComponent,
    MatchComponent,
    MessageComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
		AppRoutingModule,
    FormsModule,
    SocketIoModule.forRoot(config)
	],
  providers: [
    UserDataService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
