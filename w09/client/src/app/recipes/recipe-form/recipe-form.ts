import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RECIPES, CATEGORIES, Recipe } from '../../in-memory';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-form.html',
  styleUrls: ['./recipe-form.scss'],
})
export class RecipeForm implements OnInit {
  form!: FormGroup;
  isEdit = false;
  recipeId?: string;
  categories = CATEGORIES;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      categoryId: ['', Validators.required],
      ingredients: this.fb.array([]),
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEdit = true;
        this.recipeId = id;
        this.loadRecipe(id);
      } else {
        // start with one empty ingredient row
        this.addIngredient();
      }
    });
  }

  get ingredients(): FormArray {
    return this.form.get('ingredients') as FormArray;
  }

  addIngredient(value?: { name: string; quantity: string }) {
    this.ingredients.push(
      this.fb.group({
        quantity: [value?.quantity ?? '', Validators.required],
        name: [value?.name ?? '', Validators.required],
      })
    );
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
    if (this.ingredients.length === 0) this.addIngredient();
  }

  private loadRecipe(id: string) {
    const r = RECIPES.find((x) => x.id === id);
    if (!r) return;
    this.form.patchValue({ title: r.title, description: r.description, categoryId: r.categoryId });
    // clear and set ingredients
    while (this.ingredients.length) {
      this.ingredients.removeAt(0);
    }
    r.ingredients.forEach((ing) => this.addIngredient(ing));
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;
    if (this.isEdit && this.recipeId) {
      const idx = RECIPES.findIndex((r) => r.id === this.recipeId);
      if (idx !== -1) {
        RECIPES[idx] = {
          ...RECIPES[idx],
          title: v.title,
          description: v.description,
          categoryId: v.categoryId,
          ingredients: v.ingredients,
        } as Recipe;
        this.router.navigate(['/recipes', this.recipeId]);
        return;
      }
    }

    // create new
    const nextId = String(RECIPES.reduce((max, r) => Math.max(max, Number(r.id)), 0) + 1);
    const newRecipe: Recipe = {
      id: nextId,
      title: v.title,
      description: v.description,
      categoryId: v.categoryId,
      ingredients: v.ingredients,
      createdBy: '1',
      createdAt: new Date(),
    };
    RECIPES.push(newRecipe);
    this.router.navigate(['/recipes', nextId]);
  }

  cancel() {
    this.router.navigate(['/recipes']);
  }
}
