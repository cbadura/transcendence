import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameModeComponent } from './game-mode.component';

describe('GameModeComponent', () => {
  let component: GameModeComponent;
  let fixture: ComponentFixture<GameModeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameModeComponent]
    });
    fixture = TestBed.createComponent(GameModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
