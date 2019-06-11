console.log(StartScene2)
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
  },
  scene: [StartScene2]
};

const game = new Phaser.Game(config);
console.log('game.js', game)