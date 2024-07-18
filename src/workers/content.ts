'is:content';

import canvasFromDom from 'html2canvas';

import { CaptureDom, CaptureDomCompleted } from '../shared/dom';
import { listen, send } from '../shared/messenger';

/**
 * @see https://stackoverflow.com/questions/15685698/getting-binary-base64-data-from-html5-canvas-readasbinarystring
 */
async function captureScreenshot(): Promise<string> {
  const canvas = await canvasFromDom(document.body);
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Context not available');
  const image = new Image();
  await new Promise((resolve) => {
    image.onload = resolve;
    image.src = canvas.toDataURL();
  });
  const scale = 600 / canvas.width;
  canvas.width = 600;
  canvas.height = 400;
  context.scale(scale, scale);
  context.drawImage(image, 0, 0);
  return canvas.toDataURL();
}

listen(CaptureDom).subscribe(async () => {
  const dom = document.documentElement.outerHTML;
  const screenshot = await captureScreenshot();
  send(CaptureDomCompleted, { document: dom, screenshot });
});
