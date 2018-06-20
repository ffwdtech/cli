import * as path from "path";
import debug from "./lib/debug";
import Compiler from "./lib/compiler";
import * as  watch from "node-watch";
import { performance } from "perf_hooks";

const userDefinedSourceFolder = './src';
const rootFolder = process.cwd();
const sourceFolder = path.join(rootFolder, userDefinedSourceFolder || '.');

const folder = `${sourceFolder}/**/`;

const initFiles = [
  `${folder}*.js`,
  `${folder}*.jsx`,
  `${folder}*.html`,
  `${folder}*.css`
];

debug.log('Starting up..');

const perFileTransformers:any[] = [];
const bundleTransformers:any[] = [];

const compiler = new Compiler({
  rootFolder,
  perFileTransformers,
  bundleTransformers
});

async function runWithPerformanceCalc(options: any) {
  var t0 = performance.now();
  await compiler.compile(options);
  var t1 = performance.now();
  debug.log(`Done in ${t1 - t0}ms.`);
}

async function run() {
  
  debug.log('Doing initial compilation..');

  await runWithPerformanceCalc({
    sourceFiles: initFiles
  });

  debug.log('Initial compilation done. Starting file watcher.');

  watch(sourceFolder, { recursive: true }, async (evt:any, name:string) => {

    debug.log('--------------------------------------------------------------------------------');
    debug.log(`${name} changed. Recompiling bundle..`);

    await runWithPerformanceCalc({
      sourceFiles: initFiles
    });

  });

}

run();
