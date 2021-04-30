let game;

let gameConfig = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scene: [Play],
    backgroundColor: 0x444444,
    physics: {
        default: "arcade"
    }
}

game = new Phaser.Game(gameConfig);

let spaceBar;