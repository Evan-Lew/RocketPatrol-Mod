class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav'); // old
        this.load.audio('sfx_explosion', './assets/explosion38.wav'); // old
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav'); // old
        this.load.audio('sfx_gunshot', './assets/gunshot.wav');
        this.load.audio('sfx_reload', './assets/reload.wav');
        this.load.image('start_menu', './assets/start_menu.png');
        // Duck noises
        this.load.audio('sfx_quack1', './assets/quack1.wav');
        this.load.audio('sfx_quack2', './assets/quack2.wav');
        this.load.audio('sfx_quack3', './assets/quack3.wav');
        this.load.audio('sfx_wilhem', './assets/wilhem.wav');
    }

    create() {
        // menu text configuration
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '18px',
            backgroundColor: '#e8e8e8',
            color: '#1e1e1e',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        
        this.add.tileSprite(0, 0, 640, 480, 'start_menu').setOrigin(0, 0);

        // P1 controls
        this.add.text(game.config.width/2, 330, 'P1) Use A and D to move & W to fire', menuConfig).setOrigin(0.5);
        // P2 controls
        this.add.text(game.config.width/2, 370, 'P2) Use ←→ arrows to move & (UP Arrow) to fire', menuConfig).setOrigin(0.5);
        
       
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // 1 player mode
          game.settings = {
            duckSpeed: 3,
            gameTimer: 60000,
            mode: 1    
          }
          this.sound.play('sfx_reload', {volume: 25});
          this.scene.start("playScene");    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // 2 player mode
          game.settings = {
            duckSpeed: 3,
            gameTimer: 60000,
            mode: 2    
          }
          this.sound.play('sfx_reload', {volume: 25});
          this.scene.start("playScene");    
        }
    }
}