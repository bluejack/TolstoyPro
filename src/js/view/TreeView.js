/* ========================================================================= *\
   
   Tree View
   
   The parent component for the file hierarchy tree.
   
\* ========================================================================= */

import ProjectHandler from '../controller/ProjectHandler.js';
import TreeItem from './TreeItem.js';
import TreeTop  from './TreeTop.js';

/* ( Interface )>----------------------------------------------------------- */

export default {
  init: init,
  render: render
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
    render(proj);
    proj.observe(render);
  }
  ProjectHandler.observe((p) => {
    p.observe(render);
    render(p);
    // Do we need to watch the project for changes?
  });
}

function render(p) {
  helm.innerHTML = '';
  p.walk_tree((i) => {
    var titem = new TreeItem(helm, i, p);
    titem.render();
  });
}

