class Fish extends Phaser.GameObjects.Sprite { // F12 shows the original class def

    firingPath;
    pathCooldown;

    constructor(scene, x, y, texture, frame, hunger) {
        super(scene, x, y, texture, frame);

        this.hunger = hunger;
        this.alive = true;

        scene.add.existing(this);

        return this;

    }
}