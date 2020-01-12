import { CustomResource } from './custom-resource';

export class Profil extends CustomResource {
  adresse: String;
  strasse: String;
  plz: String;
  raum: String;
  phonenumber: String;
  mail: String;
}
