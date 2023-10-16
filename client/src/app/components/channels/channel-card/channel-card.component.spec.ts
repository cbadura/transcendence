import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelCardComponent } from './channel-card.component';

describe('ChannelCardComponent', () => {
  let component: ChannelCardComponent;
  let fixture: ComponentFixture<ChannelCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChannelCardComponent]
    });
    fixture = TestBed.createComponent(ChannelCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
