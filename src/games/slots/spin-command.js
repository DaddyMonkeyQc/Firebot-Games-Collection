"use strict";

import { logger } from "../../logger"

const SPIN_COMMAND_ID = "daddymonkey:casino";

const spinCommand = {
    definition: {
        id: SPIN_COMMAND_ID,
        name: "Spin (Visual Slots)",
        active: true,
        trigger: "!casino",
        description: "Allows viewers to play the Slots game.",
        autoDeleteTrigger: false,
        scanWholeMessage: false,
        hideCooldowns: true,
        subCommands: [
            {
                id: "spinAmount",
                arg: "\\d+",
                regex: true,
                usage: "[currencyAmount]",
                description: "Spins the slot machine with the given amount",
                hideCooldowns: true
            }
        ]
    },
    onTriggerEvent: async event => {
        const { userCommand } = event;
        logger.info(userCommand);
    }
};

function registerSpinCommand() {
}

function unregisterSpinCommand() {
}

function purgeCaches() {
}

exports.purgeCaches = purgeCaches;
exports.registerSpinCommand = registerSpinCommand;
exports.unregisterSpinCommand = unregisterSpinCommand;