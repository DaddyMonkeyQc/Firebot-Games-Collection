import { FirebotSettings } from "@crowbartools/firebot-custom-scripts-types/types/settings";
import { ScriptModules } from "@crowbartools/firebot-custom-scripts-types";
import { CustomGameDefinition } from "./models/custom-game-definition";
import { GameVisualEffect } from "./models/game-visual-effect";
import { Request, Response } from "express";

export class CustomGamesManager {
    public static identifier = "daddymonkey"
    public static resultRoute = "result"

    readonly logger: ScriptModules['logger'];
    readonly gameManager: ScriptModules['gameManager'];
    readonly commandManager: ScriptModules['commandManager'];
    readonly httpServer: ScriptModules['httpServer'];
    readonly twitchChat: ScriptModules['twitchChat'];
    readonly effectManager: ScriptModules['effectManager'];
    readonly eventManager: ScriptModules['eventManager'];
    readonly currencyDb: ScriptModules['currencyDb'];
    readonly settings: FirebotSettings;
    readonly resultUrl: string;

    private static formatID(key: string): string {
        return `${CustomGamesManager.identifier}:${key}`
    }

    public static games: Record<string, CustomGameDefinition> = {
        "slots": {
            gameID: CustomGamesManager.formatID("slots"),
            cmdID: CustomGamesManager.formatID("slots"),
            path: "slots/game",
        },
    };

    constructor(
        modules: ScriptModules,
        settings: FirebotSettings
    ) {
        this.logger = modules.logger;
        this.gameManager = modules.gameManager;
        this.commandManager = modules.commandManager;
        this.httpServer = modules.httpServer;
        this.twitchChat = modules.twitchChat;
        this.effectManager = modules.effectManager;
        this.eventManager = modules.eventManager;
        this.currencyDb = modules.currencyDb;
        this.settings = settings
        this.resultUrl = `http://localhost:${settings.getWebServerPort()}/integrations/${CustomGamesManager.identifier}/${CustomGamesManager.resultRoute}`
    }

    public register() {
        for (const key in CustomGamesManager.games) {
            const customGameDef = CustomGamesManager.games[key];
            const definition = require(`./games/${customGameDef.path}.ts`);
            this.gameManager.registerGame(definition);
            this.logger.info(`Custom Games Manager registered game ${definition.name} with ID: ${definition.id}`)
        }
        this.effectManager.registerEffect(GameVisualEffect);

        this.httpServer.registerCustomRoute(
            CustomGamesManager.identifier,
            CustomGamesManager.resultRoute,
            "POST",
            (req: Request, res: Response) => {
                this.logger.info("Received the callback");
                const {
                    username,
                    currencyId,
                    amount
                } = req.body;

                this.currencyDb.adjustCurrencyForUser(
                    username,
                    currencyId,
                    amount
                );

                this.twitchChat.sendChatMessage(`@${username} you won ${amount}`, null, "bot");

                res.status(200).send({ "message": "ok" })
            });
    }
}

export class GamesManagerSingleton {
    private static instance: CustomGamesManager;

    private constructor() { }

    public static getInstance(): CustomGamesManager {
        return GamesManagerSingleton.instance;
    }

    public static init(modules: ScriptModules, settings: FirebotSettings) {
        if (!GamesManagerSingleton.instance) {
            GamesManagerSingleton.instance = new CustomGamesManager(modules, settings);
            GamesManagerSingleton.instance.register();
        }
    }
}