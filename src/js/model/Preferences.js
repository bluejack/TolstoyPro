/* ======================================================================== *\
   
   Preferences
   
   Possible preferences:
   
   theme: < the stylesheet theme for the app >

\* ======================================================================== */

import AppState from './AppState.js';

export default class Preferences {
  constructor(p) {
    this.map = p;
  }

  /* Generics */
  get(key) {
    return this.map[key];
  }

  set(key, val) {
    this.map[key] = val;
    AppState.sync();
  }
  
  /* Convenience */
  
  theme(val) {
    if (val) {
      this.set('theme', val);
    }
    return this.map.theme;
  }
  
  get_map() {
    return this.map;
  }
}