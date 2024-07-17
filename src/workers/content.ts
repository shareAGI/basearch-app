'is:content';

import canvasFromDom from 'html2canvas';

import { CaptureDom, CaptureDomCompleted } from '../shared/dom';
import { listen, send } from '../shared/messenger';

/**
 * @see https://stackoverflow.com/questions/15685698/getting-binary-base64-data-from-html5-canvas-readasbinarystring
 */
async function captureScreenshot(): Promise<string> {
  const canvas = await canvasFromDom(document.body);
  return canvas.toDataURL();
}

listen(CaptureDom).subscribe(async () => {
  const dom = document.documentElement.outerHTML;
  const screenshot = await captureScreenshot();
  send(CaptureDomCompleted, { document: dom, screenshot });
});
