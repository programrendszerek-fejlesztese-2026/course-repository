import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CategoryList } from './category-list/category-list';
import { CategoryForm } from './category-form/category-form';
import { CategoryFilter } from './category-filter/category-filter';

const routes: Routes = [
  { path: '', component: CategoryList },
  { path: 'new', component: CategoryForm },
  { path: ':id/edit', component: CategoryForm },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), CategoryList, CategoryForm, CategoryFilter],
})
export class CategoriesModule {}
