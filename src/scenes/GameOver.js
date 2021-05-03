class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    create() {
        // set up cursor keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(spaceBar)) {
            this.scene.start('Play');    
        } else if (Phaser.Input.Keyboard.JustDown(keyQ)) {
            this.scene.start('Title');
        }
    }
}