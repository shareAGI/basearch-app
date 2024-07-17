import { Injectable } from '@angular/core';
import FontFaceObserver from 'fontfaceobserver';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FontLoadObserver {
  observe(fontFamily: string, timeout: number): Observable<void> {
    const observer = new FontFaceObserver(fontFamily);
    return from(observer.load(null, timeout));
  }
}
