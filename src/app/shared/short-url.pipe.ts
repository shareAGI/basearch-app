import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortUrl',
  standalone: true,
})
export class ShortUrlPipe implements PipeTransform {
  transform(url: string): string {
    const urlObject = new URL(url);
    return urlObject.hostname + urlObject.pathname;
  }
}
