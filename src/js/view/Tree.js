/* ========================================================================= *\
   
   Tree
   
   The parent component for the file hierarchy tree.
   
\* ========================================================================= */

import ModalFactory from './modal/ModalFactory.js';
import ProjectHandler from '../controller/ProjectHandler.js';
import TreeBinder from './TreeBinder.js';
import TreeDoc  from './TreeDoc.js';
import TreeTop  from './TreeTop.js';

/* ( Interface )>----------------------------------------------------------- */

export default {
  init: init,
  render: render
};

const html = `<div id="tree_view"></div>`;
const hier = `<div id="hier"></div>`;
var helm;

function init() {
  var pelm = document.getElementById('tree');
  pelm.innerHTML = html;
  var telm = document.getElementById('tree_view');
  var proj = ProjectHandler.get();
  var top = new TreeTop(telm, proj);
  top.render();
  telm.insertAdjacentHTML('beforeend', hier);
  helm = document.getElementById('hier');
  if (proj) {
    render(proj);
    proj.observe(validate);
  }
  ProjectHandler.observe((p) => {
    p.observe(validate);
    render(p);
    // Do we need to watch the project for changes?
  });
}

function validate(p) {
  if (!p.curr) {
    ModalFactory.enqueue('file_create');
  }
  render(p);
}

function render(p) {
  if (p) {
    helm.innerHTML = '';
    // TODO  sAdd binders.
    p.walk_tree((i) => {
      if (i.type == 'doc') {
        var titem = new TreeDoc(helm, i, p);
        titem.render();
      } else {
        new TreeBinder(helm, i, p).render();
      }
    });
  }
}

