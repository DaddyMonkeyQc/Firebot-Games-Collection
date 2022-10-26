
import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import { CustomGamesManager, GamesManagerSingleton } from "../manager";
var $ = require("jquery");

interface keyable {
    [key: string]: any
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export const GameVisualEffect: Effects.EffectType<{}> = {
    definition: {
        id: `daddymonkey:game-visual-effect`,
        name: "Run Game Visual Effect",
        description: "Allow to run a visual Game in the overlay",
        icon: "fad fa-gamepad",
        categories: ["overlay", "fun"],
        triggers: ['event']
    },
    optionsTemplate: ``,
    onTriggerEvent: async ({ effect, trigger }) => {
        const instance = GamesManagerSingleton.getInstance()
        instance.logger.info("Effect runned!");
        return true;
    },
    overlayExtension: {
        dependencies: {
            globalStyles: "",
            css: [],
            js: []
        },
        event: {
            name: "run-visual-game",
            onOverlayEvent: (event) => {
                const data: keyable = event;
                console.log("Running the Game in the Overlay");
                console.log(data);

                // Throw div on page and start up.
                $('.wrapper').append(data.code);
                $(document).ready(function () {
                    $.runFunction().then((value:string)=>{
                        console.log(value);
                        setTimeout(() => {
                            $('.wrapper').empty()
                        }, 2000);
                    }
                    );
                })
            }
        }
    }
};