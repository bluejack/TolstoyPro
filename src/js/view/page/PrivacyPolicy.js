/* ======================================================================== *\
   
   Privacy Policy
   
\* ======================================================================== */

import ModalPage from './ModalPage.js';

export default class PrivacyPolicy extends ModalPage {
  constructor() {
    super('Privacy Policy', true, 'privacy');
    this.html = `
<div id="pp" class="static_page">
  <h1>TolstoyPro: Privacy Policy</h1>
  <p>Coming soon.</p>
</div>
    `;
  }
}