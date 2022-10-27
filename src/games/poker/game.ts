"use strict";

import { FirebotGame } from "@crowbartools/firebot-custom-scripts-types/types/modules/game-manager";
import { SpinCommand } from "./command";
import { CustomGamesManager } from "../../manager"

const slots: FirebotGame = {
    id: CustomGamesManager.games['slots'].gameID,
    name: "Slots Visual",
    subtitle: "Spin to win",
    description: "Visual Casino Slots Machine",
    icon: "fa-sack-dollar",
    settingCategories: {
        currencySettings: {
            title: "Currency Settings",
            description: "",
            sortRank: 1,
            settings: {
                currencyId: {
                    type: "currency-select",
                    title: "Currency",
                    description: "Which currency to use for this game.",
                    tip: "Optional",
                    default: "",
                    showBottomHr: false,
                    sortRank: 1,
                    validation: {
                        required: true
                    }
                },
                defaultWager: {
                    type: "number",
                    title: "Default Wager Amount",
                    description: "The default wager amount to use if a viewer doesn't specify one.",
                    showBottomHr: false,
                    default: 1,
                    tip: "Optional",
                    sortRank: 2,
                    validation: {
                        required: false,
                        min: 0,
                        max: 1000
                    }
                }
            }
        },
        spinSettings: {
            title: "Spin Settings",
            description: "",
            sortRank: 2,
            settings: {
                successChances: {
                    type: "role-percentages",
                    title: "Roll Success Chances",
                    default: null,
                    showBottomHr: false,
                    description: "The chances each roll will be successful (There are 3 rolls per spin)",
                    tip: "The success chance for the first user role a viewer has in this list is used, so ordering is important!",
                    sortRank: 1,
                    validation: {
                        required: false
                    }
                },
                multiplier: {
                    type: "number",
                    title: "Winnings Multiplier",
                    description: "The winnings multiplier for each successful roll",
                    tip: "The winnings are calculated as: WagerAmount * (SuccessfulHits * Multiplier)",
                    sortRank: 2,
                    showBottomHr: false,
                    default: 1,
                    validation: {
                        required: true,
                        min: 0.5
                    }
                }
            }
        },
        cooldownSettings: {
            title: "Cooldown",
            description: "",
            sortRank: 3,
            settings: {
                cooldown: {
                    type: "number",
                    title: "Cooldown (secs)",
                    description: "The Cooldown",
                    sortRank: 1,
                    showBottomHr: false,
                    tip: "Cooldown is applied per viewer.",
                    default: 300,
                    validation: {
                        min: 0,
                        max: 10000,
                        required: false
                    }
                }
            }
        },
        generalMessages: {
            title: "General Messages",
            description: "",
            sortRank: 5,
            settings: {
                alreadySpinning: {
                    type: "string",
                    title: "Already Spinning",
                    description: "When someone tries to spin too fast (leave empty for no message).",
                    default: "{username}, your slot machine is actively working!",
                    tip: "Available variables: {username}",
                    sortRank: 1,
                    showBottomHr: false,
                    validation: {
                        required: false
                    }
                },
                onCooldown: {
                    type: "string",
                    title: "On Cooldown",
                    description: "When the command is on cooldown for a user (leave empty for no message).",
                    default: "{username}, your slot machine is currently on cooldown. Time remaining: {timeRemaining}",
                    tip: "Available variables: {username}, {timeRemaining}",
                    sortRank: 2,
                    showBottomHr: false,
                    validation: {
                        required: false
                    }
                },
                noWagerAmount: {
                    type: "string",
                    title: "No Wager Amount",
                    description: "Sent when a user leaves out the wager amount (leave empty for no message).",
                    default: "{user}, please include a wager amount!",
                    tip: "Available variables: {user}",
                    sortRank: 3,
                    showBottomHr: false,
                    validation: {
                        required: false
                    }
                },
                invalidWagerAmount: {
                    type: "string",
                    title: "Invalid Wager Amount",
                    description: "Sent when a user uses an invalid wager amount (leave empty for no message).",
                    default: "{user}, please include a valid wager amount!",
                    tip: "Available variables: {user}",
                    sortRank: 4,
                    showBottomHr: false,
                    validation: {
                        required: false
                    }
                },
                moreThanZero: {
                    type: "string",
                    title: "More Than 0",
                    description: "When the user tries to spin with 0 currency (leave empty for no message).",
                    default: "{username}, your wager amount must be more than 0.",
                    tip: "Available variables: {username}",
                    sortRank: 5,
                    showBottomHr: false,
                    validation: {
                        required: false
                    }
                },
                minWager: {
                    type: "string",
                    title: "Amount Too Low",
                    description: "When the wager amount is too low (leave empty for no message).",
                    default: "{username}, your wager amount must be at least {minWager}.",
                    tip: "Available variables: {username}, {minWager}",
                    sortRank: 6,
                    showBottomHr: false,
                    validation: {
                        required: false
                    }
                },
                maxWager: {
                    type: "string",
                    title: "Amount Too High",
                    description: "When the wager amount is too high (leave empty for no message).",
                    default: "{username}, your wager amount must be at least {maxWager}.",
                    tip: "Available variables: {username}, {maxWager}",
                    sortRank: 7,
                    showBottomHr: false,
                    validation: {
                        required: false
                    }
                },
                notEnough: {
                    type: "string",
                    title: "Not Enough",
                    description: "When the user doesn't have enough to wager the chosen amount (leave empty for no message).",
                    default: "{username}, you don't have enough to wager this amount!",
                    tip: "Available variables: {username}",
                    sortRank: 8,
                    showBottomHr: false,
                    validation: {
                        required: false
                    }
                },
                spinInAction: {
                    type: "string",
                    title: "Spinning In Action",
                    description: "When the spin is going on (leave empty for no message).",
                    default: "{username} pulls back the lever...",
                    tip: "Available variables: {username}",
                    sortRank: 9,
                    showBottomHr: false,
                    validation: {
                        required: false
                    }
                },
                spinSuccessful: {
                    type: "string",
                    title: "Spin successful",
                    description: "When the spin is successful (leave empty for no message).",
                    default: "{username} hit {successfulRolls} out of 3 and won {winningsAmount} {currencyName}!",
                    tip: "Available variables: {username}, {successfulRolls}, {winningsAmount}, {currencyName}",
                    sortRank: 10,
                    showBottomHr: false,
                    validation: {
                        required: false
                    }

                }
            }
        },
        chatSettings: {
            title: "Chat Settings",
            description: "The Chat Settings",
            sortRank: 6,
            settings: {
                chatter: {
                    type: "chatter-select",
                    title: "Chat As",
                    description: "The Chat Selector",
                    default: "{username} hit {successfulRolls} out of 3 and won {winningsAmount} {currencyName}!",
                    tip: "Available variables: {username}, {successfulRolls}, {winningsAmount}, {currencyName}",
                    sortRank: 1,
                    showBottomHr: false,
                    validation: {
                        required: false
                    }
                }
            }
        }
    },
    onLoad: () => {
        SpinCommand.registerSpinCommand();
    },
    onUnload: () => {
        SpinCommand.unregisterSpinCommand();
        SpinCommand.purgeCaches();
    },
    onSettingsUpdate: () => {
        SpinCommand.purgeCaches();
    }
};

module.exports = slots;