import Phaser from 'phaser';
import GameScene from './es6/game-scene.js';
import './assets/css/style.css';

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 600,
  backgroundColor: "#43adfd",
  parent: "game-container",
  pixelArt: true,
  scene: GameScene,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  }
};

const game = new Phaser.Game(config);
