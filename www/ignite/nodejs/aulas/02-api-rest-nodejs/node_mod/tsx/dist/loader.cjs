"use strict";var n=require("./pkgroll_create-require-c530e400.cjs"),u=require("repl"),q=require("esbuild"),r=require("./esm/index.cjs");require("module"),require("worker_threads"),require("./node-features-c450ed54.cjs"),require("./source-map.cjs"),require("path"),require("url"),require("./index-5d1f01e6.cjs"),require("crypto"),require("fs"),require("os"),require("./temporary-directory-2a027842.cjs"),require("./resolve-ts-path-3fca13b7.cjs"),require("./client-2f0df4a6.cjs"),require("net"),require("./get-pipe-path-86e97fc9.cjs"),require("get-tsconfig");function c(e){const{eval:a}=e,l=async function(i,s,t,o){try{i=(await q.transform(i,{sourcefile:t,loader:"ts",tsconfigRaw:{compilerOptions:{preserveValueImports:!0}},define:{require:"global.require"}})).code}catch{}return a.call(this,i,s,t,o)};e.eval=l}const{start:v}=u;u.start=function(){const e=Reflect.apply(v,this,arguments);return c(e),e},n.require("./cjs/index.cjs"),exports.globalPreload=r.globalPreload,exports.initialize=r.initialize,exports.load=r.load,exports.resolve=r.resolve;