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
  win_height:   0
};

var t, e, a;

function init() {
  window.onresize = reset;
  reset();
}

function reset() {
  layout.win_width  = window.innerWidth;
  layout.win_height = window.innerHeight;
  t = document.getElementById('tree');
  e = document.getElementById('editor');
  a = document.getElementById('applets');
  var aw = a.clientWidth;
  if (layout.content_left == 0) {
    var tw = t.clientWidth;
    layout.tree_width    = tw;
    layout.applet_width  = aw;
    layout.content_left  = tw;
  }
  layout.win_height = layout.win_height - HEADER_FOOTER_HEIGHT;
  e.style.left  = "" + layout.content_left + "px";
  e.style.width = "" + ((layout.win_width - layout.content_left) - layout.applet_width) + "px";  
  t.style.width  = "" + layout.tree_width + "px";
  t.style.height = "" + layout.win_height + "px";
  e.style.height = "" + layout.win_height + "px";
  a.style.height = "" + layout.win_height + "px";
}

