class galleryShooter extends Phaser.Scene {
    constructor() {
        super("galleryShooter");

        this.my = {sprite: {}}; //class variable that holds all the sprites

        // key creations
        this.wKey = null;
        this.sKey = null;
        this.dKey = null;
        this.score = 0;

        // this array holds the pointers to the food sprites
        this.my.sprite.foodArray = [];
        this.my.sprite.enemyArray = [];

        this.waveOneActive = true;
        this.waveTwoActive = false;

        this.waveOne = 10;
        this.coorOne = [[650, 100], [650, 175], [650, 250], [650, 325], [650, 400], [775, 100], [775, 175], [775, 250], [775, 325], [775, 400]];

        this.maxFood = 5; // we won't have more than this much food on screen at once
        this.foodCooldown = 5;
        this.foodCooldownCounter = 0;
        this.curve = null;
    }

    preload() {
        this.load.setPath("./assets/");

        // player + enemies
        this.load.image("player","fishTile_101.png");
        this.load.image("hangryFish","fishTile_079.PNG");
        this.load.image("angryFish","fishTile_081.png");
        this.load.image("normalFish","fishTile_077.png");
        this.load.image("deadFish","fishTile_097.png");

        // interactables
        this.load.image("enemyRock","fishTile_086.png");
        this.load.image("food","fishTile_124.png");
        this.load.image("bubble","fishTile_123.png");
        this.load.image("rock","fishTile_084.png");
        this.load.image("healthHeart","pixelHeart.png");

        // background
        this.load.image("seaweedGreen","fishTile_032.png");
        this.load.image("seaweedGreen2","fishTile_033.png");
        this.load.image("seaweedGreen3","fishTile_034.png");
        this.load.image("seaweedGreen4","fishTile_035.png");
        this.load.image("seaweedPink","fishTile_014.png");
        this.load.image("seaweedPink2","fishTile_015.png");
        this.load.image("seaweedPink3","fishTile_016.png");
        this.load.image("seaweedPink4","fishTile_017.png");

            // sand
        this.load.image("sandShell","fishTile_018.png");
        this.load.image("sandStar","fishTile_019.png");
        this.load.image("sandSquare","fishTile_001.png");
        this.load.image("sandTile2","fishTile_024.png");

        // numbers for score
        this.load.image("numberZero", "fishTile_108.png");
        this.load.image("numberOne", "fishTile_109.png");
        this.load.image("numberTwo", "fishTile_110.png");
        this.load.image("numberThree", "fishTile_111.png");
        this.load.image("numberFour", "fishTile_112.png");
        this.load.image("numberFive", "fishTile_113.png");
        this.load.image("numberSix", "fishTile_114.png");
        this.load.image("numberSeven", "fishTile_115.png");
        this.load.image("numberEight", "fishTile_116.png");
        this.load.image("numberNine", "fishTile_117.png");
    }

    create() {
        let my = this.my;

        my.sprite.player = this.add.sprite(40, 50,"player");
        
        my.sprite.sandStar = this.add.sprite(30,570,"sandStar")
        
        for (let i = 90; i <= 810; i+=60) {
            my.sprite.sandSquare = this.add.sprite(i,570,"sandSquare");
        }

        my.sprite.sandShell = this.add.sprite(750,570,"sandShell");
        my.sprite.sandSquare = this.add.sprite(810,570,"sandSquare");

        for (let j = 30; j <= 870; j += 60) {
            my.sprite.sandTile = this.add.sprite(j,510,"sandTile2");
        }

        for (let k = (game.config.width - 180)/2 + 30; k <= (game.config.width - 180)/2 + 180; k+=60) {
            my.sprite.healthHeart = this.add.sprite(k,525,"healthHeart");
            my.sprite.healthHeart.scale = 0.15
        }

        for (let i=0; i < this.maxFood; i++) {
            //create sprites that are offscreen and invisible
            my.sprite.foodArray.push(this.add.sprite(-100, -100, "food"));
            my.sprite.foodArray[i].visible = false;
        }

        //CONTINUE HERE: Fix Seaweed!! >W<
        my.sprite.seaweed = this.add.sprite(450,455,"seaweedGreen");
        my.sprite.seaweed2 = this.add.sprite(60,455,"seaweedGreen2");
        my.sprite.seaweed3 = this.add.sprite(120,455,"seaweedGreen3");
        my.sprite.seaweed4 = this.add.sprite(180,455,"seaweedGreen4");

        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // set movement speeds (pixels/tick)
        this.playerSpeed = 5;
        this.foodSpeed = 10;

        // score
        my.sprite.scorePosZero = this.add.sprite(338, 575, "numberZero");
        my.sprite.scorePosOne = this.add.sprite(378, 575, "numberZero");
        my.sprite.scorePosTwo = this.add.sprite(418, 575, "numberZero");
        my.sprite.scorePosThree = this.add.sprite(458, 575, "numberZero");

        this.counter = 0;

        /*
        // have an event handler for button
            this.scene.start("galleryShooter")
        */

        this.Behavior = {
            Hangry: {
                texture: "hangryFish",
                speed: 5,
                firingPath: [
                    652, 377,
                    611, 338,
                    555, 307,
                    492, 292,
                    429, 291,
                    364, 303,
                    304, 327,
                    242, 361,
                    216, 387,
                    248, 430,
                    284, 451,
                    347, 471,
                    382, 475,
                    450, 479,
                    496, 480,
                    544, 469,
                    598, 445,
                    638, 411,
                    652, 377
                ],
                pathCooldown: 5000
            },
            Angry: {
                texture: "angryFish",
                speed: 10,
                firingPath: [
                    614, 356,
                    613, 323,
                    608, 293,
                    582, 269,
                    502, 300,
                    475, 333,
                    446, 371,
                    420, 412,
                    390, 430,
                    337, 413,
                    318, 346,
                    350, 283,
                    405, 284,
                    454, 317,
                    484, 375,
                    514, 406,
                    551, 420,
                    584, 398,
                    609, 375,
                    614, 356
                ],
                pathCooldown: 250
            },
            Normal: {
                texture: "normalFish",
                speed: 15,
                firingPath: [
                    494, 323,
                    354, 223,
                    353, 446,
                    494, 323
                ],
                pathCooldown: 500
            }
        };

    }


    update() {

        let my = this.my; 

        if (this.waveOneActive) {
            this.startWave(10);
            this.waveOneActive = false;
        }

        this.counter ++;

        // displaying score on screen
        let scoreStr = this.score.toString();

        if (this.score < 9999) {

            if (scoreStr[3] != undefined) {
                my.sprite.scorePosZero.setTexture(this.numberTexture(scoreStr[0]));
                my.sprite.scorePosOne.setTexture(this.numberTexture(scoreStr[1]));
                my.sprite.scorePosTwo.setTexture(this.numberTexture(scoreStr[2]));
                my.sprite.scorePosThree.setTexture(this.numberTexture(scoreStr[3]));
            }
            else if (scoreStr[2] != undefined) {
                my.sprite.scorePosZero.setTexture("numberZero")
                my.sprite.scorePosOne.setTexture(this.numberTexture(scoreStr[0]));
                my.sprite.scorePosTwo.setTexture(this.numberTexture(scoreStr[1]));
                my.sprite.scorePosThree.setTexture(this.numberTexture(scoreStr[2]));
            }
            else if (scoreStr[1] != undefined) {
                my.sprite.scorePosZero.setTexture("numberZero")
                my.sprite.scorePosOne.setTexture("numberZero")
                my.sprite.scorePosTwo.setTexture(this.numberTexture(scoreStr[0]));
                my.sprite.scorePosThree.setTexture(this.numberTexture(scoreStr[1]));
            }
            else if (scoreStr [0] != undefined) {
                my.sprite.scorePosZero.setTexture("numberZero")
                my.sprite.scorePosOne.setTexture("numberZero")
                my.sprite.scorePosTwo.setTexture("numberZero")
                my.sprite.scorePosThree.setTexture(this.numberTexture(scoreStr[0]));
            }
        }
        else {
            my.sprite.scorePosZero.setTexture(this.numberTexture(9));
            my.sprite.scorePosOne.setTexture(this.numberTexture(9));
            my.sprite.scorePosTwo.setTexture(this.numberTexture(9));
            my.sprite.scorePosThree.setTexture(this.numberTexture(9));
        
        }

        this.foodCooldownCounter--;

        for (let enemy of my.sprite.enemyArray) {

            if (this.counter % 10 == 0) {
                enemy.x -= 5;
            }

            enemy.hunger++;

            // BEHAVIOR UPDATING HERE
            let newType = null;

            // changed order bc if not angry wouldnt be triggered probably
            if (enemy.hunger < 1000)  {
                newType = "Normal";
            } else if (enemy.hunger < 2000) {
                newType = "Angry";
            } else if (enemy.hunger < 4000) {
                newType = "Hangry";
            }
            else {
                enemy.texture = "deadFish";
            }
            
            if (enemy.behaviorType !== newType) {
                this.updateBehavior(enemy, newType);
            }

            if (!enemy.isFollowing && (this.counter % enemy.pathCooldown == 0)) {
                enemy.isFollowing = true;
                enemy.startFollow({
                duration: 3000,
                ease: 'Sine.easeInOut',
                repeat: 1, 
                yoyo: false,
                onComplete: () => {
                        enemy.isFollowing = false;
                        enemy.angle = 0;

                        if (enemy.hunger < 0) {
                            enemy.visible=false;
                            enemy.x += 800;
                            console.log("a fsh instance was destroyed");
                            my.sprite.enemyArray.pop(enemy);

                        }
                    }
            });
            } 
        }
        
        // player movement + constraints
        if (this.wKey.isDown) my.sprite.player.y -= this.playerSpeed;
        if (this.sKey.isDown) my.sprite.player.y += this.playerSpeed;

        if (my.sprite.player.y > 455) my.sprite.player.y = 455;
        if (my.sprite.player.y < 30) my.sprite.player.y = 30;

        // check if the food is being fired
        if (this.dKey.isDown) {
            if (this.foodCooldownCounter < 0) {
                //check if there is food available
                for (let food of my.sprite.foodArray) {
                    // if the bullet is invisible, it's available
                    if (!food.visible) {
                        food.x = my.sprite.player.x + (my.sprite.player.displayWidth/2);
                        food.y = my.sprite.player.y;
                        food.visible = true;
                        this.foodCooldownCounter = this.foodCooldown;
                        break;
                    }
                }
            }
        }

        // make all of the food move
        for (let food of my.sprite.foodArray) {

            for (let enemy of my.sprite.enemyArray) {
                // check if food is colliding with fish
                if (this.collides(enemy, food) && (food.visible) && (enemy.visible)) {
                    console.log("food collided with fish");
                    food.visible = false;
                    food.x += 800;
                    //console.log("hunger: " + enemy.hunger);

                    // check if any behaviors need to be updated
                    if (enemy.hunger < 0) {
                        enemy.visible=false;
                        enemy.x += 800;
                        console.log("a fsh instance was destroyed");
                        my.sprite.enemyArray.pop(enemy);
                    }

                    enemy.hunger -= 250;

                    // enemy is never deleted so the score keeps increasing
                    this.score += 25;
                }
            }

            //if the bullet is visible, it's active so we should move it
            if (food.visible) {
                food.x += this.foodSpeed;
            }

            //if the bullet has moved offscreen, we make it inactive (invisible)
            //this allows us to re-use the food sprites
            if (food.x > 800) {
                food.visible = false;
            }
        }
        
    }

    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    numberTexture(num) {
        if (num == "0") {
            return "numberZero";
        }
        else if (num == "1") {
            return "numberOne";
        }
        else if (num == "2") {
            return "numberTwo";
        }
        else if (num == "3") {
            return "numberThree";
        }
        else if (num == "4") {
            return "numberFour";
        }
        else if (num == "5") {
            return "numberFive";
        }
        else if (num == "6") {
            return "numberSix";
        }
        else if (num == "7") {
            return "numberSeven";
        }
        else if (num == "8") {
            return "numberEight";
        }
        else if (num == "9") {
            return "numberNine";
        }
    }

    updateBehavior(enemy, type) {
        const behavior = this.Behavior[type];
        if (enemy.behaviorType !== type) {

            enemy.setTexture(behavior.texture);
            enemy.pathCooldown = behavior.pathCooldown;
            let offsetPath = this.offsetPath(behavior.firingPath, enemy.x, enemy.y);
            let curve = new Phaser.Curves.Spline(offsetPath);
            enemy.setPath(curve);
            enemy.behaviorType = type;
        }
        console.log("behavior updated to "+ type);
    }

    // pretty much the same, just pushing it to a copy of a path so the main path isnt mutated
    offsetPath(path, enemyX, enemyY) {
        let result = [];
        for (let i = 0; i < path.length; i++) {
            if (i % 2 == 0) {
                result[i] = path[i] + enemyX;
            }
            else {
                result[i] = path[i] + enemyY;
            }
            console.log("offsetPathPoint: " + result[i]);
        }
        return result;
    }

    startWave(count) {
        for (let i = 0; i < count; i++) {
            let behavior = this.Behavior.Normal; // for ease of testing i did it this way, u can update to generate randomly

            //creating a new path for each enemy
            let curve = new Phaser.Curves.Spline(behavior.firingPath);
            let enemy = this.add.follower(curve, this.coorOne[i][0], this.coorOne[i][1], behavior.texture);
            enemy.setPath(curve);

            // ok well we're making use of javascripts weirdness and just giving this new properties ig
            // setting types
            enemy.flipX = true;
            enemy.hunger =  Math.random() * 250; // might wanna change values bc it ends up changing type really fast
            enemy.behaviorType = "Normal";
            enemy.pathCooldown = 500;
            enemy.isFollowing = false; 

            //debug
            console.log(`created enemy of type ${enemy.behaviorType} with hunger ${enemy.hunger} at position [${enemy.x}, ${enemy.y}]`);

            this.my.sprite.enemyArray.push(enemy);
        }
    }
}
