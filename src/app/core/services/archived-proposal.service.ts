import { Injectable, Injector } from '@angular/core';
import { RestService } from 'angular4-hal';
import { Proposal } from '../../shared/hal-resources/proposal-resource';
import { ArchivedProposal } from '../../shared/hal-resources/archived-proposal.resource';
import { Observable } from 'rxjs';
import { UUID } from 'angular2-uuid';

@Injectable({
  providedIn: 'root'
})
export class ArchivedProposalService extends RestService<ArchivedProposal> {
  constructor(injector: Injector) {
    super(ArchivedProposal, 'archivedProposals', injector);
  }

  findByProjectIdAndStudentIdOrderByVersionAsc(
    projectId: string,
    studentId: string
  ): Observable<ArchivedProposal[]> {
    let options: any = {
      params: [{ key: 'projectId', value: projectId }, { key: 'studentId', value: studentId }]
    };
    return this.search('findByProjectIdAndStudentIdOrderByVersionAsc', options);
  }
}
