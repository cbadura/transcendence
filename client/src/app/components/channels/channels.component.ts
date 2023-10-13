import { Component } from '@angular/core';

@Component({
  selector: 'tcd-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent {
  pages = ['My channels', 'DMs', 'Public', 'Private', 'Protected'];
}
