import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Rating } from '../../in-memory/models';

@Component({
  selector: 'app-rating-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating-item.html',
  styleUrls: ['./rating-item.scss'],
})
export class RatingItem {
  @Input() rating?: Rating;
}
