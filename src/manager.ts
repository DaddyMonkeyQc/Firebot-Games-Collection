import { ScriptModules } from "@crowbartools/firebot-custom-scripts-types";
import { HttpServerManager } from "@crowbartools/firebot-custom-scripts-types/types/modules/http-server-manager";
import { CustomGameDefinition } from "./models/custom-game-definition";
import { GameVisualEffect } from "./models/game-visual-effect";
import { superGame } from "./games/slots/slots-logic";
import {Request, Response} from "express";

function callback(){
    console.info("Callback received");
}

export class CustomGamesManager {
    public static identifier = "daddymonkey"

    readonly logger: ScriptModules['logger'];
    readonly gameManager: ScriptModules['gameManager'];
    readonly commandManager: ScriptModules['commandManager'];
    readonly httpServer: ScriptModules['httpServer'];
    readonly twitchChat: ScriptModules['twitchChat'];
    readonly effectManager: ScriptModules['effectManager'];
    readonly eventManager: ScriptModules['eventManager'];

    private static formatID(key: string): string {
        return `${CustomGamesManager.identifier}:${key}`
    }

    public static games: Record<string, CustomGameDefinition> = {
        "slots": {
            gameID: CustomGamesManager.formatID("slots"),
            cmdID: CustomGamesManager.formatID("slots"),
            path: "slots/slots",
            func: superGame
        },
    };

    constructor(
        logger: ScriptModules['logger'],
        gameManager: ScriptModules['gameManager'],
        commandManager: ScriptModules['commandManager'],
        httpServer: ScriptModules['httpServer'],
        twitchChat: ScriptModules['twitchChat'],
        effectManager: ScriptModules['effectManager'],
        eventManager: ScriptModules['eventManager'],
    ) {
        this.logger = logger;
        this.gameManager = gameManager;
        this.commandManager = commandManager;
        this.httpServer = httpServer;
        this.twitchChat = twitchChat;
        this.effectManager = effectManager;
        this.eventManager = eventManager;
    }

    public register() {
        for (const key in CustomGamesManager.games) {
            const customGameDef = CustomGamesManager.games[key];
            const definition = require(`./games/${customGameDef.path}.ts`);
            this.gameManager.registerGame(definition);
            this.logger.info(`Custom Games Manager registered game ${definition.name} with ID: ${definition.id}`)
        }
        this.effectManager.registerEffect(GameVisualEffect);
        this.httpServer.registerCustomRoute("callback","result","POST",(req:any,res:any)=>{
            this.logger.info("Received the callback");
            this.logger.info(req.body);
            res.status(200).send({"message":"ok"})
        });
    }
}

export class GamesManagerSingleton {
    private static instance: CustomGamesManager;

    private constructor() { }

    public static getInstance(): CustomGamesManager {
        return GamesManagerSingleton.instance;
    }

    public static init(
        logger: ScriptModules['logger'],
        gameManager: ScriptModules['gameManager'],
        commandManager: ScriptModules['commandManager'],
        httpServer: ScriptModules['httpServer'],
        twitchChat: ScriptModules['twitchChat'],
        effectManager: ScriptModules['effectManager'],
        eventManager: ScriptModules['eventManager']
    ) {
        if (!GamesManagerSingleton.instance) {
            GamesManagerSingleton.instance = new CustomGamesManager(
                logger,
                gameManager,
                commandManager,
                httpServer,
                twitchChat,
                effectManager,
                eventManager
            );
            GamesManagerSingleton.instance.register();
        }
    }
}