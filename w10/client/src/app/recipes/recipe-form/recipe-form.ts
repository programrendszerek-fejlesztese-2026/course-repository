import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe, Category } from '../../in-memory';
import { RecipeService } from '../../services/recipe.service';
import { CategoryService } from '../../services/category.service';

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
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private categoryService: CategoryService,
    private cd: ChangeDetectorRef
  ) {}

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
    // load categories from server
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
        this.cd.detectChanges();
      },
      error: (err) => console.error('Failed to load categories', err),
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
    this.recipeService.getRecipeById(id).subscribe({
      next: (r) => {
        if (!r) return;
        this.form.patchValue({ title: r.title, description: r.description, categoryId: r.categoryId });
        // clear and set ingredients
        while (this.ingredients.length) {
          this.ingredients.removeAt(0);
        }
        (r.ingredients || []).forEach((ing) => this.addIngredient(ing));
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load recipe', err);
        if (err?.status === 404) this.router.navigate(['/recipes']);
      }
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;
    if (this.isEdit && this.recipeId) {
      this.recipeService.updateRecipe(this.recipeId, v).subscribe({
        next: (updated) => {
          this.router.navigate(['/recipes', updated.id]);
        },
        error: (err) => console.error('Failed to update recipe', err),
      });
      return;
    }

    // create new
    this.recipeService.createRecipe(v).subscribe({
      next: (created) => {
        this.router.navigate(['/recipes', created.id]);
      },
      error: (err) => console.error('Failed to create recipe', err),
    });
  }

  cancel() {
    this.router.navigate(['/recipes']);
  }
}
