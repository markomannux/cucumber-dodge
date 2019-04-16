import Phaser from 'phaser';

import Player from "./player.js";
import Cucumber from "./cucumber.js";
import Item from "./item.js";

import GroundImage from "../assets/spritesheets/ground.png";
import CucumberImage from "../assets/spritesheets/cucumber.png";
import ItemsSpritesheet from "../assets/spritesheets/items.png";
import PlayerSpritesheet from "../assets/spritesheets/buch-characters-64px-extruded.png";

export default class GameScene extends Phaser.Scene {

  constructor() {
    super();
    this.arrays = [
      '1001',
      '1100',
      '0110',
      '0011',
      '1110',
      '0111',
      '1010',
      '0101',
      '1011',
      '1101'
    ]

    this.EMITTING_INTERVAL = 550;
    this.DROP_INTERVAL = 10;
  }

  preload() {
    this.load.image('ground', GroundImage);
    this.load.image('cucumber', CucumberImage);

    this.load.spritesheet(
      "player-spritesheet",
      PlayerSpritesheet,
      {
        frameWidth: 64,
        frameHeight: 64,
        margin: 1,
        spacing: 2
      }
    );

    this.load.spritesheet(
      "items",
      ItemsSpritesheet,
      {
        frameWidth: 32,
        frameHeight: 32,
        margin: 0,
        spacing: 0
      }
    );
  }

  create() {
    const MARGIN_SIZE = 48;
    const TILE_SIZE = 76;
    this.cucumberRowCounter = 0;

    console.log('Creating scene...');
    this.hasPlayerDied = false;
    this.score = 0;
    this.platforms = this.physics.add.staticGroup();

    for (let i = 0; i<4; i++) {
      this.platforms.create(MARGIN_SIZE + TILE_SIZE/2 + TILE_SIZE*i, 587, 'ground');
    }

    this.lastEmit = 0;
    this.cucumberPool = this.add.group();
    this.cucumberPool.classType = Cucumber;

    this.itemPool = this.add.group();
    this.itemPool.classType = Item;

    this.player = new Player(this, 225, 505);

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.cucumberPool, this.collidePlayerWithCucumber, null, this);
    this.physics.add.overlap(this.player, this.itemPool, this.collect, null, this);
    this.physics.add.collider(this.cucumberPool, this.platforms, this.hideCucumber, null, this);
    this.physics.add.collider(this.itemPool, this.platforms, this.hideItem, null, this);

    this.text = this.add
      .text(16, 16, this.generateStatusText(), {
        font: "18px monospace",
        fill: "#000000",
        padding: { x: 20, y: 10 },
        backgroundColor: "#ffffff"
      })
      .setScrollFactor(0)
      .setDepth(1000);

  }

  generateStatusText() {
    return `Score: ${this.score}`;
  }

  collidePlayerWithCucumber(player, cucumber) {
    if (cucumber.active && !this.hasPlayerDied) {
      this.hasPlayerDied = true;
      this.player.freeze();
      this.player.die();
      const cam = this.cameras.main;
      cam.fade(1000, 0, 0, 0);
      cam.once("camerafadeoutcomplete", () => {
        this.player.destroy();
        this.scene.restart();
      });
    }
  }

  collect(player, item) {
    console.log("Player collected item");
    item.destroy();
    this.score += item.value;
  }

  hideCucumber(cucumber, platform) {
    if (cucumber.active) {
      this.cucumberPool.killAndHide(cucumber);
      this.score += 50;
    }
  }

  hideItem(item, platform) {
    if (item.active) {
      this.itemPool.killAndHide(item);
      this.score += item.value;
    }
  }

  update(time, delta) {
    if (!this.hasPlayerDied) {
      if(time > 2500 && time - this.lastEmit > this.EMITTING_INTERVAL) {
        this.emitCucumberArray();
        this.lastEmit = time;
      }
    }

    this.text.setText(this.generateStatusText())
  }

  emitCucumberArray() {
    const cucumberMask = this.arrays[Math.floor(Math.random() * this.arrays.length)];
    
    let drop = this.cucumberRowCounter%this.DROP_INTERVAL === 0;
    let dropCoords = [];
    for (let i = 0; i < cucumberMask.length; i++) {
      const x = 48 + 38 + 76 * i;
      const y = -50;
      if (cucumberMask[i] == '1') {
        let cucumber = this.cucumberPool.getFirstDead(true, x, y);
        cucumber.visible = true;
        cucumber.active = true;
      } else {
        dropCoords.push({x: x, y: y});
      }
    }

    if (drop) {
      const rand = Math.floor(Math.random()*dropCoords.length);
      const dropCoord = dropCoords[rand];

      const item = this.itemPool.getFirstDead(true, dropCoord.x, dropCoord.y);
      item.setValue(500);
      item.setItemType(120);
      item.visible = true;
      item.active = true;
    }

    this.cucumberRowCounter++;
  }
}
