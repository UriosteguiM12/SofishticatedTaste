class Fish extends Phaser.GameObjects.Sprite { // F12 shows the original class def

    constructor(scene, x, y, texture, frame, speed, hunger, firingPath, pathCooldown) {
        super(scene, x, y, texture, frame);

        this.speed = speed;
        this.hunger = hunger;
        this.firingPath = firingPath;
        this.pathCooldown = pathCooldown;
        this.alive = true;

        scene.add.existing(this);

        return this;

    }
}