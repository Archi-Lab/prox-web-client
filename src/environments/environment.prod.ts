import { KeycloakConfig } from 'keycloak-angular';

const keycloakConfig: KeycloakConfig = {
  url: 'https://login.archi-lab.io/auth',
  realm: 'archilab',
  clientId: 'prox-web-client'
};

export const environment = {
  production: true,
  keycloak: keycloakConfig,
  url: 'https://api.ip-ws2019.prox.archi-lab.io'
};
