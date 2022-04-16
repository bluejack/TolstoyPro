/* ========================================================================= *\
   
   LoginOut Menu Item 
   
   Instead of disabling, we toggle state.

\* ========================================================================= */

import MenuItem from './MenuItem.js';
import Auth     from '../controller/AuthHandler.js';

export default class LoginOut extends MenuItem {
  constructor(pelm) {
    super(pelm, 'login_mi', 'Login');
    this.html = '<div id="login_mi" class="menu_item mi_active"></div>';
    this.action = Auth.sign_out;
    this.login_l = 'Sign In';
    this.logout_l = 'Sign Out';
    this.label = this.logout_l;
  }

  set_active(active) {
    if (active !== this.active) {
      if (active) {
        this.action = Auth.sign_out;
        this.label  = this.logout_l;
      } else {
        this.action = Auth.sign_in;
        this.label  = this.login_l;
      }
      if (this.mi) {
        this.mi.onclick = this.action;
        this.mi.innerHTML = this.label;
      }      
    }
  }
  
  render() {
    this.pelm.insertAdjacentHTML("beforeend", this.html);
    this.mi = document.getElementById(this.id);
    this.mi.onclick = this.action;
    this.mi.innerHTML = this.label;
  }
}
