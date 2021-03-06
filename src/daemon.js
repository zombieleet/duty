const fs = require("fs");
const cp = require("child_process");

module.exports = class Daemon {
  static CreateDaemon (platform) {
    // every things that happens in this
    //  static method is just to make the code,
    //  dependency injectable

    return Daemon[platform]();
  }
  static wait () {
    process.stdout.write("wait while the daemon is been enabled...");
  }
  static execSetupScript () {
    Daemon.wait();
    try {
      cp.execSync(`${__dirname}/daemon.bash duty`);
    } catch (ex) {
      throw ("error encountered while enabling service");
    }

    return Promise.resolve("daemon has been created");
  }
  static linux () {
    return Daemon.execSetupScript();
  }
  static windows () {
    // return Daemon.execSetupScript();
  }
  static darwin () {
    return Daemon.execSetupScript();
  }
};
