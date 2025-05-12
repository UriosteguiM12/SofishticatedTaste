class galleryShooter extends Phaser.Scene{
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
        this.maxFood = 5; // we won't have more than this much food on screen at once
        this.foodCooldown = 5;
        this.foodCooldownCounter = 0;
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

        my.sprite.enemyFish = new Fish(this, 400, 400, "normalFish", null, 0, 0, null, 5);
        my.sprite.enemyFish.flipX = true;
        my.sprite.enemyArray.push(my.sprite.enemyFish);
        my.sprite.enemyFish2 = new Fish(this, 200, 300, "normalFish", null, 0, 0, null, 10);
        my.sprite.enemyFish2.flipX = true;
        my.sprite.enemyArray.push(my.sprite.enemyFish2);

        // score
        my.sprite.scorePosZero = this.add.sprite(338, 575, "numberZero");
        my.sprite.scorePosOne = this.add.sprite(378, 575, "numberZero");
        my.sprite.scorePosTwo = this.add.sprite(418, 575, "numberZero");
        my.sprite.scorePosThree = this.add.sprite(458, 575, "numberZero");

        this.counter = 0.0;
    }

    update() {

        let my = this.my; 

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

        const Behavior = {
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
                pathCooldown: 5,
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
                pathCooldown: 10,
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
                pathCooldown: 15,
            }
        }

        this.foodCooldownCounter--;

        for (let enemy of my.sprite.enemyArray) {

            if (this.counter % enemy.pathCooldown == 0) {
                enemy.x = (100 * Math.cos(-0.5 * this.counter)) + 400;
                enemy.y = (50 * Math.sin(0.5 * this.counter)) + 200;
            }

            // reduce each enemy's hunger by one
            enemy.hunger++;

            if (enemy.hunger < 2500) {
                enemy.speed = Behavior.Normal.speed;
                enemy.firingPath = Behavior.Normal.firingPath;
                enemy.pathCooldown = Behavior.Normal.pathCooldown;
                enemy.setTexture(Behavior.Normal.texture);
            }

            else if (enemy.hunger >= 2500 && enemy.hunger < 5000) {
                enemy.speed = Behavior.Angry.speed;
                enemy.firingPath = Behavior.Angry.firingPath;
                enemy.pathCooldown = Behavior.Angry.pathCooldown;
                enemy.setTexture(Behavior.Angry.texture);
            }

            else if (enemy.hunger >= 5000 && enemy.hunger < 7500) {
                enemy.speed = Behavior.Hangry.speed;
                enemy.firingPath = Behavior.Hangry.firingPath;
                enemy.pathCooldown = Behavior.Hangry.pathCooldown;
                enemy.setTexture(Behavior.Hangry.texture);
            }

            else if (enemy.hunger >= 7500) {
                // have the fish turn into a skeleton
                enemy.setTexture("deadFish");
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
                if (this.collides(enemy, food)) {
                    food.visible = false;
                    food.x += 800;
                    console.log(enemy.hunger);

                    // check if any behaviors need to be updated
                    if (enemy.hunger < 0) {
                        enemy.visible=false;
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
}