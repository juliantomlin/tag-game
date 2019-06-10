const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
  },
  scene: [StartScene]
};

const game = new Phaser.Game(config);