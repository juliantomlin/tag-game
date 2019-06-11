const survivorSpeed = 200
const fast_vault_req = 25
const slow_vault_pen = .6

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
    this.walls.create(460, 100, "wall").setScale(1.8, .1).refreshBody() //top wall
    this.walls.create(590, 242.5, "wall").setScale(.1, 2).refreshBody() // L shaft top

    this.walls.create(280, 510, "wall").setScale(2, .1).refreshBody() //bottom wall
    this.walls.create(280, 360, "wall").setScale(.1, 2).refreshBody() //T shaft bottom


    this.windows = this.physics.add.collider(this.player, this.walls, this.killMomentum, null, this)
    this.cursors = this.input.keyboard.createCursorKeys()
    this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.vault = null
    this.momentumLeft = 0
    this.momentumRight = 0
    this.stopped = false
  }

  killMomentum () {
    this.momentumLeft = 0
    this.momentumRight = 0
    console.log('bonk')
  }

  update(delta){
    this.player.body.setVelocity(0)
    console.log(this.momentumRight, this.momentumLeft)



    if (this.vault === 1) {
      this.physics.world.removeCollider(this.windows)
      let target = {x: 350, y:470}
      let vaultSpeed = survivorSpeed
      if (this.momentumRight <= fast_vault_req) {
        vaultSpeed = survivorSpeed * slow_vault_pen
      }
      this.physics.moveToObject(this.player, target, vaultSpeed)
      if ( this.player.body.x > target.x - 40){
        this.windows = this.physics.add.collider(this.player, this.walls)
        this.vault = null
      }
    }

    if (this.vault === 2) {
      this.physics.world.removeCollider(this.windows)
      let target = {x: 210, y:470}
      let vaultSpeed = survivorSpeed
      if (this.momentumLeft <= fast_vault_req) {
        vaultSpeed = survivorSpeed * slow_vault_pen
      }
      this.physics.moveToObject(this.player, target, vaultSpeed)
      if ( this.player.body.x < target.x - 5){
        this.windows = this.physics.add.collider(this.player, this.walls)
        this.vault = null
      }
    }

    if (this.vault === 3) {
      this.physics.world.removeCollider(this.windows)
      let target = {x: 660, y:140}
      let vaultSpeed = survivorSpeed
      if (this.momentumRight <= fast_vault_req) {
        vaultSpeed = survivorSpeed * slow_vault_pen
      }
      this.physics.moveToObject(this.player, target, vaultSpeed)
      if ( this.player.body.x > target.x - 40){
        this.windows = this.physics.add.collider(this.player, this.walls)
        this.vault = null
      }
    }

    if (this.vault === 4) {
      this.physics.world.removeCollider(this.windows)
      let target = {x: 520, y:140}
      let vaultSpeed = survivorSpeed
      if (this.momentumLeft <= fast_vault_req) {
        vaultSpeed = survivorSpeed * slow_vault_pen
      }
      this.physics.moveToObject(this.player, target, vaultSpeed)
      if ( this.player.body.x < target.x - 5){
        this.windows = this.physics.add.collider(this.player, this.walls)
        this.vault = null
      }
    }

    if (!this.vault){

      if (this.space.isDown && this.player.body.x > 170 && this.player.body.x < 280 && this.player.body.y < 510 && this.player.body.y > 430) {
        this.vault = 1
      }

      if (this.space.isDown && this.player.body.x < 390 && this.player.body.x > 280 && this.player.body.y < 510 && this.player.body.y > 430) {
        this.vault = 2
      }

      if (this.space.isDown && this.player.body.x > 480 && this.player.body.x < 590 && this.player.body.y < 180 && this.player.body.y > 100) {
        this.vault = 3
      }

      if (this.space.isDown && this.player.body.x < 700 && this.player.body.x > 590 && this.player.body.y < 180 && this.player.body.y > 100) {
        this.vault = 4
      }

      if (this.cursors.up.isDown) {
        this.player.body.setVelocityY(-survivorSpeed)
      } else if (this.cursors.down.isDown) {
        this.player.body.setVelocityY(survivorSpeed)
      }

      if (this.cursors.left.isDown && !this.cursors.right.isDown) {
        this.player.body.setVelocityX(-survivorSpeed)
        this.momentumRight = 0
        this.momentumLeft += 1
        if (this.stopped){
          this.momentumLeft = 0
        }
      } else if (this.cursors.right.isDown && !this.cursors.left.isDown) {
        this.player.body.setVelocityX(survivorSpeed)
        this.momentumLeft = 0
        this.momentumRight += 1
      } else {
        this.momentumLeft = 0
        this.momentumRight = 0
      }

      if (this.stopped) {
        this.momentumLeft = 0
        this.momentumRight = 0
      }

    this.player.body.velocity.normalize().scale(survivorSpeed)
    }


  }
}