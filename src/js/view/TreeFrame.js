/* ========================================================================= *\
   
   TreeFrame
   
   The parent component for the file hierarchy tree.
   
   General structure:
     TreeFrame ->
       TreeRoot (Project Name & actions) ->
         Tree (Documents & Binders)
           TreeDoc -> Doc
           TreeBinder -> 
             Tree ...
   
\* ========================================================================= */

import ProjectHandler from '../controller/ProjectHandler.js';
import TreeRoot  from './TreeRoot.js';

/* ( Interface )>----------------------------------------------------------- */

export default {
  init: init,
  render: render
};

var tf_elm; // Tree frame element.

function init() {
  tf_elm = document.getElementById('tree_frame');
  var proj = ProjectHandler.get();
  if (proj) {
    render(proj);
    // If project changes structure, re-render.
    proj.observe(render);
  } else {
    // Render c-to-a tree frame.
  }
  // If ProjectHandler switches projects, re-render.
  ProjectHandler.observe(render);
}

function render(p) {
  if (!p) {
    return;
  }
  tf_elm.innerHTML = '';
  TreeRoot.render(tf_elm);
}

