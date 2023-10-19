import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Channel } from 'src/app/shared/chat/Channel';

@Component({
  selector: 'tcd-chat-header',
  templateUrl: './chat-header.component.html',
})
export class ChatHeaderComponent implements OnInit {
  channel!: Channel;

  constructor(
    private route: ActivatedRoute,
    ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log('PARAMS', params)
      const { channel, ...rest } = params;
      this.channel = rest as Channel;
    });
  }
}
