function o(o){return o.split("_").map((o=>o.charAt(0).toUpperCase()+o.slice(1))).join(" ")}const e=(o,e)=>new Promise((s=>{setTimeout((()=>{e&&e(),s()}),o)}));const s=new class{constructor(o){this.disableAll=o}info(o,...e){this.disableAll||"production"===process.env.NODE_ENV||console.info(o,...e)}debug(o,...e){this.disableAll||"production"===process.env.NODE_ENV||console.debug(o,...e)}warn(o,...e){this.disableAll||console.warn(o,...e)}error(o,...e){var s;this.disableAll||"production"===(null===(s=import.meta.env)||void 0===s?void 0:s.MODE)||console.error(o,...e)}}(!1);function i(o){if(!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(o))return"Invalid email."}export{o as capitalize,e as delay,s as logger,i as validateEmail};
