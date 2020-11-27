const survivorSpeed = 250 * .66
const fast_vault_req = 25
const slow_vault_pen = .4
let killerSpeed = 1.15

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
    this.load.image("gen", "assets/gen.svg")
  }

  create() {
    Client.askNewPlayer()
    this.zoom = .66
    this.background = this.add.tileSprite(0,0,3200*this.zoom,3200*this.zoom, 'ground').setOrigin(0, 0)
    this.cameras.main.setBounds(-500, -500, 3200, 3200)
    this.physics.world.setBounds(0, 0, 3200*this.zoom, 3200*this.zoom)

    //this.player = this.physics.add.sprite(50, 350, "ball").setScale(.3,.3)
    this.windows = {}
    this.playerCollision = {}
    this.itCollision = []
    this.scoreZone = {}
    this.player = {}
    this.genZone = {}
    this.playerScoring = {}
    this.playerId =''
    this.changeGenBack = {}
    this.itChosen = false
    this.vision = this.add.graphics(0,0)
    this.mask = this.vision.createGeometryMask()
    this.view = [[[0,0],[4000*this.zoom,0]],[[4000*this.zoom,0],[4000*this.zoom,4000]],[[4000*this.zoom,4000*this.zoom],[0,4000*this.zoom]],[[0,4000*this.zoom],[0,0]]]

    this.totalScore = 0
    this.totalScoreDisplay = this.add.text(10, 5, '0').setScrollFactor(0)

    //randomly generate the 9 map tiles

    this.window = this.physics.add.staticGroup()
    this.walls = this.physics.add.staticGroup()
    this.gens = this.physics.add.staticGroup()
    this.players = this.physics.add.staticGroup()

    this.toBuild = Generate.tile(0,0,5)
    this.view = this.view.concat(Generate.tile(0,0,5).vision)

    this.toBuild.windows = this.toBuild.windows.concat(Generate.tile(1,0,2).windows)
    this.toBuild.walls = this.toBuild.walls.concat(Generate.tile(1,0,2).walls)
    this.toBuild.gens = this.toBuild.gens.concat(Generate.tile(1,0,2).gens)
    this.view = this.view.concat(Generate.tile(1,0,2).vision)

    this.toBuild.windows = this.toBuild.windows.concat(Generate.tile(2,0,2).windows)
    this.toBuild.walls = this.toBuild.walls.concat(Generate.tile(2,0,2).walls)
    this.toBuild.gens = this.toBuild.gens.concat(Generate.tile(2,0,2).gens)
    this.view = this.view.concat(Generate.tile(2,0,2).vision)

    this.toBuild.windows = this.toBuild.windows.concat(Generate.tile(0,1,2).windows)
    this.toBuild.walls = this.toBuild.walls.concat(Generate.tile(0,1,2).walls)
    this.toBuild.gens = this.toBuild.gens.concat(Generate.tile(0,1,2).gens)
    this.view = this.view.concat(Generate.tile(0,1,2).vision)

    this.toBuild.windows = this.toBuild.windows.concat(Generate.tile(1,1,2).windows)
    this.toBuild.walls = this.toBuild.walls.concat(Generate.tile(1,1,2).walls)
    this.toBuild.gens = this.toBuild.gens.concat(Generate.tile(1,1,2).gens)
    this.view = this.view.concat(Generate.tile(1,1,2).vision)

    this.toBuild.windows = this.toBuild.windows.concat(Generate.tile(2,1,2).windows)
    this.toBuild.walls = this.toBuild.walls.concat(Generate.tile(2,1,2).walls)
    this.toBuild.gens = this.toBuild.gens.concat(Generate.tile(2,1,2).gens)
    this.view = this.view.concat(Generate.tile(2,1,2).vision)

    this.toBuild.windows = this.toBuild.windows.concat(Generate.tile(0,2,2).windows)
    this.toBuild.walls = this.toBuild.walls.concat(Generate.tile(0,2,2).walls)
    this.toBuild.gens = this.toBuild.gens.concat(Generate.tile(0,2,2).gens)
    this.view = this.view.concat(Generate.tile(0,2,2).vision)

    this.toBuild.windows = this.toBuild.windows.concat(Generate.tile(1,2,2).windows)
    this.toBuild.walls = this.toBuild.walls.concat(Generate.tile(1,2,2).walls)
    this.toBuild.gens = this.toBuild.gens.concat(Generate.tile(1,2,2).gens)
    this.view = this.view.concat(Generate.tile(1,2,2).vision)

    this.toBuild.windows = this.toBuild.windows.concat(Generate.tile(2,2,2).windows)
    this.toBuild.walls = this.toBuild.walls.concat(Generate.tile(2,2,2).walls)
    this.toBuild.gens = this.toBuild.gens.concat(Generate.tile(2,2,2).gens)
    this.view = this.view.concat(Generate.tile(2,2,2).vision)


    //adds windows to the map
    this.toBuild.windows.forEach((window) => {
      this.window.create(window.x, window.y, "window").setScale(window.width, window.length).refreshBody()
    })

    //adds walls to the map
    this.toBuild.walls.forEach((wall) => {
      this.walls.create(wall.x, wall.y, "wall").setScale(wall.width, wall.length).refreshBody()
    })

    //adds generators to the map
    this.toBuild.gens.forEach((gen, i) => {
      this.genZone[i] = this.gens.create(gen.x, gen.y, "gen").setScale(.35, .35).refreshBody()
      this.genZone[i].id = i
    })

    //defines the player keys
    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      })
    this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    this.shift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
    this.testKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    //initate player movement properties
    this.vault = null
    this.lundge = 0
    this.phase = 0
    this.momentumLeft = 0
    this.momentumRight = 0
    this.damageBoost = 0

    if (this.player) {
      for (const existingPlayer in this.player) {
        this.player[existingPlayer].setMask(this.mask)
      }
    }

    //id is the player id, (x,y) are the spawn coordinates, user is true if the player controlls the character, it is true if the are killer, score is the player score
    this.addNewPlayer = function(id, x, y, user, it, score) {
      if (!user) {
        if (it) {
          this.player[id] = this.players.create(x, y, "it").setScale(.4*this.zoom,.4*this.zoom).refreshBody()
          this.player[id].it = true
          //this.player[id].setCircle((this.player[id].width/2))
        }else{
          this.player[id] = this.players.create(x, y, "ball").setScale(.3*this.zoom,.3*this.zoom).refreshBody()
          this.player[id].it = false
          this.scoreZone[id] = []
          for (let gen in this.genZone){
            this.scoreZone[id].push(this.physics.add.overlap(this.player[id], this.genZone[gen], this.scoreEvent, null, this))
          }
          //this.player[id].setCircle((this.player[id].width/2))
        }
        this.player[id].setMask(this.mask)
        this.player[id].id = id
        this.player[id].score = score
        this.player[id].body.collideWorldBounds = true
        this.playerCollision[id] = []
        this.windows[id] = this.physics.add.collider(this.player[id], this.walls, this.killMomentum, null, this)
        for (let char in this.player) {
          this.playerCollision[id].push(this.physics.add.collider(this.player[id], this.player[char], this.killMomentum, null, this))
        }

      }
      else {
      //this is if the player controlls the newly created player
        this.playerId = id
        if (it) {
          this.player[id] = this.physics.add.sprite(x, y, "it").setScale(.4*this.zoom,.4*this.zoom).setBounce(.1)
          this.player[id].it = true
          //this.player[id].setCircle(this.player[id].width/2)
        }else{
          this.player[id] = this.physics.add.sprite(x, y, "ball").setScale(.3*this.zoom,.3*this.zoom).setBounce(.1)
          this.player[id].it = false
          this.player[id].scoreDisplay = this.add.text(10, 30, '0').setScrollFactor(0)
          this.scoreZone[id] = []
          for (let gen in this.genZone){
            this.scoreZone[id].push(this.physics.add.overlap(this.player[id], this.genZone[gen], this.scoreEvent, null, this))
          }
          //this.player[id].setCircle(this.player[id].width/2)
        }
        // this.playerCollisionCheck = this.physics.add.image(x-1,y-1)
        // this.playerCollisionCheck.displayWidth = this.player[id].displayWidth + 2
        // this.playerCollisionCheck.displayHeight = this.player[id].displayHeight + 2
        this.player[id].setMask(this.mask)
        this.player[id].id = id
        this.player[id].score = score
        this.player[id].body.collideWorldBounds = true
        this.windows[id] = this.physics.add.collider(this.player[id], this.walls, this.killMomentum, null, this)
        this.playerCollision[id] = []
        for (let char in this.player) {
            this.playerCollision[id].push(this.physics.add.collider(this.player[id], this.player[char], this.killMomentum, null, this))
        }
        this.cameras.main.startFollow(this.player[this.playerId], true, 0.08, 0.08)
      }
      this.totalScore = 0
      for (var score in this.player){
        this.totalScore += this.player[score].score
      }
      this.totalScoreDisplay.setText(this.totalScore)
    }


    this.movePlayer = function(id,x,y) {
      if (id != this.playerId) {
        this.player[id].setOrigin(0,0).setPosition(x,y).refreshBody()
      }
    }

    this.removePlayer = function(id){
      this.player[id].score = 0
      this.player[id].destroy();
      this.totalScore = 0
      for (var score in this.player){
        this.totalScore += this.player[score].score
      }
      this.totalScoreDisplay.setText(this.totalScore)
      if (this.player[id].it) {
        Client.itLeft()
      }
    }

    this.shutDownRoom = function() {
      this.player = {}
      this.scene.stop()
      this.scene.start('MainMenu')
    }

    this.receiveDamage = function(id) {
      if (this.playerId === id) {
        this.player[id].damageBoost = true
        this.player[id].score = Math.floor(this.player[id].score / 2)
        this.player[id].scoreDisplay.setText(this.player[id].score)
      }
      this.player[id].setTintFill(0xffffff)
      setTimeout(() => this.player[id].clearTint(), 150)
      setTimeout(() => this.player[id].setTintFill(0xffffff), 300)
      setTimeout(() => this.player[id].clearTint(), 450)
      setTimeout(() => this.player[id].setTintFill(0xffffff), 600)
      setTimeout(() => this.player[id].clearTint(), 900)


    }

    this.updateScore = function(data) {
      this.player[data.id].score = data.score
      this.totalScore = 0
      for (var score in this.player){
        this.totalScore += this.player[score].score
      }
      this.totalScoreDisplay.setText(this.totalScore)
      if (this.playerId === data.id){
        this.player[data.id].scoreDisplay.setText(this.player[data.id].score)
      }
    }
  }

  scoreEvent (player, gen) {
    this.playerScoring[player.id]= {gen: gen.id}
  }

  changeGenColor (genId, change) {
    if (change){
      this.genZone[genId].setTintFill(0x0000ff)
    } else {
      this.genZone[genId].clearTint()
    }
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

      //changes scorezone color after sitting on it for 3 seconds
      for (let player in this.player){
        if (!this.playerScoring[player]){
          this.player[player].scoreStart = false
        }
        else {
          if (!this.player[player].scoreStart){
            this.player[player].scoreStart = {genId: this.playerScoring[player].gen, time: delta}
          } else {
            if (delta - this.player[player].scoreStart.time > 3000) {
              this.changeGenColor(this.player[player].scoreStart.genId, true)
              this.changeGenBack[this.player[player].scoreStart.genId] = false
              if (player === this.playerId) {
                if (!this.scoreIncrease) {
                  this.scoreIncrease = delta
                } else {
                  if (delta - this.scoreIncrease > 1000){
                    this.scoreIncrease = delta
                    Client.increaseScore(this.playerId)
                  }
                }
              }
            }
          }
        }
      }
      //changes scorezone color back to white if no one is on it
       for (let gen in this.genZone){
        if (this.changeGenBack[gen]){
          this.changeGenColor(gen, false)
        }
        this.changeGenBack[gen] = true
      }

      this.playerScoring = {}

      // this.playerCollisionCheck.body.x = this.player[this.playerId].body.x - 1
      // this.playerCollisionCheck.body.y = this.player[this.playerId].body.y - 1


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
        let vaultSpeed = survivorSpeed * .8
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
          if (this.vaultStart){
            this.slowVault = this.physics.moveTo(this.player[this.playerId],this.vault.previous.x, this.vault.previous.y, vaultSpeed, 300)
            setTimeout(() => this.vaultStart = false, 300)
          } else {
            this.physics.moveToObject(this.player[this.playerId], this.vault, vaultSpeed)
          }
        }else{
          this.physics.moveToObject(this.player[this.playerId], this.vault, vaultSpeed)
        }
        if ((this.player[this.playerId].body.x > (this.vault.x - 40*this.zoom) && this.vault.direction === 'right') || (this.player[this.playerId].body.x < (this.vault.x - 5*this.zoom) && this.vault.direction === 'left') || (this.player[this.playerId].body.y < (this.vault.y - 5*this.zoom) && this.vault.direction === 'up') || (this.player[this.playerId].body.y > (this.vault.y - 40*this.zoom) && this.vault.direction === 'down')){
          this.windows[this.playerId] = this.physics.add.collider(this.player[this.playerId], this.walls, this.killMomentum, null, this)
          this.vault = null
          this.vaultStart = false
        }
        if (this.vault && this.collideDuringVault && ((this.player[this.playerId].body.x < (this.vault.x - 40*this.zoom) && this.vault.direction === 'right') || (this.player[this.playerId].body.x > (this.vault.x - 5*this.zoom) && this.vault.direction === 'left') || (this.player[this.playerId].body.y > (this.vault.y - 5*this.zoom) && this.vault.direction === 'up') || (this.player[this.playerId].body.y < (this.vault.y - 40*this.zoom) && this.vault.direction === 'down'))) {
          this.windows[this.playerId] = this.physics.add.collider(this.player[this.playerId], this.walls, this.killMomentum, null, this)
          this.vault = null
          this.vaultStart = false
        }
      }

      //survivor controlls
      if (!this.vault && !this.player[this.playerId].it){

        //vaulting
        if (this.space.isDown){
          this.toBuild.windows.forEach((window) => {
            if (window.direction === 1) {
              if (this.player[this.playerId].body.x < window.x && this.player[this.playerId].body.x > (window.x - 110*this.zoom) && this.player[this.playerId].body.y < (window.y + 15*this.zoom) && this.player[this.playerId].body.y > (window.y - 65*this.zoom)) {
                this.vault = {x: window.x + 70*this.zoom, y: window.y, direction: 'right', previous:{x:window.x-70*this.zoom, y:window.y}}
                this.collideDuringVault = false
                this.vaultStart = true
              }
              else if (this.player[this.playerId].body.x < (window.x + 110*this.zoom) && this.player[this.playerId].body.x > window.x && this.player[this.playerId].body.y < (window.y + 15*this.zoom) && this.player[this.playerId].body.y > (window.y - 65*this.zoom)) {
                this.vault = {x: window.x - 70*this.zoom, y: window.y, direction: 'left', previous:{x:window.x+70*this.zoom, y:window.y}}
                this.collideDuringVault = false
                this.vaultStart = true
              }
            }
            if (window.direction === -1) {
              if (this.player[this.playerId].body.y < window.y && this.player[this.playerId].body.y > (window.y - 110*this.zoom) && this.player[this.playerId].body.x < (window.x + 15*this.zoom) && this.player[this.playerId].body.x > (window.x - 65*this.zoom)) {
                this.vault = {x: window.x, y: window.y + 70*this.zoom, direction: 'down', previous:{x:window.x, y:window.y-70*this.zoom}}
                this.collideDuringVault = false
                this.vaultStart = true
              }
              else if (this.player[this.playerId].body.y < (window.y + 110*this.zoom) && this.player[this.playerId].body.y > window.y && this.player[this.playerId].body.x < (window.x + 15*this.zoom) && this.player[this.playerId].body.x > (window.x - 65*this.zoom)) {
                this.vault = {x: window.x, y: window.y - 70*this.zoom, direction: 'up', previous:{x:window.x, y:window.y+70*this.zoom}}
                this.collideDuringVault = false
                this.vaultStart = true
              }
            }
          })
        }

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
          //this.playerCollisionCheck.body.velocity.normalize().scale(survivorSpeed * 1.5)
        } else {
          this.player[this.playerId].body.velocity.normalize().scale(survivorSpeed)
          //this.playerCollisionCheck.body.velocity.normalize().scale(survivorSpeed)
        }
      }

      // killer controlls
      if (this.player[this.playerId].it) {

        if (this.space.isDown && !this.lundge) {
          this.lundge = true
          this.lundgeStart = delta
        }

        if (this.shift.isDown) {
          this.phase = true
          console.log(this.playerCollision)
          this.physics.world.removeCollider(this.itCollision)
        } else {
          this.phase = false
        }

        if (this.cursors.up.isDown && !this.cursors.down.isDown) {
          this.player[this.playerId].body.setVelocityY(-survivorSpeed*killerSpeed)
        }

        if (this.cursors.down.isDown && !this.cursors.up.isDown) {
          this.player[this.playerId].body.setVelocityY(survivorSpeed*killerSpeed)
        }

        if (this.cursors.left.isDown && !this.cursors.right.isDown) {
          this.player[this.playerId].body.setVelocityX(-survivorSpeed*killerSpeed)
        }

        if (this.cursors.right.isDown && !this.cursors.left.isDown) {
          this.player[this.playerId].body.setVelocityX(survivorSpeed*killerSpeed)
        }

        // killer lunge
        if (this.lundge && (delta - this.lundgeStart) < 300 && !this.lundgeHit) {
          this.player[this.playerId].body.velocity.normalize().scale(survivorSpeed*1.725)
        } else if (this.lundge && (delta - this.lundgeStart < 1500)){
          this.player[this.playerId].body.velocity.normalize().scale(survivorSpeed*.3)
        } else if (this.phase) {
          this.player[this.playerId].body.velocity.normalize().scale(survivorSpeed*1.05)
        } else {
          this.lundge = false
          this.lundgeHit = false
          this.player[this.playerId].body.velocity.normalize().scale(survivorSpeed*1.15)
        }


      }

    Client.sendPosition(this.player[this.playerId].body.x, this.player[this.playerId].body.y)


    let visibility = VisibilityPolygon.computeViewport([this.player[this.playerId].body.x+25*this.zoom, this.player[this.playerId].body.y+25*this.zoom], this.view, [0,0], [3200*this.zoom,3200*this.zoom])


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