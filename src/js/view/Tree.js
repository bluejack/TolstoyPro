/* ========================================================================= *\
   
   Tree Panel
   
   The major left sidebar of the primary app: project, file tree, etc.
   
\* ========================================================================= */

import TreeStrip from './TreeStrip.js';
import TreeView  from './TreeView.js';

/* ( Interface )>----------------------------------------------------------- */

export default {
  init: init
};

function init() {
  var telm = document.getElementById('tree');
  var strip = new TreeStrip(telm);
  strip.render();
  TreeView.init(telm);
}

