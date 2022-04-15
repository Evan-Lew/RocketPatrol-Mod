class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png'); // old
        this.load.image('spaceship', './assets/spaceship.png'); // old
        this.load.image('starfield', './assets/starfield.png'); // old
        this.load.image('forest', './assets/forest.png');
        this.load.image('bullet', './assets/bullet.png');
        this.load.image('duck', './assets/duck.png');
        this.load.image('cloud', './assets/cloud.png');
        
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9}); // old
        this.load.spritesheet('dead_duck', './assets/duck_spritesheet.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 10});
    }

    create() {
        console.log(game.settings.mode);

        // place tile sprite
        this.forest = this.add.tileSprite(0, 0, 640, 480, 'forest').setOrigin(0, 0);

        // green UI background
        // this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0xda9432).setOrigin(0, 0);
        console.log("borderUISize: ", borderUISize);
        console.log("borderPadding: ", borderPadding);
        console.log("game.config.width: ", game.config.width);
        console.log("game.config.height: ", game.config.height);

        this.add.tileSprite(0, borderUISize + borderPadding, 170, 74, 'cloud').setOrigin(0, 0); // Left Cloud
        
        if (game.settings.mode == 2) {
            this.add.tileSprite(480, borderUISize + borderPadding, 170, 74, 'cloud').setOrigin(0, 0); // Right Cloud
        }

        // white borders
        // this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        // this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        // this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        // this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
    
        // add bullet (p1)
        this.p1Bullet = new Bullet(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'bullet').setOrigin(0.5, 0);

        // add bullet (p2)
        if (game.settings.mode == 2) {
            this.p2Bullet = new Bullet2(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'bullet').setOrigin(0.5, 0);
        }

        // add Ducks (x3)
        this.bird01 = new Duck(this, game.config.width + borderUISize*6, borderUISize*4, 'duck', 0, 30).setOrigin(0, 0);
        this.bird02 = new Duck(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'duck', 0, 20).setOrigin(0,0);
        this.bird03 = new Duck(this, game.config.width, borderUISize*6 + borderPadding*4, 'duck', 0, 10).setOrigin(0,0);

        // define keys
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('dead_duck', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // Initialize p1 and p2 score
        this.p1Score = 0;
        if (game.settings.mode == 2) {
            this.p2Score = 0;
        }

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        
        if (game.settings.mode == 2) {
            this.scoreRight = this.add.text(510, borderUISize + borderPadding*2, this.p2Score, scoreConfig);
        }

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'HUNT OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        // check key input for restart / menu
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.forest.tilePositionX -= 4;  // update tile sprite

        if (!this.gameOver) {
            this.p1Bullet.update();             // update p1
            if (game.settings.mode == 2) {
                this.p2Bullet.update();             // update p2
            }
            this.bird01.update();               // update duck (x3)
            this.bird02.update();
            this.bird03.update();
        }

        // check collisions for p1Bullet
        if (this.checkCollision(this.p1Bullet, this.bird03)) {
            this.p1Bullet.reset();
            this.birdExplode(1, this.bird03);
        }
        if (this.checkCollision(this.p1Bullet, this.bird02)) {
            this.p1Bullet.reset();
            this.birdExplode(1, this.bird02);
        }
        if (this.checkCollision(this.p1Bullet, this.bird01)) {
            this.p1Bullet.reset();
            this.birdExplode(1, this.bird01);
        }

        // check collisions for p2Bullet
        if (game.settings.mode == 2) {
            if (this.checkCollision(this.p2Bullet, this.bird03)) {
                this.p2Bullet.reset(); // p2
                this.birdExplode(2, this.bird03);
            }
            if (this.checkCollision(this.p2Bullet, this.bird02)) {
                this.p2Bullet.reset(); // p2
                this.birdExplode(2, this.bird02);
            }
            if (this.checkCollision(this.p2Bullet, this.bird01)) {
                this.p2Bullet.reset(); // p2
                this.birdExplode(2, this.bird01);
            }
        }
    }

    checkCollision(bullet, bird) {
        // simple AABB checking
        if (bullet.x < bird.x + bird.width && 
            bullet.x + bullet.width > bird.x && 
            bullet.y < bird.y + bird.height &&
            bullet.height + bullet.y > bird.y) {
                return true;
        } else {
            return false;
        }
    }

    birdExplode(player, bird) {
        // temporarily hide bird
        bird.alpha = 0;                         
        // create dead_duck sprite at bird's position
        let boom = this.add.sprite(bird.x, bird.y, 'dead_duck').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            bird.reset();                         // reset bird position
            bird.alpha = 1;                       // make bird visible again
            boom.destroy();                       // remove dead_duck sprite
        });
        // score add and repaint
        if (player == 1) {
            this.p1Score += bird.points;
            this.scoreLeft.text = this.p1Score;
        }
        else if (player == 2) {
            this.p2Score += bird.points;
            this.scoreRight.text = this.p2Score;
        }

        this.sound.play('sfx_quack', {volume: 3});
    }
}