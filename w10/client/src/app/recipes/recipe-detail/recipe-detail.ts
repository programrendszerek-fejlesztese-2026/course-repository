import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Recipe, Rating } from '../../in-memory';
import { IngredientList } from '../ingredient-list/ingredient-list';
import { RatingList } from '../../ratings/rating-list/rating-list';
import { RatingForm } from '../../ratings/rating-form/rating-form';
import { RecipeService } from '../../services/recipe.service';
import { RatingService } from '../../services/rating.service';
import { CategoryService } from '../../services/category.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private ratingService: RatingService,
    private categoryService: CategoryService,
    private cd: ChangeDetectorRef
  ) {}

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
    this.recipeService.getRecipeById(id).subscribe({
      next: (r) => {
        this.recipe = r;
        console.log(this.recipe);
        this.cd.detectChanges();
        // load ratings for this recipe
        this.ratingService.getRatingsByRecipe(id).subscribe({
          next: (rs) => {
            this.ratings = rs;
            this.cd.detectChanges();
          },
          error: (err) => console.error('Failed to load ratings', err),
        });

        // load category name
        if (this.recipe && this.recipe.categoryId) {
          this.categoryService.getCategoryById(this.recipe.categoryId).subscribe({
            next: (c) => {
              this.categoryName = c?.name;
              this.cd.detectChanges();
            },
            error: (err) => console.error('Failed to load category', err),
          });
        } else {
          this.categoryName = undefined;
        }
      },
      error: (err: any) => {
        if (err?.status === 404) {
          this.router.navigate(['/recipes']);
        } else {
          console.error('Failed to load recipe', err);
        }
      }
    });
  }

  goBack() {
    this.router.navigate(['/recipes']);
  }

  onRatingSaved(rating: Rating) {
    if (!this.recipe) return;
    // refresh ratings from server to ensure consistency
    this.ratingService.getRatingsByRecipe(this.recipe.id).subscribe({
      next: (rs) => {
        this.ratings = rs;
        this.cd.detectChanges();
      },
      error: (err) => console.error('Failed to refresh ratings', err),
    });
  }

  averageScore(): number | null {
    if (!this.ratings || this.ratings.length === 0) return null;
    const sum = this.ratings.reduce((s, r) => s + r.score, 0);
    return Math.round((sum / this.ratings.length) * 10) / 10;
  }
}
