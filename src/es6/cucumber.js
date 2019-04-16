export default class Cucumber extends Phaser.GameObjects.Sprite {


  constructor(scene, x, y) {
    super(scene, x, y);

    this.MAX_SWING = .5;

    this.setTexture("cucumber");
    this.setPosition(x, y);
    this.setSize(18, 28);
    scene.add.existing(this);

    scene.physics.add.existing(this)
    this.body.offset.x = 6;
    this.body.offset.y = 2;

    this.rotation = Math.random() - this.MAX_SWING;
    this.rotationSpeed = .05;//(Math.random()*0.1)-0.02;
  }

  preUpdate (time, delta) {
    super.preUpdate(time, delta);
    this.rotation += this.rotationSpeed;
    if (this.rotation <= -0.5 || this.rotation >= .5) {
      this.rotationSpeed = -this.rotationSpeed;
    }

    const speed = 280;
    const prevVelocity = this.body.velocity.clone();

    // Stop any previous movement from the last frame
    this.body.setVelocity(0);

    this.body.setVelocityY(speed);

  }
}

