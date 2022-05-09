/* ======================================================================== *\
   
   Binder Context Menu

\* ======================================================================== */

import BinderDialog   from './modal/BinderDialog.js';
import DocumentDialog from './modal/DocumentDialog.js';

export default {
  display: display
};

var cmenu   = null;
var rnm_bind = null;
var cfg_bind = null;
var bind_doc = null;
var bind_bind = null;

function display(event, binder) {
  if (cmenu == null) _setup();    

  document.addEventListener('click', _outer_click);

  cmenu.style.display = 'block';
  cmenu.style.left = event.pageX + 'px';
  cmenu.style.top  = event.pageY + 'px';

  rnm_bind.onclick = () => {
    _dismiss();
    new BinderDialog(binder).render();
  };

  cfg_bind.onclick = () => {
    _dismiss();
    console.log("Clicked configure");
  };

  bind_bind.onclick = () => {
    _dismiss();
    new BinderDialog(binder).render();
  }

  bind_doc.onclick = () => {
    _dismiss();
    new DocumentDialog(binder).render();    
  }

}

function _outer_click(event) {
  if (!cmenu.contains(event.target) && cmenu.style.display == 'block') {
    _dismiss();
  }
}

function _dismiss() {
  cmenu.style.display = 'none';
  document.removeEventListener('click', _dismiss);
}

function _setup() {
  cmenu   = document.getElementById('bind_cm');
  rnm_bind = document.getElementById('rnm_bind');
  cfg_bind = document.getElementById('cfg_bind');
  bind_doc = document.getElementById('bind_doc');
  bind_bind = document.getElementById('bind_bind');
}