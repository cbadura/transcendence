import { Component, Input } from '@angular/core';

@Component({
  selector: 'tcd-game-mode',
  templateUrl: './game-mode.component.html'
})
export class GameModeComponent {
	@Input() mode!: string;
	@Input() darkerColor!: string;
	@Input() highLightColor!: string;


}
