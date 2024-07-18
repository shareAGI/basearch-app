import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResizeObserver {
  observe(element: HTMLElement): Observable<void> {
    return new Observable<void>((observer) => {
      const resizeObserver = new window.ResizeObserver(() => observer.next());
      resizeObserver.observe(element);
      return () => resizeObserver.disconnect();
    });
  }
}
