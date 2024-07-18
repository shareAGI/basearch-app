import { Bookmark, CapturedBookmark } from '../../shared/bookmark';
import { httpClient } from './http-client';

export async function createBookmarks(
  bookmarks: (Bookmark | CapturedBookmark)[],
): Promise<void> {
  await httpClient.post('api:bookmarks', bookmarks);
}

export async function fetchBookmarks(): Promise<Bookmark[]> {
  return httpClient.get('api:bookmarks');
}

export async function deleteBookmark(url: string): Promise<void> {
  await httpClient.delete(`api:bookmarks/${url}`);
}

export async function updateBookmark(
  url: string,
  payload:
    | Pick<Bookmark, 'title'>
    | Pick<CapturedBookmark, 'title' | 'document' | 'screenshot'>,
): Promise<void> {
  await httpClient.put(`api:bookmarks/${url}`, payload);
}

export async function searchBookmarks(
  query: string,
): Promise<(Bookmark | CapturedBookmark)[]> {
  return httpClient.get('api:bookmarks', { params: { query, detailed: true } });
}
