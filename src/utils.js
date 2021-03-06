const crypto = require("crypto");
const DutyTodo = require("./duty.js");
const ReadTodo = require("./readtodo.js");
const { join, dirname, extname } = require("path");
const fs = require("fs");

const node_env = () => {
  return process.env.NODE_ENV !== "development";
};

const env = (message) => {
  return node_env() ? DutyTodo.PRINT(message + "\n") : message;
};
const getPrevCurrHash = (previousHash, todoGroup) => {
  return {
    previousHash,
    currentHash: getProperty(todoGroup).hash
  };
};

const getProperty = todoGroup => {
  let __hash = Object.keys(todoGroup);
  __hash = __hash[__hash.length - 1];

  return todoGroup[__hash];
};
const getNotePropetry = todoGroup => {
  return { note: getProperty(todoGroup).note };
};
function isExists (file, commander) {
  let fileContent, _file = join(dirname(__dirname), file);

  if (fs.existsSync(_file) && (fileContent = fs.readFileSync(_file)) &&
fs.existsSync(JSON.parse(fileContent.toString()).location)) {
    return node_env() ? commander.outputHelp() : "Enjoy...";
  }

  return "error while reading config file";
}

function addOption (todo, category = [], ff) {
  // category = [ "general" ]
  // does not have any effect if duty is executed as a program not as test
  let hash = crypto.createHash("sha256").update(todo).digest("hex"),
    manager = ff.MANAGER;

  if (category.length === 0) category.push("general");

  return ff.add({todo, category, hash}, manager)
    .then(() => {
      let currentSave = DutyTodo.SaveTodo({
        manager,
        hash,
        todo,
        category
      });

      env(currentSave);

      return currentSave;
    }).catch(_ => {
      env(_);
      return (_);
    });
}

function appendOption (hash, text, ff) {
  let { location, todoGroup } = ff.MANAGER;

  return ff.append({hash, text})
    .then(message => {
      let _pMessage = DutyTodo.WriteFile({
        location,
        todoGroup
      });

      env(_pMessage);

      return getPrevCurrHash(hash, todoGroup);
    })
    .catch(_ => {
      return (_);
    });
}

function replaceOption (hash, regexp, text, ff) {
  let { todoGroup, location } = ff.MANAGER;

  return ff.replace({hash, regexp, text}).then(messaeg => {
    let _pMessage = DutyTodo.WriteFile({
      location,
      todoGroup
    });

    env(_pMessage);

    return getPrevCurrHash(hash, todoGroup);
  }).catch(_ => {
    return (_);
  });
}

function markCompletedOption (hash, ff) {
  let { todoGroup, location } = ff.MANAGER;

  return ff.markcompleted({hash}).then(message => {
    let _pMessage = DutyTodo.WriteFile({
      location,
      todoGroup
    });

    env(_pMessage);

    return {
      completed: getProperty(todoGroup).completed
    };
  }).catch(_ => {
    return (_);
  });
}

function noteOption (hash, note, ff) {
  let { todoGroup, location } = ff.MANAGER;
  return ff.note({hash, note}).then(message => {
    let _pMessage = DutyTodo.WriteFile({
      location,
      todoGroup
    });

    env(_pMessage);

    return getNotePropetry(todoGroup);
  }).catch(_ => {
    return (_);
  });
}

function removenoteOption (hash, ff) {
  let { todoGroup, location } = ff.MANAGER;
  return ff.removenote({hash}).then(message => {
    let _pMessage = DutyTodo.WriteFile({
      location,
      todoGroup
    });

    env(_pMessage);

    return getNotePropetry(todoGroup);
  }).catch(_ => {
    return (_);
  });
}

function dueOption (hash, date, ff) {
  let { todoGroup, location } = ff.MANAGER;

  return ff.due({hash, date})
    .then(result => {
      let _pMessage = DutyTodo.WriteFile({
        location,
        todoGroup
      });

      env(_pMessage);
      return result;
    }).catch(_ => {
      return (_);
    });
}

function urgencyOption (hash, urgency, ff) {
  let { todoGroup, location } = ff.MANAGER;

  return ff.urgency({hash, urgency})
    .then(result => {
      let _pMessage = DutyTodo.WriteFile({
        location,
        todoGroup
      });

      env(_pMessage);

      return result;
    }).catch(_ => {
      env(_);
      return _;
    });
}

function readOption (type, opt, ff) {
  let { todoGroup } = ff.MANAGER;

  return ff.read(type, opt)
    .then(result => {
      const _readTodo = [];
      result.forEach(res => {
        _readTodo.push(todoGroup[res]);
        return node_env() ? ReadTodo.STYLE_READ(todoGroup[res], DutyTodo) : "";
      });

      return _readTodo;
    }).catch(_ => {
      env(_);
      return (_);
    });
}

function priorityOption (hash, priority, ff) {
  let { location, todoGroup } = ff.MANAGER;

  return ff.setpriority({hash, priority})
    .then(result => {
      let _pMessage = DutyTodo.WriteFile({
        location,
        todoGroup
      });

      env(_pMessage);

      return result;
    }).catch(_ => {
      env(_);
      return (_);
    });
}

function categorizeOption (hash, category, ff) {
  let { location, todoGroup } = ff.MANAGER;

  return ff.categorize({hash, category})
    .then(result => {
      let _pMessage = DutyTodo.WriteFile({
        location,
        todoGroup
      });

      env(_pMessage);
      return result;
    }).catch(_ => {
      env(_);
      return (_);
    });
}

function setnotifyOption (hash, notification, timeout, ff) {
  let { location, todoGroup } = ff.MANAGER;

  return ff.setnotify(hash, { notification, timeout })
    .then(result => {
      let _pMessage = DutyTodo.WriteFile({
        location,
        todoGroup
      });

      env(_pMessage);

      return result;
    }).catch(_ => {
      env(_);
      return (_);
    });
}

function editOption (hash, text, ff) {
  let { location, todoGroup } = ff.MANAGER;

  return ff.edit({hash, text})
    .then(result => {
      let _pMessage = DutyTodo.WriteFile({
        location,
        todoGroup
      });

      env(_pMessage);
      return result;
    }).catch(_ => {
      env(_);
      return (_);
    });
}

function deleteOption (type, opt = {}, ff) {
  let { location, todoGroup } = ff.MANAGER;

  return ff.delete(type, opt)
    .then(result => {
      let _pMessage = DutyTodo.WriteFile({
        location,
        todoGroup
      });

      env(_pMessage);

      return result;
    }).catch(_ => {
      env(_);
      return (_);
    });
}

function exportOption (type, path, ff) {
  let { location, todoGroup } = ff.MANAGER;

  return ff.export({type, path})
    .then(result => {
      const { _pathDir, _path } = result,
        MESSAGE = `file location ${_path}\n`;
      if (_path && _pathDir) {
        let cssContent = fs.readFileSync(join(__dirname, "assets", "duty.css")).toString();

        cssContent = fs.writeFileSync(`${_pathDir}/duty.css`, cssContent);

        let imgContent = fs.readFileSync(join(__dirname, "assets", "logo.png")).toString();

        imgContent = fs.writeFileSync(`${_pathDir}/logo.png`);

        env(MESSAGE);
        return { _pathDir, _path };
      }

      if (extname(_path) === ".json") { fs.writeFileSync(_path, JSON.stringify(todoGroup)); }

      env(MESSAGE);

      return { _path };
    }).catch(_ => {
      env(_);
      return (_);
    });
}

function execDaemonOption (platform, ff) {
  return ff.execDaemon(platform)
    .then(result => {
      env(result);
      return result;
    }).catch(_ => {
      env(_);
      return (_);
    });
}
module.exports = {
  execDaemonOption,
  addOption,
  appendOption,
  replaceOption,
  markCompletedOption,
  noteOption,
  removenoteOption,
  dueOption,
  readOption,
  urgencyOption,
  priorityOption,
  categorizeOption,
  setnotifyOption,
  editOption,
  deleteOption,
  exportOption,
  isExists,
  node_env
};
