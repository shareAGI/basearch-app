export interface Bookmark {
  url: string;
  title: string;
}

export interface CapturedBookmark extends Bookmark {
  document: string;
  screenshot: string;
}
