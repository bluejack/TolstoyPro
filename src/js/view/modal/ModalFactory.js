/* ======================================================================== *\
   
   ModalFactory
   
   Building modals since 2022.
   
   Mix dialogs and pages because they have the same interface.

\* ======================================================================== */

import AboutPage         from '../page/AboutPage.js';
import ChangeLog         from '../page/ChangeLog.js';
import EditProjectDialog from './EditProjectDialog.js';
import FileDialog        from './FileDialog.js';
import IntroPage         from '../page/IntroPage.js';
import Log               from '../../sys/Log.js';
import LogoutPage        from '../page/LogoutPage.js';
import PreferencesDialog from './PreferencesDialog.js';
import PrivacyPolicy     from '../page/PrivacyPolicy.js';
import ProjectChooser    from './ProjectChooser.js';
import ProjectDialog     from './ProjectDialog.js';
import Roadmap           from '../page/Roadmap.js';
import ToSPage           from '../page/ToSPage.js';
import SupportDialog     from './SupportDialog.js';
import WelcomePage       from '../page/WelcomePage.js';


export default {
  enqueue: enqueue,
  dequeue: dequeue,
  trigger: trigger
};

var queue = [];

var map = {
  about:          () => { return new AboutPage();         },
  changelog:      () => { return new ChangeLog();         },
  file_create:    () => { return new FileDialog();        },
  intro:          () => { return new IntroPage();         },
  logout:         () => { return new LogoutPage();        },
  pchoose:        () => { return new ProjectChooser();    },
  prefs:          () => { return new PreferencesDialog(); },
  privacy:        () => { return new PrivacyPolicy();     },
  project_edit:   () => { return new EditProjectDialog(); },
  project_create: () => { return new ProjectDialog();     },
  roadmap:        () => { return new Roadmap();           },
  tos:            () => { return new ToSPage();           },
  support:        () => { return new SupportDialog();     },
  welcome:        () => { return new WelcomePage();       },
};

function _create(name) {
  if (!map[name]) {
    Log.warning("No matching location for: " + name);
    return;
  }
  return map[name]();
}

function _show(name) {
  return _create(name).render();
}

function enqueue(name) {
  queue.push(name);
  if (queue.length == 1) {
    _show(name);
  }
}

function dequeue() {
  if (queue.length > 0) {
    queue.shift();
    if (queue.length > 0) {
      _show(queue[0]);
    }
  }
}

function trigger(name) {
  if (!map[name]) {
    Log.warning("Invalid name requested for modal: " + name);
  } else {
    window.location.hash = name;
  }
  
}
