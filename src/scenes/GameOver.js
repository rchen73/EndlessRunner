class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    preload() {
        this.load.image('gameover', './assets/gameover.png');
    }

    create() {
        this.add.image(0, 0, 'gameover').setOrigin(0, 0);

        // set up cursor keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.start('Play');    
        } else if (Phaser.Input.Keyboard.JustDown(keyQ)) {
            this.scene.start('Title');
        }
    }
}