/**
 * A class that wraps up our top down player logic. It creates, animates and moves a this in
 * response to WASD keys. Call its update method from the scene's update and call its destroy
 * method when you're done with the player.
 */
export default class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.moving = false;
    this.waitLeftReleased = false;
    this.waitRightReleased = false;

    this.gridPosition = 1;

    this.scene = scene;
    const anims = scene.anims;
    anims.create({
      key: "player-walk",
      frames: anims.generateFrameNumbers("player-spritesheet", { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });
    anims.create({
      key: "player-walk-back",
      frames: anims.generateFrameNumbers("player-spritesheet", { start: 19, end: 22 }),
      frameRate: 8,
      repeat: -1
    });

    this.setTexture("player-spritesheet", 0);
    this.setPosition(48+38+76, y);
    this.setSize(22, 33);

    scene.physics.add.existing(this)
    this.body.offset.x = 23;
    this.body.offset.y = 27;

    scene.add.existing(this);

    this.anims.play("player-walk-back");

    this.keys = scene.input.keyboard.createCursorKeys();

    var leftZone = scene.add.zone(0, 0, 200, 600).setOrigin(0).setName('Left').setInteractive();
    var rightZone = scene.add.zone(200, 0, 400, 600).setOrigin(0).setName('Right').setInteractive();

    const self = this;

    scene.input.on('gameobjectdown', function(pointer, gameObject) {
      if(gameObject.name === 'Left') {
        console.log('tap left');
        self.tapLeft = true;
      }

      if(gameObject.name === 'Right') {
        console.log('tap right');
        self.tapRight = true;
      }
      
    })
    
  }

  freeze() {
    this.body.moves = false;
    this.anims.stop();
    this.setTexture("player-spritesheet", 0);
  }

  die() {
    this.dead = true;
    this.setOrigin(0.5, 0.7);
    this.tint = 0xff0000;
    this.scene.tweens.add({
        targets: this,
        angle: { value: 360, duration: 500},
        repeat: 5
    });
  }

  preUpdate(time, delta) {
    if (this.dead) return;
    const keys = this.keys;
    const speed = 300;

    const duration = 100;
    const self = this;

    // Horizontal movement
    if (!this.moving
      && !this.waitLeftReleased
      && (keys.left.isDown || this.tapLeft)
      && this.gridPosition > 0) {

      this.waitLeftReleased = true;
      this.setFlipX(true);
      this.gridPosition--;
      this.moving = true;
      this.scene.tweens.add({
        targets: this,
        props: {
          x: { value: '-=76', duration: duration },
          y: { value: '+=0', duration: duration }
        },
        onComplete: function() { self.moving = false; },
        delay: 0
      });
    } else if (!this.moving
      && !this.waitRightReleased
      && (keys.right.isDown || this.tapRight)
      && this.gridPosition < 3) {

      this.waitRightReleased = true;
      this.setFlipX(false);
      this.gridPosition++;
      this.moving = true;
      this.scene.tweens.add({
        targets: this,
        props: {
          x: { value: '+=76', duration: duration },
          y: { value: '+=0', duration: duration }
        },
        onComplete: function() { self.moving = false; },
        delay: 0
      });
    }

    if(this.waitLeftReleased && keys.left.isUp) {
      this.waitLeftReleased = false;
    }
    if(this.waitRightReleased && keys.right.isUp) {
      this.waitRightReleased = false;
    }

    // Update the animation last and give left/right/down animations precedence over up animations
    if (this.moving) {
      this.anims.play("player-walk", true);
    } else {
      this.anims.stop();
    }

    this.tapLeft = false;
    this.tapRight = false;

  }
}

