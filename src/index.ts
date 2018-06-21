import * as program from "commander";
import * as config from "../package.json";

program
  .version(config.version)
  .name("ffwd")
//.option("-f, --file <file.json>", "Create flock from file");

program
  .command("create")
  .alias("c")
  .description("Create a new ffwd project")
  .action((cmd: Function, options: object) => {
    console.log(cmd, options);
  });

program
  .command("run")
  .alias("r")
  .description("Run the ffwd project in current directory")
  .action((cmd: Function, options: object) => {

    //console.log(cmd, options);

    const port = parseInt(process.env["PORT"]) || 3000;
    const ip = process.env["IP"] || "127.0.0.1";

    //const server = new FFWDServer(ip, port);
    //server.startServer();

  });

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