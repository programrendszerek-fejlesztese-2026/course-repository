import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingModeration } from './rating-moderation';

describe('RatingModeration', () => {
  let component: RatingModeration;
  let fixture: ComponentFixture<RatingModeration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingModeration],
    }).compileComponents();

    fixture = TestBed.createComponent(RatingModeration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
