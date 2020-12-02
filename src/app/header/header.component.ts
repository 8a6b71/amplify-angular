import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isSignedIn = false;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly ref: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.listenAuthState();
  }

  private listenAuthState(): void {
    this.authService.loggedIn
      .pipe(untilDestroyed(this))
      .subscribe( (isSignedIn) => {
        this.isSignedIn = isSignedIn;
        this.ref.detectChanges();
      });
  }
}
