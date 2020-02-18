import { CustomResource } from './custom-resource';
import { UUID } from 'angular2-uuid';

export class Student extends CustomResource {
  id: UUID;
  name: string;
  phonenumber: string;
  mail: string;
  aboutMe: string;
  studiengang: string;
  schwerpunkt: string;
  status: string;
  qualifikation: string;
  doneProjects: string;
  doneModules: string[];
  doneJobs: string;
  keycloakId: UUID;
}
