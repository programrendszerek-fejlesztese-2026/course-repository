import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register {
  form: FormGroup;
  hidePassword = true;
  hideConfirm = true;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  register() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, email, password, confirmPassword } = this.form.value;
    if (password !== confirmPassword) {
      this.form.get('confirmPassword')?.setErrors({ mismatch: true });
      return;
    }

    // Call backend to register; server handles uniqueness checks
    this.authService.register({ username, email, password }).subscribe({
      next: () => {
        this.router.navigate(['/recipes']);
      },
      error: (err: any) => {
        if (err?.status === 409) {
          // email (or username) already exists according to server
          this.form.get('email')?.setErrors({ exists: true });
        }
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmVisibility() {
    this.hideConfirm = !this.hideConfirm;
  }
}
