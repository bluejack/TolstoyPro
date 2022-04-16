/* ========================================================================= *\
   
   Support Dialog
   
   Show support links.

\* ========================================================================= */

import Dialog from './Dialog.js';

const display = `
  <p>Please join our <a href="https://discord.gg/sFaMRGYr">discord server</a> 
     to get all the latest information on help options, support, roadmap, 
     known bugs, bug reporting, feature requests, as well as meeting other 
     folks using TolstoyPro for all kinds of amazing purposes!</p>
`;

export default class SupportModal extends Dialog {
  constructor() {
    super('Help & Support', true);
  }

  render() {
    var pelm = super.render();
    pelm.insertAdjacentHTML('afterbegin', display);
  }
}