import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { KeycloakService } from 'keycloak-angular';
import { KeyCloakUser } from './KeyCloakUser';

@Injectable()
export class BearerInterceptor implements HttpInterceptor {
  constructor(private user: KeyCloakUser, private keycloak: KeycloakService) {}

  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.user.isLoggedIn()) {
      return next.handle(req);
    }

    return this.keycloak.addTokenToHeader(req.headers).pipe(
      mergeMap(headersWithBearer => {
        const kcReq = req.clone({ headers: headersWithBearer });
        return next.handle(kcReq);
      })
    );
  }
}
