/* ========================================================================= *\
   
   Tree Top
   
   Project name
   
\* ========================================================================= */

import Component from './Component.js';
import ProjectHandler from '../controller/ProjectHandler.js';
import ProjectContextMenu from './ProjectContextMenu.js';

export default class TreeTop extends Component {
  constructor(pelm, proj) {
    super(pelm, 'tree_top');
    this.html = `<div id="tree_top"></div>`;
    this.proj = proj;
    this.set_proj(proj);
    this.proj_observe();
  }
  
  set_proj(proj) {
    if (proj) {
      this.label = proj.name;
    } else {
      this.label = '-';
    }
  }
  
  proj_observe() {
    var self = this;
    ProjectHandler.observe((proj) => {
      self.set_proj(proj);
      if (self.elm) {
        self.elm.innerHTML = self.label;
      }
    });
  }
  
  render() {
    super.render();
    this.elm = document.getElementById('tree_top');
    this.elm.innerHTML = this.label;
    
    this.elm.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      ProjectContextMenu.display(e);
    });
  }
}
