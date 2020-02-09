import { Component, OnInit } from '@angular/core';
import { KeyCloakUser } from '../../keycloak/KeyCloakUser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  username = '';
  isLoggedIn = false;

  constructor(protected user: KeyCloakUser, private router: Router) {
    user.onUserChanged.subscribe(() => {
      this.onUserChanged();
    });
  }
  ngOnInit(): void {
    this.onUserChanged();
  }

  private onUserChanged() {
    this.isLoggedIn = this.user.isLoggedIn();

    if (this.isLoggedIn) {
      this.username = this.user.getFullName();
    } else {
      this.username = '';
    }
  }

  async login() {
    await this.user.login();
  }

  async logout() {
    await this.user.logout();
  }

  goToProfile() {
    this.router.navigateByUrl('/user-profile');
  }
}
