import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateTwofaComponent } from './activate-twofa.component';

describe('ActivateTwofaComponent', () => {
  let component: ActivateTwofaComponent;
  let fixture: ComponentFixture<ActivateTwofaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivateTwofaComponent]
    });
    fixture = TestBed.createComponent(ActivateTwofaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
