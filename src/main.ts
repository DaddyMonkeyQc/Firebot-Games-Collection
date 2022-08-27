import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { GamesManagerSingleton } from "./manager";

interface Params {
  enabled: boolean;
}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Custom Games Loader",
      description: "A Collection of visual Games for Firebot",
      author: "DaddyMonkeyQc",
      version: "0.1",
      firebotVersion: "5",
    };
  },
  getDefaultParameters: () => {
    return {
      enabled: {
        type: "boolean",
        default: true,
        description: "Enabled "
      },
    };
  },
  run: (runRequest) => {
    if (runRequest.parameters.enabled) {
      const { logger, gameManager, commandManager, httpServer, twitchChat } = runRequest.modules;
      GamesManagerSingleton.init(logger, gameManager, commandManager, httpServer, twitchChat);
      const instance = GamesManagerSingleton.getInstance()
      instance.register();
    }
  },
};

export default script;
