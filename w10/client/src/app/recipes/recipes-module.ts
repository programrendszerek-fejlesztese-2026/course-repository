import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';

import { RecipeList } from './recipe-list/recipe-list';
import { RecipeDetail } from './recipe-detail/recipe-detail';
import { RecipeForm } from './recipe-form/recipe-form';
import { IngredientList } from './ingredient-list/ingredient-list';
import { RecipeSearch } from './recipe-search/recipe-search';
import { RatingForm } from '../ratings/rating-form/rating-form';
import { RatingList } from '../ratings/rating-list/rating-list';
import { RatingItem } from '../ratings/rating-item/rating-item';

const routes: Routes = [
  { path: '', component: RecipeList },
  { path: 'new', component: RecipeForm },
  { path: ':id', component: RecipeDetail },
  { path: ':id/edit', component: RecipeForm },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    RecipeList,
    RecipeDetail,
    RecipeForm,
    IngredientList,
    RecipeSearch,
    RatingForm,
    RatingList,
    RatingItem,
  ],
})
export class RecipesModule {}
