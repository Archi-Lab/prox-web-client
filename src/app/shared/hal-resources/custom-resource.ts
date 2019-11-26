import { Resource } from 'angular4-hal';
import { ResourceHelper } from 'angular4-hal';
import { Observable } from 'rxjs';

export class CustomResource extends Resource {
  private createUriListFromResourceArray<T extends Resource>(
    resources: T[]
  ): string {
    let uriList = '';

    for (let i = 0; i < resources.length; i++) {
      if (i !== 0) {
        uriList = uriList.concat('\n');
      }
      uriList = uriList.concat(resources[i]._links.self.href);
    }
    return uriList;
  }

  // Set collection of related resources
  public setRelationArray<T extends Resource>(
    relation: string,
    resources: T[]
  ): Observable<any> {
    const header = ResourceHelper.headers.append(
      'Content-Type',
      'text/uri-list'
    );
    const payload = this.createUriListFromResourceArray(resources);

    return ResourceHelper.getHttp().put(
      ResourceHelper.getProxy(this._links[relation].href),
      payload,
      { headers: header }
    );
  }
}
