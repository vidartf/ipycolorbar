// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { AxisScale, AxisDomain } from 'd3-axis';

import { scaleLinear, ScaleOrdinal, scaleBand } from 'd3-scale';

import { Selection, TransitionLike, select } from 'd3-selection';

export type SelectionContext<Datum> = Selection<SVGSVGElement | SVGGElement, Datum, any, any>;
export type TransitionContext<Datum> = TransitionLike<SVGSVGElement | SVGGElement, Datum>;


export type Orientation = 'horizontal' | 'vertical';



export interface ColorScaleBase {
  (value: number | { valueOf(): number }): string;

  domain(): AxisDomain[];
  domain(domain: Array<AxisDomain | { valueOf(): AxisDomain }>): this;

  ticks(count?: number): number[];
  tickFormat(count?: number, specifier?: string): ((d: number | { valueOf(): number }) => string);
};

export interface ColorScaleOptionals {
  range(): string[];
  range(value: string[]): this;

  invert(value: number | { valueOf(): number }): number;

  copy(): this;
}

export type ColorScale = ColorScaleBase & Partial<ColorScaleOptionals>;
export type FullColorScale = ColorScaleBase & ColorScaleOptionals;



export interface ColorbarAxisScale extends AxisScale<AxisDomain> {

  domain(): AxisDomain[];
  domain(value: AxisDomain[]): this;

  range(): number[];
  range(value: number[]): this;

  invert(value: number | { valueOf(): number }): number;
}


/**
 * Create an empty linear gradient.
 */
export function createGradient(
  selection: Selection<SVGSVGElement, unknown, any, unknown>,
  id: string,
): Selection<SVGLinearGradientElement, null, SVGDefsElement, null> {
  let defs = selection.selectAll<SVGDefsElement, unknown>('defs').data([null]);
  defs = defs.merge(defs.enter().append('defs'));
  defs.exit().remove();

  let gradient = defs.selectAll<SVGLinearGradientElement, unknown>(`linearGradient#${id}`)
    .data([null]);
  gradient = gradient.merge(gradient.enter().append<SVGLinearGradientElement>('linearGradient')
    .attr('id', id));
  gradient.exit().remove();

  return gradient;
}


const svgIDs = {};

export function generateSvgID(prefix: string = '') {
  svgIDs[prefix] = (svgIDs[prefix] || 0) + 1;
  return `${prefix}-${svgIDs[prefix]}`;
}


/**
 * Create a 10x10 checker pattern.
 *
 * Commonly used as background behind transparent images.
 *
 * @returns The id of the pattern
 */
export function ensureCheckerPattern(selection: Selection<SVGSVGElement, unknown, any, unknown>): string {
  let defs = selection.selectAll<SVGDefsElement, unknown>('defs').data([null]);
  defs = defs.merge(defs.enter().append('defs'));
  defs.exit().remove();

  let patterns = defs.selectAll('pattern.checkerPattern').data([null]);
  patterns.exit().remove();
  let newPatterns = patterns.enter().append<SVGPatternElement>('pattern')
    .attr('id', () => generateSvgID('checkerPattern'))
    .attr('class', 'checkerPattern')
    .attr('viewBox', '0,0,10,10')
    .attr('width', 10)
    .attr('height', 10)
    .attr('patternUnits', 'userSpaceOnUse');

  newPatterns.append<SVGPathElement>('path')
    .attr('d', 'M0,0v10h10V0')
    .attr('fill', '#555')
  newPatterns.append<SVGPathElement>('path')
    .attr('d', 'M0,5h10V0h-5v10H0')
    .attr('fill', '#fff');

  return patterns.merge(newPatterns).attr('id');
}


/**
 * Infer the type of the scale.
 *
 * @param scale The scale to check.
 */
function checkType(scale: any) {
  if (scale.range === undefined) {
    return 'sequential'
  }
  const s = scale.copy();
  if (s.domain([1, 2]).range([1, 2])(1.5) === 1)
      return 'ordinal';
  else if (s.domain([1, 2]).range([1, 2]).invert(1.5) === 1.5)
      return 'linear';
  else if (s.domain([1, 2]).range([1, 2]).invert(1.5) instanceof Date)
      return 'time';
  else
      return 'not supported';
}


export function scaleIsOrdinal<Domain, Range>(candidate: any): candidate is ScaleOrdinal<Domain, Range> {
  return checkType(candidate) === 'ordinal';
}


/**
 * Given a color scale and a pixel extent, create an axis scale.
 *
 * @param scale The color scale (domain -> color string)
 * @param extent The pixel extent to map to.
 *
 * @returns An axis scale (domain -> pixel position)
 */
export function makeAxisScale(scale: ColorScale, extent: number[]): ColorbarAxisScale {
  // Assume monotonous domain for scale:
  const domain = scale.domain();

  if (scaleIsOrdinal(scale)) {
    return (scaleBand() as any)
      .domain(scale.domain())
      .range(extent);
  }

  // Check if we can use the type of `scale` as an axis scale
  let ctor;
  if (typeof scale.range === 'function' && typeof scale.invert === 'function') {
    // We can, use copy of scale as basis
    ctor = scale.copy;
  } else {
    // We cannot, use a linear scale
    ctor = () => { return (scaleLinear() as any).domain(domain) };
  }
  // Set up a scale that transfers the first/last domain values to the pixel extremes:
  const transformer = ctor()
    .domain([domain[0], domain[domain.length -1]] as any)
    .range(extent) as ColorbarAxisScale;
  // Copy the scale, and switch type by setting range (color -> pixels)
  // We also make sure any intermediate values in the domain get a pixel value
  return ctor()
    .range(domain.map((v) => transformer(v))) as ColorbarAxisScale;
}
