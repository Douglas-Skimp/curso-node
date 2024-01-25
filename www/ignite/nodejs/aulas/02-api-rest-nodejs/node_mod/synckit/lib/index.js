import { __awaiter } from "tslib";
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { MessageChannel, Worker, parentPort, receiveMessageOnPort, workerData, } from 'node:worker_threads';
import { findUp, isPkgAvailable, tryExtensions } from '@pkgr/core';
export * from './types.js';
export const TsRunner = {
    TsNode: 'ts-node',
    EsbuildRegister: 'esbuild-register',
    EsbuildRunner: 'esbuild-runner',
    SWC: 'swc',
    TSX: 'tsx',
};
const { SYNCKIT_BUFFER_SIZE, SYNCKIT_TIMEOUT, SYNCKIT_EXEC_ARGV, SYNCKIT_TS_RUNNER, SYNCKIT_GLOBAL_SHIMS, NODE_OPTIONS, } = process.env;
export const DEFAULT_BUFFER_SIZE = SYNCKIT_BUFFER_SIZE
    ? +SYNCKIT_BUFFER_SIZE
    : undefined;
export const DEFAULT_TIMEOUT = SYNCKIT_TIMEOUT ? +SYNCKIT_TIMEOUT : undefined;
export const DEFAULT_WORKER_BUFFER_SIZE = DEFAULT_BUFFER_SIZE || 1024;
export const DEFAULT_EXEC_ARGV = (SYNCKIT_EXEC_ARGV === null || SYNCKIT_EXEC_ARGV === void 0 ? void 0 : SYNCKIT_EXEC_ARGV.split(',')) || [];
export const DEFAULT_TS_RUNNER = SYNCKIT_TS_RUNNER;
export const DEFAULT_GLOBAL_SHIMS = ['1', 'true'].includes(SYNCKIT_GLOBAL_SHIMS);
export const DEFAULT_GLOBAL_SHIMS_PRESET = [
    {
        moduleName: 'node-fetch',
        globalName: 'fetch',
    },
    {
        moduleName: 'node:perf_hooks',
        globalName: 'performance',
        named: 'performance',
    },
];
export const MTS_SUPPORTED_NODE_VERSION = 16;
const syncFnCache = new Map();
export function extractProperties(object) {
    if (object && typeof object === 'object') {
        const properties = {};
        for (const key in object) {
            properties[key] = object[key];
        }
        return properties;
    }
}
export function createSyncFn(workerPath, bufferSizeOrOptions, timeout) {
    if (!path.isAbsolute(workerPath)) {
        throw new Error('`workerPath` must be absolute');
    }
    const cachedSyncFn = syncFnCache.get(workerPath);
    if (cachedSyncFn) {
        return cachedSyncFn;
    }
    const syncFn = startWorkerThread(workerPath, typeof bufferSizeOrOptions === 'number'
        ? { bufferSize: bufferSizeOrOptions, timeout }
        : bufferSizeOrOptions);
    syncFnCache.set(workerPath, syncFn);
    return syncFn;
}
const cjsRequire = typeof require === 'undefined'
    ? createRequire(import.meta.url)
    : require;
const dataUrl = (code) => new URL(`data:text/javascript,${encodeURIComponent(code)}`);
export const isFile = (path) => {
    var _a;
    try {
        return !!((_a = fs.statSync(path, { throwIfNoEntry: false })) === null || _a === void 0 ? void 0 : _a.isFile());
    }
    catch (_b) {
        return false;
    }
};
const setupTsRunner = (workerPath, { execArgv, tsRunner }) => {
    let ext = path.extname(workerPath);
    if (!/[/\\]node_modules[/\\]/.test(workerPath) &&
        (!ext || /^\.[cm]?js$/.test(ext))) {
        const workPathWithoutExt = ext
            ? workerPath.slice(0, -ext.length)
            : workerPath;
        let extensions;
        switch (ext) {
            case '.cjs': {
                extensions = ['.cts', '.cjs'];
                break;
            }
            case '.mjs': {
                extensions = ['.mts', '.mjs'];
                break;
            }
            default: {
                extensions = ['.ts', '.js'];
                break;
            }
        }
        const found = tryExtensions(workPathWithoutExt, extensions);
        let differentExt;
        if (found && (!ext || (differentExt = found !== workPathWithoutExt))) {
            workerPath = found;
            if (differentExt) {
                ext = path.extname(workerPath);
            }
        }
    }
    const isTs = /\.[cm]?ts$/.test(workerPath);
    let jsUseEsm = workerPath.endsWith('.mjs');
    let tsUseEsm = workerPath.endsWith('.mts');
    if (isTs) {
        if (!tsUseEsm) {
            const pkg = findUp(workerPath);
            if (pkg) {
                tsUseEsm =
                    cjsRequire(pkg).type ===
                        'module';
            }
        }
        if (tsRunner == null && isPkgAvailable(TsRunner.TsNode)) {
            tsRunner = TsRunner.TsNode;
        }
        switch (tsRunner) {
            case TsRunner.TsNode: {
                if (tsUseEsm) {
                    if (!execArgv.includes('--loader')) {
                        execArgv = ['--loader', `${TsRunner.TsNode}/esm`, ...execArgv];
                    }
                }
                else if (!execArgv.includes('-r')) {
                    execArgv = ['-r', `${TsRunner.TsNode}/register`, ...execArgv];
                }
                break;
            }
            case TsRunner.EsbuildRegister: {
                if (!execArgv.includes('-r')) {
                    execArgv = ['-r', TsRunner.EsbuildRegister, ...execArgv];
                }
                break;
            }
            case TsRunner.EsbuildRunner: {
                if (!execArgv.includes('-r')) {
                    execArgv = ['-r', `${TsRunner.EsbuildRunner}/register`, ...execArgv];
                }
                break;
            }
            case TsRunner.SWC: {
                if (!execArgv.includes('-r')) {
                    execArgv = ['-r', `@${TsRunner.SWC}-node/register`, ...execArgv];
                }
                break;
            }
            case TsRunner.TSX: {
                if (!execArgv.includes('--loader')) {
                    execArgv = ['--loader', TsRunner.TSX, ...execArgv];
                }
                break;
            }
            default: {
                throw new Error(`Unknown ts runner: ${String(tsRunner)}`);
            }
        }
    }
    else if (!jsUseEsm) {
        const pkg = findUp(workerPath);
        if (pkg) {
            jsUseEsm =
                cjsRequire(pkg).type === 'module';
        }
    }
    if (process.versions.pnp) {
        const nodeOptions = NODE_OPTIONS === null || NODE_OPTIONS === void 0 ? void 0 : NODE_OPTIONS.split(/\s+/);
        let pnpApiPath;
        try {
            pnpApiPath = cjsRequire.resolve('pnpapi');
        }
        catch (_a) { }
        if (pnpApiPath &&
            !(nodeOptions === null || nodeOptions === void 0 ? void 0 : nodeOptions.some((option, index) => ['-r', '--require'].includes(option) &&
                pnpApiPath === cjsRequire.resolve(nodeOptions[index + 1]))) &&
            !execArgv.includes(pnpApiPath)) {
            execArgv = ['-r', pnpApiPath, ...execArgv];
            const pnpLoaderPath = path.resolve(pnpApiPath, '../.pnp.loader.mjs');
            if (isFile(pnpLoaderPath)) {
                const experimentalLoader = pathToFileURL(pnpLoaderPath).toString();
                execArgv = ['--experimental-loader', experimentalLoader, ...execArgv];
            }
        }
    }
    return {
        ext,
        isTs,
        jsUseEsm,
        tsRunner,
        tsUseEsm,
        workerPath,
        execArgv,
    };
};
const md5Hash = (text) => createHash('md5').update(text).digest('hex');
export const encodeImportModule = (moduleNameOrGlobalShim, type = 'import') => {
    const { moduleName, globalName, named, conditional } = typeof moduleNameOrGlobalShim === 'string'
        ? { moduleName: moduleNameOrGlobalShim }
        : moduleNameOrGlobalShim;
    const importStatement = type === 'import'
        ? `import${globalName
            ? ' ' +
                (named === null
                    ? '* as ' + globalName
                    : (named === null || named === void 0 ? void 0 : named.trim())
                        ? `{${named}}`
                        : globalName) +
                ' from'
            : ''} '${path.isAbsolute(moduleName)
            ? String(pathToFileURL(moduleName))
            : moduleName}'`
        : `${globalName
            ? 'const ' + ((named === null || named === void 0 ? void 0 : named.trim()) ? `{${named}}` : globalName) + '='
            : ''}require('${moduleName
            .replace(/\\/g, '\\\\')}')`;
    if (!globalName) {
        return importStatement;
    }
    const overrideStatement = `globalThis.${globalName}=${(named === null || named === void 0 ? void 0 : named.trim()) ? named : globalName}`;
    return (importStatement +
        (conditional === false
            ? `;${overrideStatement}`
            : `;if(!globalThis.${globalName})${overrideStatement}`));
};
export const _generateGlobals = (globalShims, type) => globalShims.reduce((acc, shim) => `${acc}${acc ? ';' : ''}${encodeImportModule(shim, type)}`, '');
const globalsCache = new Map();
let tmpdir;
const _dirname = typeof __dirname === 'undefined'
    ? path.dirname(fileURLToPath(import.meta.url))
    : __dirname;
export const generateGlobals = (workerPath, globalShims, type = 'import') => {
    const cached = globalsCache.get(workerPath);
    if (cached) {
        const [content, filepath] = cached;
        if ((type === 'require' && !filepath) ||
            (type === 'import' && filepath && isFile(filepath))) {
            return content;
        }
    }
    const globals = _generateGlobals(globalShims, type);
    let content = globals;
    let filepath;
    if (type === 'import') {
        if (!tmpdir) {
            tmpdir = path.resolve(findUp(_dirname), '../node_modules/.synckit');
        }
        fs.mkdirSync(tmpdir, { recursive: true });
        filepath = path.resolve(tmpdir, md5Hash(workerPath) + '.mjs');
        content = encodeImportModule(filepath);
        fs.writeFileSync(filepath, globals);
    }
    globalsCache.set(workerPath, [content, filepath]);
    return content;
};
function startWorkerThread(workerPath, { bufferSize = DEFAULT_WORKER_BUFFER_SIZE, timeout = DEFAULT_TIMEOUT, execArgv = DEFAULT_EXEC_ARGV, tsRunner = DEFAULT_TS_RUNNER, transferList = [], globalShims = DEFAULT_GLOBAL_SHIMS, } = {}) {
    const { port1: mainPort, port2: workerPort } = new MessageChannel();
    const { isTs, ext, jsUseEsm, tsUseEsm, tsRunner: finalTsRunner, workerPath: finalWorkerPath, execArgv: finalExecArgv, } = setupTsRunner(workerPath, { execArgv, tsRunner });
    const workerPathUrl = pathToFileURL(finalWorkerPath);
    if (/\.[cm]ts$/.test(finalWorkerPath)) {
        const isTsxSupported = !tsUseEsm ||
            Number.parseFloat(process.versions.node) >= MTS_SUPPORTED_NODE_VERSION;
        if (!finalTsRunner) {
            throw new Error('No ts runner specified, ts worker path is not supported');
        }
        else if ([
            TsRunner.EsbuildRegister,
            TsRunner.EsbuildRunner,
            TsRunner.SWC,
            ...(isTsxSupported ? [] : [TsRunner.TSX]),
        ].includes(finalTsRunner)) {
            throw new Error(`${finalTsRunner} is not supported for ${ext} files yet` +
                (isTsxSupported
                    ? ', you can try [tsx](https://github.com/esbuild-kit/tsx) instead'
                    : ''));
        }
    }
    const finalGlobalShims = (globalShims === true
        ? DEFAULT_GLOBAL_SHIMS_PRESET
        : Array.isArray(globalShims)
            ? globalShims
            : []).filter(({ moduleName }) => isPkgAvailable(moduleName));
    const useGlobals = finalGlobalShims.length > 0;
    const useEval = isTs ? !tsUseEsm : !jsUseEsm && useGlobals;
    const worker = new Worker((jsUseEsm && useGlobals) || (tsUseEsm && finalTsRunner === TsRunner.TsNode)
        ? dataUrl(`${generateGlobals(finalWorkerPath, finalGlobalShims)};import '${String(workerPathUrl)}'`)
        : useEval
            ? `${generateGlobals(finalWorkerPath, finalGlobalShims, 'require')};${encodeImportModule(finalWorkerPath, 'require')}`
            : workerPathUrl, {
        eval: useEval,
        workerData: { workerPort },
        transferList: [workerPort, ...transferList],
        execArgv: finalExecArgv,
    });
    let nextID = 0;
    const syncFn = (...args) => {
        const id = nextID++;
        const sharedBuffer = new SharedArrayBuffer(bufferSize);
        const sharedBufferView = new Int32Array(sharedBuffer);
        const msg = { sharedBuffer, id, args };
        worker.postMessage(msg);
        const status = Atomics.wait(sharedBufferView, 0, 0, timeout);
        if (!['ok', 'not-equal'].includes(status)) {
            throw new Error('Internal error: Atomics.wait() failed: ' + status);
        }
        const { id: id2, result, error, properties, } = receiveMessageOnPort(mainPort)
            .message;
        if (id !== id2) {
            throw new Error(`Internal error: Expected id ${id} but got id ${id2}`);
        }
        if (error) {
            throw Object.assign(error, properties);
        }
        return result;
    };
    worker.unref();
    return syncFn;
}
export function runAsWorker(fn) {
    if (!workerData) {
        return;
    }
    const { workerPort } = workerData;
    parentPort.on('message', ({ sharedBuffer, id, args }) => {
        ;
        (() => __awaiter(this, void 0, void 0, function* () {
            const sharedBufferView = new Int32Array(sharedBuffer);
            let msg;
            try {
                msg = { id, result: yield fn(...args) };
            }
            catch (error) {
                msg = { id, error, properties: extractProperties(error) };
            }
            workerPort.postMessage(msg);
            Atomics.add(sharedBufferView, 0, 1);
            Atomics.notify(sharedBufferView, 0);
        }))();
    });
}
//# sourceMappingURL=index.js.map