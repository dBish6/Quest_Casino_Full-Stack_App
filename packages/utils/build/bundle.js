function e(e){return e.split("_").map((e=>e.charAt(0).toUpperCase()+e.slice(1))).join(" ")}function o(e,o){const n=Date.now();let s="offline";if(e&&o){s=n-new Date(e).getTime()<=36e4?"online":"away"}return s}const n=new class{constructor(e){this.disableAll=e}info(e,...o){this.disableAll||"production"===process.env.NODE_ENV||console.info(e,...o)}debug(e,...o){this.disableAll||"production"===process.env.NODE_ENV||console.debug(e,...o)}warn(e,...o){this.disableAll||console.warn(e,...o)}error(e,...o){this.disableAll||console.error(e,...o)}}(!1);export{e as capitalize,o as getUserActivityStatus,n as logger};
