import { cubicOut } from 'svelte/easing';

export const grow = (node, { delay = 0, duration = 200, easing = cubicOut } = {}) => {
  const style = getComputedStyle(node);
  const opacity = +style.opacity;
  const fontSize = parseFloat(style.fontSize);
  const height = parseFloat(style.height);
  const width = parseFloat(style.width);
  const paddingLeft = parseFloat(style.paddingLeft);
  const paddingRight = parseFloat(style.paddingRight);
  const marginLeft = parseFloat(style.marginLeft);
  const marginRight = parseFloat(style.marginRight);
  const borderLeftWidth = parseFloat(style.borderLeftWidth);
  const borderRightWidth = parseFloat(style.borderRightWidth);
  const paddingTop = parseFloat(style.paddingTop);
  const paddingBottom = parseFloat(style.paddingBottom);
  const marginTop = parseFloat(style.marginTop);
  const marginBottom = parseFloat(style.marginBottom);
  const borderTopWidth = parseFloat(style.borderTopWidth);
  const borderBottomWidth = parseFloat(style.borderBottomWidth);
  return {
    delay,
    duration,
    easing,
    css: (t) =>
      'overflow: hidden;' +
      `opacity: ${Math.min(t * 20, 1) * opacity};` +
      `font-size: ${t * fontSize}px;` +
      `height: ${t * height}px;` +
      `width: ${t * width}px;` +
      `padding-left: ${t * paddingLeft}px;` +
      `padding-right: ${t * paddingRight}px;` +
      `margin-left: ${t * marginLeft}px;` +
      `margin-right: ${t * marginRight}px;` +
      `border-left-width: ${t * borderLeftWidth}px;` +
      `border-right-width: ${t * borderRightWidth}px;` +
      `padding-top: ${t * paddingTop}px;` +
      `padding-bottom: ${t * paddingBottom}px;` +
      `margin-top: ${t * marginTop}px;` +
      `margin-bottom: ${t * marginBottom}px;` +
      `border-top-width: ${t * borderTopWidth}px;` +
      `border-bottom-width: ${t * borderBottomWidth}px;`
  };
};
