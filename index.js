/// <reference path="node_modules/@citizenfx/server/index.d.ts" />
const axios = require('axios').default;
const config = require('./config.json');
const { getError } = require('./errors');
let canRun = false;

axios.defaults.baseURL = 'https://discord.com/api/v8';
axios.defaults.headers = {
  Authorization: `Bot ${config.discordData.token}`,
  'Content-Type': 'application/json'
};

if (config.debug) {
  axios.interceptors.request.use(function (config) {
    console.log(`^3[discordroles | DEBUG] ${config.method} ${config.url}^7\n`);
    return config;
  });  
}

axios.interceptors.response.use((res) => (res), (err) => {
  if (err.response.status !== 404)
    console.log(`\n^1[discordroles] request to discord API failed.\n  • ${getError(err)}^7\n`);
  return Promise.reject(err);
});

async function validateToken() {
  const res = await axios('/users/@me');
  if (res.data.id) {
    console.log(`\n^2[discordroles] successfully validated bot token.\n  ^7• Current account: ^6${res.data.username}#${res.data.discriminator} (${res.data.id})^7\n`);
    canRun = true;
  }
}

async function checkUpdate() {
  try {
    const res = await axios({
      url: 'https://raw.githubusercontent.com/sadboilogan/discordroles/master/config.json'
    });
    const hasNewVersion = res.data.version !== config.version;
    if (hasNewVersion) console.log('^1[discordroles] discordroles is not up to date. download the latest version at:\n  - https://github.com/sadboilogan/discordroles^7\n');
    else console.log('^2[discordroles] discordroles is up to date.^7');
  } catch(err) {
    console.log('\n^1[discordroles] failed to check version^7');
  }
}

function getUserDiscord(user) {
  if (typeof user === 'string') return user;
  if (!GetPlayerName(user)) return false;
  for (let idIndex = 0; idIndex <= GetNumPlayerIdentifiers(user); idIndex ++) {
    if (GetPlayerIdentifier(user, idIndex).indexOf('discord:') !== -1) return GetPlayerIdentifier(user, idIndex).replace('discord:', '');
  }
  return false;
}

exports('isRolePresent', (user, role, ...args) => {
  if (!canRun) return console.log('^1[discordroles] authentication error, exports wont run.^7');
  const isArgGuild = typeof args[0] === 'string';
  const selectedGuild = isArgGuild ? args[0] : config.discordData.guild;
  const discordUser = getUserDiscord(user); 
  if (!discordUser) return isArgGuild ? args[1](false) : args[0](false);
  axios(`/guilds/${selectedGuild}/members/${discordUser}`).then((res) => {
    const hasRole = typeof role === 'string' ? res.data.roles.includes(role) : res.data.roles.some((curRole, index) => res.data.roles.includes(role[index]));
    isArgGuild ? args[1](hasRole, res.data.roles) : args[0](hasRole, res.data.roles);
  }).catch((err) => {
    if (err.response.status === 404) {
      isArgGuild ? args[1](false) : args[0](false);
    }
  });
});

exports('getUserRoles', (user, ...args) => {
  if (!canRun) return console.log('^1[discordroles] authentication error, exports wont run.^7');
  const isArgGuild = typeof args[0] === 'string';
  const selectedGuild = isArgGuild ? args[0] : config.discordData.guild;
  const discordUser = getUserDiscord(user); 
  if (!discordUser) return isArgGuild ? args[1](false) : args[0](false);
  axios(`/guilds/${selectedGuild}/members/${discordUser}`).then((res) => {
    isArgGuild ? args[1](res.data.roles) : args[0](res.data.roles);
  }).catch((err) => {
    if (err.response.status === 404) {
      isArgGuild ? args[1](false) : args[0](false);
    }
  });
});

exports('getUserData', (user, ...args) => {
  if (!canRun) return console.log('^1[discordroles] authentication error, exports wont run.^7');
  const isArgGuild = typeof args[0] === 'string';
  const selectedGuild = isArgGuild ? args[0] : config.discordData.guild;
  const discordUser = getUserDiscord(user); 
  if (!discordUser) return isArgGuild ? args[1](false) : args[0](false);
  axios(`/guilds/${selectedGuild}/members/${discordUser}`).then((res) => {
    isArgGuild ? args[1](res.data) : args[0](res.data);
  }).catch((err) => {
    if (err.response.status === 404) {
      isArgGuild ? args[1](false) : args[0](false);
    }
  });
});

validateToken();
checkUpdate();
