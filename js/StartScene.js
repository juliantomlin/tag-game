class StartScene extends Phaser.Scene {
  constructor() {
    super({key: "StartScene"})
  }

  preload(){
    this.load.image("ground", "assets/ground.png")
    this.load.image("ball", "assets/ball.svg")
  }

  create() {
    this.background = this.add.image(0,0, 'ground').setOrigin(0, 0)
    this.player = this.physics.add.sprite(50, 350, "ball").setScale(.3,.3)
    this.player.body.collideWorldBounds = true

    this.cursors = this.input.keyboard.createCursorKeys()
  }

  update(delta){

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160)
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160)
    } else {
      this.player.setVelocityY(0)
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160)
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160)
    } else {
      this.player.setVelocityX(0)
    }

  }
}