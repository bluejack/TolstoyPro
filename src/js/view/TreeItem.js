/* ========================================================================= *\
   
   Tree Item
   
   Files & Different Types of Folders.

\* ========================================================================= */

import Component from './Component.js';
import TreeRoot  from './TreeRoot.js';

export default class TreeItem extends Component {
  constructor(pelm, id, model, binder) {
    super(pelm, id);
    this.model  = model;
    this.binder = binder;
  }

  set_move_manager() {
    var self = this;
    var ox, oy, nx, ny;

    function _drag(e) {
      nx = ox - e.clientX;
      ny = oy - e.clientY;
      if (self.clicking) {
        if (Math.abs(e.clientY - oy) <= 3) return;
        if (self.model.open) {
          self.toggle();
          return;
        }
        self.clicking = false;
        self.handle.style.cursor = 'crosshair';
        TreeRoot.init_move(self);
        self.elm.style.position = 'absolute';
        self.elm.style.zIndex = '99';
      }
      ox = e.clientX;
      oy = e.clientY;
      TreeRoot.arrange(e.clientY);
      self.handle.style.top = (self.handle.offsetTop - ny) + 'px';
      self.handle.style.left = (self.handle.offsetLeft - nx) + 'px';
    }
    
    function _end_drag(e) {
      if (!self.clicking) {
        self.elm.style.cursor = 'pointer';
        self.elm.style.position = 'relative';
        self.elm.style.zIndex = '0';
        TreeRoot.finalize();
      }
      document.onmousemove = null;
      document.onmouseup = null;
      document.onselectstart = this.selecthold;
    }
    
    this.elm.addEventListener('mousedown', (e) => {
      self.clicking = true;
      ox = e.clientX;
      oy = e.clientY + 5;
      document.onmouseup = _end_drag;
      document.onmousemove = _drag;
      this.selecthold = document.onselectstart;
      document.onselectstart = () => { return false; }
    });
  }


  render() {
    super.render();
    this.set_move_manager();
  }
}
