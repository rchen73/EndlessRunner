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

        this.sound.get('menuMusic').stop();
        this.playBGM = this.sound.add('playMusic', {volume: 0.5});
        this.playBGM.play();

        // add player
        this.player = this.physics.add.sprite(200, 380, "player");
        this.player.setGravityY(900);
        this.ghost = this.physics.add.sprite(400, 200, "ghost");

        spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

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
            backgroundColor: '#ffe100',
            color: '#000000',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 100
        }
        this.scoreText = this.add.text(1150, 50, this.score, scoreConfig);

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

    jump() {
        if(this.player.body.touching.down) {
            this.player.setVelocityY(-550);
        }
    }

    // ground creation
    addGround(groundWidth, xPosition, yPosition) {
        let ground;
        if(this.groundSpawn.getLength()){
            ground = this.groundSpawn.getFirst();
            ground.x = xPosition;
            ground.y = yPosition;
        }
        else{
            ground = this.add.tileSprite(xPosition, yPosition, groundWidth, 32, "ground");
            this.physics.add.existing(ground);
            ground.body.setImmovable(true);
            ground.body.setVelocityX(-350);
            this.groundOnScreen.add(ground);
        }
        this.nextGroundDistance = Phaser.Math.Between(100, 300);

        // random candle spawn
        if(Phaser.Math.Between(1, 100) <= 33){
            if(this.candleSpawn.getLength()){
                let candle = this.candleSpawn.getFirst();
                candle.alpha = 1;
                candle.x = xPosition;
                candle.y = yPosition - 250;
                this.candleSpawn.remove(candle);
            }
            else{
                let candle = this.physics.add.sprite(xPosition, yPosition - 250, "candle");
                candle.setImmovable(true);
                candle.setVelocityX(ground.body.velocity.x);
                this.candleOnScreen.add(candle);
            }
        }
    }

    update() {
        this.player.x = 200;

        if(Phaser.Input.Keyboard.JustDown(spaceBar)) {
            this.jump();
        }

        // game over
        if(this.player.y > game.config.height){
            this.scene.start("Play");
        }

        let minDistance = game.config.width;
        this.groundOnScreen.getChildren().forEach(function(ground){
            let groundDistance = game.config.width - ground.x - ground.displayWidth / 2;
            minDistance = groundDistance;
        }, this);

        if(minDistance > this.nextGroundDistance){
            var nextGroundWidth = Phaser.Math.Between(150, 350);
            this.addGround(nextGroundWidth, game.config.width + nextGroundWidth / 2, Phaser.Math.Between(game.config.height *0.8,
                game.config.height * 0.6));
        }
    }
};