import { UUID } from 'angular2-uuid';
import { Module } from './module.resource';
import { Observable } from 'rxjs';
import { CustomResource } from './custom-resource';

export class Project extends CustomResource {
  id: UUID;
  name: string;
  description: string;
  status: string;
  creatorID: UUID;
  creatorName: string;
  supervisorName: string;

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
