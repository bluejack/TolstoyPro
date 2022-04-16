/* ========================================================================= *\

   Menu

\* ========================================================================= */

import AlwaysOnMenuItem from './AlwaysOnMenuItem.js';
import LoginOut         from './LoginOut.js';
import MenuItem         from './MenuItem.js';
import MenuSeparator    from './MenuSeparator.js';
import ModalFactory     from './modal/ModalFactory.js';
import TopMenu          from './TopMenu.js';
import Auth             from '../controller/AuthHandler.js';

/* ( Interface )>----------------------------------------------------------- */

export default {
  init: init
};

/* ( Members )>------------------------------------------------------------- */

// neg

/* ( Public Methods )>------------------------------------------------------ */

function init() {
  var melm = document.getElementById('menu');
  var home_menu = new TopMenu(melm, 'hmenu', '<img src="/img/TolstoyPro.Menu.png" alt="TolstoyPro" height="18" width="18" />');
  var home_dom = home_menu.render();
  home_menu.add_menu_item(new AlwaysOnMenuItem(home_dom, 'about_mi', 'About', 
    () => { ModalFactory.trigger('about'); }));
  home_menu.add_menu_item(new MenuSeparator(home_dom, 'sep1'));
  home_menu.add_menu_item(new MenuItem(home_dom, 'prefs_mi', 'Preferences', 
    () => { ModalFactory.enqueue('prefs'); }));
  home_menu.add_menu_item(new LoginOut(home_dom));
  home_menu.add_menu_item(new MenuItem(home_dom, 'nuke', 'Nuke', function() {
    Auth.reset();
  }));

  var project_menu = new TopMenu(melm, 'projmenu', 'Project');
  var proj_dom = project_menu.render();
  project_menu.add_menu_item(new MenuItem(proj_dom, 'newproj_mi', 'New Project', 
    () => { ModalFactory.enqueue('project_create'); }));
  project_menu.add_menu_item(new MenuItem(proj_dom, 'openproj_mi', 'Open Project', 
    () => { ModalFactory.enqueue('pchoose'); }));

  var file_menu = new TopMenu(melm, 'filemenu', 'File');
  var file_dom = file_menu.render();
  file_menu.add_menu_item(new MenuItem(file_dom, 'newfile_mi', 'New File', 
    () => { ModalFactory.enqueue('file_create'); }));

  var help_menu = new TopMenu(melm, 'helpmenu', 'Help');
  var help_dom = help_menu.render();
  help_menu.add_menu_item(new AlwaysOnMenuItem(help_dom, 'support_mi', 'Support', 
    () => { ModalFactory.enqueue('support'); }));
  help_menu.add_menu_item(new MenuSeparator(help_dom, 'sep2'));
  help_menu.add_menu_item(new AlwaysOnMenuItem(help_dom, 'change_mi', 'Change log', 
    () => { ModalFactory.trigger('changelog'); }));
  help_menu.add_menu_item(new AlwaysOnMenuItem(help_dom, 'privacy_mi', 'Privacy Policy', 
    () => { ModalFactory.trigger('privacy'); }));
  help_menu.add_menu_item(new AlwaysOnMenuItem(help_dom, 'tos_mi', 'Terms of Service', 
    () => { ModalFactory.trigger('tos'); }));
}

/* ( Private Methods )>----------------------------------------------------- */


