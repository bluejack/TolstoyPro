/* ======================================================================== *\
   
   Observable

   Anything that can register observers and notify interested parties.   

\* ======================================================================== */

import Observable from './Observable.js';

export default class TreeNode extends Observable {
  constructor(name, desc, type) {
    super();
    this.name = name;
    this.desc = desc;
    this.type  = type;
  }
}