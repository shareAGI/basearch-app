import { $type } from '@angularity/core';

import { define } from './messenger';

export const CaptureDom = define('CaptureDom', $type<void>());
export const CaptureDomCompleted = define(
  'CaptureDomCompleted',
  $type<{ document: string; screenshot: string }>(),
);
