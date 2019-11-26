import { Injectable } from '@angular/core';
import {
  ExternalConfiguration,
  ExternalConfigurationHandlerInterface
} from 'angular4-hal';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class ExternalConfigurationService
  implements ExternalConfigurationHandlerInterface {
  constructor(private http: HttpClient) {}

  getProxyUri(): string {
    return environment.url;
  }

  getRootUri(): string {
    return environment.url;
  }

  getHttp(): HttpClient {
    return this.http;
  }

  getExternalConfiguration(): ExternalConfiguration {
    return null;
  }

  setExternalConfiguration(externalConfiguration: ExternalConfiguration) {}

  deserialize(): any {}

  serialize(): any {}
}
