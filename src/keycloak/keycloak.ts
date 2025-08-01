import Keycloak from 'keycloak-js';

export const keycloak = new Keycloak({
  url: 'http://localhost:8085/',
  realm: 'loyalty',
  clientId: 'loyalty-portal'
});

