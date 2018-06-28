import { Command } from "commander";
import { Application } from "ffwd";
import * as path from "path";
import debug from "../lib/debug";
import Compiler from "../lib/compiler";
import * as  watch from "node-watch";
import { performance } from "perf_hooks";
import * as colors from "colors/safe";
import FileProcessor from "../lib/transformers/FileProcessor";
import LocalServer from "../services/LocalServer";

async function run(app:Application, appConfiguration:any): Promise<void> {

  const rootFolder = process.cwd();

  const sourceFolderAbsolute = path.join(rootFolder, appConfiguration.get("compiler").sourceFolder || '.');

  const initFiles = [
    `${sourceFolderAbsolute}/**/*.js`,
    `${sourceFolderAbsolute}/**/*.jsx`,
    `${sourceFolderAbsolute}/**/*.html`,
    `${sourceFolderAbsolute}/**/*.css`
  ];

  // TODO this should come from all transformer extensions put together
  const interestedFileExtensions = [
    ".js",
    ".jsx",
    ".html",
    ".css"
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

  async function compileWithPerformanceCalc(options: any): Promise<Application> {
    var t0 = performance.now();
    const ret = await compiler.compile(options);
    var t1 = performance.now();
    debug.debug(`Done in ${t1 - t0}ms.`);
    return ret;
  }

  async function run() {

    debug.log(`Initial compilation of ${initFiles.length} file(s).`);

    app = await compileWithPerformanceCalc({
      sourceFilePaths: initFiles
    });

    const server = new LocalServer({
      app,
      appConfiguration,
      ip: "127.0.0.1",
      port: 3033
    }).start();

    debug.info('Starting file watcher.');

    watch(sourceFolderAbsolute, { recursive: true }, async (evt: any, name: string) => {

      if(interestedFileExtensions.find((fileExtension:string) => {
        return name.endsWith(fileExtension);
      })) {

        debug.info(`${name} changed. Recompiling..`);

        app = await compileWithPerformanceCalc({
          sourceFilePaths: initFiles
        });

        server.start();

      }

    });

  }

  run();

}

export default run; 