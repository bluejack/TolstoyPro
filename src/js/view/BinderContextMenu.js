/* ======================================================================== *\
   
   Binder Context Menu

\* ======================================================================== */

import BinderDialog from './modal/BinderDialog.js';

export default {
  display: display
};

var cmenu   = null;
var rnm_bind = null;
var cfg_bind = null;

function display(event, item) {
  if (cmenu == null) _setup();    

  document.addEventListener('click', _outer_click);

  cmenu.style.display = 'block';
  cmenu.style.left = event.pageX + 'px';
  cmenu.style.top  = event.pageY + 'px';

  rnm_bind.onclick = () => {
    _dismiss();
    var edit_file = new BinderDialog(item);
    edit_file.render(); 
  };

  cfg_bind.onclick = () => {
    _dismiss();
    console.log("Clicked configure");
  };

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
  cmenu   = document.getElementById('doc_cm');
  rnm_bind = document.getElementById('rnm_bind');
  cfg_bind = document.getElementById('cfg_bind');
}