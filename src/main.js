/*
Names: Ryan Chen
       Zhe Kou
       Chun Yin Chu

Game Title: Onryo

Date Completed:

Creative Tilt: I'm proud of
*/

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

let spaceBar, keyA, keyS, keyR, keyQ;