const gameArea = document.querySelector('#game-area');
const shellCounter = document.querySelector('#shell-count');
const killCounter = document.querySelector('#kill-count');
// hold attribute relate to the stage of the game
const gameStage = {
    running: false,
    leftBoundary: 0,
    rightBoundary: gameArea.clientWidth - 10,
    topBoundary: 0,
    bottomBoundary: gameArea.clientHeight - 40,
    projectiles: [],
    enemies: [],
    enemyShell: [],
    spawnEnemyTimer: null,
    killCount: 0,
    gameLoop: null,
    
}

function gamgeLoop () {
    setInterval(() => {
        if(gameStage.projectiles.length > 0 && gameStage.enemies.length > 0)
        gameStage.projectiles.forEach((projectile) => {
            
            gameStage.enemies.forEach((enemy) => {
                // colision detection is learn from youtube video and credit to "Franks laboratory"
                // https://www.youtube.com/watch?v=r0sy-Cr6WHY
                if(projectile.currentX < enemy.currentX + enemy.width &&
                    projectile.currentX + projectile.width > enemy.currentX &&
                    projectile.currentY + enemy.currentY + enemy.height &&
                    projectile.currentY + projectile.height > enemy.currentY) {
                        //console.log('HIT!!!!!!!!!')
                        projectile.shellExplode()
                        enemy.die()
                        gameStage.killCount += 1;
                    }
               
            })
        }) 
    }, 1);
}

function alertAndWarning (msg, color) {
    let alertText = document.createElement('label')
    alertText.textContent = msg
    alertText.style.fontSize = '15em'
    alertText.style.position = 'absolute'
    alertText.style.top = `${gameStage.bottomBoundary/2 -300}px`
    alertText.style.left = `${gameStage.rightBoundary/2 - 500}px`
    alertText.style.color = color
    gameArea.append(alertText) 
    setTimeout(() => {
        alertText.remove()
    }, 500);
}

function spawnEnemy() {
    return setInterval(() => {
        if(gameStage.running) {

            randX = (Math.random() * gameStage.rightBoundary + 1)
            randY = (Math.random() * gameStage.bottomBoundary)

            let enemy = new Enemy ({randX, randY});
            enemy.id = randX+'shell'+gameStage.enemies.length
            gameStage.enemies.push(enemy)
            killCounter.textContent = `Enemy Killed: ${gameStage.killCount}`
            //console.log(gameStage.enemies)
        }
    }, 2500)
}

// toggle start or pause game
function startPause(e) {
    gameStage.running = !gameStage.running;
   
    if(!gameStage.running) {
        e.target.style.backgroundColor = 'orange'
        clearInterval(gameLoop)
    } else {
        e.target.style.backgroundColor ='green'
        gameLoop = gamgeLoop()
        spawnEnemy()
    }
}

// position of mouseclick serve as aim point for projectile
function aimPoint(e) {
    //console.log(e)
    //player.adjustAimPoint(e.clientX, e.clientY)
    

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
        gameArea.append(this.playerTank)
        gameArea.append(this.tankTurret)
        this.updatePosition(100,this.positionY)
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
        if(x < gameStage.rightBoundary-10 && x > 0) {
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
        this.updateShellCount()
        this.moveTank()
    },

    reloadShell() {
        if(this.shellCount+10 > this.maxShell) {
            this.shellCount = 25;
        } else {
            this.shellCount+=10;
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

// Projectiles

class Shell {
    shell = null
    shellTravelTimer = null
    currentX = null
    currentY = null
    speed = 3
    width = 20
    height = 20
    type = null
    id = null

    constructor(spawnCoords, explodeCoord, type, speed) {
        // spawnCoord will be at tank position x & y
        // explodeCoord will be where the mouse is click
        // type is use for enemy shell only
        this.currentX = spawnCoords.x + 30;
        this.currentY = spawnCoords.y;
        this.destX = explodeCoord.x;
        this.destY = explodeCoord.y-60;
        this.type = type;
        this.speed = speed != null ? speed: 3;
        this.shell = document.createElement('img');
        //this.shell.setAttribute('class', 'shell');
        this.shell.style.width = `${this.width}px`;
        this.shell.style.height = `${this.height}px`;
        this.shell.style.border = "2px solid green"
        this.shell.style.borderRadius = "90%"
        this.shell.style.backgroundColor = 'red';
        this.shell.style.position = 'absolute';
        this.shell.style.left = `${this.currentX}px`;
        this.shell.style.top = `${this.currentY}px`;
        //console.log(`bullet @ x:${spawnCoords.x}, y:${spawnCoords.y}`)
        gameArea.append(this.shell)
        this.shellTravel(this.type)
        //this.shellExplode()
        
    }

    shellExplode() {
        let projectileList;
        this.width = 100
        this.height = 100
        this.shell.style.width = `${this.width}px`
        this.shell.style.height = `${this.height}px`
        this.shell.style.border = ""
        this.shell.style.borderRadius = "0%"
        this.shell.style.backgroundColor = ''
        this.shell.setAttribute('src', 'resources/media/explode.png')
        if(this.type === 'enemy') {
            projectileList = gameStage.enemyShell;
        } else {
            projectileList = gameStage.projectiles;
        }
         
        let projectitleIndex = projectileList.indexOf(this.id)

        setTimeout(() => {
            
            projectileList.splice(projectitleIndex,1)
            this.shell.remove()
            //console.log(gameStage.projectiles)
        }, 250);
        
            
    }

    shellTravel(type) {
        // the flight path should be distance x/4000, distance y/4000
        let distanX = (this.destX - this.currentX)
        let distanY = (this.destY - this.currentY)

        let angle = Math.atan2(distanY, distanX)
        
        let aimAngle = angle*180/Math.PI
        //console.log(aimAngle)
        
        // if aim angle is not more than -80 or less than -120 do not move the turret or let bullet fly
        if((aimAngle < 0  && aimAngle > -180) || type === 'enemy' ) {
            
            player.turretAngle = aimAngle

            let verlocityX = Math.cos(angle)*this.speed
            let verlocityY = Math.sin(angle)*this.speed
    
            this.shellTravelTimer = setInterval(() => {
    
                this.currentX += verlocityX;
                this.currentY += verlocityY;
    
                if((this.currentX == this.destX && this.currentY == this.destY) || this.currentX >= gameStage.rightBoundary-10 ||
                    this.currentY >= gameStage.bottomBoundary || this.currentY < 0) {
                    clearInterval(this.shellTravelTimer);
                    this.shellExplode()
                }
    
                this.shell.style.left = `${this.currentX}px`;
                this.shell.style.top = `${this.currentY}px`;
                // gameStage.enemies.forEach((enemy) => {
                // if(this.currentX < enemy.currentX + enemy.width &&
                //     this.currentX + this.width > enemy.currentX &&
                //     this.currentY + enemy.currentY + enemy.height &&
                //     this.currentY + this.height > enemy.currentY) {
                //         console.log('HIT!!!!!!!!!')
                //         clearInterval(this.shellTravelTimer);
                //         this.shellExplode()
                //         enemy.die()
                //         gameStage.killCount += 1;
                //     }
                // })
            }, 1);
            
        } else {
            this.shell.remove()
        }

       
    }
}

class EnemyShell extends Shell {
    

    constructor(spawnCoords, explodeCoord) {
        super(spawnCoords, explodeCoord, 'enemy', 1)
        this.shell.style.border = "2px solid orange"
        this.shell.style.borderRadius = "90%"
        this.shell.style.backgroundColor = 'purple';
        
        
    }
    
}

// Enemy

class Enemy {
    currentX = 0;
    currentY = 0;
    hp = 10;
    id = null;
    speed = .5;
    soul = null;
    width = 80;
    height = 60;
    flyTime = null;
    firingTimer = null;
    travelPath = [
        [ {x:300, y:100}, {x:400, y:200}, {x:800, y:200},{x: 1000, y: 400} ]
    ]

    constructor(spawnCoords, destCoords, id) {
        this.currentX = spawnCoords.randX;
        this.currentY = spawnCoords.randY;
        this.soul = document.createElement('img')
        this.soul.setAttribute('src', 'resources/media/chopper1.gif')
        this.soul.setAttribute('draggable', false);
        this.soul.style.width = `${this.width}px`
        this.soul.style.height = `${this.height}px`
        this.soul.style.position = 'absolute';
        this.soul.style.left = `${this.currentX}px`;
        this.soul.style.top = `${this.currentY}px`;
        gameArea.append(this.soul)
        this.move()
        
       
    }

    async move () {
        
    
        this.fireShot()
            await this.Traverse(this.travelPath[0][0])
            clearInterval(this.flyTime)
            await this.Traverse(this.travelPath[0][1])
            clearInterval(this.flyTime)
            await this.Traverse(this.travelPath[0][2])
            clearInterval(this.flyTime)
            await this.Traverse(this.travelPath[0][3])
            clearInterval(this.flyTime)

   
    }

    die () {
        setTimeout(() =>{
            clearInterval(this.firingTimer)
            clearInterval(this.flyTime)
            let index = gameStage.enemies.indexOf(this.id)
            gameStage.enemies.splice(index, 1)
            this.soul.remove();
        }, 50)
    }

    Traverse (wayPoint) {
        ///console.log(wayPoint)
        return new Promise((resolve) => {
            let toX = wayPoint.x;
            let toY = wayPoint.y;
            let distanX = (toX- this.currentX)
            let distanY = (toY - this.currentY)

            let angle = Math.atan2(distanY, distanX)
        
            let aimAngle = angle*180/Math.PI

            if(distanX < 0) {
                this.soul.style.transform = `rotateY(180deg)`
            } else {
                this.soul.style.transform = `rotateY(0deg)`
            }
        
            let verlocityX = Math.cos(angle)*this.speed
            let verlocityY = Math.sin(angle)*this.speed
            let rotation = 1
            this.flyTime = setInterval(() => {
                if(gameStage.running) {
                    let img = `resources/media/chopper${rotation}.gif`
                    this.soul.setAttribute('src', img)
                    
                    if(rotation+1 > 5) {
                        rotation = 1
                    } else {
                        rotation ++
                    }
                    this.currentX += verlocityX;
                    this.currentY += verlocityY;
        
                    if(this.currentX >= gameStage.rightBoundary || this.currentX <= 0 ||
                        this.currentY >= gameStage.bottomBoundary || this.currentY < gameStage.topBoundary) {
                            
                        this.die()
                    }
        
                    this.soul.style.left = `${this.currentX}px`;
                    this.soul.style.top = `${this.currentY}px`;
                }
                    
            }, 1);
        })
        
            
      
    }

    fireShot () {
        this.firingTimer = setInterval(() => {
            if(gameStage.running) {
                let shell = new EnemyShell({x: this.currentX, y: this.currentY}, {x: player.positionX, y: player.positionY})
               
                shell.id = this.currentX+'enemyShell'+gameStage.enemyShell.length
                
                gameStage.enemyShell.push(shell)
                
            }
        }, 1500);
    }
}