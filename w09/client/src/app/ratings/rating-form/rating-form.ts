import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { RATINGS } from '../../in-memory/ratings';
import { Rating } from '../../in-memory/models';

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

  constructor(private fb: FormBuilder) {
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
    const newRating: Rating = {
      id: Date.now().toString(),
      userId: '1',
      recipeId: this.recipeId,
      score: score,
      comment: val.comment || '',
      createdAt: new Date(),
    };
    RATINGS.push(newRating);
    this.saved.emit(newRating);
    this.form.reset({ score: 5, comment: '' });
  }
}
