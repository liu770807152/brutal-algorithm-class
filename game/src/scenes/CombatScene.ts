import Phaser from "phaser";
import {
    Missed,
} from "../logic/interfaces";
import { Combat } from "../logic/combat";

import * as csp from "../lib/csp";
import * as ui from "../ui";
import * as playerHelper from "./player";
import * as enermyHelper from "./enermy";
import RewardScene from "./RewardScene";
import LevelListScene from './LevelList';
import { Game } from '../logic/game';
import StartMenuScene from './StartMenuScene';

export default class CombatScene extends Phaser.Scene {

    // UI
    // @ts-ignore
    enermyContainer: Phaser.GameObjects.GameObject;
    // @ts-ignore
    playerContainer: Phaser.GameObjects.Container;
    handCards: Phaser.GameObjects.GameObject[] = [];
    // @ts-ignore
    playerCollider: Phaser.Physics.Arcade.Collider;
    // @ts-ignore
    enermyCollider: Phaser.Physics.Arcade.Collider;
    // @ts-ignore
    nextTurnButton: {
        conatiner: Phaser.GameObjects.Container;
        rect: Phaser.GameObjects.Rectangle;
    };
    // @ts-ignore
    handCardGroup: Phaser.GameObjects.Group;

    readonly cardWidth = 90 * 2;
    readonly cardHeight = 148 * 2;

    constructor(public combat: Combat, public gameState: Game) {
        super(CombatScene.name);
    }

    preload() {
        this.load.image("sky", "assets/sky.png");
        this.load.image("girl_1", "assets/girl_1.png");
        this.load.image("girl_2", "assets/girl_2.png");
    }

    async create() {
        let img = this.add.image(ui.centerX(this), ui.centerY(this), "sky");
        img.setScale(2);
        this.input.on("drag", function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        this.nextTurnButton = playerHelper.renderNextTurnButton(this);
        const startMenu = ui.button(this, "返回主菜单", {
            x: 150,
            y: ui.centerY(this) * 1.9,
            width: 250,
            height: 80,
            fontSize: 40,
        });
        startMenu.rect.on("pointerdown", async (pointer) => {
            // this.scene.bringToTop("StartMenu");
            // this.scene.start("StartMenu");
            // this.scene.remove(this);
            ui.transit(this,
                new StartMenuScene(), "StartMenu")
        });

        // Main Combat Loop
        this.gameControlLoop();
    }

    async gameControlLoop() {
        let waitForCombat = this.currentCombat().begin();
        let onStateChangeChan = this.currentCombat().onStateChange();
        let playerNextTurn = this.combat.player.nextTurnCaster.copy()

        console.log(onStateChangeChan);
        while (true) {
            console.log("waiting for state change", onStateChangeChan);
            let change = await onStateChangeChan.pop();
            console.log("state has been changed");
            if (onStateChangeChan.closed()) {
                throw new Error("unreachable");
            }
            const combat = this.currentCombat();
            const unitOfThisTurn = combat.getUnitOfThisTurn();
            console.log("refreshing");
            const { handCardGroup, enermy, player } = await this.refresh();
            console.log("refreshed");
            if (combat.hasWinner()) {
                console.log("hasWinner");
                const timeToWait = 1500;
                const text =
                    this.currentCombat().hasWinner() === this.currentCombat().player
                        ? await ui.renderVictory(this, timeToWait)
                        : await ui.renderLost(this, timeToWait);

                console.log("wait for current combat to finish");
                await waitForCombat;
                console.log("current combat is finished");

                const rewardScene = new RewardScene(combat.reward);
                const s = this.scene.add("RewardScene", rewardScene, true);
                const rewardPicked = await rewardScene.done();
                console.log(rewardPicked);
                combat.player.addCardToDeck(rewardPicked);
                // wait for reward scene to finish

                // Destory this scene
                ui.transit(this,
                    new LevelListScene(this.gameState),
                    LevelListScene.name)
                return;
            }
            else if (unitOfThisTurn === combat.enermy) {
                console.log("combat.getUnitOfThisTurn() === combat.participantB");
                const action = await combat.enermy.observeActionTaken();
                // todo: render a card attack animation
                // https://phaser.io/examples
                // @ts-ignore
                const body: Phaser.Physics.Arcade.Body = enermy.body;
                const cardPlayedByEnermy = ui.renderCard(
                    this,
                    action.card,
                    enermy.x,
                    enermy.y,
                    this.cardWidth,
                    this.cardHeight,
                );
                await ui.moveTo(
                    this,
                    cardPlayedByEnermy,
                    { x: 400 * 2, y: 150 * 2 },
                    400,
                );
                const isMissed = combat.enermy.commit(action);
                const waitDuration = 1500;
                if (isMissed instanceof Missed) {
                    console.log(isMissed);
                    await ui.renderMissed(this, waitDuration);
                } else {
                    await csp.sleep(waitDuration);
                }
                cardPlayedByEnermy.destroy();
            }
            else if (unitOfThisTurn === combat.player) {
                console.log("player");
                playerHelper.setNextTurnButtonInteractive(this);
                playerHelper.setHandCardsInteractive(this);
                
                async function isMissed(scene) {
                    let done = false;
                    while(!done) {
                        console.log(111);
                        await csp.select([
                            [combat.player.actionMissed, async () => {
                                console.log(222);
                                await ui.renderMissed(scene, 1500);
                            }],
                            [playerNextTurn, async () => {
                                console.log(333);
                                done = true;
                            }]
                        ])
                        console.log(444);
                    }
                }
                isMissed(this);
            }
            else {
                console.log("should not");
            }
            console.log("end of loop");
        }
        throw new Error("12321321");
    }

    async refresh() {
        const enermy = await enermyHelper.refreshEnermy(this, this.currentCombat());
        const player = await playerHelper.refreshPlayer(this, this.currentCombat());
        // todo: render draw pile
        const drawPile = await playerHelper.refreshDrawPile(this);
        const discardPile = playerHelper.refreshDiscardPile(this);
        this.handCardGroup = await playerHelper.refreshHandCards(
            this,
            this.currentCombat(),
        );
        // todo: render discard pile
        return {
            handCardGroup: this.handCardGroup,
            enermy,
            player,
            drawPile,
            discardPile,
        };
    }

    currentCombat(): Combat {
        return this.combat;
    }

    async done() {
    }
}
