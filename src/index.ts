import * as program from "commander";
import * as packageJson from "../package.json";
import * as commands from "./commands";
import { Command } from "commander";
import * as colors from "colors/safe";
import debug from "./lib/debug";
import * as appConfiguration from "nconf";
import { Application } from "ffwd";

function configureAndRun(cmd: Command, options: any) {

  // Initialize configuration
  appConfiguration.env().argv();

  appConfiguration.defaults({
    compiler: {
      sourceFolder: "./build",
      outputDirectory: "./ffwd-dist",
      buildDirectory: "./ffwd-build"
    }
  });

  if(cmd.settings) {
    // Read settings from supplied .json file
    debug.info(`Using settings file ${cmd.settings}`);
    appConfiguration.file({ file: cmd.settings });
  }
  else {
    // ..or default
    appConfiguration.file({ file: "./ffwd.config.json" });
  }

  // Create the FFWD application to contain everything
  const app = new Application({
    context: "development",
    debug: debug
  });

  debug.trace(`Executing command ${cmd._name}`);

  // Execute command that's passed
  commands[cmd._name](app, appConfiguration);

}

//
// Define CLI commands
//

program
  .version(packageJson.version)
  .name("ffwd")

program
  .command("run")
  .description("Run the ffwd project in current directory")
  .alias("r")
  .option("-s, --settings <ffwd.config.json>", "Specify settings file")
  .action(configureAndRun);

program
  .command("create")
  .alias("c")
  .description("Create a new ffwd project")
  .action(configureAndRun);

/*
program
  .command("build")
  .alias("b")
  .description("Build the ffwd project in current directory")
  .action(async (cmd: Function, options: object) => {

    const builder = new Builder();
    builder.setRootFolder(process.cwd());
    builder.getConfiguration();

    await builder.build();

  });
*/

program.parse(process.argv);