const survivorSpeed = 250
const fast_vault_req = 25
const slow_vault_pen = .5

class StartScene extends Phaser.Scene {
  constructor() {
    super({key: "StartScene"})
  }

  preload(){
    this.load.image("ground", "assets/ground.png")
    this.load.image("ball", "assets/ball.svg")
    this.load.image("it", "assets/it.svg")
    this.load.image("wall", "assets/wall_tile.svg")
    this.load.image("window", "assets/window.svg")
  }

  create() {
    this.background = this.add.image(0,0, 'ground').setOrigin(0, 0)

    //this.player = this.physics.add.sprite(50, 350, "ball").setScale(.3,.3)
    this.windows = {}
    this.player = {}
    this.playerId =''
    this.itChosen = false

    this.window = this.physics.add.staticGroup()
    this.window.create(590, 140, "window").setScale(.15, .4).refreshBody()
    this.window.create(280, 470, "window").setScale(.15, .4).refreshBody()


    this.walls = this.physics.add.staticGroup()
    this.walls.create(460, 100, "wall").setScale(1.8, .1).refreshBody() //top wall
    this.walls.create(590, 242.5, "wall").setScale(.1, 2).refreshBody() // L shaft top

    this.walls.create(280, 510, "wall").setScale(2, .1).refreshBody() //bottom wall
    this.walls.create(280, 360, "wall").setScale(.1, 2).refreshBody() //T shaft bottom


    this.cursors = this.input.keyboard.createCursorKeys()
    this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.testKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.vault = null
    this.lundge = 0
    this.momentumLeft = 0
    this.momentumRight = 0
    this.stopped = false

    this.addNewPlayer = function(id, x, y, user) {
      console.log(this.player)
      if (!this.itChosen) {
        this.player[id] = this.physics.add.sprite(x, y, "it").setScale(.4,.4)
        this.player[id].it = true
        this.itChosen = true
      }else{
        this.player[id] = this.physics.add.sprite(x, y, "ball").setScale(.3,.3)
        this.player[id].it = false
      }
      this.player[id].body.collideWorldBounds = true
      this.windows[id] = this.physics.add.collider(this.player[id], this.walls, this.killMomentum, null, this)
      if (user) {
        this.playerId = id
      }
    }

    this.movePlayer = function(id,x,y) {
      if (id != this.playerId) {
        this.player[id].setPosition(x+25,y+25)
      }
    }

    this.removePlayer = function(id){
      this.player[id].destroy();
      delete this.playerMap[id];
    }

    console.log("creating player")
    Client.askNewPlayer()
  }

  killMomentum () {
    this.momentumLeft = 0
    this.momentumRight = 0
    console.log('bonk')
  }

  update(delta){

    if (this.playerId && this.player[this.playerId]) {

      this.player[this.playerId].body.setVelocity(0)

      if (this.testKey.isDown) {
        Client.sendTest()

      }

      if (this.vault === 1) {
        this.physics.world.removeCollider(this.windows[this.playerId])
        let target = {x: 350, y:470}
        let vaultSpeed = survivorSpeed
        if (this.momentumRight <= fast_vault_req) {
          vaultSpeed = survivorSpeed * slow_vault_pen
        }
        this.physics.moveToObject(this.player[this.playerId], target, vaultSpeed)
        if ( this.player[this.playerId].body.x > target.x - 40){
          this.windows[this.playerId] = this.physics.add.collider(this.player[this.playerId], this.walls, this.killMomentum, null, this)
          this.vault = null
        }
      }

      if (this.vault === 2) {
        this.physics.world.removeCollider(this.windows[this.playerId])
        let target = {x: 210, y:470}
        let vaultSpeed = survivorSpeed
        if (this.momentumLeft <= fast_vault_req) {
          vaultSpeed = survivorSpeed * slow_vault_pen
        }
        this.physics.moveToObject(this.player[this.playerId], target, vaultSpeed)
        if ( this.player[this.playerId].body.x < target.x - 5){
          this.windows[this.playerId] = this.physics.add.collider(this.player[this.playerId], this.walls, this.killMomentum, null, this)
          this.vault = null
        }
      }

      if (this.vault === 3) {
        this.physics.world.removeCollider(this.windows[this.playerId])
        let target = {x: 660, y:140}
        let vaultSpeed = survivorSpeed
        if (this.momentumRight <= fast_vault_req) {
          vaultSpeed = survivorSpeed * slow_vault_pen
        }
        this.physics.moveToObject(this.player[this.playerId], target, vaultSpeed)
        if ( this.player[this.playerId].body.x > target.x - 40){
          this.windows[this.playerId] = this.physics.add.collider(this.player[this.playerId], this.walls, this.killMomentum, null, this)
          this.vault = null
        }
      }

      if (this.vault === 4) {
        this.physics.world.removeCollider(this.windows[this.playerId])
        let target = {x: 520, y:140}
        let vaultSpeed = survivorSpeed
        if (this.momentumLeft <= fast_vault_req) {
          vaultSpeed = survivorSpeed * slow_vault_pen
        }
        this.physics.moveToObject(this.player[this.playerId], target, vaultSpeed)
        if ( this.player[this.playerId].body.x < target.x - 5){
          this.windows[this.playerId] = this.physics.add.collider(this.player[this.playerId], this.walls, this.killMomentum, null, this)
          this.vault = null
        }
      }

      if (!this.vault && !this.player[this.playerId].it){

        if (this.space.isDown && this.player[this.playerId].body.x > 170 && this.player[this.playerId].body.x < 280 && this.player[this.playerId].body.y < 510 && this.player[this.playerId].body.y > 430) {
          this.vault = 1
        }

        if (this.space.isDown && this.player[this.playerId].body.x < 390 && this.player[this.playerId].body.x > 280 && this.player[this.playerId].body.y < 510 && this.player[this.playerId].body.y > 430) {
          this.vault = 2
        }

        if (this.space.isDown && this.player[this.playerId].body.x > 480 && this.player[this.playerId].body.x < 590 && this.player[this.playerId].body.y < 180 && this.player[this.playerId].body.y > 100) {
          this.vault = 3
        }

        if (this.space.isDown && this.player[this.playerId].body.x < 700 && this.player[this.playerId].body.x > 590 && this.player[this.playerId].body.y < 180 && this.player[this.playerId].body.y > 100) {
          this.vault = 4
        }

        if (this.cursors.up.isDown) {
          this.player[this.playerId].body.setVelocityY(-survivorSpeed)
        } else if (this.cursors.down.isDown) {
          this.player[this.playerId].body.setVelocityY(survivorSpeed)
        }

        if (this.cursors.left.isDown && !this.cursors.right.isDown) {
          this.player[this.playerId].body.setVelocityX(-survivorSpeed)
          this.momentumRight = 0
          this.momentumLeft += 1
          if (this.stopped){
            this.momentumLeft = 0
          }
        } else if (this.cursors.right.isDown && !this.cursors.left.isDown) {
          this.player[this.playerId].body.setVelocityX(survivorSpeed)
          this.momentumLeft = 0
          this.momentumRight += 1
        } else {
          this.momentumLeft = 0
          this.momentumRight = 0
        }


      this.player[this.playerId].body.velocity.normalize().scale(survivorSpeed)
      }

      if (this.player[this.playerId].it) {

        if (this.space.isDown && this.lundge <=0) {
          this.lundge = 80
        }

        if (this.cursors.up.isDown) {
          this.player[this.playerId].body.setVelocityY(-survivorSpeed*1.15)
        } else if (this.cursors.down.isDown) {
          this.player[this.playerId].body.setVelocityY(survivorSpeed*1.15)
        }

        if (this.cursors.left.isDown && !this.cursors.right.isDown) {
          this.player[this.playerId].body.setVelocityX(-survivorSpeed*1.15)
          this.momentumRight = 0
          this.momentumLeft += 1
          if (this.stopped){
            this.momentumLeft = 0
          }
        } else if (this.cursors.right.isDown && !this.cursors.left.isDown) {
          this.player[this.playerId].body.setVelocityX(survivorSpeed*1.15)
          this.momentumLeft = 0
          this.momentumRight += 1
        } else {
          this.momentumLeft = 0
          this.momentumRight = 0
        }
        if (this.lundge > 60) {
          this.player[this.playerId].body.velocity.normalize().scale(survivorSpeed*1.725)
          this.lundge --
        } else if (this.lundge > 0){
          this.player[this.playerId].body.velocity.normalize().scale(survivorSpeed*.3)
          this.lundge --
        } else {
          this.player[this.playerId].body.velocity.normalize().scale(survivorSpeed*1.15)
        }

      }


    Client.sendPosition(this.player[this.playerId].body.x, this.player[this.playerId].body.y)
    }
  }
}
const StartScene2 = new StartScene()
console.log(new StartScene())