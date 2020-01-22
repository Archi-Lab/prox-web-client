import { CustomResource } from './custom-resource';

export class Student extends CustomResource {
  name: String;
  phonenumber: String;
  mail: String;
  tags: String[];
  aboutMe: String;
  studiengang: String;
  schwerpunkt: String;
  semester: string;
  status: string;
  qualifikation: string;
  doneProjects: string;
  doneModules: string;
  doneJobs: string;
}
