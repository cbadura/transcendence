import { Component, Input } from '@angular/core';
import { Achievement } from 'src/app/shared/interfaces/achievement';

@Component({
  selector: 'tcd-achievement',
  templateUrl: './achievement.component.html',
  styleUrls: ['./achievement.component.css']
})
export class AchievementComponent {
  @Input() achievement!: Achievement;

}
