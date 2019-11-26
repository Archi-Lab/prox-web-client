import { Module } from './module.resource';
import { Observable } from 'angular4-hal/node_modules/rxjs';
import { CustomResource } from './custom-resource';
import { UUID } from 'angular2-uuid';

export class StudyCourse extends CustomResource {
  id: UUID;
  name: string;
  academicDegree: string;
  modules: Module[];

  getStudyDirections(): Observable<StudyCourse[]> {
    return this.getRelationArray(StudyCourse, 'studyDirections');
  }

  getModules(): Observable<Module[]> {
    // THIS DOES NOT WORK
    // There is a bug that appends a slash between the URL and the params
    // when you call getRelationArray with HalOptions
    // let options: HalOptions = {sort: [{path: 'name', order: 'ASC'}]};
    // return this.getRelationArray(Module, 'modules', undefined, options);
    return this.getRelationArray(Module, 'modules');
  }

  getAndSetModuleArray(): Promise<Module[]> {
    return new Promise<Module[]>((resolve, reject) => {
      this.getModules().subscribe(
        tmpModules => (this.modules = tmpModules),
        () => reject(),
        () => {
          this.modules.sort((a, b) => {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          });
          resolve(this.modules);
        }
      );
    });
  }

  getParentStudyCourse(): Observable<StudyCourse> {
    return this.getRelation(StudyCourse, 'parentStudyCourse');
  }
}
