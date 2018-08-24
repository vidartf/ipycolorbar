// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import expect = require('expect.js');

import { JSDOM } from 'jsdom';

import {
  scaleLinear
} from 'd3-scale'

import {
  select
} from 'd3-selection'

import {
  chromabar
} from '../../src/index'


describe('chromabar', () => {

  it('should have expected defaults', () => {
    const s = scaleLinear<string, number>();
    const a = scaleLinear();
    const b = chromabar(s);

    expect(b.scale()).to.be(s);
    expect(b.orientation()).to.be('vertical');
    expect(b.side()).to.be('bottomright');
    expect(b.barLength()).to.be(100);
    expect(b.breadth()).to.be(30);
    expect(b.borderThickness()).to.be(1);
    expect(b.title()).to.be(null);
    expect(b.tickArguments()).to.eql([]);
    expect(b.tickValues()).to.be(null);
    expect(b.tickFormat()).to.be(null);
    expect(b.tickSizeInner()).to.be(6);
    expect(b.tickSizeOuter()).to.be(6);
    expect(b.tickPadding()).to.be(3);
  });

  it('should produce the expected results', () => {
    const s = scaleLinear<string, number>()
      .range(['red', 'blue']);
    const b = chromabar(s)
      .barLength(10)
      .ticks(3);

    var bodyActual = (new JSDOM("<!DOCTYPE html><svg></svg>")).window.document.body,
        bodyExpected = (new JSDOM(
          '<!DOCTYPE html><svg>' +
          '<g class="colorbar" transform="translate(1, 1)">' +
          '<rect class="border" fill="transparent" stroke="currentColor" x="0" y="0" stroke-width="2" width="30" height="11"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(255, 0, 0)" height="1" width="30" y="10" x="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(230, 0, 26)" height="2" width="30" y="9" x="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(204, 0, 51)" height="2" width="30" y="8" x="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(179, 0, 77)" height="2" width="30" y="7" x="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(153, 0, 102)" height="2" width="30" y="6" x="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(128, 0, 128)" height="2" width="30" y="5" x="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(102, 0, 153)" height="2" width="30" y="4" x="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(77, 0, 179)" height="2" width="30" y="3" x="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(51, 0, 204)" height="2" width="30" y="2" x="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(26, 0, 230)" height="2" width="30" y="1" x="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(0, 0, 255)" height="2" width="30" y="0" x="0"></rect>' +
          '</g>' +
          '<g class="axis" fill="none" font-size="10" font-family="sans-serif" text-anchor="start" transform="translate(31, 1)">' +
          '<path class="domain" stroke="currentColor" d="M6,0.5H0.5V10.5H6"></path>' +
          '<g class="tick" opacity="1" transform="translate(0,0.5)">' +
          '<line stroke="currentColor" x2="6"></line>' +
          '<text fill="currentColor" x="9" dy="0.32em">0.0</text>' +
          '</g>' +
          '<g class="tick" opacity="1" transform="translate(0,5.5)">' +
          '<line stroke="currentColor" x2="6"></line>' +
          '<text fill="currentColor" x="9" dy="0.32em">0.5</text>' +
          '</g>' +
          '<g class="tick" opacity="1" transform="translate(0,10.5)">' +
          '<line stroke="currentColor" x2="6"></line>' +
          '<text fill="currentColor" x="9" dy="0.32em">1.0</text>' +
          '</g>' +
          '</g></svg></body>'
        )).window.document.body;
    select(bodyActual).select("svg").call(b);

    expect(bodyActual.outerHTML).to.equal(bodyExpected.outerHTML);
  });

  it('should produce the expected results when horizontal', () => {
    const s = scaleLinear<string, number>()
      .range(['red', 'blue']);
    const b = chromabar(s)
      .orientation('horizontal')
      .barLength(10)
      .breadth(8)
      .ticks(3);

    var bodyActual = (new JSDOM("<!DOCTYPE html><svg></svg>")).window.document.body,
        bodyExpected = (new JSDOM(
          '<!DOCTYPE html><svg>' +
          '<g class="colorbar" transform="translate(1, 1)">' +
          '<rect class="border" fill="transparent" stroke="currentColor" x="0" y="0" stroke-width="2" width="11" height="8"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(255, 0, 0)" width="2" height="8" x="0" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(230, 0, 26)" width="2" height="8" x="1" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(204, 0, 51)" width="2" height="8" x="2" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(179, 0, 77)" width="2" height="8" x="3" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(153, 0, 102)" width="2" height="8" x="4" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(128, 0, 128)" width="2" height="8" x="5" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(102, 0, 153)" width="2" height="8" x="6" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(77, 0, 179)" width="2" height="8" x="7" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(51, 0, 204)" width="2" height="8" x="8" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(26, 0, 230)" width="2" height="8" x="9" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(0, 0, 255)" width="1" height="8" x="10" y="0"></rect>' +
          '</g>' +
          '<g class="axis" fill="none" font-size="10" font-family="sans-serif" text-anchor="middle" transform="translate(1, 9)">' +
          '<path class="domain" stroke="currentColor" d="M0.5,6V0.5H10.5V6"></path>' +
          '<g class="tick" opacity="1" transform="translate(0.5,0)">' +
          '<line stroke="currentColor" y2="6"></line>' +
          '<text fill="currentColor" y="9" dy="0.71em">0.0</text>' +
          '</g>' +
          '<g class="tick" opacity="1" transform="translate(5.5,0)">' +
          '<line stroke="currentColor" y2="6"></line>' +
          '<text fill="currentColor" y="9" dy="0.71em">0.5</text>' +
          '</g>' +
          '<g class="tick" opacity="1" transform="translate(10.5,0)">' +
          '<line stroke="currentColor" y2="6"></line>' +
          '<text fill="currentColor" y="9" dy="0.71em">1.0</text>' +
          '</g>' +
          '</g>' +
          '</svg></body>'
        )).window.document.body;
    select(bodyActual).select("svg").call(b);

    expect(bodyActual.outerHTML).to.equal(bodyExpected.outerHTML);
  });

  it('should produce the expected results when axis on left side', () => {
    const s = scaleLinear<string, number>()
      .range(['red', 'blue']);
    const b = chromabar(s)
      .orientation('horizontal')
      .side('topleft')
      .barLength(10)
      .breadth(8)
      .ticks(3);

    var bodyActual = (new JSDOM("<!DOCTYPE html><svg></svg>")).window.document.body,
        bodyExpected = (new JSDOM(
          '<!DOCTYPE html><svg>' +
          '<g class="colorbar" transform="translate(1, 31)">' +
          '<rect class="border" fill="transparent" stroke="currentColor" x="0" y="0" stroke-width="2" width="11" height="8"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(255, 0, 0)" width="2" height="8" x="0" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(230, 0, 26)" width="2" height="8" x="1" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(204, 0, 51)" width="2" height="8" x="2" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(179, 0, 77)" width="2" height="8" x="3" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(153, 0, 102)" width="2" height="8" x="4" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(128, 0, 128)" width="2" height="8" x="5" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(102, 0, 153)" width="2" height="8" x="6" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(77, 0, 179)" width="2" height="8" x="7" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(51, 0, 204)" width="2" height="8" x="8" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(26, 0, 230)" width="2" height="8" x="9" y="0"></rect>' +
          '<rect stroke-width="0" class="gradient" fill="rgb(0, 0, 255)" width="1" height="8" x="10" y="0"></rect>' +
          '</g>' +
          '<g class="axis" fill="none" font-size="10" font-family="sans-serif" text-anchor="middle" transform="translate(1, 30)">' +
          '<path class="domain" stroke="currentColor" d="M0.5,-6V0.5H10.5V-6"></path>' +
          '<g class="tick" opacity="1" transform="translate(0.5,0)">' +
          '<line stroke="currentColor" y2="-6"></line>' +
          '<text fill="currentColor" y="-9" dy="0em">0.0</text>' +
          '</g>' +
          '<g class="tick" opacity="1" transform="translate(5.5,0)">' +
          '<line stroke="currentColor" y2="-6"></line>' +
          '<text fill="currentColor" y="-9" dy="0em">0.5</text>' +
          '</g>' +
          '<g class="tick" opacity="1" transform="translate(10.5,0)">' +
          '<line stroke="currentColor" y2="-6"></line>' +
          '<text fill="currentColor" y="-9" dy="0em">1.0</text>' +
          '</g>' +
          '</g>' +
          '</svg></body>'
        )).window.document.body;
    select(bodyActual).select("svg").call(b);

    expect(bodyActual.outerHTML).to.equal(bodyExpected.outerHTML);
  });

});