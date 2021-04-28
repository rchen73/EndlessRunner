// Play Scene
class Play extends Phaser.Scene {
    constructor() {
        super("Play");
    }

    preload() {
        this.load.image("platform", "./assets/platform.png");
        this.load.image("player", "./assets/player.png");
        this.load.image("ghost", "./assets/ghost.png");
    }

    create() {
        // adding the player
        this.player = this.physics.add.sprite(gameOptions.playerStartPosition, 300, "player");
        this.player.setGravityY(gameOptions.playerGravity);
        this.ghost = this.physics.add.sprite(400, 200, "ghost");

        this.ghostSpeed = -450;
        this.ghostSpeedMax = -1000;

        // set up barrier group
        this.ghostGroup = this.add.group({
            runChildUpdate: true    // make sure update runs on group children
        });
        // wait a few seconds before spawning barriers
        this.time.delayedCall(2500, () => { 
            this.addGhost(); 
        });

        // ground on screen
        this.groundScreen = this.add.group({
            // once a platform is removed, it's added to the pool
            removeCallback: function(ground) {
                ground.scene.groundSpawn.add(ground)
            }
        });

        // loop ground spawn
        this.groundSpawn = this.add.group({
            removeCallback: function(ground) {
                ground.scene.groundScreen.add(ground)
            }
        });

        this.addGround(game.config.width, 300);

        // setting collisions between the player and the platform group
        this.physics.add.collider(this.player, this.groundScreen);

        // checking for input
        this.input.on("pointerdown", this.jump, this);
    }

    // create new barriers and add them to existing barrier group
    addGhost() {
        let speedVariance =  Phaser.Math.Between(0, 50);
        let ghost = new Ghost(this, this.ghostSpeed - speedVariance);
        this.ghostGroup.add(ghost);
    }

    jump() {
        if(this.player.body.touching.down) {
            this.player.setVelocityY(gameOptions.jumpForce * -1);
        }
    }

    // ground creation
    addGround(groundWidth, xPosition) {
        let ground;
        if(this.groundSpawn.getLength()){
            ground = this.groundSpawn.getFirst();
            ground.x = xPosition;
            ground.active = true;
            ground.visible = true;
        }

        else{
            ground = this.physics.add.sprite(xPosition, Phaser.Math.Between(game.config.height *0.8, game.config.height * 0.6),
                "platform");
            ground.setImmovable(true);
            ground.setVelocityX(gameOptions.platformStartSpeed * -1);
            this.groundScreen.add(ground);
        }
        ground.displayWidth = groundWidth;
        this.nextDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
    }

    update() {
        // game over
        if(this.player.y > game.config.height) {
            this.scene.start("Play");
        }

        this.player.x = gameOptions.playerStartPosition;

        // distance between grounds
        let minDistance = game.config.width;
        this.groundScreen.getChildren().forEach(function(ground) {
            let groundDistance = game.config.width - ground.x - ground.displayWidth / 2;
            minDistance = Math.min(minDistance, groundDistance);
        }, this);

        // next ground size
        if(minDistance > this.nextDistance) {
            var nextGroundWidth = Phaser.Math.Between(gameOptions.platformSizeRange[0], gameOptions.platformSizeRange[1]);
            this.addGround(nextGroundWidth, game.config.width + nextGroundWidth / 2);
        }
    }
};