let game;

let gameOptions = {
    platformStartSpeed: 350,
    spawnRange: [100, 300],
    platformSizeRange: [150, 350],
    playerGravity: 900,
    jumpForce: 550,
    playerStartPosition: 200,
    jumps: 1
}

let gameConfig = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scene: [Play],
    backgroundColor: 0x000000,
    physics: {
        default: "arcade"
    }
}

game = new Phaser.Game(gameConfig);