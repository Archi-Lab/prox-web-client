import { CustomResource } from './custom-resource';
import { UUID } from 'angular2-uuid';
import { Module } from './module.resource';
import { Observable } from 'rxjs';

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
  modules: Module[];
  doneJobs: string;
  keycloakId: UUID;
  bildSrc: string;

  setModules(newModules: Module[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.setRelationArray('modules', newModules).subscribe(
        () => {},
        error => reject(error),
        () => resolve()
      );
    });
  }

  getModules(): Observable<Module[]> {
    return this.getRelationArray(Module, 'modules');
  }
}
