/* ========================================================================= *\
   
   MenuItem
   
   Generic Menu Item, renders itself at the end of the current sequence of
   menu items.

\* ========================================================================= */

import Component from './Component.js';

const display = `<div id="%ID%" class="menu_item mi_active">%LABEL%</div>`;

export default class MenuItem extends Component {
  constructor(pelm, id, label, action) {
    super(pelm,id);
    this.action = action;
    this.html   = display.replace(/%(\w*)%/g, function(m,key) { if (key == 'ID') return id; else return label; } );
    this.active = true;
  }

  set_active(active) {
    if (active !== this.active) {
      this.active = active;
      if (this.mi) {
        if (active == false) {
          this.mi.classList.replace('mi_active', 'mi_inactive');           
        } else {
          this.mi.classList.replace('mi_inactive', 'mi_active');
        }
      }      
    }
  }
  
  render() {
    super.render();
    var self = this;
    this.elm.onclick = function() {
      if (self.active) {
        self.action();
      }
    };
  }
}
