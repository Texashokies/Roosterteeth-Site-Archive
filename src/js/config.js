//import config from '../wrg-config.json';

//const config = await import("../wrg-config.json");

class Site {
  constructor({ title, logoSrc = '' }) {
    this.title = title || 'Web Archives';
    this.logoSrc = logoSrc;
  }
}

class Archive {
  constructor({ name, url = '', description = '', deepLink='',deepLinkAddition='',deepLinkQuery='',downloadLink='',downloadSize='',tag='' }) {
    this.url = url;
    this.description = description;
    this.deepLink = deepLink;
    this.deepLinkAddition = deepLinkAddition;
    this.deepLinkQuery = deepLinkQuery;
    this.downloadLink = downloadLink;
    this.downloadSize = downloadSize;
    this.tag = tag;
    this.name =
      name || url.slice(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
  }
}

class ReplayOptions {
  constructor({ embed, replayBase }) {
    this.embed = embed || 'embed';
    this.replayBase = replayBase || '../replay/';
  }
}

/**
 * @param {string|Object} data - URL string or { name: string; url: string }
 * @param {number} [idx] - Item index in array
 * @returns {Archive}
 */
function makeArchive(data, idx) {
  let name, url,deepLink,deepLinkAddition,deepLinkQuery,downloadLink,downloadSize,tag;
  if (typeof data === 'string') {
    url = data;
  } else if (
    typeof data === 'object' &&
    data.constructor === Object &&
    data.name &&
    data.url
  ) {
    name = data.name;
    url = data.url;
    deepLink = data.deepLink;
    deepLinkAddition = data.deepLinkAddition;
    deepLinkQuery = data.deepLinkQuery;
    downloadSize = data.downloadSize;
    downloadLink = data.downloadLink;
    tag = data.tag;
  }

  if (url) {
    return new Archive({ name, url, description: data.description, deepLink,deepLinkAddition,deepLinkQuery, downloadLink,downloadSize,tag});
  }

  console.error(`Invalid WACZ data at index ${idx || 'unknown'}, skipping`);
}

class WRGConfig {
  constructor(prefix) {
    this.inited = this.load(prefix + "wrg-config.json");
  }

  async load(name) {
    const resp = await fetch(name);
    const json = await resp.json();
    this.init(json);
  }

  init({ site, replay, archives }) {
    this.site = new Site(site || {});
    this.replay = new ReplayOptions(replay || {});
    this.archives = (archives || []).map(makeArchive);
  }
}

let config = null;

async function initConfig(prefix) {
  if (!config) {
    config = new WRGConfig(prefix);
  }
  await config.inited;
  return config;
}

export default initConfig;
