/* ======================================================================== *\
   
   Document Context Menu

\* ======================================================================== */

import DeleteDoc from './modal/DeleteDoc.js';
import DocDialog from './modal/DocumentDialog.js';

export default {
  display: display
};

var cmenu   = null;
var rnm_doc = null;
var del_doc = null;

function display(event, item) {
  if (cmenu == null) _setup();    

  document.addEventListener('click', _outer_click);

  cmenu.style.display = 'block';
  cmenu.style.left = event.pageX + 'px';
  cmenu.style.top  = event.pageY + 'px';

  rnm_doc.onclick = () => {
    _dismiss();
    var edit_file = new DocDialog(item);
    edit_file.render(); 
  };

  del_doc.onclick = () => {
    var del_doc = new DeleteDoc(item);
    del_doc.render();
    _dismiss();
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
  rnm_doc = document.getElementById('rnm_doc');
  del_doc = document.getElementById('del_doc');
}