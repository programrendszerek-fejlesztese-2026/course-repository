import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';
import { Recipe, Category } from '../../in-memory';
import { RecipeService } from '../../services/recipe.service';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatChipsModule, MatButtonModule, MatDialogModule, ConfirmDialog],
  templateUrl: './recipe-list.html',
  styleUrls: ['./recipe-list.scss'],
})
export class RecipeList implements OnInit {
  recipes: Recipe[] = [];

  // category id -> category map for quick lookup
  categoryMap = new Map<string, Category>();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private recipeService: RecipeService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.recipeService.getRecipes().subscribe({
      next: (rs) => {
        this.recipes = rs;
        this.cd.detectChanges();
      },
      error: (err) => console.error('Failed to load recipes', err),
    });

    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        this.categoryMap = new Map(cats.map((c) => [c.id, c]));
        this.cd.detectChanges();
      },
      error: (err) => console.error('Failed to load categories', err),
    });
  }

  trackById(_: number, item: Recipe) {
    return item.id;
  }

  logout() {
    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Kijelentkezés',
        message: 'Biztosan ki szeretnél jelentkezni?',
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
