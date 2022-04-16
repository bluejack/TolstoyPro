/* ========================================================================= *\
   
   AlwasyOnMenuItem
   
   Override standard menu item activity, because it's always on.

\* ========================================================================= */

import MenuItem from './MenuItem.js';

export default class AlwaysOnMenuItem extends MenuItem {
  constructor(pelm, id, label, action) {
    super(pelm, id, label, action);
  }

  set_active() {}

  render() {
    var self = this;
    this.pelm.insertAdjacentHTML("beforeend", this.html);
    this.mi = document.getElementById(this.id);
    this.mi.onclick = function() {
      if (self.active) {
        self.action();
      }
    }
  }
}
