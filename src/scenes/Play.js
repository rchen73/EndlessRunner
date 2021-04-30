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
    }

    create() {
        //this.add.image(0, 0, 'background').setOrigin(0, 0);
        //this.background = this.add.tileSprite(0, 0, 1280, 720, 'background').setOrigin(0,0);

        this.player = this.physics.add.sprite(200, 380, "player");
        this.player.setGravityY(gameOptions.playerGravity);
        this.ghost = this.physics.add.sprite(400, 200, "ghost");

        spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.groundOnScreen = this.add.group({
            removeCallback: function(ground){
                ground.scene.groundSpawn.add(ground)
            }
        });

        this.groundSpawn = this.add.group({
            removeCallback: function(ground){
                ground.scene.groundOnScreen.add(ground)
            }
        });

        this.dying = false;

        this.groundCollider = this.physics.add.collider(this.player, this.groundOnScreen);

        this.addGround(game.config.width, 300, 500);
    }

    jump() {
        if(this.player.body.touching.down) {
            this.player.setVelocityY(gameOptions.jumpForce * -1);
        }
    }

    addGround(groundWidth, xPosition, yPosition){
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
            ground.body.setVelocityX(gameOptions.groundSpeed * -1);
            this.groundOnScreen.add(ground);
        }
        this.nextGroundDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(spaceBar)) {
            this.jump();
        }

        // game over
        if(this.player.y > game.config.height){
            this.scene.start("Play");
        }

        this.player.x = 200;

        let minDistance = game.config.width;
        this.groundOnScreen.getChildren().forEach(function(ground){
            let groundDistance = game.config.width - ground.x - ground.displayWidth / 2;
            minDistance = groundDistance;
        }, this);

        if(minDistance > this.nextGroundDistance){
            var nextGroundWidth = Phaser.Math.Between(gameOptions.groundSize[0], gameOptions.groundSize[1]);
            this.addGround(nextGroundWidth, game.config.width + nextGroundWidth / 2, Phaser.Math.Between(game.config.height *0.8,
                game.config.height * 0.6));
        }
    }
};