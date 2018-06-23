import { Command } from "commander";
import { Application } from "ffwd";
import * as path from "path";
import debug from "../lib/debug";
import Compiler from "../lib/compiler";
import * as  watch from "node-watch";
import { performance } from "perf_hooks";
import * as colors from "colors/safe";
import FileProcessor from "../lib/transformers/FileProcessor";

async function run(app:Application, appConfiguration:any) {

  const rootFolder = process.cwd();

  const sourceFolderAbsolute = path.join(rootFolder, appConfiguration.get("compiler").sourceFolder || '.');

  const initFiles = [
    `${sourceFolderAbsolute}/**/*.js`,
    `${sourceFolderAbsolute}/**/*.jsx`,
    `${sourceFolderAbsolute}/**/*.html`,
    `${sourceFolderAbsolute}/**/*.css`
  ];

  const perFileTransformers: any[] = [
    {
      name: "FileProcessor",
      options: {
        some: "option"
      },
      extensions: [".js", ".html", ".css"],
      transform: FileProcessor
    }
  ];

  const bundleTransformers: any[] = [];

  const compiler = new Compiler({
    app,
    appConfiguration,
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

    watch(sourceFolderAbsolute, { recursive: true }, async (evt: any, name: string) => {

      debug.log('--------------------------------------------------------------------------------');
      debug.log(`${name} changed. Recompiling bundle..`);

      await compileWithPerformanceCalc({
        sourceFilePaths: initFiles
      });

    });

  }

  run();

}

export default run;