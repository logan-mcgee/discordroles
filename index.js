/// <reference path="node_modules/@citizenfx/server/index.d.ts" />
const axios = require('axios').default;
const config = require('./config.json');
const { getError } = require('./errors');
canRun = false;

axios.defaults.baseURL = 'https://discord.com/api/v6';
axios.defaults.headers = {
  Authorization: `Bot ${config.discordData.token}`,
  'Content-Type': 'application/json'
};

if (config.debug) {
  axios.interceptors.request.use(function (config) {
    console.log(`^3[discordroles | DEBUG] ${config.method} ${config.baseURL}${config.url}^7\n`);
    return config;
  });  
}

axios.interceptors.response.use((res) => (res), (err) => {
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
    else console.log('\n^2[discordroles] discordroles is up to date.^7');
  } catch(err) {
    console.log('\n^1[discordroles] failed to check version^7');
  }
}

function getUserDiscord(user) {
  for (let idIndex = 0; idIndex <= GetNumPlayerIdentifiers(user); idIndex ++) {
    if (GetPlayerIdentifier(user, idIndex).indexOf('discord:') !== -1) return GetPlayerIdentifier(user, idIndex).replace('discord:', '');
  }
}

exports('userHasRole', (user, role, ...args) => {
  const isArgGuild = typeof args[2] === 'string';
  const selectedGuild = isArgGuild ? args[2] : config.discordData.guild;
  axios(`/guilds/${selectedGuild}/members/${getUserDiscord(user)}`).then((res) => {
    const hasRole = typeof role === 'string' ? res.data.roles.includes(role) : res.data.roles.some((curRole, index) => res.data.roles.includes(role[index]));
    isArgGuild ? args[3](hasRole) : args[2](hasRole);
  });
});

validateToken();
checkUpdate();