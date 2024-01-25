"use strict";var O=require("worker_threads"),p=require("../node-features-c450ed54.cjs"),M=require("module"),v=require("../source-map.cjs"),h=require("path"),g=require("url"),R=require("../index-5d1f01e6.cjs"),L=require("../resolve-ts-path-3fca13b7.cjs"),N=require("../client-2f0df4a6.cjs"),d=require("get-tsconfig"),E=require("fs");require("esbuild"),require("crypto"),require("os"),require("../temporary-directory-2a027842.cjs"),require("net"),require("../get-pipe-path-86e97fc9.cjs");var f=typeof document<"u"?document.currentScript:null;const D=()=>{v.installSourceMapSupport(),M.register("./index.mjs",{parentURL:typeof document>"u"?require("url").pathToFileURL(__filename).href:f&&f.src||new URL("esm/index.cjs",document.baseURI).href,data:!0})},m=new Map;async function b(e){if(m.has(e))return m.get(e);if(!await E.promises.access(e).then(()=>!0,()=>!1)){m.set(e,void 0);return}const r=await E.promises.readFile(e,"utf8");try{const a=JSON.parse(r);return m.set(e,a),a}catch{throw new Error(`Error parsing: ${e}`)}}async function x(e){let t=new URL("package.json",e);for(;!t.pathname.endsWith("/node_modules/package.json");){const r=g.fileURLToPath(t),a=await b(r);if(a)return a;const n=t;if(t=new URL("../package.json",t),t.pathname===n.pathname)break}}async function A(e){var t;const r=await x(e);return(t=r==null?void 0:r.type)!=null?t:"commonjs"}const l=process.env.TSX_TSCONFIG_PATH?{path:h.resolve(process.env.TSX_TSCONFIG_PATH),config:d.parseTsconfig(process.env.TSX_TSCONFIG_PATH)}:d.getTsconfig(),I=l&&d.createFilesMatcher(l),q=l&&d.createPathsMatcher(l),S="file://",y=/\.([cm]?ts|[tj]sx)($|\?)/,J=/\.json(?:$|\?)/,C=e=>{const t=h.extname(e);if(t===".json")return"json";if(t===".mjs"||t===".mts")return"module";if(t===".cjs"||t===".cts")return"commonjs"},W=e=>{const t=C(e);if(t)return t;if(y.test(e))return A(e)},k=v.installSourceMapSupport(),U=/\/(?:$|\?)/,G=async e=>{if(!e)throw new Error(`tsx must be loaded with --import instead of --loader
The --loader flag was deprecated in Node v20.6.0 and v18.19.0`)},H=()=>`
const require = getBuiltin('module').createRequire("${typeof document>"u"?require("url").pathToFileURL(__filename).href:f&&f.src||new URL("esm/index.cjs",document.baseURI).href}");
require('../source-map.cjs').installSourceMapSupport();
`,w=async(e,t,r)=>{const a=await e(t,r);return!a.format&&a.url.startsWith(S)&&(a.format=await W(a.url)),a},X=[".js",".json",".ts",".tsx",".jsx"];async function _(e,t,r){const[a,n]=e.split("?");let c;for(const o of X)try{return await w(r,a+o+(n?`?${n}`:""),t)}catch(s){if(c===void 0&&s instanceof Error){const{message:i}=s;s.message=s.message.replace(`${o}'`,"'"),s.stack=s.stack.replace(i,s.message),c=s}}throw c}async function j(e,t,r){const a=U.test(e),n=a?"index":"/index",[c,o]=e.split("?");try{return await _(c+n+(o?`?${o}`:""),t,r)}catch(s){if(!a)try{return await _(e,t,r)}catch{}const i=s,{message:u}=i;throw i.message=i.message.replace(`${n.replace("/",h.sep)}'`,"'"),i.stack=i.stack.replace(u,i.message),i}}const $=/^\.{1,2}\//,F=async function(e,t,r,a){var n;if(U.test(e))return await j(e,t,r);const c=e.startsWith(S)||$.test(e);if(q&&!c&&!((n=t.parentURL)!=null&&n.includes("/node_modules/"))){const o=q(e);for(const s of o)try{return await F(g.pathToFileURL(s).toString(),t,r)}catch{}}if(y.test(t.parentURL)){const o=L.resolveTsPath(e);if(o)for(const s of o)try{return await w(r,s,t)}catch(i){const{code:u}=i;if(u!=="ERR_MODULE_NOT_FOUND"&&u!=="ERR_PACKAGE_PATH_NOT_EXPORTED")throw i}}try{return await w(r,e,t)}catch(o){if(o instanceof Error&&!a){const{code:s}=o;if(s==="ERR_UNSUPPORTED_DIR_IMPORT")try{return await j(e,t,r)}catch(i){if(i.code!=="ERR_PACKAGE_IMPORT_NOT_DEFINED")throw i}if(s==="ERR_MODULE_NOT_FOUND")try{return await _(e,t,r)}catch{}}throw o}};let T;N.connectingToServer.then(e=>{T=e},()=>{});const P=p.isFeatureSupported(p.importAttributes)?"importAttributes":"importAssertions",z=async function(e,t,r){var a;T&&T({type:"dependency",path:e}),J.test(e)&&(t[P]||(t[P]={}),t[P].type="json");const n=await r(e,t);if(!n.source)return n;const c=e.startsWith("file://")?g.fileURLToPath(e):e,o=n.source.toString();if(n.format==="json"||y.test(e)){const s=await R.transform(o,c,{tsconfigRaw:(a=I)==null?void 0:a(c)});return{format:"module",source:k(s)}}if(n.format==="module"){const s=R.transformDynamicImport(c,o);s&&(n.source=k(s))}return n};p.isFeatureSupported(p.moduleRegister)&&O.isMainThread&&D(),exports.globalPreload=H,exports.initialize=G,exports.load=z,exports.resolve=F;