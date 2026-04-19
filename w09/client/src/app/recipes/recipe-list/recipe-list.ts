import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';
import { RECIPES, CATEGORIES, Recipe } from '../../in-memory';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatChipsModule, MatButtonModule, MatDialogModule, ConfirmDialog],
  templateUrl: './recipe-list.html',
  styleUrls: ['./recipe-list.scss'],
})
export class RecipeList {
  recipes: Recipe[] = RECIPES;

  // category id -> category map for quick lookup
  categoryMap = new Map(CATEGORIES.map((c) => [c.id, c]));

  constructor(private router: Router, private dialog: MatDialog) {}

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
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
