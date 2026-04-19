import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Rating } from '../../in-memory/models';
import { RatingItem } from '../rating-item/rating-item';

@Component({
  selector: 'app-rating-list',
  standalone: true,
  imports: [CommonModule, RatingItem],
  templateUrl: './rating-list.html',
  styleUrls: ['./rating-list.scss'],
})
export class RatingList {
  @Input() ratings: Rating[] = [];

  trackById(_: number, item: Rating) {
    return item.id;
  }
}
