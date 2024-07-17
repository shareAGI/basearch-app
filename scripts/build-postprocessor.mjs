import { readFile, writeFile } from 'fs/promises';
import { globIterate } from 'glob';

const DIST = 'dist/adx24-app/browser';

main();

async function main() {
  /**@type {Partial<Record<'background' | 'content', string>>} */
  const context = {};
  for await (const entry of globIterate(`${DIST}/worker-*.js`)) {
    const content = await readFile(entry, 'utf8');
    const name = identifyWorker(content);
    const adoptAs = (/**@type {keyof typeof context} */ key) =>
      (context[key] = entry.replace(`${DIST}/`, ''));
    if (name === 'background') adoptAs('background');
    else if (name === 'content') adoptAs('content');
  }
  if (!context.background || !context.content)
    throw new Error('Missing workers');

  console.log(context);

  const manifestTemplate = await readFile(`${DIST}/manifest.json`, 'utf8');
  const manifest = resolveTemplate(manifestTemplate, context);
  await writeFile(`${DIST}/manifest.json`, manifest);
}

/**
 *
 * @param {string} content
 * @returns {string}
 */
export function identifyWorker(content) {
  const re = /"is:(?<name>[a-z]*)"/;
  const match = content.match(re);
  const name = match?.groups?.['name'];
  if (!name) throw new Error('Worker missing identifier');
  return name;
}

/**
 *
 * @param {string} template
 * @param {Record<string, string>} context
 * @returns {string}
 */
export function resolveTemplate(template, context) {
  return template.replace(/\{(.+?)\}/gu, (_, key) => {
    const value = context[key];
    if (value === undefined)
      throw new Error(`Missing template context: ${key}`);
    return value;
  });
}
