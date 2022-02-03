/*! For license information please see extension.js.LICENSE.txt */
!function(t,e){for(var i in e)t[i]=e[i];e.__esModule&&Object.defineProperty(t,"__esModule",{value:!0})}(exports,(()=>{"use strict";var t={601:(t,e)=>{var i;Object.defineProperty(e,"__esModule",{value:!0}),e.LogLevel=e.COMMAND_STATUS_BAR_ENABLED=e.COMMAND_STATUS_BAR_CODING_ACTIVITY=e.COMMAND_PROXY=e.COMMAND_LOG_FILE=e.COMMAND_DISABLE=e.COMMAND_DEBUG=e.COMMAND_DASHBOARD=e.COMMAND_CONFIG_FILE=e.COMMAND_API_KEY=void 0,e.COMMAND_API_KEY="wakatime.apikey",e.COMMAND_CONFIG_FILE="wakatime.config_file",e.COMMAND_DASHBOARD="wakatime.dashboard",e.COMMAND_DEBUG="wakatime.debug",e.COMMAND_DISABLE="wakatime.disable",e.COMMAND_LOG_FILE="wakatime.log_file",e.COMMAND_PROXY="wakatime.proxy",e.COMMAND_STATUS_BAR_CODING_ACTIVITY="wakatime.status_bar_coding_activity",e.COMMAND_STATUS_BAR_ENABLED="wakatime.status_bar_enabled",(i=e.LogLevel||(e.LogLevel={}))[i.DEBUG=0]="DEBUG",i[i.INFO=1]="INFO",i[i.WARN=2]="WARN",i[i.ERROR=3]="ERROR"},593:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Utils=void 0,e.Utils=class{static quote(t){return t.includes(" ")?`"${t.replace('"','\\"')}"`:t}static validateKey(t){const e="Invalid api key... check https://wakatime.com/settings for your key";return t&&new RegExp("^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$","i").test(t)?"":e}static validateProxy(t){if(!t)return"";let e;return e=-1===t.indexOf("\\")?new RegExp("^((https?|socks5)://)?([^:@]+(:([^:@])+)?@)?[\\w\\.-]+(:\\d+)?$","i"):new RegExp("^.*\\\\.+$","i"),e.test(t)?"":"Invalid proxy. Valid formats are https://user:pass@host:port or socks5://user:pass@host:port or domain\\user:pass"}static formatDate(t){let e="AM",i=t.getHours();i>11&&(e="PM",i-=12),0==i&&(i=12);let a=t.getMinutes();return`${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][t.getMonth()]} ${t.getDate()}, ${t.getFullYear()} ${i}:${a<10?`0${a}`:a} ${e}`}static obfuscateKey(t){let e="";return t&&(e=t,t.length>4&&(e="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXX"+t.substring(t.length-4))),e}static wrapArg(t){return t.indexOf(" ")>-1?'"'+t.replace(/"/g,'\\"')+'"':t}static formatArguments(t,e){let i=e.slice(0);i.unshift(this.wrapArg(t));let a=[],r="";for(let t=0;t<i.length;t++)"--key"==r?a.push(this.wrapArg(this.obfuscateKey(i[t]))):a.push(this.wrapArg(i[t])),r=i[t];return a.join(" ")}}},236:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.deactivate=e.activate=void 0;const a=i(549),r=i(601),s=i(890),o=i(169);var n,l=new s.Logger(r.LogLevel.INFO);e.activate=function(t){n=new o.WakaTime(l,t.globalState),t.subscriptions.push(a.commands.registerCommand(r.COMMAND_API_KEY,(function(){n.promptForApiKey()}))),t.subscriptions.push(a.commands.registerCommand(r.COMMAND_DEBUG,(function(){n.promptForDebug()}))),t.subscriptions.push(a.commands.registerCommand(r.COMMAND_DISABLE,(function(){n.promptToDisable()}))),t.subscriptions.push(a.commands.registerCommand(r.COMMAND_STATUS_BAR_ENABLED,(function(){n.promptStatusBarIcon()}))),t.subscriptions.push(a.commands.registerCommand(r.COMMAND_STATUS_BAR_CODING_ACTIVITY,(function(){n.promptStatusBarCodingActivity()}))),t.subscriptions.push(a.commands.registerCommand(r.COMMAND_DASHBOARD,(function(){n.openDashboardWebsite()}))),t.subscriptions.push(n),n.initialize()},e.deactivate=function(){n.dispose()}},890:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Logger=void 0;const a=i(601);e.Logger=class{constructor(t){this.setLevel(t)}getLevel(){return this.level}setLevel(t){this.level=t}log(t,e){t>=this.level&&(e=`[WakaTime][${a.LogLevel[t]}] ${e}`,t==a.LogLevel.DEBUG&&console.log(e),t==a.LogLevel.INFO&&console.info(e),t==a.LogLevel.WARN&&console.warn(e),t==a.LogLevel.ERROR&&console.error(e))}debug(t){this.log(a.LogLevel.DEBUG,t)}info(t){this.log(a.LogLevel.INFO,t)}warn(t){this.log(a.LogLevel.WARN,t)}warnException(t){void 0!==t.message&&this.log(a.LogLevel.WARN,t.message)}error(t){this.log(a.LogLevel.ERROR,t)}errorException(t){void 0!==t.message&&this.log(a.LogLevel.ERROR,t.message)}}},169:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.WakaTime=void 0;const a=i(655),r=i(549),s=i(601),o=i(593);e.WakaTime=class{constructor(t,e){this.statusBar=r.window.createStatusBarItem(r.StatusBarAlignment.Left),this.lastHeartbeat=0,this.dedupe={},this.fetchTodayInterval=6e4,this.lastFetchToday=0,this.disabled=!0,this.logger=t,this.config=e}initialize(){this.statusBar.command=s.COMMAND_DASHBOARD,"true"==this.config.get("wakatime.debug")&&this.logger.setLevel(s.LogLevel.DEBUG);let t=r.extensions.getExtension("WakaTime.vscode-wakatime");if(this.extension=null!=t&&t.packageJSON||{version:"0.0.0"},this.logger.debug(`Initializing WakaTime v${this.extension.version}`),this.agentName="vscode",this.statusBar.text="$(clock) WakaTime Initializing...",this.statusBar.show(),this.setupEventListeners(),this.disabled="true"===this.config.get("wakatime.disabled"),this.disabled)return this.setStatusBarVisibility(!1),void this.logger.debug("Extension disabled, will not report coding stats to dashboard.");this.checkApiKey(),this.initializeDependencies()}initializeDependencies(){this.logger.debug("WakaTime initialized."),this.statusBar.text="$(clock)",this.statusBar.tooltip="WakaTime: Initialized";const t=this.config.get("wakatime.status_bar_enabled");this.showStatusBar="false"!==t,this.setStatusBarVisibility(this.showStatusBar),"false"==this.config.get("wakatime.status_bar_coding_activity")?this.showCodingActivity=!1:(this.showCodingActivity=!0,this.getCodingActivity())}promptForApiKey(){let t=this.config.get("wakatime.api_key")||"";""!=o.Utils.validateKey(t)&&(t="");let e={prompt:"WakaTime Api Key",placeHolder:"Enter your api key from https://wakatime.com/settings",value:t,ignoreFocusOut:!0,validateInput:o.Utils.validateKey.bind(this)};r.window.showInputBox(e).then((t=>{if(null!=t){let e=o.Utils.validateKey(t);""===e?this.config.update("wakatime.api_key",t):r.window.setStatusBarMessage(e)}else r.window.setStatusBarMessage("WakaTime api key not provided")}))}promptForDebug(){let t=this.config.get("wakatime.debug")||"";t&&"true"===t||(t="false");let e={placeHolder:`true or false (current value "${t}")`,value:t,ignoreFocusOut:!0};r.window.showQuickPick(["true","false"],e).then((t=>{null!=t&&(this.config.update("wakatime.debug",t),"true"===t?(this.logger.setLevel(s.LogLevel.DEBUG),this.logger.debug("Debug enabled")):this.logger.setLevel(s.LogLevel.INFO))}))}promptToDisable(){let t=this.config.get("wakatime.disabled");t&&"true"===t||(t="false");let e={placeHolder:`disable or enable (extension is currently "${"true"===t?"disabled":"enabled"}")`,ignoreFocusOut:!0};r.window.showQuickPick(["disable","enable"],e).then((t=>{"enable"!==t&&"disable"!==t||(this.disabled="disable"===t,this.disabled?(this.config.update("wakatime.disabled","true"),this.setStatusBarVisibility(!1),this.logger.debug("Extension disabled, will not report coding stats to dashboard.")):(this.config.update("wakatime.disabled","false"),this.checkApiKey(),this.initializeDependencies(),this.showStatusBar&&this.setStatusBarVisibility(!0),this.logger.debug("Extension enabled and reporting coding stats to dashboard.")))}))}promptStatusBarIcon(){let t=this.config.get("wakatime.status_bar_enabled")||"";t&&"false"===t||(t="true");let e={placeHolder:`true or false (current value "${t}")`,value:t,ignoreFocusOut:!0};r.window.showQuickPick(["true","false"],e).then((t=>{"true"!==t&&"false"!==t||(this.config.update("wakatime.status_bar_enabled",t),this.showStatusBar="true"===t,this.setStatusBarVisibility(this.showStatusBar))}))}promptStatusBarCodingActivity(){let t=this.config.get("wakatime.status_bar_coding_activity")||"";t&&"false"===t||(t="true");let e={placeHolder:`true or false (current value "${t}")`,value:t,ignoreFocusOut:!0};r.window.showQuickPick(["true","false"],e).then((t=>{"true"!==t&&"false"!==t||(this.config.update("wakatime.status_bar_coding_activity",t),"true"===t?(this.logger.debug("Coding activity in status bar has been enabled"),this.showCodingActivity=!0,this.getCodingActivity(!0)):(this.logger.debug("Coding activity in status bar has been disabled"),this.showCodingActivity=!1,-1==this.statusBar.text.indexOf("Error")&&(this.statusBar.text="$(clock)")))}))}openDashboardWebsite(){r.env.openExternal(r.Uri.parse("https://wakatime.com/"))}dispose(){this.statusBar.dispose(),this.disposable.dispose(),clearTimeout(this.getCodingActivityTimeout)}checkApiKey(){this.hasApiKey((t=>{t||this.promptForApiKey()}))}hasApiKey(t){const e=this.config.get("wakatime.api_key")||"";t(""===o.Utils.validateKey(e))}setStatusBarVisibility(t){t?(this.statusBar.show(),this.logger.debug("Status bar icon enabled.")):(this.statusBar.hide(),this.logger.debug("Status bar icon disabled."))}setupEventListeners(){let t=[];r.window.onDidChangeTextEditorSelection(this.onChange,this,t),r.window.onDidChangeActiveTextEditor(this.onChange,this,t),r.workspace.onDidSaveTextDocument(this.onSave,this,t),this.disposable=r.Disposable.from(...t)}onChange(){this.onEvent(!1)}onSave(){this.onEvent(!0)}onEvent(t){if(this.disabled)return;let e=r.window.activeTextEditor;if(e){let i=e.document;if(i){i.languageId;let a=i.fileName;if(a){let r=Date.now();if(t||this.enoughTimePassed(r)||this.lastFile!==a){const s=this.getLanguage(i);this.sendHeartbeat(a,r,e.selection.start,i.lineCount,s,t),this.lastFile=a,this.lastHeartbeat=r}}}}}sendHeartbeat(t,e,i,a,r,s){this.hasApiKey((o=>{o?this._sendHeartbeat(t,e,i,a,r,s):this.promptForApiKey()}))}_sendHeartbeat(t,e,i,s,n,l){return a.__awaiter(this,void 0,void 0,(function*(){if(l&&this.isDuplicateHeartbeat(t,e,i))return;const a={type:"file",entity:t,time:Date.now()/1e3,plugin:this.agentName+"/"+r.version+" vscode-wakatime/"+this.extension.version,lineno:String(i.line+1),cursorpos:String(i.character+1),lines:String(s),is_write:l};let u=this.getProjectName();u&&(a.project=u),n&&(a.language=n),this.logger.debug(`Sending heartbeat: ${JSON.stringify(a)}`);const c=`https://api.wakatime.com/api/v1/users/current/heartbeats?api_key=${this.config.get("wakatime.api_key")}`;try{const t=yield fetch(c,{method:"POST",headers:{"Content-Type":"application/json","User-Agent":this.agentName+"/"+r.version+" vscode-wakatime/"+this.extension.version},body:JSON.stringify(a)}),e=yield t.json();if(200==t.status||201==t.status||202==t.status)this.showStatusBar&&(this.showCodingActivity||(this.statusBar.text="$(clock)"),this.getCodingActivity()),this.logger.debug(`last heartbeat sent ${o.Utils.formatDate(new Date)}`);else if(this.logger.warn(`API Error ${t.status}: ${e}`),t&&401==t.status){let t="Invalid WakaTime Api Key";this.showStatusBar&&(this.statusBar.text="$(clock) WakaTime Error",this.statusBar.tooltip=`WakaTime: ${t}`),this.logger.error(t)}else{let e=`Error sending heartbeat (${t.status}); Check your browser console for more details.`;this.showStatusBar&&(this.statusBar.text="$(clock) WakaTime Error",this.statusBar.tooltip=`WakaTime: ${e}`),this.logger.error(e)}}catch(t){this.logger.warn(`API Error: ${t}`);let e="Error sending heartbeat; Check your browser console for more details.";this.showStatusBar&&(this.statusBar.text="$(clock) WakaTime Error",this.statusBar.tooltip=`WakaTime: ${e}`),this.logger.error(e)}}))}getCodingActivity(t=!1){if(!this.showCodingActivity||!this.showStatusBar)return;const e=Date.now()-this.fetchTodayInterval;!t&&this.lastFetchToday>e||(this.lastFetchToday=Date.now(),this.getCodingActivityTimeout=setTimeout(this.getCodingActivity,this.fetchTodayInterval),this.hasApiKey((t=>{t&&this._getCodingActivity()})))}_getCodingActivity(){return a.__awaiter(this,void 0,void 0,(function*(){this.logger.debug("Fetching coding activity for Today from api.");const t=`https://api.wakatime.com/api/v1/users/current/statusbar/today?api_key=${this.config.get("wakatime.api_key")}`;try{const e=yield fetch(t,{method:"GET",headers:{"Content-Type":"application/json","User-Agent":this.agentName+"/"+r.version+" vscode-wakatime/"+this.extension.version}}),i=yield e.json();if(200==e.status){if(this.config.get("wakatime.status_bar_coding_activity"),this.showStatusBar&&this.showCodingActivity){let t=i.data.grand_total.text;"true"!=this.config.get("wakatime.status_bar_hide_categories")&&i.data.categories.length>1&&(t=i.data.categories.map((t=>t.text+" "+t.name)).join(", ")),t&&t.trim()?(this.statusBar.text=`$(clock) ${t.trim()}`,this.statusBar.tooltip="WakaTime: Today’s coding time. Click to visit dashboard."):(this.statusBar.text="$(clock)",this.statusBar.tooltip="WakaTime: Calculating time spent today in background...")}}else if(this.logger.warn(`API Error ${e.status}: ${i}`),e&&401==e.status){let t="Invalid WakaTime Api Key";this.showStatusBar&&(this.statusBar.text="$(clock) WakaTime Error",this.statusBar.tooltip=`WakaTime: ${t}`),this.logger.error(t)}else{let t=`Error fetching code stats for status bar (${e.status}); Check your browser console for more details.`;this.logger.debug(t)}}catch(t){this.logger.warn(`API Error: ${t}`)}}))}enoughTimePassed(t){return this.lastHeartbeat+12e4<t}isDuplicateHeartbeat(t,e,i){let a=!1;return this.dedupe[t]&&this.dedupe[t].lastHeartbeatAt+18e5<e&&this.dedupe[t].selection.line==i.line&&this.dedupe[t].selection.character==i.character&&(a=!0),this.dedupe[t]={selection:i,lastHeartbeatAt:e},a}getLanguage(t){return t.languageId||""}getProjectName(){return r.workspace.name||""}}},655:(t,e,i)=>{i.r(e),i.d(e,{__extends:()=>r,__assign:()=>s,__rest:()=>o,__decorate:()=>n,__param:()=>l,__metadata:()=>u,__awaiter:()=>c,__generator:()=>h,__createBinding:()=>d,__exportStar:()=>g,__values:()=>p,__read:()=>f,__spread:()=>y,__spreadArrays:()=>b,__await:()=>v,__asyncGenerator:()=>m,__asyncDelegator:()=>_,__asyncValues:()=>w,__makeTemplateObject:()=>A,__importStar:()=>O,__importDefault:()=>S,__classPrivateFieldGet:()=>D,__classPrivateFieldSet:()=>B});var a=function(t,e){return(a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i])})(t,e)};function r(t,e){function i(){this.constructor=t}a(t,e),t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)}var s=function(){return(s=Object.assign||function(t){for(var e,i=1,a=arguments.length;i<a;i++)for(var r in e=arguments[i])Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t}).apply(this,arguments)};function o(t,e){var i={};for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&e.indexOf(a)<0&&(i[a]=t[a]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(a=Object.getOwnPropertySymbols(t);r<a.length;r++)e.indexOf(a[r])<0&&Object.prototype.propertyIsEnumerable.call(t,a[r])&&(i[a[r]]=t[a[r]])}return i}function n(t,e,i,a){var r,s=arguments.length,o=s<3?e:null===a?a=Object.getOwnPropertyDescriptor(e,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,a);else for(var n=t.length-1;n>=0;n--)(r=t[n])&&(o=(s<3?r(o):s>3?r(e,i,o):r(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o}function l(t,e){return function(i,a){e(i,a,t)}}function u(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)}function c(t,e,i,a){return new(i||(i=Promise))((function(r,s){function o(t){try{l(a.next(t))}catch(t){s(t)}}function n(t){try{l(a.throw(t))}catch(t){s(t)}}function l(t){var e;t.done?r(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(o,n)}l((a=a.apply(t,e||[])).next())}))}function h(t,e){var i,a,r,s,o={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return s={next:n(0),throw:n(1),return:n(2)},"function"==typeof Symbol&&(s[Symbol.iterator]=function(){return this}),s;function n(s){return function(n){return function(s){if(i)throw new TypeError("Generator is already executing.");for(;o;)try{if(i=1,a&&(r=2&s[0]?a.return:s[0]?a.throw||((r=a.return)&&r.call(a),0):a.next)&&!(r=r.call(a,s[1])).done)return r;switch(a=0,r&&(s=[2&s[0],r.value]),s[0]){case 0:case 1:r=s;break;case 4:return o.label++,{value:s[1],done:!1};case 5:o.label++,a=s[1],s=[0];continue;case 7:s=o.ops.pop(),o.trys.pop();continue;default:if(!((r=(r=o.trys).length>0&&r[r.length-1])||6!==s[0]&&2!==s[0])){o=0;continue}if(3===s[0]&&(!r||s[1]>r[0]&&s[1]<r[3])){o.label=s[1];break}if(6===s[0]&&o.label<r[1]){o.label=r[1],r=s;break}if(r&&o.label<r[2]){o.label=r[2],o.ops.push(s);break}r[2]&&o.ops.pop(),o.trys.pop();continue}s=e.call(t,o)}catch(t){s=[6,t],a=0}finally{i=r=0}if(5&s[0])throw s[1];return{value:s[0]?s[1]:void 0,done:!0}}([s,n])}}}var d=Object.create?function(t,e,i,a){void 0===a&&(a=i),Object.defineProperty(t,a,{enumerable:!0,get:function(){return e[i]}})}:function(t,e,i,a){void 0===a&&(a=i),t[a]=e[i]};function g(t,e){for(var i in t)"default"===i||Object.prototype.hasOwnProperty.call(e,i)||d(e,t,i)}function p(t){var e="function"==typeof Symbol&&Symbol.iterator,i=e&&t[e],a=0;if(i)return i.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&a>=t.length&&(t=void 0),{value:t&&t[a++],done:!t}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")}function f(t,e){var i="function"==typeof Symbol&&t[Symbol.iterator];if(!i)return t;var a,r,s=i.call(t),o=[];try{for(;(void 0===e||e-- >0)&&!(a=s.next()).done;)o.push(a.value)}catch(t){r={error:t}}finally{try{a&&!a.done&&(i=s.return)&&i.call(s)}finally{if(r)throw r.error}}return o}function y(){for(var t=[],e=0;e<arguments.length;e++)t=t.concat(f(arguments[e]));return t}function b(){for(var t=0,e=0,i=arguments.length;e<i;e++)t+=arguments[e].length;var a=Array(t),r=0;for(e=0;e<i;e++)for(var s=arguments[e],o=0,n=s.length;o<n;o++,r++)a[r]=s[o];return a}function v(t){return this instanceof v?(this.v=t,this):new v(t)}function m(t,e,i){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var a,r=i.apply(t,e||[]),s=[];return a={},o("next"),o("throw"),o("return"),a[Symbol.asyncIterator]=function(){return this},a;function o(t){r[t]&&(a[t]=function(e){return new Promise((function(i,a){s.push([t,e,i,a])>1||n(t,e)}))})}function n(t,e){try{(i=r[t](e)).value instanceof v?Promise.resolve(i.value.v).then(l,u):c(s[0][2],i)}catch(t){c(s[0][3],t)}var i}function l(t){n("next",t)}function u(t){n("throw",t)}function c(t,e){t(e),s.shift(),s.length&&n(s[0][0],s[0][1])}}function _(t){var e,i;return e={},a("next"),a("throw",(function(t){throw t})),a("return"),e[Symbol.iterator]=function(){return this},e;function a(a,r){e[a]=t[a]?function(e){return(i=!i)?{value:v(t[a](e)),done:"return"===a}:r?r(e):e}:r}}function w(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e,i=t[Symbol.asyncIterator];return i?i.call(t):(t=p(t),e={},a("next"),a("throw"),a("return"),e[Symbol.asyncIterator]=function(){return this},e);function a(i){e[i]=t[i]&&function(e){return new Promise((function(a,r){!function(t,e,i,a){Promise.resolve(a).then((function(e){t({value:e,done:i})}),e)}(a,r,(e=t[i](e)).done,e.value)}))}}}function A(t,e){return Object.defineProperty?Object.defineProperty(t,"raw",{value:e}):t.raw=e,t}var k=Object.create?function(t,e){Object.defineProperty(t,"default",{enumerable:!0,value:e})}:function(t,e){t.default=e};function O(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var i in t)"default"!==i&&Object.prototype.hasOwnProperty.call(t,i)&&d(e,t,i);return k(e,t),e}function S(t){return t&&t.__esModule?t:{default:t}}function D(t,e){if(!e.has(t))throw new TypeError("attempted to get private field on non-instance");return e.get(t)}function B(t,e,i){if(!e.has(t))throw new TypeError("attempted to set private field on non-instance");return e.set(t,i),i}},549:t=>{t.exports=require("vscode")}},e={};function i(a){if(e[a])return e[a].exports;var r=e[a]={exports:{}};return t[a](r,r.exports,i),r.exports}return i.d=(t,e)=>{for(var a in e)i.o(e,a)&&!i.o(t,a)&&Object.defineProperty(t,a,{enumerable:!0,get:e[a]})},i.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),i.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i(236)})());
//# sourceMappingURL=extension.js.map