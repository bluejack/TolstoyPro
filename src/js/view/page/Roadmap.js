/* ======================================================================== *\
   
   Roadmap
   
   The future plan for feature releases

\* ======================================================================== */

import ModalPage from './ModalPage.js';

export default class Roadmap extends ModalPage {
  constructor() {
    super('Roadmap', true, 'roadmap');
    this.html = `
<div id="roadmap" class="static_page">
  <p>As of release 0.2, the roadmap of TolstoyPro is still largely aspirational. 
     If you are curious about a particular feture, see where it is in the 
     roadmap below. And if you don't see it, join our discord server and
     tell us about it!
  </p>

  <ul>
    <li>At version 0.3, circa mid May 2022:
      <ul>
        <li> File Rename</li>
        <li> Folders in File Tree</li>
        <li> Folder functionality: Create, Rename, Delete</li>
        <li> Re-orderable Files and Folders</li>
        <li> New Project templates with pre-designd folder sets</li>
        <li> Initial project templates: "notes" & "draft"</li>
      </ul>
    </li>
    <li>At version 0.3, circa mid June 2022:
      <ul>
        <li> Applet Panel</li>
        <li> Todo Lists Applet</li>
        <li> Word count</li>
      </ul>
    </li>
    <li>At version 0.4, circa August 2022:
      <ul>
        <li> Draft export: html, docx, pdf</li>
        <li> More style sets</li>
        <li> Refresh design treatment for cleaner design</li>
        <li> Robust handling off loss of internet</li>
      </ul>
    </li>
    <li>At version 0.5, circa September 2022:
      <ul>
        <li> Reminders</li>
        <li> Support for more devices: Win, Mac, iPad</li>
      </ul>
    </li>
    <li>At version 0.6, circa October 2022:
      <ul>
        <li> Robust handling of external file changes in google drive</li>
        <li> More metrics</li>
      </ul>
    </li>
    <li>At version 0.7, circa November 2022: (Alpha)
      <ul>
        <li> Corkboard restructuring</li>
        <li> File template options</li>
      </ul>
    </li>
    <li>At version 0.8, circa December 2022: (Beta-1)
      <ul>
        <li> In-project search</li>
      </ul>
    </li>
    <li>At version 0.9, crica January 2023: (Beta-2)
      <ul>
        <li> Version tracking</li>
      </ul>
    </li>
    <li>At version 1.0, February 3, 2023: || Launch ||
      <ul>
        <li> mobile device support</li>
      </ul>
    </li>
  </ul>
  
  <h3>Feature aspirations beyond launch</h3>
  <ul>
    <li> Native apps for iOS devices</li>
    <li> Cross-project search</li>
    <li> (Many) more project and file templates</li>
    <li> 
</div>
    `;
  }
}