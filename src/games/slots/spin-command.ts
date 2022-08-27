"use strict";

import { SystemCommand } from "@crowbartools/firebot-custom-scripts-types/types/modules/command-manager";
import { GamesManagerSingleton } from "../../manager";

const SPIN_COMMAND_ID = "daddymonkey:casino";

const spinCommand: SystemCommand = {
    definition: {
        id: SPIN_COMMAND_ID,
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

        instance.logger.info(`Game have been triggered by ${userCommand.commandSender}`);
        instance.twitchChat.sendChatMessage("Spin Command done!", null, "bot")
    }
};

export class SpinCommand {
    static registerSpinCommand() {
        const instance = GamesManagerSingleton.getInstance()

        if (!instance.commandManager.hasSystemCommand(SPIN_COMMAND_ID)) {
            instance.commandManager.registerSystemCommand(spinCommand);
        }
    }

    static unregisterSpinCommand() {
        const instance = GamesManagerSingleton.getInstance()
        instance.commandManager.unregisterSystemCommand(SPIN_COMMAND_ID);
    }

    static purgeCaches() {
    }
}
