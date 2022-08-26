import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { initLogger, logger } from "./logger";

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
    initLogger(runRequest.modules.logger);

    if (runRequest.parameters.enabled) {
      logger.info("Custom Games enabled");

      [
        'slots/slots'
      ].forEach(filename => {
        const definition = require(`./games/${filename}.js`);
        runRequest.modules.gameManager.registerGame(definition);
        logger.info(`Custom Game ${definition.name} with ID: ${definition.id} loaded`)
      });
    }
  },
};

export default script;
