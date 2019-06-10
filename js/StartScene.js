const survivorSpeed = 200

class StartScene extends Phaser.Scene {
  constructor() {
    super({key: "StartScene"})
  }

  preload(){
    this.load.image("ground", "assets/ground.png")
    this.load.image("ball", "assets/ball.svg")
    this.load.image("wall", "assets/wall_tile.svg")
  }

  create() {
    this.background = this.add.image(0,0, 'ground').setOrigin(0, 0)
    this.player = this.physics.add.sprite(50, 350, "ball").setScale(.3,.3)
    this.player.body.collideWorldBounds = true

    this.walls = this.physics.add.staticGroup()
    this.walls.create(460, 100, "wall").setScale(1.8, .1).refreshBody()
    this.walls.create(590, 280, "wall").setScale(.1, 1.6).refreshBody()

    this.walls.create(280, 510, "wall").setScale(2, .1).refreshBody()
    this.walls.create(280, 360, "wall").setScale(.1, 2).refreshBody()


    this.windows = this.physics.add.collider(this.player, this.walls);
    this.cursors = this.input.keyboard.createCursorKeys()
    this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.vault = false
  }

  update(delta){
    this.player.body.setVelocity(0)

    if (this.space.isDown && this.player.body.x > 175 && this.player.body.x < 250 && this.player.body.y < 458 && this.player.body.y > 430) {
      this.vault = true
    }

    if (this.vault) {
      this.physics.world.removeCollider(this.windows)

      let target = {x: 350, y:470}
      this.physics.moveToObject(this.player, target, survivorSpeed)
      //console.log(this.player.body.x, this.player.body.y)
      if ( this.player.body.x > target.x - 40){
        this.windows = this.physics.add.collider(this.player, this.walls)
        this.vault = false
      }
    }

    if (!this.vault){
      if (this.cursors.up.isDown) {
        this.player.body.setVelocityY(-survivorSpeed)
      } else if (this.cursors.down.isDown) {
        this.player.body.setVelocityY(survivorSpeed)
      }

      if (this.cursors.left.isDown) {
        this.player.body.setVelocityX(-survivorSpeed)
      } else if (this.cursors.right.isDown) {
        this.player.body.setVelocityX(survivorSpeed)
      }
    }

    this.player.body.velocity.normalize().scale(survivorSpeed)

  }
}