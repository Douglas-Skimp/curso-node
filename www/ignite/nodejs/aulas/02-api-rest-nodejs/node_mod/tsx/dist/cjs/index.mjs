import f from"path";import x from"fs";import m from"module";import{parseTsconfig as F,getTsconfig as j,createFilesMatcher as E,createPathsMatcher as O}from"get-tsconfig";import{installSourceMapSupport as P}from"../source-map.mjs";import{p as M,t as g,a as A}from"../index-bd1ceb03.mjs";import{r as N}from"../resolve-ts-path-eb3847f5.mjs";import{c as R}from"../client-e665d820.mjs";import"url";import"esbuild";import"crypto";import"os";import"../temporary-directory-04b36185.mjs";import"net";import"../get-pipe-path-b74d9893.mjs";const b=t=>{if(t.includes("import")||t.includes("export"))try{return M(t)[3]}catch{return!0}return!1},I=/^\.{1,2}\//,C=/\.[cm]?tsx?$/,D=`${f.sep}node_modules${f.sep}`,a=process.env.TSX_TSCONFIG_PATH?{path:f.resolve(process.env.TSX_TSCONFIG_PATH),config:F(process.env.TSX_TSCONFIG_PATH)}:j(),h=a&&E(a),_=a&&O(a),v=P(),l=m._extensions,G=l[".js"],H=[".cts",".mts",".ts",".tsx",".jsx"],X=[".js",".cjs",".mjs"];let p;R.then(t=>{p=t},()=>{});const y=(t,s)=>{p&&p({type:"dependency",path:s});const r=H.some(o=>s.endsWith(o)),n=X.some(o=>s.endsWith(o));if(!r&&!n)return G(t,s);let e=x.readFileSync(s,"utf8");if(s.endsWith(".cjs")){const o=g(s,e);o&&(e=v(o))}else if(r||b(e)){const o=A(e,s,{tsconfigRaw:h==null?void 0:h(s)});e=v(o)}t._compile(e,s)};[".js",".ts",".tsx",".jsx"].forEach(t=>{l[t]=y}),Object.defineProperty(l,".mjs",{value:y,enumerable:!1});const d=m._resolveFilename.bind(m);m._resolveFilename=(t,s,r,n)=>{var e;const o=t.indexOf("?");if(o!==-1&&(t=t.slice(0,o)),_&&!I.test(t)&&!((e=s==null?void 0:s.filename)!=null&&e.includes(D))){const i=_(t);for(const u of i){const T=S(u,s,r,n);if(T)return T;try{return d(u,s,r,n)}catch{}}}const c=S(t,s,r,n);return c||d(t,s,r,n)};const S=(t,s,r,n)=>{const e=N(t);if(s!=null&&s.filename&&C.test(s.filename)&&e)for(const o of e)try{return d(o,s,r,n)}catch(c){const{code:i}=c;if(i!=="MODULE_NOT_FOUND"&&i!=="ERR_PACKAGE_PATH_NOT_EXPORTED")throw c}};