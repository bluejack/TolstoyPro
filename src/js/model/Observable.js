/* ======================================================================== *\
   
   Observable

   Anything that can register observers and notify interested parties.   

\* ======================================================================== */

export default class Observable {
  constructor() {
    this.obs = [];
  }

  observe(cb) {
    this.obs.forEach((i) => {
      if (i === cb) return;
    });
    this.obs.push(cb);
  }
  
  notify() {
    this.obs.forEach((cb) => { cb(this); });
  }
  
}