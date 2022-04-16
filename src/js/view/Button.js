/* ======================================================================== *\
   
   Button
   
   Generic button component

\* ======================================================================== */

import Component from './Component.js';

const tmplt = `<button id="%ID%" class="%CLASS%">%LABEL%</button>`;

export default class Button extends Component {
  constructor(pelm, id, style, label, click_handler) {
    super(pelm, id);
    this.html = tmplt.replace(/%(\w*)%/g, function(m, key) { 
      switch (key) {
        case 'ID': 
          return id;
        case 'CLASS':
          return style;
        case 'LABEL':
          return label;
        default:
          return '';
      }
    });
    this.handler = click_handler;
  }
  
  render() {
    super.render();
    this.elm.onclick = this.handler;
  }
}
