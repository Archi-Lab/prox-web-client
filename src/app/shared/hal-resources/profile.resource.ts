import { CustomResource } from './custom-resource';

export class Profil extends CustomResource {
  name: String;
  adresse: String;
  strasse: String;
  plz: String;
  raum: String;
  phonenumber: String;
  mail: String;
  tags: String[];
  aboutMe: String;
}
