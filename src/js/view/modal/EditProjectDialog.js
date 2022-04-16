/* ========================================================================= *\
   
   Edit Project Dialog
   
   All functionality is in Project Dialog, this is merely a switch to 
   indicate the edit functionality should be used.

\* ========================================================================= */

import ProjectDialog from './ProjectDialog.js';
import PHandler      from '../../controller/ProjectHandler.js';

export default class EditProjectDialog extends ProjectDialog {
  constructor() {
    super(PHandler.get_curr(), true);
  }
}
