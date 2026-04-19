import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', redirectTo: 'auth/login', pathMatch: 'full' },
	{
		path: 'recipes',
		loadChildren: () => import('./recipes/recipes-module').then(m => m.RecipesModule),
	},
	{
		path: 'auth',
		loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule),
	},
	{
		path: 'categories',
		loadChildren: () => import('./categories/categories-module').then(m => m.CategoriesModule),
	},
	{
		path: 'admin',
		loadChildren: () => import('./admin/admin-module').then(m => m.AdminModule),
	},
	{
		path: 'profile',
		loadChildren: () => import('./user/user-module').then(m => m.UserModule),
	},
	{ path: '**', redirectTo: 'auth/login' },
];
