export function processIcon(input: string | TemplateStringsArray): string {
  const raw = Array.isArray(input) ? input[0] : input;
  const svg = new DOMParser().parseFromString(raw, 'image/svg+xml');
  traverse(svg, (node) => {
    if (node instanceof SVGSVGElement) {
      node.removeAttribute('width');
      node.removeAttribute('height');
      node.setAttribute('aria-hidden', 'true');
      node.style.width = 'var(--icon-size)';
      node.style.height = 'var(--icon-size)';
    } else if (node instanceof SVGElement) {
      node.removeAttribute('stroke-width');
      if (node.hasAttribute('stroke') && node.getAttribute('stroke') !== 'none')
        node.setAttribute('stroke', 'currentColor');
      if (node.hasAttribute('fill') && node.getAttribute('fill') !== 'none')
        node.setAttribute('fill', 'currentColor');
    }
  });
  return svg.documentElement.outerHTML;
}

function traverse(node: Node, callback: (node: Node) => void) {
  callback(node);
  node.childNodes.forEach((child) => traverse(child, callback));
}
