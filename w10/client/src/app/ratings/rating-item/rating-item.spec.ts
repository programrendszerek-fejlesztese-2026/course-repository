import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingItem } from './rating-item';

describe('RatingItem', () => {
  let component: RatingItem;
  let fixture: ComponentFixture<RatingItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingItem],
    }).compileComponents();

    fixture = TestBed.createComponent(RatingItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
