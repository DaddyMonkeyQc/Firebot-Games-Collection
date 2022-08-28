import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { CustomGamesManager } from "../manager";

export const GameVisualEffect: Firebot.EffectType<{}> = {
    definition: {
        id: `${CustomGamesManager.identifier}:game-visual-effect`,
        name: "Run Game Visual Effect",
        description: "Allow to run a visual Game in the overlay",
        icon: "fad fa-gamepad",
        categories: ["overlay", "fun"],
        triggers: ["event"]
    },
    optionsTemplate: ``,
    onTriggerEvent: async ({ effect }) => {
        return true;
    },
    overlayExtension: {
        dependencies: {
            globalStyles: "",
            css: [],
            js: []
        },
        event: {
            name: "",
            onOverlayEvent: (data) => { 
                
            }
        }
    }
};