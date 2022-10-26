"use strict";

import { SystemCommand } from "@crowbartools/firebot-custom-scripts-types/types/modules/command-manager";
import { CustomGamesManager, GamesManagerSingleton } from "../../manager";

const customGameDef = CustomGamesManager.games['slots'];

const spinCommand: SystemCommand = {
    definition: {
        id: customGameDef.cmdID,
        name: "Spin (Visual Slots)",
        active: true,
        trigger: "!slots",
        description: "Allows viewers to play the Slots game.",
        autoDeleteTrigger: false,
        scanWholeMessage: false,
        subCommands: [
            {
                id: "spinAmount",
                name: "Spin Amount",
                arg: "\\d+",
                regex: true,
                usage: "[currencyAmount]",
                description: "The Spin Amount",
                active: null,
                trigger: null
            }
        ]
    },
    onTriggerEvent: async event => {
        const { userCommand, command, commandOptions } = event;

        const instance = GamesManagerSingleton.getInstance()
        const settings = instance.gameManager.getGameSettings(customGameDef.gameID);

        instance.logger.info(`Game have been triggered by ${userCommand.commandSender}`);
        const data = {
            "data": "test",
            "code": `
            <style>
            body {
                width: 100vw;
                height: 100vh;
                margin: 0;
                padding: 0;
              }
              
              #app {
                width: 100%;
                height: 60%;
                background: rgba(0,0,0,0);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              }
              
              .doors {
                display: flex;
              }
              
              .door {
                background: #fafafa;
                width: 100px;
                height: 110px;
                overflow: hidden;
                border-radius: 5px;
                margin: 5px;
              }
              
              .boxes {
                transition: transform 1s ease-in-out;
              }
              
              .box {
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 3rem;
              }
              
              .buttons {
                margin: 1rem 0 2rem 0;
              }
              
              button {
                cursor: pointer;
                font-size: 1.2rem;
                margin: 0 0.2rem;
                border: none;
                border-radius: 5px;
                padding: 10px 15px;
              }
              
              .info {
                position: fixed;
                bottom: 0;
                width: 100%;
                text-align: center;
              }
            </style>
            <div id="app">
            <div class="doors">
              <div class="door">
                <div class="boxes">
                  <!-- <div class="box">?</div> -->
                </div>
              </div>
          
              <div class="door">
                <div class="boxes">
                  <!-- <div class="box">?</div> -->
                </div>
              </div>
          
              <div class="door">
                <div class="boxes">
                  <!-- <div class="box">?</div> -->
                </div>
              </div>
            </div>
          </div>
          <script>
          (function () {
            const items = [
              '🍭',
              '❌',
              '⛄️',
              '🦄',
              '🍌',
              '💩',
              '👻',
              '😻',
              '💵',
              '🤡',    
              '🦖',
              '🍎',
              '😂',
              '🖕',
            ];
            const doors = document.querySelectorAll('.door');
          
            function init(firstInit = true, groups = 1, duration = 3) {
              for (const door of doors) {
                if (firstInit) {
                  door.dataset.spinned = '0';
                } else if (door.dataset.spinned === '1') {
                  return;
                }
          
                const boxes = door.querySelector('.boxes');
                const boxesClone = boxes.cloneNode(false);
                const pool = ['❓'];
          
                if (!firstInit) {
                  const arr = [];
                  for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
                    arr.push(...items);
                  }
                  pool.push(...shuffle(arr));
          
                  boxesClone.addEventListener(
                    'transitionstart',
                    function () {
                      door.dataset.spinned = '1';
                      this.querySelectorAll('.box').forEach((box) => {
                        box.style.filter = 'blur(1px)';
                      });
                    },
                    { once: true }
                  );
          
                  boxesClone.addEventListener(
                    'transitionend',
                    function () {
                      this.querySelectorAll('.box').forEach((box, index) => {
                        box.style.filter = 'blur(0)';
                        if (index > 0) this.removeChild(box);
                      });
                    },
                    { once: true }
                  );
                }
          
                for (let i = pool.length - 1; i >= 0; i--) {
                  const box = document.createElement('div');
                  box.classList.add('box');
                  box.style.width = door.clientWidth + 'px';
                  box.style.height = door.clientHeight + 'px';
                  box.textContent = pool[i];
                  boxesClone.appendChild(box);
                }
                boxesClone.style.transitionDuration = \`\${duration > 0 ? duration : 1}s\`;
                boxesClone.style.transform = \`translateY(-\${door.clientHeight * (pool.length - 1)}px)\`;
                door.replaceChild(boxesClone, boxes);
              }
            }
          
            async function spin() {
              const tts = 3;
              init(false, 1, tts);
              const total = tts * 1000;
              
              for (const door of doors) {
                const boxes = door.querySelector('.boxes');
                const duration = parseInt(boxes.style.transitionDuration);
                boxes.style.transform = 'translateY(0)';
                await new Promise((resolve) => setTimeout(resolve, tts * 100));
              }
              await new Promise((resolve)=> setTimeout(resolve, total))
              return "victory";
            }
          
            function shuffle([...arr]) {
              let m = arr.length;
              while (m) {
                const i = Math.floor(Math.random() * m--);
                [arr[m], arr[i]] = [arr[i], arr[m]];
              }
              return arr;
            }
          
            init();
            $.runFunction = spin;
          })();
          </script>
            `
        };
        instance.httpServer.sendToOverlay('run-visual-game', data);
        instance.twitchChat.sendChatMessage("Insert Result Callback HERE", null, "bot");
    }
};

export class SpinCommand {
    static registerSpinCommand() {
        const instance = GamesManagerSingleton.getInstance()

        if (!instance.commandManager.hasSystemCommand(customGameDef.cmdID)) {
            instance.commandManager.registerSystemCommand(spinCommand);
        }
    }

    static unregisterSpinCommand() {
        const instance = GamesManagerSingleton.getInstance()
        instance.commandManager.unregisterSystemCommand(customGameDef.cmdID);
    }

    static purgeCaches() {
    }
}
