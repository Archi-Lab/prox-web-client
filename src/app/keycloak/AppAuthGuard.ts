import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { KeycloakService, KeycloakAuthGuard } from 'keycloak-angular';

@Injectable()
export class AppAuthGuard extends KeycloakAuthGuard {
  constructor(
    protected router: Router,
    protected keycloakAngular: KeycloakService
  ) {
    super(router, keycloakAngular);
  }

  isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        if (route.data.roles == null) {
          resolve(true);
          return;
        }

        if (!this.authenticated) {
          await this.keycloakAngular.login();
        }

        for (const requiredRole of route.data.roles) {
          if (this.keycloakAngular.isUserInRole(requiredRole)) {
            resolve(true);
            return;
          }
        }
      } catch (e) {
        console.log('isAccessAllowed error');
      }
    });
  }
}
