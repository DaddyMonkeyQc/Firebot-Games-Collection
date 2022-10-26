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
      GamesManagerSingleton.init(
        runRequest.modules,
        runRequest.firebot.settings
      );
    }
  },
};

export default script;
