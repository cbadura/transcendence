import { Component, Input } from '@angular/core';
import { Achievement } from 'src/app/shared/achievement';

@Component({
  selector: 'tcd-achievement',
  templateUrl: './achievement.component.html'
})
export class AchievementComponent {
  @Input() achievement: Achievement = { name: '', url: '' }; 

}