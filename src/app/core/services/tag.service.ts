import { Injectable, Injector } from '@angular/core';
import { Tag } from '@prox/shared/hal-resources';
import { RestService } from 'angular4-hal';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService extends RestService<Tag> {
  constructor(injector: Injector) {
    super(Tag, 'tags', injector);
  }

  findByTagName(
    tagName: string,
    exactMatch: boolean = true
  ): Observable<Tag[]> {
    const options = { params: [{ key: 'tagName', value: tagName }] };
    if (exactMatch) {
      return this.search('findByTagName_TagName', options);
    } else {
      return this.search('findByTagName_TagNameContaining', options);
    }
  }

  getRecommendations(tags: Tag[]): Observable<Tag[]> {
    const tagIds = tags.map(tag => tag.id).join(',');
    const options = { params: [{ key: 'tagIds', value: tagIds }] };
    return this.search('tagRecommendations', options);
  }
}
