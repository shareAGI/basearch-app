/// <reference types="@types/chrome" />

/* eslint-disable no-console */
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);

// This tells Angular CLI to bundle the worker.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function mockRegisterWorkers() {
  new Worker(new URL('./workers/background', import.meta.url));
  new Worker(new URL('./workers/content', import.meta.url));
}
