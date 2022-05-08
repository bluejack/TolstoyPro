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
  app_create:    app_create,
  app_load:      app_load,
  app_save:      app_save,

  // Project
  proj_create:   proj_create,
  proj_load:     proj_load, 
  proj_save:     proj_save,
  proj_list:     proj_list,
  proj_rename:   proj_rename,
  
  // Documents
  doc_create:    doc_create,
  doc_load:      doc_load,
  doc_save:      doc_save,
  doc_rename:    doc_rename,
  doc_delete:    _obj_delete,
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

const OBJ_TYPE_APP      = 'app';
const OBJ_TYPE_PROJECT  = 'project';
const OBJ_TYPE_DOCUMENT = 'doc';
const OBJ_TYPE_META     = 'meta';

const ROOT_FOLDER       = 'Tolstoy';

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
  await _obj_delete(state_fid);
  console.log('revoking credentials.');
  gauth.disconnect();
}

/* ( Public App Methods )>-------------------------------------------------- */

async function app_create() {
  
  root_fid  = _root_create();
  state_fid = _app_state_create();

  [root_fid, state_fid] = await Promise.all([root_fid, state_fid]);
  
  return root_fid;
}

async function app_load() {
  try {
    state_fid = await _app_state_load();
    if (!state_fid) { 
      return null;
    } else {
      var body = await _obj_data(state_fid);
      var state = JSON.parse(body);
      root_fid = state.root;
      return state;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function app_save(s) {
  if (!state_fid) {
    throw new Error('no-state-file');
  }
  return await _obj_write_data(state_fid, JSON.stringify(s));  
}

/* ( Public Project Methods )>---------------------------------------------- */

async function proj_create(name) {
  const proj_id = await _obj_create(root_fid, name, OBJ_TYPE_PROJECT, MIME_TYPE_FOLDER);
  const meta_id = await _obj_create(proj_id, PROJ_META_NAME, OBJ_TYPE_META, MIME_TYPE_JSON);
  return { proj_id: proj_id, meta_id: meta_id };
}

async function proj_load(id) {
  const meta_id   = await _pmeta_find(id, PROJ_META_NAME, OBJ_TYPE_META);
  const proj_meta = await _obj_data(meta_id);
  if (proj_meta) {
    return JSON.parse(proj_meta);
  } else {
    return null;
  }
}

async function proj_rename(id, name) {
  return await _obj_write_meta(id, name, {type: OBJ_TYPE_META});
}

async function proj_save(id, state) {
  return await _obj_write_data(id, JSON.stringify(state));
}

async function proj_list() {
  return await _folder_list(root_fid);
}

/* ( Public Document Methods )>--------------------------------------------- */

async function doc_create(parid, name) {
  return await _obj_create(parid, name, MIME_TYPE_JSON, { type: 'doc' });
}

async function doc_load(id) {
  return await _obj_data(id);
}

async function doc_save(id, content) {
  return await _obj_write_data(id, content);
}

async function doc_rename(id, name) {
  return await _obj_write_meta(id, name);
}

/* ( Private Object Methods )>----------------------------------------------- */



/* ( Private Methods )>----------------------------------------------------- */

async function _root_create() {
  var obj_def = {
    name: ROOT_FOLDER,
    mimeType: MIME_TYPE_FOLDER,
    appProperties: { type: OBJ_TYPE_APP }
  };
  var rsp = await gpi.client.drive.files.create({
    resource: obj_def,
    fields: 'id'
  });
  return rsp.result.id;
}

async function _obj_create(parent, name, type, mime) {
  var obj_def = {
    name:          name,
    mimeType:      mime,
    appProperties: { type: type },
    parents:       [parent]
  };
  var rsp = await gpi.client.drive.files.create({
    resource: obj_def,
    fields: 'id'
  });
  return rsp.result.id;
}

async function _obj_write_meta(id, name, props) {
  var params = { name: name,
                 properties: props };
  return await gpi.client.drive.files.update( { fileId: id, resource: params });
}

async function _obj_write_data(id, content) {
  var rsp = await gpi.client.request({
    path:   '/upload/drive/v3/files/' + id,
    method: 'PATCH',
    params: { uploadType: 'media' },
    body:   content
  });
  rsp = await gpi.client.drive.files.get({fileId: id, fields: 'modifiedTime'});
  return Date.parse(rsp.result.modifiedTime);
}

async function _obj_meta(id) {
  var rsp = await gpi.client.drive.files.get({ fileId: id, fields: 'name,appProperties,modifiedTime' });
  if (rsp && rsp.result) {
    return { 
      name: rsp.result.name,
      ts:   Date.parse(rsp.result.modifiedTime),
      prop: rsp.result.properties
    };
  }
  return null;
}

async function _obj_data(id) {
  var rsp = await gpi.client.drive.files.get({'fileId': id, alt: 'media'});
  if (! rsp.body) rsp.body = '{}';
  return rsp.body;
}

async function _obj_delete(id) {
  return gpi.client.drive.files.delete({
   fileId: id
  });      
}

async function _folder_list(id) {
  const param = {
    q: `'${id}' in parents`,
    fields: 'files/id,files/name'
  };
  const rsp = await gpi.client.drive.files.list( param );
  if (!rsp.result) {
    return null;
  } else {
    return rsp.result.files;
  }
}

// would it make sense to put the project file in the project space, and to name it with the project id?
// Problem would be if there are any orphaned files based on user delete of projects, would need 
// clean up mechanism.
async function _pmeta_find(id, type) {
  var param = { 
    q: `name = '${PROJ_META_NAME}' and '${id}' in parents and appProperties has { key='type' and value='meta' } `,
    fields: 'files/id'
  };
  var rsp;
  try {
    rsp = await gpi.client.drive.files.list( param );
  } catch (err) {
    console.log(err);
    return null;
  }
  if (!rsp.result || !rsp.result.files || rsp.result.files.length == 0) {
    return null;
  } else {
    return rsp.result.files[0]['id'];
  }
}

async function _app_state_create() {
  var data = await gpi.client.drive.files.create({
      resource: {
        name: 'state.json',
        parents: ['appDataFolder']
      },
      fields: 'id'
  });
  return data.result.id;
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

async function _app_state_load() {
  var param = { 'spaces': 'appDataFolder', 'fields': '*' };
  var rsp = await gpi.client.drive.files.list( param );
  if (!rsp.result || !rsp.result.files || rsp.result.files.length == 0) {
    return null;
  } else {
    return rsp.result.files[0]['id'];
  }
}


