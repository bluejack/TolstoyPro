/* ========================================================================= *\
   
   Tree Strip
   
   The thin panel on the left that holds tree options.
   
\* ========================================================================= */

import Component      from './Component.js';
import ModalFactory   from './modal/ModalFactory.js';
import ProjectHandler from '../controller/ProjectHandler.js';

export default class TreeStrip extends Component {
  constructor(pelm) {
    super(pelm, 'tree_strip');
    this.gear = null;
    this.html = `<div id="tree_strip"><a href="#" id="proj_edit">&#9881;</a><br></div>`;
  }
  
  #edit_project() {
    ModalFactory.enqueue('project_edit');
  }
  
  render() {
    super.render();
    this.gear = document.getElementById('proj_edit');
    this.gear.onclick = this.#edit_project;
  }
}
