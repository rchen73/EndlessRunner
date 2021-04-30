let game;

let gameOptions = {
    groundSpeed: 350,
    spawnRange: [100, 300],
    groundSize: [150, 350],
    playerGravity: 900,
    jumpForce: 550,
    jumps: 1
}

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