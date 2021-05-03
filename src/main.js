let config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scene: [Title, Play,  GameOver],
    physics: {
        default: "arcade"
    }
}

let game = new Phaser.Game(config);

let spaceBar, keyR, keyQ;