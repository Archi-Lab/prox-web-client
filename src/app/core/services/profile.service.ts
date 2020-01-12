import { Injectable } from '@angular/core';
import { RestService } from 'angular4-hal';
import { Profil } from '../../shared/hal-resources/profile.resource';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends RestService<Profil> {}
