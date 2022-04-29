/* ========================================================================= *\

                                    Cloud

   Tolstoy is designed to entirely use cloud storage for persistence. Google
   Drive is the cloud of choice. This interface is a conceptual abstraction,
   but there is no plan to expand to other cloud storage. This module offers
   no true abstraction for additional implementations.

\* ========================================================================= */

/* ( Interface )>----------------------------------------------------------- */

export default {

  // Auth
  connect:       connect,
  login:         login,
  logout:        logout,
  reset:         reset,

  // App Fundamentals
  get_root:      get_root,
  load_state:    load_state,
  set_state:     save_state,
  create_root:   create_root,
  
  // Folders
  folder_create: folder_create,
  folder_list:   folder_list,

  // Project
  proj_create:   proj_create, // Creates folder & metadata file
  proj_load:     proj_load, // Note: just loads metadata file
  proj_list:     proj_list, // Lists all *projects*
  proj_save:     proj_save,
  
  // Objects
  obj_create:    obj_create,
  obj_get_meta:  obj_get_meta,
  obj_load:      obj_load,
  obj_update:    obj_update,
  obj_save:      obj_save,
  obj_delete:    obj_delete,
  obj_test_ts:   obj_test_ts
};


const GPI_LOADER = process.env.GPI_LOADER;
const GPI_CLIENT = process.env.GPI_CLIENT;
const GPI_SCOPE  = process.env.GPI_SCOPE;
const GPI_PARAMS = {
  'api_key':       process.env.GPI_KEY, 
  'client_id':     process.env.GPI_CLI_ID,
  'scope':         GPI_SCOPE,
  'discoveryDocs': [ process.env.GPI_DISCOVERY ]
};
const MIME_TYPE_FOLDER = 'application/vnd.google-apps.folder';
const MIME_TYPE_JSON   = 'application/json';
const PROJ_META_NAME   = 'proj.meta.json';

var gpi = null;
var gauth = null;
var auth_resolver = {res: null, rej: null};
var state_fid = null;
var root_fid = null;
 
/* ( Public Auth Methods )>------------------------------------------------- */

function connect() {
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
  console.log('Deleting state file.');
  await gpi.client.drive.files.delete({fileId: state_fid});
  console.log('revoking credentials.');
  gauth.disconnect();
}

/* ( Public State Methods )>------------------------------------------------ */

function get_root() {
  return root_fid;
}

async function load_state() {
  try {
    state_fid = await _get_app_state();
    if (!state_fid) { 
      return null;
    } else {
      var body = await obj_load(state_fid);
      var state = JSON.parse(body);
      root_fid = state.root;
      return state;
    }
  } catch (err) {
    console.log(err);
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
    body:   JSON.stringify(s)
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

/* ( Public Folder Methods )>----------------------------------------------- */

async function folder_create(parent, name, props, desc) {
  var folder = {
    name:        name,
    mimeType:    MIME_TYPE_FOLDER,
    properties:  props,
    description: desc,
    parents:     [parent]
  };
  var rsp = await gpi.client.drive.files.create({
    resource: folder,
    fields: 'id'
  });
  return rsp.result.id;
}

// Q: should this restrict to json? 
async function folder_list(parid) {
  var rsp = await gpi.client.drive.files.list({
    q: `mimeType='application/json' and '${parid}' in parents and name != '${PROJ_META_NAME}'`,
    fields: "files(id, name, mimeType, modifiedTime)"
  });
  return rsp.result.files;
}

/* ( Public Project Methods )>---------------------------------------------- */

async function proj_create(name) {
  return await folder_create(root_fid, name, { curr: 'NA' }, `A project named ${name}` );
}

async function proj_load(id) {
  var ret = {};
  var rsp = await obj_get_meta(id);
  ret.proj = rsp;
  var lst = await gpi.client.drive.files.list({
    q: `'${id}' in parents`,
    fields: "files(id, name, description, properties, modifiedTime)"
  });
  ret.files = lst.result.files;
  return ret;
}

async function proj_list() {
  var rsp = await gpi.client.drive.files.list({
    q: `mimeType='${MIME_TYPE_FOLDER}' and '${root_fid}' in parents`,
    fields: "files(id, name, modifiedTime)"
  });
  return rsp.result.files;
}

async function proj_save(id, name, curr) {
  var rsp = await gpi.client.drive.files.update({
    fileId: id,
    name: name,
    properties: { curr: curr }
  });
  return rsp;
} 

/* ( Public Object Methods )>----------------------------------------------- */

async function obj_create(parid, name, mime) {
  if (!mime) mime = MIME_TYPE_JSON;
  var file = {
    name: name,
    'mimeType': mime,
    parents: [parid]
  };
  var rsp = await gpi.client.drive.files.create({
      resource: file,
      fields: 'id,modifiedTime'
    });
  const dt = Date.parse(rsp.result.modifiedTime);
  return {
    id: rsp.result.id,
    ts: dt
  };
}

async function obj_get_meta(id) {
  var rsp = await gpi.client.drive.files.get({ fileId: id, fields: 'name,properties,description,modifiedTime' });
  if (rsp && rsp.result) {
    return { 
      name: rsp.result.name,
      ts:   Date.parse(rsp.result.modifiedTime),
      prop: rsp.result.properties,
      desc: rsp.result.description
    };
  }
  return null;
}

async function obj_test_ts(id, ts) {
  if (!ts) {
    return false;
  }
  var rsp = await gpi.client.drive.files.get({ fileId: id, fields: 'name,modifiedTime' });
  if (ts == Date.parse(rsp.result.modifiedTime)) {
    return false;
  } 
  return true;
}

async function obj_load(id) {
  var rsp = await gpi.client.drive.files.get({'fileId': id, alt: 'media'});
  return rsp.body;
}

async function obj_update(id, name, desc) {
  var params = { name: name,
                 description: desc };
  return await gpi.client.drive.files.update( { fileId: id, resource: params });
}

async function obj_save(id, content) {
  var rsp = await gpi.client.request({
    path:   '/upload/drive/v3/files/' + id,
    method: 'PATCH',
    params: { uploadType: 'media' },
    body: content
  });
  rsp = await gpi.client.drive.files.get({fileId: id, fields: 'modifiedTime'});
  return Date.parse(rsp.result.modifiedTime);
}

async function obj_delete(id) {
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


