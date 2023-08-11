import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditChannelComponent } from './edit-channel.component';

describe('EditChannelComponent', () => {
  let component: EditChannelComponent;
  let fixture: ComponentFixture<EditChannelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditChannelComponent]
    });
    fixture = TestBed.createComponent(EditChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
