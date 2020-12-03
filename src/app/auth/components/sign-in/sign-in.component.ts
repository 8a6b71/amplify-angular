import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  form: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  isSubmitInProcess = false;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  async signIn(): Promise<void> {
    if (this.form.valid) {
      try {
        this.isSubmitInProcess = true;
        const {username, password} = this.form.value;
        await this.authService.signIn(username, password);
        this.router.navigate(['/']);
      } catch (error) {
        this.openSnackBar(error.message);
      }
      this.isSubmitInProcess = false;
    }
  }

  getSubmitButtonText(): string {
    return this.isSubmitInProcess ? 'Signing...' : 'Sign In';
  }

  private openSnackBar(message: string): void {
    this.snackBar.open(message, 'Undo', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  private initForm(): void {
    this.form = new FormGroup({
      username : new FormControl('', [
        Validators.required,
      ]),
      password: new FormControl('', [Validators.required]),
    });
  }
}
