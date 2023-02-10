/*! For license information please see 789.445cb4ae.chunk.js.LICENSE.txt */
(self.webpackChunkopenbooks=self.webpackChunkopenbooks||[]).push([[789],{2009:function(e,t){"use strict";t.byteLength=function(e){var t=f(e),n=t[0],r=t[1];return 3*(n+r)/4-r},t.toByteArray=function(e){var t,n,i=f(e),s=i[0],u=i[1],a=new o(function(e,t,n){return 3*(t+n)/4-n}(0,s,u)),c=0,h=u>0?s-4:s;for(n=0;n<h;n+=4)t=r[e.charCodeAt(n)]<<18|r[e.charCodeAt(n+1)]<<12|r[e.charCodeAt(n+2)]<<6|r[e.charCodeAt(n+3)],a[c++]=t>>16&255,a[c++]=t>>8&255,a[c++]=255&t;2===u&&(t=r[e.charCodeAt(n)]<<2|r[e.charCodeAt(n+1)]>>4,a[c++]=255&t);1===u&&(t=r[e.charCodeAt(n)]<<10|r[e.charCodeAt(n+1)]<<4|r[e.charCodeAt(n+2)]>>2,a[c++]=t>>8&255,a[c++]=255&t);return a},t.fromByteArray=function(e){for(var t,r=e.length,o=r%3,i=[],s=16383,u=0,f=r-o;u<f;u+=s)i.push(a(e,u,u+s>f?f:u+s));1===o?(t=e[r-1],i.push(n[t>>2]+n[t<<4&63]+"==")):2===o&&(t=(e[r-2]<<8)+e[r-1],i.push(n[t>>10]+n[t>>4&63]+n[t<<2&63]+"="));return i.join("")};for(var n=[],r=[],o="undefined"!==typeof Uint8Array?Uint8Array:Array,i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",s=0,u=i.length;s<u;++s)n[s]=i[s],r[i.charCodeAt(s)]=s;function f(e){var t=e.length;if(t%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var n=e.indexOf("=");return-1===n&&(n=t),[n,n===t?0:4-n%4]}function a(e,t,r){for(var o,i,s=[],u=t;u<r;u+=3)o=(e[u]<<16&16711680)+(e[u+1]<<8&65280)+(255&e[u+2]),s.push(n[(i=o)>>18&63]+n[i>>12&63]+n[i>>6&63]+n[63&i]);return s.join("")}r["-".charCodeAt(0)]=62,r["_".charCodeAt(0)]=63},47465:function(e){"use strict";var t,n="object"===typeof Reflect?Reflect:null,r=n&&"function"===typeof n.apply?n.apply:function(e,t,n){return Function.prototype.apply.call(e,t,n)};t=n&&"function"===typeof n.ownKeys?n.ownKeys:Object.getOwnPropertySymbols?function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:function(e){return Object.getOwnPropertyNames(e)};var o=Number.isNaN||function(e){return e!==e};function i(){i.init.call(this)}e.exports=i,e.exports.once=function(e,t){return new Promise((function(n,r){function o(n){e.removeListener(t,i),r(n)}function i(){"function"===typeof e.removeListener&&e.removeListener("error",o),n([].slice.call(arguments))}d(e,t,i,{once:!0}),"error"!==t&&function(e,t,n){"function"===typeof e.on&&d(e,"error",t,n)}(e,o,{once:!0})}))},i.EventEmitter=i,i.prototype._events=void 0,i.prototype._eventsCount=0,i.prototype._maxListeners=void 0;var s=10;function u(e){if("function"!==typeof e)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof e)}function f(e){return void 0===e._maxListeners?i.defaultMaxListeners:e._maxListeners}function a(e,t,n,r){var o,i,s,a;if(u(n),void 0===(i=e._events)?(i=e._events=Object.create(null),e._eventsCount=0):(void 0!==i.newListener&&(e.emit("newListener",t,n.listener?n.listener:n),i=e._events),s=i[t]),void 0===s)s=i[t]=n,++e._eventsCount;else if("function"===typeof s?s=i[t]=r?[n,s]:[s,n]:r?s.unshift(n):s.push(n),(o=f(e))>0&&s.length>o&&!s.warned){s.warned=!0;var c=new Error("Possible EventEmitter memory leak detected. "+s.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");c.name="MaxListenersExceededWarning",c.emitter=e,c.type=t,c.count=s.length,a=c,console&&console.warn&&console.warn(a)}return e}function c(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function h(e,t,n){var r={fired:!1,wrapFn:void 0,target:e,type:t,listener:n},o=c.bind(r);return o.listener=n,r.wrapFn=o,o}function p(e,t,n){var r=e._events;if(void 0===r)return[];var o=r[t];return void 0===o?[]:"function"===typeof o?n?[o.listener||o]:[o]:n?function(e){for(var t=new Array(e.length),n=0;n<t.length;++n)t[n]=e[n].listener||e[n];return t}(o):l(o,o.length)}function v(e){var t=this._events;if(void 0!==t){var n=t[e];if("function"===typeof n)return 1;if(void 0!==n)return n.length}return 0}function l(e,t){for(var n=new Array(t),r=0;r<t;++r)n[r]=e[r];return n}function d(e,t,n,r){if("function"===typeof e.on)r.once?e.once(t,n):e.on(t,n);else{if("function"!==typeof e.addEventListener)throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof e);e.addEventListener(t,(function o(i){r.once&&e.removeEventListener(t,o),n(i)}))}}Object.defineProperty(i,"defaultMaxListeners",{enumerable:!0,get:function(){return s},set:function(e){if("number"!==typeof e||e<0||o(e))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");s=e}}),i.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},i.prototype.setMaxListeners=function(e){if("number"!==typeof e||e<0||o(e))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+e+".");return this._maxListeners=e,this},i.prototype.getMaxListeners=function(){return f(this)},i.prototype.emit=function(e){for(var t=[],n=1;n<arguments.length;n++)t.push(arguments[n]);var o="error"===e,i=this._events;if(void 0!==i)o=o&&void 0===i.error;else if(!o)return!1;if(o){var s;if(t.length>0&&(s=t[0]),s instanceof Error)throw s;var u=new Error("Unhandled error."+(s?" ("+s.message+")":""));throw u.context=s,u}var f=i[e];if(void 0===f)return!1;if("function"===typeof f)r(f,this,t);else{var a=f.length,c=l(f,a);for(n=0;n<a;++n)r(c[n],this,t)}return!0},i.prototype.addListener=function(e,t){return a(this,e,t,!1)},i.prototype.on=i.prototype.addListener,i.prototype.prependListener=function(e,t){return a(this,e,t,!0)},i.prototype.once=function(e,t){return u(t),this.on(e,h(this,e,t)),this},i.prototype.prependOnceListener=function(e,t){return u(t),this.prependListener(e,h(this,e,t)),this},i.prototype.removeListener=function(e,t){var n,r,o,i,s;if(u(t),void 0===(r=this._events))return this;if(void 0===(n=r[e]))return this;if(n===t||n.listener===t)0===--this._eventsCount?this._events=Object.create(null):(delete r[e],r.removeListener&&this.emit("removeListener",e,n.listener||t));else if("function"!==typeof n){for(o=-1,i=n.length-1;i>=0;i--)if(n[i]===t||n[i].listener===t){s=n[i].listener,o=i;break}if(o<0)return this;0===o?n.shift():function(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}(n,o),1===n.length&&(r[e]=n[0]),void 0!==r.removeListener&&this.emit("removeListener",e,s||t)}return this},i.prototype.off=i.prototype.removeListener,i.prototype.removeAllListeners=function(e){var t,n,r;if(void 0===(n=this._events))return this;if(void 0===n.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==n[e]&&(0===--this._eventsCount?this._events=Object.create(null):delete n[e]),this;if(0===arguments.length){var o,i=Object.keys(n);for(r=0;r<i.length;++r)"removeListener"!==(o=i[r])&&this.removeAllListeners(o);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"===typeof(t=n[e]))this.removeListener(e,t);else if(void 0!==t)for(r=t.length-1;r>=0;r--)this.removeListener(e,t[r]);return this},i.prototype.listeners=function(e){return p(this,e,!0)},i.prototype.rawListeners=function(e){return p(this,e,!1)},i.listenerCount=function(e,t){return"function"===typeof e.listenerCount?e.listenerCount(t):v.call(e,t)},i.prototype.listenerCount=v,i.prototype.eventNames=function(){return this._eventsCount>0?t(this._events):[]}},84038:function(e,t){t.read=function(e,t,n,r,o){var i,s,u=8*o-r-1,f=(1<<u)-1,a=f>>1,c=-7,h=n?o-1:0,p=n?-1:1,v=e[t+h];for(h+=p,i=v&(1<<-c)-1,v>>=-c,c+=u;c>0;i=256*i+e[t+h],h+=p,c-=8);for(s=i&(1<<-c)-1,i>>=-c,c+=r;c>0;s=256*s+e[t+h],h+=p,c-=8);if(0===i)i=1-a;else{if(i===f)return s?NaN:1/0*(v?-1:1);s+=Math.pow(2,r),i-=a}return(v?-1:1)*s*Math.pow(2,i-r)},t.write=function(e,t,n,r,o,i){var s,u,f,a=8*i-o-1,c=(1<<a)-1,h=c>>1,p=23===o?Math.pow(2,-24)-Math.pow(2,-77):0,v=r?0:i-1,l=r?1:-1,d=t<0||0===t&&1/t<0?1:0;for(t=Math.abs(t),isNaN(t)||t===1/0?(u=isNaN(t)?1:0,s=c):(s=Math.floor(Math.log(t)/Math.LN2),t*(f=Math.pow(2,-s))<1&&(s--,f*=2),(t+=s+h>=1?p/f:p*Math.pow(2,1-h))*f>=2&&(s++,f/=2),s+h>=c?(u=0,s=c):s+h>=1?(u=(t*f-1)*Math.pow(2,o),s+=h):(u=t*Math.pow(2,h-1)*Math.pow(2,o),s=0));o>=8;e[n+v]=255&u,v+=l,u/=256,o-=8);for(s=s<<o|u,a+=o;a>0;e[n+v]=255&s,v+=l,s/=256,a-=8);e[n+v-l]|=128*d}}}]);
//# sourceMappingURL=789.445cb4ae.chunk.js.map