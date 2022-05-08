/* ======================================================================== *\
   
   Document Context Menu

\* ======================================================================== */

import EditProject  from './modal/EditProjectDialog.js';
import BinderDialog from './modal/BinderDialog.js';
import FileDialog   from './modal/FileDialog.js';

export default {
  display: display
};

var cmenu    = null;
var rnm_proj = null;
var add_bind = null;
var add_doc  = null;

function display(event) {
  if (cmenu == null) _setup();    

  document.addEventListener('click', _outer_click);

  cmenu.style.display = 'block';
  cmenu.style.left = event.pageX + 'px';
  cmenu.style.top  = event.pageY + 'px';

  rnm_proj.onclick = () => {
    _dismiss();
    var edit_proj = new EditProject();
    edit_proj.render(); 
  };

  add_doc.onclick = () => {
    _dismiss();
    var add_doc = new FileDialog();
    add_doc.render();
  }

  add_bind.onclick = () => {
    _dismiss();
    new BinderDialog().render();
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
  cmenu    = document.getElementById('proj_cm');
  rnm_proj = document.getElementById('rnm_proj');
  add_doc  = document.getElementById('add_doc');
  add_bind = document.getElementById('add_bind');
}