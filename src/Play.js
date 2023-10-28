class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // Create and display (1) a shot counter (2) score (“hole-in”) and (3) successful shot percentage
        let shotCounter = 0, score = 0
        this.counter = this.add.text(width / 2 + 150, 0, "Shot Counter: 0")
        this.scoreVal = this.add.text(width / 2 + 150, 20, "Score: 0")
        this.scorePercent = this.add.text(width / 2 + 150, 40, "Percent: 0%")
        
        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)

        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)

        // add walls + Make one obstacle move left/right and bounce against the screen edges
        let wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width / 2, width - wallA.width / 2))
        wallA.setVelocityX(250)
        wallA.setCollideWorldBounds(true)
        wallA.body.setBounce(1)
        wallA.body.setImmovable(true)

        let wallB = this.physics.add.sprite(0, height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width / 2, width - wallB.width / 2))
        wallB.body.setImmovable(true)

        this.walls = this.add.group([wallA, wallB])

        // add oneWay
        this.oneWay = this.physics.add.sprite(0, height / 4 * 3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width / 2, width - this.oneWay.width / 2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        // variables
        this.SHOT_VELOCITY_X = 200;
        this.SHOT_VELOCITY_Y_MIN = 700;
        this.SHOT_VELOCITY_Y_MAX = 1100;
        // Improve shot logic by making the input pointer’s relative x-position shoot the ball in the correct x direction
        this.input.on('pointerdown', (pointer) => {
            let shotDirectionX
            let shotDirectionY
            pointer.x <= this.ball.x ? shotDirectionX = 1 : shotDirectionX = -1
            pointer.y <= this.ball.y ? shotDirectionY = 1 : shotDirectionY = -1
            this.ball.body.setVelocityX(Phaser.Math.Between(this.SHOT_VELOCITY_X, this.SHOT_VELOCITY_X) * shotDirectionX)
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirectionY)
            shotCounter += 1;
            this.counter.setText('Shot Counter: ' + shotCounter);
            if(score != 0){
                this.scorePercent.setText('Percent: ' + Phaser.Math.RoundTo((score/shotCounter) * 100, -2) + '%')
            }
        })
        // Add logic so the ball resets to the bottom on a successful “hole-in”
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            this.ball.x = game.config.width / 2
            this.ball.y = game.config.height - game.config.height / 10
            this.ball.setVelocity(0)
            score += 1;
            this.scoreVal.setText('Score: ' + score);
            if(score != 0){
                this.scorePercent.setText('Percent: ' + Phaser.Math.RoundTo((score/shotCounter) * 100, -2) + '%')
            }
        })
        this.physics.add.collider(this.ball, this.walls)
        this.physics.add.collider(this.ball, this.oneWay)
    }

    update() {

    }
}