import { Injectable, Injector } from '@angular/core';
import { RestService } from 'angular4-hal';
import { Profil } from '../../shared/hal-resources/profile.resource';
import { Project } from '../../shared/hal-resources/project.resource';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends RestService<Profil> {
  constructor(injector: Injector) {
    super(Profil, 'profils', injector);
  }
}
