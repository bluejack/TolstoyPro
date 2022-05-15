/* ======================================================================== *\
   Align
   
   Handles the alignment of UX across the tree view, the editor panel, and 
   the applet panel.

\* ======================================================================== */

export default {
  init: init
};

const HEADER_FOOTER_HEIGHT = 46;

var layout = {
  content_left: 0,
  tree_width:   0,
  applet_width: 0,
  win_width:    0,
  win_height:   0,
  edit_height:  0
};

function init() {
  window.onresize = reset;
  reset();
}

function reset() {
  layout.win_width  = window.innerWidth;
  layout.win_height = window.innerHeight;
  const t = document.getElementById('tree_frame');
  const e = document.getElementById('editor');
  const a = document.getElementById('applets');
  const m = document.getElementById('menu');
  const f = document.getElementById('footer');
  var aw = a.clientWidth;
  if (layout.content_left == 0) {
    var tw = t.clientWidth;
    layout.tree_width    = tw;
    layout.applet_width  = aw;
    layout.content_left  = tw;
    layout.edit_height   = layout.win_height - (m.offsetHeight + f.offsetHeight); 
  }
  layout.edit_height   = layout.win_height - (m.offsetHeight + f.offsetHeight); 
  e.style.left  = "" + layout.content_left + "px";
  e.style.width = "" + ((layout.win_width - layout.content_left) - layout.applet_width) + "px";  
  t.style.width  = "" + layout.tree_width + "px";
  t.style.height = "" + layout.edit_height + "px";
  e.style.height = "" + layout.edit_height + "px";
  a.style.height = "" + layout.edit_height + "px";
}

