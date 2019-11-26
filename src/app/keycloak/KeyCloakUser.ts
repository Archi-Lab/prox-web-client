import { EventEmitter, Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable()
export class KeyCloakUser {
  onUserChanged = new EventEmitter();

  private id = '';
  private loggedIn = false;
  private username = '';
  private fullname = '';
  private roles: string[] = [];

  constructor(protected keycloakAngular: KeycloakService) {
    this.Load();
  }

  public async Load() {
    this.loggedIn = await this.keycloakAngular.isLoggedIn();

    if (this.loggedIn) {
      this.roles = await this.keycloakAngular.getUserRoles(true);

      const keycloak = await this.keycloakAngular.getKeycloakInstance();

      keycloak
        .loadUserInfo()
        .success(userInfo => {
          this.id = userInfo['sub'];
          this.username = userInfo['preferred_username'];
          this.fullname = userInfo['name'];

          this.onUserChanged.emit();
        })
        .error(() => {
          this.Reset();
        });
    } else {
      this.Reset();
    }
  }

  private Reset() {
    this.id = '';
    this.username = '';
    this.fullname = '';
    this.roles = [];

    this.loggedIn = false;

    this.onUserChanged.emit();
  }

  public isLoggedIn(): boolean {
    return this.loggedIn;
  }
  public getUserName(): string {
    return this.username;
  }

  public getFullName(): string {
    return this.fullname;
  }

  public getID(): string {
    return this.id;
  }

  public hasRole(role: string): boolean {
    for (const i in this.roles) {
      if (this.roles[i].toUpperCase() === role.toUpperCase()) {
        return true;
      }
    }
    return false;
  }

  public async login() {
    await this.loginRedirect(window.location.href);
  }

  public async loginRedirect(uri: string) {
    await this.keycloakAngular.login({
      redirectUri: uri
    });
    await this.Load();
  }

  public async logout() {
    await this.keycloakAngular.logout(window.location.href);
    await this.Load();
  }
}
