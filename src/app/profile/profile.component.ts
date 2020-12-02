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
  user: string;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.listenAuthUserState();
  }

  private listenAuthUserState(): void {
    this.authService.authState
      .pipe(untilDestroyed(this))
      .subscribe( (state) => {
        this.user = state.email;
      });
  }
}
