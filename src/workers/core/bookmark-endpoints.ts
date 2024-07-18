import { Bookmark } from '../../shared/bookmark';
import { httpClient } from './http-client';

export async function upsertBookmark(bookmark: Bookmark): Promise<void> {
  await httpClient.post('api:url-batch-importing', {
    ['url']: bookmark.url,
    ['title']: bookmark.title,
    ['raw_html']: bookmark.document,
    ['cover_url']: bookmark.screenshot,
  });
}
