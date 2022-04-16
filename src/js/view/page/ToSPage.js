/* ======================================================================== *\
   
   Terms of Service
   
\* ======================================================================== */

import ModalPage from './ModalPage.js';

export default class TermsOfService extends ModalPage {
  constructor(view) {
    super('Terms of Service', true, 'tos');
    this.html = `
<div id="tos" class="static_page">
  <h1>TolstoyPro: Terms of Service</h1>
  <p>Coming soon.</p>
</div>
    `;
  }
}