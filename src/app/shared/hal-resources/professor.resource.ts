import { CustomResource } from './custom-resource';
import { UUID } from 'angular2-uuid';

export class Professor extends CustomResource {
  id: UUID;
  name: string;
  adresse: string;
  strasse: string;
  plz: string;
  raum: string;
  phonenumber: number;
  mail: string;
  tags: string[];
  title: string;
  sprechzeiten: string;
  bildSrc: string;
  aboutMe: string;
  keycloakId: string;
}
