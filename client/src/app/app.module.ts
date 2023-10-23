import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Socket, SocketIoConfig } from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
// import { EditProfileComponent } from './components/profile-components/edit-profile/edit-profile.component';
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
import { MessageBubbleComponent } from './components/chat/message-bubble/message-bubble.component';
import { MessageInfoComponent } from './components/chat/message-info/message-info.component';

import { NgIconsModule } from '@ng-icons/core';
import { featherSettings, featherSend, featherUser, featherUsers, featherPlusSquare, featherX } from '@ng-icons/feather-icons';
import { ChatHeaderComponent } from './components/chat/chat-header/chat-header.component';
import { ChatInputComponent } from './components/chat/chat-input/chat-input.component';
import { ChatBtnComponent } from './components/chat/chat-btn/chat-btn.component';
import { HomeComponent } from './components/home/home.component';
import { ChatSocketModule } from './chat-socket/chat-socket.module';
// import { GameSocketModule } from './game-socket/game-socket.module'; //doesnt exist anymore?
import { CreateProfileComponent } from './components/profile-components/create-edit-profile/create-edit-profile.component';
import { ChannelsComponent } from './components/channels/channels.component';
import { ChannelCardComponent } from './components/channels/channel-card/channel-card.component';
import { EditChannelComponent } from './components/channels/edit-channel/edit-channel.component';
import { ProfileCardComponent } from './components/profile-components/profile-card/profile-card.component';
import { SigninComponent } from './components/authentication/signin/signin.component';
import { UserSearchComponent } from './components/shared-components/user-search/user-search.component';
import { GameModeComponent } from './components/game/game-mode/game-mode.component';
import { TokenComponent } from './components/authentication/token/token/token.component';

const chatConfig: SocketIoConfig = { url: 'http://localhost:3000/chat', options: {} };
// const gameConfig: SocketIoConfig = { url: 'http://localhost:3000/game?userId=1', options: {} };


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    // EditProfileComponent,
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
    MessageBubbleComponent,
    MessageInfoComponent,
    ChatHeaderComponent,
    ChatInputComponent,
    ChatBtnComponent,
    HomeComponent,
    CreateProfileComponent,
    ChannelsComponent,
    ChannelCardComponent,
    EditChannelComponent,
    ProfileCardComponent,
    SigninComponent,
		UserSearchComponent,
		GameModeComponent,
  TokenComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
		AppRoutingModule,
    FormsModule,
    ChatSocketModule,
    NgIconsModule.withIcons({ featherSettings, featherSend, featherUser, featherUsers, featherPlusSquare, featherX }),
  ],
  providers: [
    UserDataService,
    DatePipe,
    // { provide: 'gameSocket', useFactory: (config: SocketIoConfig) => new Socket(gameConfig) },
    { provide: 'chatSocket', useFactory: (config: SocketIoConfig) => new Socket(chatConfig) }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
