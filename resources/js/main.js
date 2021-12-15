

const gameArea = document.querySelector('#game-area');
const shellCounter = document.querySelector('#shell-count');
const killCounter = document.querySelector('#kill-count');
const tankMagazine = document.querySelector('#tank-magazine');
const playerHp = document.querySelector('#player-hp');

// hold attribute relate to the stage of the game
const gameStage = {
    running: false,
    leftBoundary: 0,
    rightBoundary: gameArea.clientWidth - 20,
    topBoundary: 0,
    bottomBoundary: gameArea.clientHeight-60,
    projectiles: [],
    enemies: [],
    enemyShell: [],
    spawnEnemyTimer: null,
    killCount: 0,
    gameLoop: null,
    shellColisionTimer: null,
    enemyShellColisionTimer: null
    
}

function gamgeLoop () {
    // gameStage.shellColisionTimer = setInterval(() => {
    //     // colision detection
    //     if(gameStage.projectiles.length > 0 && gameStage.enemies.length > 0) {
    //         gameStage.projectiles.forEach((projectile) => {
    //             gameStage.enemies.forEach((enemy) => {
    //                 // colision detection is learned from youtube video and credit to "Franks laboratory"
    //                 // https://www.youtube.com/watch?v=r0sy-Cr6WHY
    //                 if(projectile.currentX <= enemy.currentX + enemy.width &&
    //                     projectile.currentX + projectile.width >= enemy.currentX &&
    //                     projectile.currentY <= enemy.currentY + enemy.height &&
    //                     projectile.currentY + projectile.height >= enemy.currentY) {
    //                         //console.log('HIT!!!!!!!!!')
    //                         projectile.shellExplode()
    //                         enemy.die()
    //                         gameStage.killCount += 1;
    //                 }

    //             })
    //         }) 
    //     }

    // }, 1);

    // gameStage.enemyShellColisionTimer = setInterval(() => {
    //     if(gameStage.enemyShell.length > 0) {
    //         gameStage.enemyShell.forEach(projectile => {
    //             // colision detection is learned from youtube video and credit to "Franks laboratory"
    //             // https://www.youtube.com/watch?v=r0sy-Cr6WHY
    //             if(projectile.currentX <= player.positionX + player.width &&
    //                 projectile.currentX + projectile.width >= player.positionX &&
    //                 projectile.currentY <= player.positionY + player.height &&
    //                 projectile.currentY + projectile.height >= player.positionY) {
    //                     //console.log('HIT!!!!!!!!!')
    //                     projectile.shellExplode()
    //                     player.updatePlayerHP(-10)
    //             }
    //         })
    //     }
    // },1)
}

function alertAndWarning (msg, color) {
    // use for showing warning message in middle of screen
    // message would be removed in .5 sec
    // can be any message or color

    let alertText = document.createElement('label')
    alertText.textContent = msg
    alertText.style.fontSize = '10em'
    alertText.style.position = 'absolute'
    alertText.style.top = `${gameStage.bottomBoundary/2 -300}px`
    alertText.style.left = `${gameStage.rightBoundary/2 - 600}px`
    alertText.style.color = color
    gameArea.append(alertText) 
    setTimeout(() => {
        alertText.remove()
    }, 500);
}

function spawnEnemy() {
    gameStage.spawnEnemyTimer = setInterval(() => {
        if(gameStage.running) {

            randX = (Math.random() * gameStage.rightBoundary + 1)
            randY = (Math.random() * gameStage.bottomBoundary)

            let enemy = new Enemy ({randX, randY});
            enemy.id = randX+'shell'+gameStage.enemies.length
            gameStage.enemies.push(enemy)
            killCounter.textContent = `Enemy Killed: ${gameStage.killCount}`
            //console.log(gameStage.enemies)
        }
    }, 3000)
}

// toggle start or pause game
function startPause(e) {
    gameStage.running = !gameStage.running;
   
    if(!gameStage.running) {
        e.target.style.backgroundColor = 'orange'
        clearInterval(gameStage.spawnEnemyTimer)
        clearInterval(gameStage.shellColisionTimer)
        clearInterval(gameStage.enemyShellColisionTimer)
    } else {
        e.target.style.backgroundColor ='green'
        //gameStage.gameLoop = gamgeLoop()
        spawnEnemy()
    }
}

// listen for key press to take action
document.addEventListener('keydown', e => {
    if (gameStage.running) {
        player.tankAction(e.key)
    }
    
})

// Play Tank
const player = {
    aimPointX:  0,
    aimPointY:  0,
    positionX: 100,
    positionY: gameArea.clientHeight - 60,
    prevX: 100,
    img: '',
    playerTank: null,
    tankTurret: null,
    turretAngle: -10,
    width: 80,
    height: 60,
    shellCount: 25,
    maxShell: 25,
    direction: 'right',
    prevDirection: 'right',
    magazine: [],
    hp: 1000,

    initPlayer() {
        this.tankTurret = document.createElement('img')
        this.tankTurret.setAttribute('src','resources/media/gun.gif')
        this.tankTurret.style.position = 'absolute';
        this.tankTurret.zIndex = '-1'
        this.playerTank = document.createElement('img')
        this.playerTank.setAttribute('src','resources/media/tank.gif')
        this.playerTank.setAttribute('draggable', false);
        this.tankTurret.setAttribute('draggable', false)
        this.playerTank.setAttribute('id', 'player-tank')
        this.playerTank.style.width = `${this.width}px`
        this.playerTank.style.height = `${this.height}px`
        this.updateShellCount()
        this.loadShell(this.shellCount)
        gameArea.append(this.playerTank)
        gameArea.append(this.tankTurret)
        this.updatePosition(100,this.positionY)
        this.updatePlayerHP()
    },

    updatePlayerHP (life) {
        if(life) {
            this.hp += life;
        }
        
        playerHp.textContent = `Health: ${this.hp}`
    },

    adjustAimPoint(x,y) {
        this.aimPointX = x;
        this.aimPointY = y;
        let distanX = (this.aimPointX - this.currentX)
        let distanY = (this.aimPointY - this.currentY)

        let angle = Math.atan2(distanY, distanX)
        
        this.turretAngle = angle*180/Math.PI
        this.tankTurret.style.transform = `rotate(${this.turretAngle}deg)`;
        
        
    },

    loadShell(n) {
        for(let i = 0; i < n; i++) {
            let round = document.createElement('img');
            round.setAttribute('src', 'resources/media/Bullet_3.png')
            round.setAttribute('class', 'tank-round')
            this.magazine.push(round)
            tankMagazine.append(round)
        }
    },

    tankAction(code) {
        switch (code) {
            case 'a':
                this.updatePosition(this.positionX-10, this.positionY)
                this.direction = 'left'
                break;
            case 'd':
                this.updatePosition(this.positionX+10, this.positionY)
                this.direction = 'right'
                break
            case 'r':
                this.reloadShell();
                break;
            default:
                console.log(`do nothing`)
        }

    
    },

    updatePosition (x,y) {
        if(x < gameStage.rightBoundary-60 && x > 0) {
            this.positionX = x;
            this.positionY = y;
       }
        
        this.moveTank()
        
    },

    moveTank () {
        
        
        // rotate tank and turret to face the direction of travel
        if(this.direction === 'left')  {
            this.playerTank.style.transform = `rotateY(180deg)`
            //this.tankTurret.style.transform = `rotateY(180deg)`
            if(this.prevDirection != 'left') {
                this.turretAngle -= 90
                this.tankTurret.style.transform = `rotate(${this.turretAngle}deg)`;
                this.prevDirection = this.direction
            }
            this.tankTurret.style.left = `${this.positionX+25}px`;
            this.tankTurret.style.top = `${this.positionY+10}px`;
            
            
        }
        if(this.direction === 'right') {
            this.playerTank.style.transform = `rotateY(0deg)`
            this.tankTurret.style.transform = `rotateY(0deg)`
            if(this.prevDirection != 'right') {
                this.turretAngle += 90 
                this.tankTurret.style.transform = `rotate(${this.turretAngle}deg)`;
                this.prevDirection = this.direction
            }
            this.tankTurret.style.left = `${this.positionX+30}px`;
            this.tankTurret.style.top = `${this.positionY+10}px`;
        }

        // only rotate turret if we change direction
        if(this.direction === this.prevDirection) {
            this.tankTurret.style.transform = `rotate(${this.turretAngle}deg)`;
        }
        
        
        this.prevX = this.positionX
        this.playerTank.style.left = `${this.positionX}px`;
        this.playerTank.style.top = `${this.positionY}px`;
    },

    useShell() {
        this.shellCount--;
        let round = this.magazine.pop()
        round.remove()
        this.updateShellCount()
        this.moveTank()
    },

    reloadShell() {
        if(this.shellCount+10 > this.maxShell) {
            let rounds = this.maxShell - this.shellCount;
            this.shellCount += rounds;
            this.loadShell(rounds);

        } else {
            this.shellCount+=5;
            this.loadShell(5);
        }
        
        this.updateShellCount()
        
    },

    updateShellCount() {
        shellCounter.textContent = `Shell: ${this.shellCount}`
        
    }
}
player.initPlayer()

// Mouse action
gameArea.addEventListener('click', (e) => {
    // listen for click to fire shell
    if(gameStage.running) {
        if(player.shellCount - 1 >= 0) {
            let shell = new Shell({x: player.positionX, y: player.positionY}, {x: e.x, y: e.y})
            player.useShell()
            shell.id = e.x+'shell'+gameStage.projectiles.length
            gameStage.projectiles.push(shell)
        } else {
            alertAndWarning('RELOAD! RELOAD!', 'red')
        }
        
        
    }

})

