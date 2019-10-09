import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OldProposalContentService {
  description: string = '';

  constructor() {}

  changeDescription(message: string) {
    this.description = message;
  }

  getDescription(): Observable<string> {
    return of(this.description);
  }
}
