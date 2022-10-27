"use strict";

import { SystemCommand } from "@crowbartools/firebot-custom-scripts-types/types/modules/command-manager";
import { CustomGamesManager, GamesManagerSingleton } from "../../manager";

const customGameDef = CustomGamesManager.games['slots'];

const spinCommand: SystemCommand = {
  definition: {
    id: customGameDef.cmdID,
    name: "Spin (Visual Slots)",
    active: true,
    trigger: "!slots",
    description: "Allows viewers to play the Slots game.",
    autoDeleteTrigger: false,
    scanWholeMessage: false,
    subCommands: [
      {
        id: "spinAmount",
        name: "Spin Amount",
        arg: "\\d+",
        regex: true,
        usage: "[currencyAmount]",
        description: "The Spin Amount",
        active: null,
        trigger: null
      }
    ]
  },
  onTriggerEvent: async event => {
    const { userCommand, command, commandOptions } = event;

    const instance = GamesManagerSingleton.getInstance()
    const settings = instance.gameManager.getGameSettings(customGameDef.gameID);
    const username = userCommand.commandSender;
    const currencyId = settings.settings.currencySettings.currencyId;

    instance.logger.info(`Game have been triggered by ${username}`);

    var html = require('./templates/game.html').default;
    var css = require('./templates/game.css').default;
    var logic = require('./templates/game.js').default;
    logic = logic.replace("// {{placeholder}}", `$.post("${instance.resultUrl}",{"username":"${username}","currencyId": "${currencyId}", "amount": 100})`)

    const data = {
      "data": "test",
      "code": `<style>${css}</style>${html}<script>${logic}</script>`
    };
    instance.httpServer.sendToOverlay('run-visual-game', data);
  }
};

export class SpinCommand {
  static registerSpinCommand() {
    const instance = GamesManagerSingleton.getInstance()

    if (!instance.commandManager.hasSystemCommand(customGameDef.cmdID)) {
      instance.commandManager.registerSystemCommand(spinCommand);
    }
  }

  static unregisterSpinCommand() {
    const instance = GamesManagerSingleton.getInstance()
    instance.commandManager.unregisterSystemCommand(customGameDef.cmdID);
  }

  static purgeCaches() {
  }
}
