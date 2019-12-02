import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArchivedProposalsContentService {
  description = '';

  constructor() {}

  changeDescription(message: string) {
    this.description = message;
  }

  getDescription(): Observable<string> {
    return of(this.description);
  }
}
