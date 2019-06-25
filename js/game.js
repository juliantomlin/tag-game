const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  physics: {
    default: "arcade",
    arcade: {
      fps: 60,
    },
  },
  scene: [MainMenu2, StartScene2]
};

const game = new Phaser.Game(config);
