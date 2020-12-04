import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userEmail: string;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    this.authService.authState$
      .pipe(untilDestroyed(this))
      .subscribe( (userData) => {
        this.userEmail = userData?.email ?? '';
      });
  }
}
