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
    console.log(Client.room)
    this.background = this.add.tileSprite(0,0,1600,1600, 'ground').setOrigin(0, 0)
    this.cameras.main.setBounds(-400, -400, 2400, 2400)
    this.physics.world.setBounds(0, 0, 1600, 1600)

    //this.player = this.physics.add.sprite(50, 350, "ball").setScale(.3,.3)
    this.windows = {}
    this.playerCollision = {}
    this.player = {}
    this.playerId =''
    this.itChosen = false
    this.vision = this.add.graphics(0,0)
    this.mask = this.vision.createGeometryMask()
    this.view = [[[0,0],[1600,0]],[[1600,0],[1600,1600]],[[1600,1600],[0,1600]],[[0,1600],[0,0]]]

    this.window = this.physics.add.staticGroup()
    this.walls = this.physics.add.staticGroup()
    this.players = this.physics.add.staticGroup()

    this.toBuild = Generate.tile(0,0,1,2)
    this.view = this.view.concat(Generate.tile(0,0,1,2).vision)
    this.toBuild.windows = this.toBuild.windows.concat(Generate.tile(1,0,1,3).windows)
    this.toBuild.walls = this.toBuild.walls.concat(Generate.tile(1,0,1,3).walls)
    this.view = this.view.concat(Generate.tile(1,0,1,3).vision)
    this.toBuild.windows = this.toBuild.windows.concat(Generate.tile(0,1,1,4).windows)
    this.toBuild.walls = this.toBuild.walls.concat(Generate.tile(0,1,1,4).walls)
    this.view = this.view.concat(Generate.tile(0,1,1,4).vision)
    this.toBuild.windows = this.toBuild.windows.concat(Generate.tile(1,1,1,1).windows)
    this.toBuild.walls = this.toBuild.walls.concat(Generate.tile(1,1,1,1).walls)
    this.view = this.view.concat(Generate.tile(1,1,1,1).vision)

    this.toBuild.windows.forEach((window) => {
      this.window.create(window.x, window.y, "window").setScale(window.width, window.length).refreshBody()
    })

    this.toBuild.walls.forEach((wall) => {
      this.walls.create(wall.x, wall.y, "wall").setScale(wall.width, wall.length).refreshBody()
    })


    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      })
    this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.testKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.vault = null
    this.lundge = 0
    this.momentumLeft = 0
    this.momentumRight = 0
    this.damageBoost = 0

    if (this.player) {
      for (const existingPlayer in this.player) {
        this.player[existingPlayer].setMask(this.mask)
      }
    }

    this.addNewPlayer = function(id, x, y, user) {
      if (!user) {
        if (!this.itChosen) {
          this.player[id] = this.players.create(x, y, "it").setScale(.4,.4).refreshBody()
          this.player[id].it = true
          this.itChosen = true
          //this.player[id].setCircle((this.player[id].width/2))
        }else{
          this.player[id] = this.players.create(x, y, "ball").setScale(.3,.3).refreshBody()
          this.player[id].it = false
          //this.player[id].setCircle((this.player[id].width/2))
        }
        //this.player[id].body.immovable = true
        //this.player[id].body.moves = false
        this.player[id].setMask(this.mask)
        this.player[id].id = id
        this.player[id].body.collideWorldBounds = true
        this.windows[id] = this.physics.add.collider(this.player[id], this.walls, this.killMomentum, null, this)
        this.playerCollision[id] = []
        for (let char in this.player) {
          this.playerCollision[id].push(this.physics.add.collider(this.player[id], this.player[char], this.killMomentum, null, this))
        }

      }
      else {
        this.playerId = id
        if (!this.itChosen) {
          this.player[id] = this.physics.add.sprite(x, y, "it").setScale(.4,.4).setBounce(.1)
          this.player[id].it = true
          this.itChosen = true
          //this.player[id].setCircle(this.player[id].width/2)
        }else{
          this.player[id] = this.physics.add.sprite(x, y, "ball").setScale(.3,.3).setBounce(.1)
          this.player[id].it = false
          //this.player[id].setCircle(this.player[id].width/2)
        }
        this.playerCollisionCheck = this.physics.add.image(x-1,y-1)
        this.playerCollisionCheck.displayWidth = this.player[id].displayWidth + 2
        this.playerCollisionCheck.displayHeight = this.player[id].displayHeight + 2
        this.player[id].setMask(this.mask)
        this.player[id].id = id
        this.player[id].body.collideWorldBounds = true
        this.windows[id] = this.physics.add.collider(this.player[id], this.walls, this.killMomentum, null, this)
        this.playerCollision[id] = []
        for (let char in this.player) {
          this.playerCollision[id].push(this.physics.add.collider(this.player[id], this.player[char], this.killMomentum, null, this))
        }
        this.cameras.main.startFollow(this.player[this.playerId], true, 0.08, 0.08)
      }
    }

    this.movePlayer = function(id,x,y) {
      if (id != this.playerId) {
        this.player[id].setOrigin(0,0).setPosition(x,y).refreshBody()
      }
    }

    this.removePlayer = function(id){
      this.player[id].destroy();
      delete this.playerMap[id];
    }

    this.receiveDamage = function(id) {
      if (this.playerId === id) {
        this.player[id].damageBoost = true
      }
      this.player[id].setTintFill(0xffffff)
      setTimeout(() => this.player[id].clearTint(), 150)
      setTimeout(() => this.player[id].setTintFill(0xffffff), 300)
      setTimeout(() => this.player[id].clearTint(), 450)
      setTimeout(() => this.player[id].setTintFill(0xffffff), 600)
      setTimeout(() => this.player[id].clearTint(), 900)


    }

    Client.askNewPlayer()
  }

  killMomentum (player1, player2) {


      player1.momentumLeft = 0
      player1.momentumRight = 0
      player1.momentumUp = 0
      player1.momentumDown = 0

      player2.momentumLeft = 0
      player2.momentumRight = 0
      player2.momentumUp = 0
      player2.momentumDown = 0

    if (player1.texture.key != "wall" && player2.texture.key != "wall"){
      this.collideDuringVault = true
      if (this.lundge && !this.lundgeHit && (player1.it || player2.it)) {
        this.lundgeHit = true
        if (player1.it){
          Client.hitConfirm(player2.id)
        } else if (player2.it) {
          Client.hitConfirm(player1.id)
        }
      }
    }
  }


  update(delta){

    if (this.playerId && this.player[this.playerId]) {

      this.playerCollisionCheck.body.x = this.player[this.playerId].body.x - 1
      this.playerCollisionCheck.body.y = this.player[this.playerId].body.y - 1


      this.player[this.playerId].body.setVelocity(0)

      if (this.player[this.playerId].body.touching.up) {
        this.upBlock = true
      }

      if (this.player[this.playerId].body.touching.down) {
        this.downBlock = true
      }

      if (this.player[this.playerId].body.touching.right) {
        this.rightBlock = true
      }

      if (this.player[this.playerId].body.touching.left) {
        this.leftBlock = true
      }

      //survivor vault
      if (this.vault) {
        let vaultSpeed = survivorSpeed
        // let direction
        // let targetOffset
        // if (this.player[this.playerId].body.x < this.vault.x) {
        //   direction = 'right'
        //   targetOffset = 40
        // } else if (this.player[this.playerId].body.x > this.vault.x) {
        //   direction = 'left'
        //   targetOffset = 5
        // }
        this.physics.world.removeCollider(this.windows[this.playerId])
        if ((this.player[this.playerId].momentumRight <= fast_vault_req && this.vault.direction === 'right') || (this.player[this.playerId].momentumLeft <= fast_vault_req && this.vault.direction === 'left') || (this.player[this.playerId].momentumUp <= fast_vault_req && this.vault.direction === 'up') || (this.player[this.playerId].momentumDown <= fast_vault_req && this.vault.direction === 'down')) {
          vaultSpeed = survivorSpeed * slow_vault_pen
        }
        this.physics.moveToObject(this.player[this.playerId], this.vault, vaultSpeed)
        if ((this.player[this.playerId].body.x > (this.vault.x - 40) && this.vault.direction === 'right') || (this.player[this.playerId].body.x < (this.vault.x - 5) && this.vault.direction === 'left') || (this.player[this.playerId].body.y < (this.vault.y - 5) && this.vault.direction === 'up') || (this.player[this.playerId].body.y > (this.vault.y - 40) && this.vault.direction === 'down')){
          this.windows[this.playerId] = this.physics.add.collider(this.player[this.playerId], this.walls, this.killMomentum, null, this)
          this.vault = null
        }
        if (this.vault && this.collideDuringVault && ((this.player[this.playerId].body.x < (this.vault.x - 40) && this.vault.direction === 'right') || (this.player[this.playerId].body.x > (this.vault.x - 5) && this.vault.direction === 'left') || (this.player[this.playerId].body.y > (this.vault.y - 5) && this.vault.direction === 'up') || (this.player[this.playerId].body.y < (this.vault.y - 40) && this.vault.direction === 'down'))) {
          this.windows[this.playerId] = this.physics.add.collider(this.player[this.playerId], this.walls, this.killMomentum, null, this)
          this.vault = null
        }
      }

      //survivor controlls
      if (!this.vault && !this.player[this.playerId].it){

        this.toBuild.windows.forEach((window) => {
          if (window.direction === 1) {
            if (this.space.isDown && this.player[this.playerId].body.x < window.x && this.player[this.playerId].body.x > (window.x - 110) && this.player[this.playerId].body.y < (window.y + 15) && this.player[this.playerId].body.y > (window.y - 65)) {
              this.vault = {x: window.x + 70, y: window.y, direction: 'right'}
              this.collideDuringVault = false
            }
            else if (this.space.isDown && this.player[this.playerId].body.x < (window.x + 110) && this.player[this.playerId].body.x > window.x && this.player[this.playerId].body.y < (window.y + 15) && this.player[this.playerId].body.y > (window.y - 65)) {
              this.vault = {x: window.x - 70, y: window.y, direction: 'left'}
              this.collideDuringVault = false
            }
          }
          if (window.direction === -1) {
            if (this.space.isDown && this.player[this.playerId].body.y < window.y && this.player[this.playerId].body.y > (window.y - 110) && this.player[this.playerId].body.x < (window.x + 15) && this.player[this.playerId].body.x > (window.x - 65)) {
              this.vault = {x: window.x, y: window.y + 70, direction: 'down'}
              this.collideDuringVault = false
            }
            else if (this.space.isDown && this.player[this.playerId].body.y < (window.y + 110) && this.player[this.playerId].body.y > window.y && this.player[this.playerId].body.x < (window.x + 15) && this.player[this.playerId].body.x > (window.x - 65)) {
              this.vault = {x: window.x, y: window.y - 70, direction: 'up'}
              this.collideDuringVault = false
            }
          }
        })

        if (this.cursors.up.isDown && !this.cursors.down.isDown) {
          this.player[this.playerId].body.setVelocityY(-survivorSpeed)
          this.player[this.playerId].momentumDown = 0
          this.player[this.playerId].momentumUp += 1
        } else if (this.cursors.down.isDown && !this.cursors.up.isDown) {
          this.player[this.playerId].body.setVelocityY(survivorSpeed)
          this.player[this.playerId].momentumUp = 0
          this.player[this.playerId].momentumDown += 1
        } else {
          this.player[this.playerId].momentumUp = 0
          this.player[this.playerId].momentumDown = 0
        }

        if (this.cursors.left.isDown && !this.cursors.right.isDown) {
          this.player[this.playerId].body.setVelocityX(-survivorSpeed)
          this.player[this.playerId].momentumRight = 0
          this.player[this.playerId].momentumLeft += 1

        } else if (this.cursors.right.isDown && !this.cursors.left.isDown) {
          this.player[this.playerId].body.setVelocityX(survivorSpeed)
          this.player[this.playerId].momentumLeft = 0
          this.player[this.playerId].momentumRight += 1
        } else {
          this.player[this.playerId].momentumLeft = 0
          this.player[this.playerId].momentumRight = 0
        }

        if (this.player[this.playerId].damageBoost) {
          this.player[this.playerId].damageBoostStart = delta
          this.player[this.playerId].damageBoost = false
        }

        if (delta - this.player[this.playerId].damageBoostStart < 3000) {
          this.player[this.playerId].body.velocity.normalize().scale(survivorSpeed * 1.5)
          this.playerCollisionCheck.body.velocity.normalize().scale(survivorSpeed * 1.5)
        } else {
          this.player[this.playerId].body.velocity.normalize().scale(survivorSpeed)
          this.playerCollisionCheck.body.velocity.normalize().scale(survivorSpeed)
        }
      }

      // killer controlls
      if (this.player[this.playerId].it) {

        if (this.space.isDown && !this.lundge) {
          this.lundge = true
          this.lundgeStart = delta
        }

        if (this.cursors.up.isDown && !this.cursors.down.isDown) {
          this.player[this.playerId].body.setVelocityY(-survivorSpeed*1.15)
        }

        if (this.cursors.down.isDown && !this.cursors.up.isDown) {
          this.player[this.playerId].body.setVelocityY(survivorSpeed*1.15)
        }

        if (this.cursors.left.isDown && !this.cursors.right.isDown) {
          this.player[this.playerId].body.setVelocityX(-survivorSpeed*1.15)
        }

        if (this.cursors.right.isDown && !this.cursors.left.isDown) {
          this.player[this.playerId].body.setVelocityX(survivorSpeed*1.15)
        }

        if (this.lundge && (delta - this.lundgeStart) < 300 && !this.lundgeHit) {
          this.player[this.playerId].body.velocity.normalize().scale(survivorSpeed*1.725)
        } else if (this.lundge && (delta - this.lundgeStart < 1500)){
          this.player[this.playerId].body.velocity.normalize().scale(survivorSpeed*.3)
        } else {
          this.lundge = false
          this.lundgeHit = false
          this.player[this.playerId].body.velocity.normalize().scale(survivorSpeed*1.15)
        }

      }

    Client.sendPosition(this.player[this.playerId].body.x, this.player[this.playerId].body.y)


    let visibility = VisibilityPolygon.computeViewport([this.player[this.playerId].body.x+25, this.player[this.playerId].body.y+25], this.view, [0,0], [2000,2000])


    this.vision.clear();
    this.vision.lineStyle(2, 0xff8800, 1)
    this.vision.fillStyle(0xffff00, .05)
    this.vision.beginPath();
    this.vision.moveTo(visibility[0][0],visibility[0][1])
    for(var i=1; i<=visibility.length; i++){
      this.vision.lineTo(visibility[i%visibility.length][0],visibility[i%visibility.length][1])
    }
    this.vision.closePath()
    //this.vision.strokePath()
    this.vision.fillPath()
    }
  }
}
const StartScene2 = new StartScene()
console.log(new StartScene())