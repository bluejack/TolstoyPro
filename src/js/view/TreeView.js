/* ========================================================================= *\
   
   Tree View
   
   The parent component for the file hierarchy tree.
   
\* ========================================================================= */

import ProjectHandler from '../controller/ProjectHandler.js';
import TreeItem from './TreeItem.js';
import TreeTop  from './TreeTop.js';

/* ( Interface )>----------------------------------------------------------- */

export default {
  init: init
};

const html = `<div id="tree_view"></div>`;
const hier = `<div id="hier"></div>`;
var helm;

function init(pelm) {
  pelm.insertAdjacentHTML('beforeend', html);
  var telm = document.getElementById('tree_view');
  var proj = ProjectHandler.get_curr();
  var top = new TreeTop(telm, proj);
  top.render();
  telm.insertAdjacentHTML('beforeend', hier);
  helm = document.getElementById('hier');
  if (proj) {
    _render(proj);
    proj.observe(_render);
  }
  ProjectHandler.observe((p) => {
    p.observe(_render);
    _render(p);
    // Do we need to watch the project for changes?
  });
}

function _render(p) {
  helm.innerHTML = '';
  p.walk_tree((i) => {
    var titem = new TreeItem(helm, i, p);
    titem.render();
  });
}

