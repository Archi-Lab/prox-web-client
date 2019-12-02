import { Injectable, Injector } from '@angular/core';
import { RestService } from 'angular4-hal';
import { Proposal } from '../../shared/hal-resources/proposal.resource';
import { Observable } from 'angular4-hal/node_modules/rxjs';
import { UUID } from 'angular2-uuid';

@Injectable({
  providedIn: 'root'
})
export class ProposalService extends RestService<Proposal> {
  constructor(injector: Injector) {
    super(Proposal, 'proposals', injector);
  }

  findByProjectId(projectId: UUID): Observable<Proposal[]> {
    const options: any = { params: [{ key: 'projectId', value: projectId }] };
    return this.search('findByProjectId', options);
  }

  findByProjectIdAndStudentId(
    projectId: UUID,
    studentId: UUID
  ): Observable<Proposal[]> {
    const options: any = {
      params: [
        { key: 'projectId', value: projectId },
        { key: 'studentId', value: studentId }
      ]
    };
    return this.search('findByProjectIdAndStudentId', options);
  }

  findPublishedProposals(projectId: UUID): Observable<Proposal[]> {
    const options: any = { params: [{ key: 'projectId', value: projectId }] };
    return this.search(
      'findByProjectIdAndSupervisorPermitsPublishIsTrueAndStudentPermitsPublishIsTrue',
      options
    );
  }
}
