import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  form!: FormGroup;
  hide = true;

  constructor(private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  login() {
    if (this.form.valid) {
      // TODO: call AuthService to authenticate; for now navigate to recipes
      this.snackBar.open('Sikeres bejelentkezés!', undefined, { duration: 3000 });
      this.router.navigate(['/recipes']);
    } else {
      this.form.markAllAsTouched();
      this.snackBar.open('Kérjük, töltsd ki az összes mezőt!', undefined, { duration: 3000, panelClass: ['snackbar-warn'] });
    }
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }
}
