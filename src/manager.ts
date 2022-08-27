import { ScriptModules } from "@crowbartools/firebot-custom-scripts-types";

class CustomGamesManager {
    readonly logger: ScriptModules['logger'];
    readonly gameManager: ScriptModules['gameManager'];
    readonly commandManager: ScriptModules['commandManager'];
    readonly httpServer: ScriptModules['httpServer'];
    readonly twitchChat: ScriptModules['twitchChat'];

    private games: Array<String> = [
        "slots/slots"
    ];

    constructor(logger: ScriptModules['logger'], gameManager: ScriptModules['gameManager'], commandManager: ScriptModules['commandManager'], httpServer: ScriptModules['httpServer'], twitchChat: ScriptModules['twitchChat']) {
        this.logger = logger;
        this.gameManager = gameManager;
        this.commandManager = commandManager;
        this.httpServer = httpServer;
        this.twitchChat = twitchChat;
    }

    public register() {
        this.games.forEach(game => {
            const definition = require(`./games/${game}.ts`);
            this.gameManager.registerGame(definition);
            this.logger.info(`Custom Games Manager registered game ${definition.name} with ID: ${definition.id}`)
        });
    }
}

export class GamesManagerSingleton {
    private static instance: CustomGamesManager;

    private constructor() { }

    public static getInstance(): CustomGamesManager {
        return GamesManagerSingleton.instance;
    }

    public static init(logger: ScriptModules['logger'], gameManager: ScriptModules['gameManager'], commandManager: ScriptModules['commandManager'], httpServer: ScriptModules['httpServer'], twitchChat: ScriptModules['twitchChat']) {
        if (!GamesManagerSingleton.instance) {
            GamesManagerSingleton.instance = new CustomGamesManager(logger, gameManager, commandManager, httpServer, twitchChat);
        }
    }
}