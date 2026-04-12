import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { RecipeManagement } from './recipe-management/recipe-management';
import { CategoryManagement } from './category-management/category-management';
import { RatingModeration } from './rating-moderation/rating-moderation';

const routes: Routes = [
  { path: '', component: AdminDashboard },
  { path: 'recipes', component: RecipeManagement },
  { path: 'categories', component: CategoryManagement },
  { path: 'ratings', component: RatingModeration },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), AdminDashboard, RecipeManagement, CategoryManagement, RatingModeration],
})
export class AdminModule {}
