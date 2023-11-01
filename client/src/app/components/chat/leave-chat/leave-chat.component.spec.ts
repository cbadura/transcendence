import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveChatComponent } from './leave-chat.component';

describe('LeaveChatComponent', () => {
  let component: LeaveChatComponent;
  let fixture: ComponentFixture<LeaveChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveChatComponent]
    });
    fixture = TestBed.createComponent(LeaveChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
