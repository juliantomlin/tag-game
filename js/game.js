console.log(StartScene2)
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  physics: {
    default: "arcade",
    arcade: {
      fps: 15,
    },
  },
  scene: [StartScene2]
};

const game = new Phaser.Game(config);
console.log('game.js', game)