import Phaser from 'phaser';
export default class Item extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y, item = 100, value = 500) {
    super(scene, x, y);
    this.setItemType(item);
    this.setValue(value);

    this.setPosition(x, y);
    this.setSize(32, 32);
    scene.physics.add.existing(this)
    scene.add.existing(this);
    console.log("item created");
  }

  setItemType(textureIdx) {
    this.setTexture("items", textureIdx);
  }

  setValue(value) {
    this.value = value;
  }

  preUpdate (time, delta) {
    super.preUpdate(time, delta);

    const speed = 280;
    const prevVelocity = this.body.velocity.clone();

    // Stop any previous movement from the last frame
    this.body.setVelocity(0);

    this.body.setVelocityY(speed);

  }
}

