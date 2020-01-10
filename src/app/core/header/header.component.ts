import { Component, Input, OnInit } from '@angular/core';
import { KeyCloakUser } from '../../keycloak/KeyCloakUser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input()
  title: string;

  isLoggedIn = false;
  constructor(protected user: KeyCloakUser) {
    user.onUserChanged.subscribe(() => {
      this.onUserChanged();
    });
  }

  ngOnInit() {
    this.onUserChanged();
  }

  private onUserChanged() {
    this.isLoggedIn = this.user.isLoggedIn();
  }
}
