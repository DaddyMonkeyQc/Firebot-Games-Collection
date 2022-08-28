"use strict";

import { SystemCommand } from "@crowbartools/firebot-custom-scripts-types/types/modules/command-manager";
import { CustomGamesManager, GamesManagerSingleton } from "../../manager";
import { GameVisualEffect } from "../../models/game-visual-effect";

const customGameDef = CustomGamesManager.games['slots'];

const spinCommand: SystemCommand = {
    definition: {
        id: customGameDef.cmdID,
        name: "Spin (Visual Slots)",
        active: true,
        trigger: "!casino",
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
                active: true,
                trigger: "!casino"
            }
        ]
    },
    onTriggerEvent: async event => {
        const { userCommand, command, commandOptions } = event;

        const instance = GamesManagerSingleton.getInstance()
        const settings = instance.gameManager.getGameSettings(customGameDef.gameID);

        instance.logger.info(`Game have been triggered by ${userCommand.commandSender}`);
        
        instance.twitchChat.sendChatMessage("Spin Command done!", null, "bot")
        instance.effectManager
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
