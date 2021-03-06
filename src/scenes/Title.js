class Title extends Phaser.Scene {
    constructor() {
        super("Title");
    }

    preload() {
        // load audio
        this.load.audio('menuMusic', './assets/menuMusic.mp3');
        this.load.image('titlebackground', './assets/titlebackground.png');
    }

    create() {
        this.add.image(0, 0, 'titlebackground').setOrigin(0, 0);

        this.titleBGM = this.sound.add('menuMusic', {volume: 0.5, loop: true });
        this.titleBGM.play();

        // define keys
        spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(spaceBar)) {
            this.titleBGM.stop();
            this.scene.start('Play');    
        }
    }
}