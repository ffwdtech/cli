import * as path from "path";
import debug from "./lib/debug";
import Compiler from "./lib/compiler";
import * as  watch from "node-watch";
import { performance } from "perf_hooks";
import * as colors from "colors/safe";
import FileCategorizer from "./lib/transformers/FileCategorizer";

const userDefinedSourceFolder = './build';
const rootFolder = process.cwd();
const sourceFolder = path.join(rootFolder, userDefinedSourceFolder || '.');

const folder = `${sourceFolder}/**/`;

const initFiles = [
  `${folder}*.js`,
  `${folder}*.jsx`,
  `${folder}*.html`,
  `${folder}*.css`
];

const perFileTransformers:any[] = [
  {
    name: "FileCategorizer",
    options: {
      some: "option"
    },
    extensions: [".js", ".html", ".css"],
    transform: FileCategorizer
  }
];
const bundleTransformers:any[] = [];

const compiler = new Compiler({
  rootFolder,
  perFileTransformers,
  bundleTransformers
});

async function compileWithPerformanceCalc(options: any) {
  var t0 = performance.now();
  await compiler.compile(options);
  var t1 = performance.now();
  debug.debug(`Done in ${t1 - t0}ms.`);
}

async function run() {
  
  debug.log(`Initial compilation of ${initFiles.length} file(s).`);

  await compileWithPerformanceCalc({
    sourceFilePaths: initFiles
  });

  debug.info('Starting file watcher.');

  watch(sourceFolder, { recursive: true }, async (evt:any, name:string) => {

    debug.log('--------------------------------------------------------------------------------');
    debug.log(`${name} changed. Recompiling bundle..`);

    await compileWithPerformanceCalc({
      sourceFilePaths: initFiles
    });

  });

}

run();
