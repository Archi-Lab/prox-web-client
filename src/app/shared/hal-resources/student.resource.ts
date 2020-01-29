import { CustomResource } from './custom-resource';
import { UUID } from 'angular2-uuid';

export class Student extends CustomResource {
  name: string;
  phonenumber: number;
  mail: string;
  tags: string[];
  aboutMe: string;
  studiengang: string;
  schwerpunkt: string;
  semester: string;
  status: string;
  qualifikation: string;
  doneProjects: string;
  doneModules: string;
  doneJobs: string;
  keycloakId: UUID;
}
