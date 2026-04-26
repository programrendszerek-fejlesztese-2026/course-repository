import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Rating } from '../../in-memory/models';
import { RatingService } from '../../services/rating.service';

@Component({
  selector: 'app-rating-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rating-form.html',
  styleUrls: ['./rating-form.scss'],
})
export class RatingForm {
  @Input() recipeId?: string;
  @Output() saved = new EventEmitter<Rating>();

  form!: FormGroup;

  constructor(private fb: FormBuilder, private ratingService: RatingService) {
    this.form = this.fb.group({
      score: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: [''],
    });
  }

  submit() {
    if (!this.recipeId) return;
    if (this.form.invalid) return;
    const val = this.form.value as { score?: number | null; comment?: string | null };
    const score = Number(val.score ?? 0);
    this.ratingService.createRating({ recipeId: this.recipeId, score, comment: val.comment || '' })
      .subscribe({
        next: (created: Rating) => {
          this.saved.emit(created);
          this.form.reset({ score: 5, comment: '' });
        },
        error: (err) => console.error('createRating failed', err)
      });
  }
}
