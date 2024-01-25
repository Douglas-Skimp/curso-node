import{isMainThread as F}from"worker_threads";import{i as w,a as v,m as M}from"../node-features-fb266590.mjs";import N from"module";import{installSourceMapSupport as _}from"../source-map.mjs";import f from"path";import{fileURLToPath as P,pathToFileURL as U}from"url";import{b as D,t as A}from"../index-bd1ceb03.mjs";import{r as J}from"../resolve-ts-path-eb3847f5.mjs";import{c as b}from"../client-e665d820.mjs";import{parseTsconfig as x,getTsconfig as I,createFilesMatcher as L,createPathsMatcher as $}from"get-tsconfig";import T from"fs";import"esbuild";import"crypto";import"os";import"../temporary-directory-04b36185.mjs";import"net";import"../get-pipe-path-b74d9893.mjs";const C=()=>{_(),N.register("./index.mjs",{parentURL:import.meta.url,data:!0})},p=new Map;async function W(t){if(p.has(t))return p.get(t);if(!await T.promises.access(t).then(()=>!0,()=>!1)){p.set(t,void 0);return}const o=await T.promises.readFile(t,"utf8");try{const e=JSON.parse(o);return p.set(t,e),e}catch{throw new Error(`Error parsing: ${t}`)}}async function q(t){let r=new URL("package.json",t);for(;!r.pathname.endsWith("/node_modules/package.json");){const o=P(r),e=await W(o);if(e)return e;const a=r;if(r=new URL("../package.json",r),r.pathname===a.pathname)break}}async function G(t){var r;const o=await q(t);return(r=o==null?void 0:o.type)!=null?r:"commonjs"}const u=process.env.TSX_TSCONFIG_PATH?{path:f.resolve(process.env.TSX_TSCONFIG_PATH),config:x(process.env.TSX_TSCONFIG_PATH)}:I(),H=u&&L(u),E=u&&$(u),k="file://",h=/\.([cm]?ts|[tj]sx)($|\?)/,X=/\.json(?:$|\?)/,K=t=>{const r=f.extname(t);if(r===".json")return"json";if(r===".mjs"||r===".mts")return"module";if(r===".cjs"||r===".cts")return"commonjs"},Q=t=>{const r=K(t);if(r)return r;if(h.test(t))return G(t)},R=_(),S=/\/(?:$|\?)/,z=async t=>{if(!t)throw new Error(`tsx must be loaded with --import instead of --loader
The --loader flag was deprecated in Node v20.6.0 and v18.19.0`)},B=()=>`
const require = getBuiltin('module').createRequire("${import.meta.url}");
require('../source-map.cjs').installSourceMapSupport();
`,d=async(t,r,o)=>{const e=await t(r,o);return!e.format&&e.url.startsWith(k)&&(e.format=await Q(e.url)),e},V=[".js",".json",".ts",".tsx",".jsx"];async function l(t,r,o){const[e,a]=t.split("?");let c;for(const n of V)try{return await d(o,e+n+(a?`?${a}`:""),r)}catch(s){if(c===void 0&&s instanceof Error){const{message:i}=s;s.message=s.message.replace(`${n}'`,"'"),s.stack=s.stack.replace(i,s.message),c=s}}throw c}async function j(t,r,o){const e=S.test(t),a=e?"index":"/index",[c,n]=t.split("?");try{return await l(c+a+(n?`?${n}`:""),r,o)}catch(s){if(!e)try{return await l(t,r,o)}catch{}const i=s,{message:m}=i;throw i.message=i.message.replace(`${a.replace("/",f.sep)}'`,"'"),i.stack=i.stack.replace(m,i.message),i}}const Y=/^\.{1,2}\//,O=async function(t,r,o,e){var a;if(S.test(t))return await j(t,r,o);const c=t.startsWith(k)||Y.test(t);if(E&&!c&&!((a=r.parentURL)!=null&&a.includes("/node_modules/"))){const n=E(t);for(const s of n)try{return await O(U(s).toString(),r,o)}catch{}}if(h.test(r.parentURL)){const n=J(t);if(n)for(const s of n)try{return await d(o,s,r)}catch(i){const{code:m}=i;if(m!=="ERR_MODULE_NOT_FOUND"&&m!=="ERR_PACKAGE_PATH_NOT_EXPORTED")throw i}}try{return await d(o,t,r)}catch(n){if(n instanceof Error&&!e){const{code:s}=n;if(s==="ERR_UNSUPPORTED_DIR_IMPORT")try{return await j(t,r,o)}catch(i){if(i.code!=="ERR_PACKAGE_IMPORT_NOT_DEFINED")throw i}if(s==="ERR_MODULE_NOT_FOUND")try{return await l(t,r,o)}catch{}}throw n}};let g;b.then(t=>{g=t},()=>{});const y=w(v)?"importAttributes":"importAssertions",Z=async function(t,r,o){var e;g&&g({type:"dependency",path:t}),X.test(t)&&(r[y]||(r[y]={}),r[y].type="json");const a=await o(t,r);if(!a.source)return a;const c=t.startsWith("file://")?P(t):t,n=a.source.toString();if(a.format==="json"||h.test(t)){const s=await D(n,c,{tsconfigRaw:(e=H)==null?void 0:e(c)});return{format:"module",source:R(s)}}if(a.format==="module"){const s=A(c,n);s&&(a.source=R(s))}return a};w(M)&&F&&C();export{B as globalPreload,z as initialize,Z as load,O as resolve};
