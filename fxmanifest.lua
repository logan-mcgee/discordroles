fx_version 'bodacious'
games { 'gta5', 'rdr3' }

author 'logan. (Illusive)'
description 'Allows for discord and fivem to interact'
version '1.0.0'

dependency 'yarn'

server_scripts {
  'index.js',
}

server_exports {
  'isRolePresent',
  'getUserRoles',
  'getUserData',
}
