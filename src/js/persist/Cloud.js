/* ========================================================================= *\

                                    Cloud

   Tolstoy is designed to entirely use cloud storage for persistence. Google
   Drive is the cloud of choice. This interface is a conceptual abstraction,
   but there is no plan to expand to other cloud storage. This module offers
   no true abstraction for additional implementations.

\* ========================================================================= */

import Log from '../sys/Log.js';

/* ( Interface )>----------------------------------------------------------- */

export default {
  connect:       conn,
  login:         login,
  logout:        logout,
  reset:         reset,
  get_root:      get_root,
  load_state:    load_state,
  set_state:     save_state,
  create_root:   create_root,
  create_folder: create_folder,
  pull_folder:   pull_folder,
  list_folder:   list_folder,
  get_obj_meta:  get_obj_meta,
  new_proj_meta: new_proj_meta,
  get_proj_meta: get_proj_meta,
  rename_obj:    rename_obj,
  create_file:   create_file,
  save_file:     save_file,
  load_file:     load_file, 
  delete_file:   del_file
};

/* ( Members )>------------------------------------------------------------- */

const GPI_LOADER = `${process.env.GPI_LOADER}`;
const GPI_CLIENT = `${process.env.GPI_CLIENT}`;
const GPI_SCOPE  = `${process.env.GPI_SCOPE}`;
const GPI_PARAMS = {
  'api_key':       `${process.env.GPI_KEY}`, 
  'client_id':     `${process.env.GPI_CLI_ID}`,
  'scope':         GPI_SCOPE,
  'discoveryDocs': [`${process.env.GPI_DISCOVERY}`]
};
const MIME_TYPE_FOLDER = 'application/vnd.google-apps.folder';
const MIME_TYPE_JSON   = 'application/json';
const PROJ_META_NAME   = 'proj.meta.json';

var gpi = null;
var gauth = null;
var auth_resolver = {res: null, rej: null};
var state_fid = null;
var root_fid = null;
 
/* ( Public Methods )>------------------------------------------------------ */
 
function get_root() {
  return root_fid;
}

function conn() {
  return new Promise((resolve, reject) => {
    
    auth_resolver.res = resolve;
    auth_resolver.rej = reject;
        
    function __load_cli() {
      gpi.load(GPI_CLIENT, __init_cli);
    }
    
    function __init_cli() {
      gpi.client.init(GPI_PARAMS)
        .then(
          function () {
            gauth = gpi.auth2.getAuthInstance();
            // Listen for state changes:
            gauth.isSignedIn.listen(_test_status);
            _test_status();
          }, 
          function(err) {
            reject(err);
          }
      );
    }
    
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = GPI_LOADER;
    script.onload = function() {
      gpi = window.gapi;
      __load_cli();
  };
  document.getElementsByTagName("head")[0].appendChild(script);
    
  });  
}
 
function login() {
  return new Promise((resolve, reject) => {
    auth_resolver.res = resolve;
    auth_resolver.rej = reject;
    gauth.signIn()
      .then(
        function() {
          _test_status();
        }, 
        function(err) {
          reject(err);
        }
      );
  });
}

async function logout() {
  gauth.signOut();
}

async function reset() {
  Log.debug('Deleting state file.');
  await gpi.client.drive.files.delete({fileId: state_fid});
  Log.debug('revoking credentials.');
  gauth.disconnect();
}

async function load_state() {
  try {
    state_fid = await _get_app_state();
    if (!state_fid) { 
      return null;
    } else {
      var body = await load_file(state_fid);
      var state = JSON.parse(body);
      root_fid = state.root;
      return state;
    }
  } catch (err) {
    Log.warning('No state file found.');
    return null;
  }
}

async function save_state(s) {
  if (!state_fid) {
    await _create_state();
  }
  var rsp = await gpi.client.request({
    path:   '/upload/drive/v3/files/' + state_fid,
    method: 'PATCH',
    params: { uploadType: 'media' },
    body: JSON.stringify(s)
  });
  return rsp;
}

async function create_root() {
  var folder = {
    name:     'TolstoyPro',
    mimeType: MIME_TYPE_FOLDER
  };
  var rsp = await gpi.client.drive.files.create({
    resource: folder,
    fields: 'id'
  });
  root_fid = rsp.result.id;
  return rsp.result.id;
}

async function create_folder(parent, name) {
  var folder = {
    name:     name,
    mimeType: MIME_TYPE_FOLDER,
    parents:  [parent]
  };
  var rsp = await gpi.client.drive.files.create({
    resource: folder,
    fields: 'id'
  });
  return rsp.result.id;
}

async function get_obj_meta(id) {
  var rsp = await gpi.client.drive.files.get({ fileId: id });
  if (rsp && rsp.result) {
    return rsp.result.name;
  }
  return null;
}

async function rename_obj(id, name) {
  var params = { name: name };
  return await gpi.client.drive.files.update( { fileId: id, resource: params });
}

async function pull_folder(parid) {
  var rsp = await gpi.client.drive.files.list({
    q: "mimeType='application/vnd.google-apps.folder' and '" + parid + "' in parents",
    fields: "files(id, name, mimeType)"
  });
  return rsp.result.files;
}

async function list_folder(parid) {
  var rsp = await gpi.client.drive.files.list({
    q: `mimeType='application/json' and '${parid}' in parents and name != '${PROJ_META_NAME}'`,
    fields: "files(id, name, mimeType)"
  });
  return rsp.result.files;
}

async function create_file(parid, name, mime) {
  if (!mime) mime = MIME_TYPE_JSON;
  var file = {
    name: name,
    'mimeType': mime,
    parents: [parid]
  };
  var rsp = await gpi.client.drive.files.create({
      resource: file,
      fields: 'id'
    });
  return rsp.result.id;
}

async function save_file(id, content) {
  var rsp = await gpi.client.request({
    path:   '/upload/drive/v3/files/' + id,
    method: 'PATCH',
    params: { uploadType: 'media' },
    body: content
  });
  return rsp;
}

async function load_file(id) {
  var rsp = await gpi.client.drive.files.get({'fileId': id, 'alt': 'media'});
  return rsp.body;
}

async function get_proj_meta(parent) {
  var rsp = await gpi.client.drive.files.list({
    q: `mimeType='${MIME_TYPE_JSON}' and name='${PROJ_META_NAME}' and '${parent}' in parents`,
    fields: 'files(id)'
  });
  if (rsp.result.files && rsp.result.files[0]) {
    return { id: rsp.result.files[0].id, meta: await load_file(rsp.result.files[0].id) };
  } else {
    return null;
  }
}

async function new_proj_meta(parent, content) {
  var id = await create_file(parent, PROJ_META_NAME, MIME_TYPE_JSON);
  await save_file(id, content);
  return id;
}

async function del_file(id) {
  return gpi.client.drive.files.delete({
   fileId: id
  });      
}

/* ( Private Methods )>----------------------------------------------------- */

async function _create_state() {
  var data = await gpi.client.drive.files.create({
      resource: {
        name: 'state.json',
        parents: ['appDataFolder']
      },
      fields: 'id'
  });
  state_fid = data.result.id;
  return state_fid;
}

function _test_status() {
  var u = gauth.currentUser.get();
  var isAuthorized = u.hasGrantedScopes(GPI_SCOPE);
  if (isAuthorized) {
    var user = _parse_user(u.getBasicProfile());
    auth_resolver.res(user);
  } else {
    auth_resolver.rej('needs-login');
  }
}

function _parse_user(prof) {
  return {
    fname: prof.getGivenName(),
    lname: prof.getFamilyName(),
    email: prof.getEmail()
  };
}

async function _get_app_state() {
  var param = { 'spaces': 'appDataFolder', 'fields': '*' };
  var rsp = await gpi.client.drive.files.list( param );
  if (!rsp.result || !rsp.result.files || rsp.result.files.length == 0) {
    return null;
  } else {
    return rsp.result.files[0]['id'];
  }
}


