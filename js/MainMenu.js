class MainMenu extends Phaser.Scene {
  constructor() {
    super({key: "MainMenu"})
  }

  create() {
    let texts = []

    const styles = {
      color: '#ffffff',
      align: 'center',
      fontSize: 52
    }

    texts.push(
      this.add
        .text(400,300, 'Join as "Not-It"', styles)
        .setOrigin(0.5,0)
        .setInteractive()
        .on('pointerdown', () => {
          Client.joinRoom()

        })
      )
    texts.push(
      this.add
        .text(400,500, 'Create as "It"', styles)
        .setOrigin(0.5,0)
        .setInteractive()
        .on('pointerdown', () => {
          Client.makeNewRoom()
        })
      )
    this.connectToRoom = function() {
      this.scene.stop()
      this.scene.start('StartScene')
    }

    this.noRooms = function() {
      alert('no games available')
    }
  }

}

const MainMenu2 = new MainMenu()