import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinsLossesComponent } from './wins-losses.component';

describe('WinsLossesComponent', () => {
  let component: WinsLossesComponent;
  let fixture: ComponentFixture<WinsLossesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WinsLossesComponent]
    });
    fixture = TestBed.createComponent(WinsLossesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
