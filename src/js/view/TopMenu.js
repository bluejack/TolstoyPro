/* ========================================================================= *\
   
   TopMenu
   
   A TopMenu has no parent menu item, but can have children. Ultimately, the 
   TopMenu should not have any behavior other than displaying its children.

\* ========================================================================= */

import Component from './Component.js';

const display = `<div id="%ID%" class="top_menu">%LABEL%<div id="%ID%_sub" class="submenu"></div></div>`;

export default class TopMenu extends Component {
  constructor(pelm, id, label) {
    super(pelm, id);
    this.sub = id + '_sub';
    this.label = label;
    this.html = display.replace(/%(\w*)%/g, function(m, key) { if (key == 'ID') return id; else return label; } );
    this.items = [];
  }
  
  add_menu_item(item) {
    this.items.push(item);
    item.render();
  }

  set_active(active) {
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].set_active(active);
    }
  }
  
  render() {
    super.render();
    return document.getElementById(this.sub);
  }
}