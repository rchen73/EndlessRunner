// Play Scene
class Play extends Phaser.Scene {
    constructor() {
        super("Play");
    }

    preload() {
        this.load.image("ground", "./assets/ground.png");
        this.load.image("player", "./assets/player.png");
        this.load.image("ghost", "./assets/ghost.png");
        this.load.image("candle", "./assets/candle.png");
        this.load.image('background', './assets/background.png');
        this.load.audio('playMusic', './assets/playMusic.mp3');
    }

    create() {
        this.add.image(0, 0, 'background').setOrigin(0, 0);

        this.playBGM = this.sound.add('playMusic', {volume: 0.5, loop: true });
        this.playBGM.play();

        // add player
        this.player = this.physics.add.sprite(200, 380, "player");
        this.player.setGravityY(900);
        this.ghost = this.physics.add.sprite(400, 200, "ghost");

        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        this.ghostSpeed = -450;
        this.ghostSpeedMax = -1000;

        // set up barrier group
        this.ghostGroup = this.add.group({
            runChildUpdate: true    // make sure update runs on group children
        });
        this.time.delayedCall(2500, () => {
            this.addGhost();
        });

        // visible ground
        this.groundOnScreen = this.add.group({
            removeCallback: function(ground){
                ground.scene.groundSpawn.add(ground)
            }
        });

        // ground spawn
        this.groundSpawn = this.add.group({
            removeCallback: function(ground){
                ground.scene.groundOnScreen.add(ground)
            }
        });

        // visible candles
        this.candleOnScreen = this.add.group({
            removeCallback: function(candle){
                candle.scene.candleSpawn.add(candle)
            }
        });

        // candle spawn
        this.candleSpawn = this.add.group({
            removeCallback: function(candle){
                candle.scene.candleOnScreen.add(candle)
            }
        });

        // player touches the ground
        this.touchGround = this.physics.add.collider(this.player, this.groundOnScreen);

        this.addGround(game.config.width, 300, 500);

        // initialize score
        this.score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Comic Sans MS',
            fontSize: '28px',
            backgroundColor: '#000000',
            color: '#ffffff',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 100
        }
        this.scoreText = this.add.text(1100, 620, this.score, scoreConfig);

        this.physics.add.overlap(this.player, this.candleOnScreen, function(player, candle){
            this.tweens.add({
                targets: candle,
                alpha: 0,
                duration: 100,
            });
            this.candleOnScreen.kill(candle);
            this.candleOnScreen.remove(candle);
            this.score += 10;
            this.scoreText.text = this.score;
        }, null, this);
    }

    // create new barriers and add them to existing barrier group
    addGhost() {
        let speedVariance =  Phaser.Math.Between(0, 50);
        let ghost = new Ghost(this, this.ghostSpeed - speedVariance);
        this.ghostGroup.add(ghost);
    }

    bigJump() {
        if (this.player.body.touching.down) {
            this.player.setVelocityY(-600);
        }
    }

    smallJump() {
        if (this.player.body.touching.down) {
            this.player.setVelocityY(-400);
        }
    }

    // ground creation
    addGround(groundWidth, xPosition, yPosition) {
        let ground;
        if (this.groundSpawn.getLength()) {
            ground = this.groundSpawn.getFirst();
            ground.x = xPosition;
            ground.y = yPosition;
        }
        else {
            ground = this.add.tileSprite(xPosition, yPosition, groundWidth, 32, "ground");
            this.physics.add.existing(ground);
            ground.body.setImmovable(true);
            ground.body.setVelocityX(-350);
            this.groundOnScreen.add(ground);
        }
        this.nextGroundDistance = Phaser.Math.Between(100, 300);

        this.time.delayedCall(3000, () => {
            // random candle spawn
            if (Phaser.Math.Between(1, 100) <= 50) {
                if(this.candleSpawn.getLength()){
                    let candle = this.candleSpawn.getFirst();
                    candle.alpha = 1;
                    candle.x = Phaser.Math.Between(0, xPosition);
                    candle.y = yPosition - 310;
                    this.candleSpawn.remove(candle);
                }
                else {
                    let candle = this.physics.add.sprite(Phaser.Math.Between(0, xPosition), yPosition - 310, "candle");
                    candle.setImmovable(true);
                    candle.setVelocityX(ground.body.velocity.x);
                    this.candleOnScreen.add(candle);
                }
            }
        });
    }

    update() {
        this.player.x = 200;

        if (Phaser.Input.Keyboard.JustDown(keyA)) {
            this.bigJump();
        }

        if (Phaser.Input.Keyboard.JustDown(keyS)) {
            this.smallJump();
        }

        // game over
        if (this.player.y > game.config.height) {
            this.playBGM.stop();
            this.scene.start('GameOver');
        }

        let minDistance = game.config.width;
        this.groundOnScreen.getChildren().forEach(function(ground) {
            let groundDistance = game.config.width - ground.x - ground.displayWidth / 2;
            minDistance = groundDistance;
        }, this);

        if (minDistance > this.nextGroundDistance) {
            var nextGroundWidth = Phaser.Math.Between(175, 350);
            this.addGround(nextGroundWidth, game.config.width + nextGroundWidth / 2, Phaser.Math.Between(game.config.height *0.8,
                game.config.height * 0.6));
        }
    }
};