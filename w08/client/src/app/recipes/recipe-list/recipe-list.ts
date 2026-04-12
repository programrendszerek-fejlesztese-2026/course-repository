import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { RECIPES, CATEGORIES, Recipe } from '../../in-memory';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipe-list.html',
  styleUrls: ['./recipe-list.scss'],
})
export class RecipeList {
  recipes: Recipe[] = RECIPES;

  // category id -> category map for quick lookup
  categoryMap = new Map(CATEGORIES.map((c) => [c.id, c]));

  constructor(private router: Router) {}

  trackById(_: number, item: Recipe) {
    return item.id;
  }

  logout() {
    this.router.navigate(['/auth/login']);
  }
}
