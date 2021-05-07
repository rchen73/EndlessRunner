/*
Names: Ryan Chen
       Zhe Kou
       Chun Yin Chu

Game Title: Onryo

Date Completed: May 7, 2021

Creative Tilt: I'm proud of creating the randomized ground that the player collides with in order to stay alive
               and continue running for their life. The horror visual and audio style of the game adds on to the
               idea of having the player endlessly running. Every design in the game is matching with each other.
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