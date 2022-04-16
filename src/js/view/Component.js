/* ======================================================================== *\
   
   Component
   
   Abstract component class to consolidate common logic.

\* ======================================================================== */

export default class Component {
  constructor(pelm, id) {
    this.pelm = pelm;
    this.id  = id;
    this.elm = null;
  }

  render() {
    this.pelm.insertAdjacentHTML('beforeend', this.html);
    this.elm = document.getElementById(this.id);
  }

  set_dom() {
    this.elm = document.getElementById(this.id);
  }
  
  get_dom() {
    return this.elm;
  }
  
  remove() {
    this.elm.remove();
  }
}