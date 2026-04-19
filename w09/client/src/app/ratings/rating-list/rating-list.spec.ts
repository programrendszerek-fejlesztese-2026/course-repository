import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingList } from './rating-list';

describe('RatingList', () => {
  let component: RatingList;
  let fixture: ComponentFixture<RatingList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingList],
    }).compileComponents();

    fixture = TestBed.createComponent(RatingList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
