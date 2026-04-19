import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ingredient } from '../../in-memory/models';

@Component({
  selector: 'app-ingredient-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ingredient-list.html',
  styleUrls: ['./ingredient-list.scss'],
})
export class IngredientList {
  @Input() ingredients: Ingredient[] | null = null;

  trackByName(_: number, item: Ingredient) {
    return item.name + '|' + item.quantity;
  }
}
