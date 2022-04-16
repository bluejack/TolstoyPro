/* ========================================================================= *\
   
   Menu Separator
   
   Um... draws a line.
   
\* ========================================================================= */

import Component from './Component.js';

export default class MenuSeparator extends Component {

  constructor(pelm, id) {
    super(pelm, id);
    this.html = `<div class="menu_sep">&nbsp;</div>`;
  }

  set_active() {}
  
}
