import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageInfoComponent } from './message-info.component';

describe('MessageInfoComponent', () => {
  let component: MessageInfoComponent;
  let fixture: ComponentFixture<MessageInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessageInfoComponent]
    });
    fixture = TestBed.createComponent(MessageInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
