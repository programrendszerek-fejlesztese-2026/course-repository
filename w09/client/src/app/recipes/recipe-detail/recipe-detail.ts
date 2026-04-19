import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RECIPES, RATINGS, CATEGORIES, Recipe, Rating } from '../../in-memory';
import { IngredientList } from '../ingredient-list/ingredient-list';
import { RatingList } from '../../ratings/rating-list/rating-list';
import { RatingForm } from '../../ratings/rating-form/rating-form';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, IngredientList, RatingList, RatingForm],
  templateUrl: './recipe-detail.html',
  styleUrls: ['./recipe-detail.scss'],
})
export class RecipeDetail implements OnInit {
  recipe?: Recipe;
  ratings: Rating[] = [];
  categoryName?: string;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) {
        this.router.navigate(['/recipes']);
        return;
      }
      this.loadRecipe(id);
    });
  }

  private loadRecipe(id: string) {
    this.recipe = RECIPES.find((r) => r.id === id);
    if (!this.recipe) {
      this.ratings = [];
      this.categoryName = undefined;
      return;
    }
    this.ratings = RATINGS.filter((rt) => rt.recipeId === id);
    const cat = CATEGORIES.find((c) => c.id === this.recipe!.categoryId);
    this.categoryName = cat?.name;
  }

  goBack() {
    this.router.navigate(['/recipes']);
  }

  onRatingSaved(rating: Rating) {
    if (!this.recipe) return;
    if (rating.recipeId === this.recipe.id) {
      this.ratings.push(rating);
    }
  }

  averageScore(): number | null {
    if (!this.ratings || this.ratings.length === 0) return null;
    const sum = this.ratings.reduce((s, r) => s + r.score, 0);
    return Math.round((sum / this.ratings.length) * 10) / 10;
  }
}
