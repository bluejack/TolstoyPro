/* ======================================================================== *\
   
   Logout Page
   
   What happens when they log out.

\* ======================================================================== */

import ModalPage from './ModalPage.js';
import Button     from '../Button.js';
import Auth       from '../../controller/AuthHandler.js';

export default class LogoutPage extends ModalPage {
  constructor() {
    super('Good Bye!', false, '');
    this.html = `
<div id="logout_page" class="static_page">
  <p><b>Did you know?</b> You do not need to log out of TolstoyPro unless you are
     switching the google drive account you want to use. Because of Google's
     security, nobody can hijack your writing session unless they steal your
     device! But if you do want to switch users...</p>
  <div id="login_box"></div>
</div>
    `;
  }
  render() {
    super.render();
    var lgnb = document.getElementById('login_box');
    var login_button = new Button(lgnb, 'login_b', 'login_b', 'Sign In to Google', async () => {
      await Auth.sign_in();
      if (Auth.user()) {
        this.remove();
      }
    });
    login_button.render();
  }
}