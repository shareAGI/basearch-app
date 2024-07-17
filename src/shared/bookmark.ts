import { $type } from '@angularity/core';

import { define } from './messenger';

export const BookmarkCreated = define('BookmarkCreated', $type<string>());
