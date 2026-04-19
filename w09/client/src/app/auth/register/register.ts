import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { USERS, User } from '../../in-memory';
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

  constructor(private fb: FormBuilder, private router: Router) {
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

    if (USERS.some((u) => u.email === email)) {
      this.form.get('email')?.setErrors({ exists: true });
      return;
    }
    if (USERS.some((u) => u.username === username)) {
      this.form.get('username')?.setErrors({ exists: true });
      return;
    }

    const nextId = String(USERS.reduce((max, u) => Math.max(max, Number(u.id)), 0) + 1);
    const newUser: User = {
      id: nextId,
      username,
      email,
      role: 'user',
      password, // demo: storing plain password client-side only
      createdAt: new Date(),
    };
    USERS.push(newUser);

    // After successful registration, navigate to login
    this.router.navigate(['/auth/login']);
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
