import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  Bookmark,
  CapturedBookmark,
  QueryBookmarks,
  QueryBookmarksResolved,
} from '../../shared/bookmark';
import { listen, send } from '../../shared/messenger';

@Injectable({ providedIn: 'root' })
export class BookmarkService {
  search(query: string): Observable<(Bookmark | CapturedBookmark)[]> {
    requestAnimationFrame(() => send(QueryBookmarks, query));
    return listen(QueryBookmarksResolved);
  }
}
