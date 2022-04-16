let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}
let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard variables
let keyUP, keyR, keyLEFT, keyRIGHT, keyA, keyD, keyW;

/* Submission Description

Evan Lew

Rocket Patrol Mods

4/16/2022

10 hours of work

Point Breakdown:

30) Implementation of a simulaneous 2 player mode
    - I gave the choice to the player to pick 1 or 2 players. Both players' points 
      are tracked and a specific win screen is shown depending on which player has 
      more points.

60) Redesign the game's artwork, UI, and sound
    - I reskinned the game to a duck hunting theme. Made new sprites for the background, 
      duck, bullet, and menu. I chose new sound effects and changed the UI for the points 
      to a cloud.  

10) Create 4 new explosion SFX and randomize which one plays on impact
    - I added randomized death noises for the duck

*/