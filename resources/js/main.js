const gameArea = document.querySelector('#game-area');
const shellCounter = document.querySelector('#shell-count');

// hold attribute relate to the stage of the game
const gameStage = {
    running: false,
    leftBoundary: gameArea.clientWidth,
    rightBoundary: 0,
    bottomBoundary: gameArea.clientHeight-160,
    projectiles: [],
    enemies: []
    
}

// toggle start or pause game
function startPause(e) {
    gameStage.running = !gameStage.running;
    if(!gameStage.running) {
        e.target.style.backgroundColor = 'orange'
    } else {
        e.target.style.backgroundColor ='green'
    }
}

// position of mouseclick serve as aim point for projectile
function aimPoint(e) {
    player.adjustAimPoint(e.clientX, e.clientY)

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
    positionY: gameArea.clientHeight - 160,
    prevX: 100,
    img: '',
    playerTank: null,
    tankTurret: null,
    turretAngle: -45,
    shellCount: 20,
    maxShell: 25,

    initPlayer() {
        this.tankTurret = document.createElement('img')
        this.tankTurret.setAttribute('src','resources/media/gun.gif')
        this.tankTurret.style.position = 'absolute';
        this.tankTurret.zIndex = '-1'
        this.playerTank = document.createElement('img')
        this.playerTank.setAttribute('src','resources/media/tank.gif')
        this.playerTank.setAttribute('id', 'player-tank')
        this.updateShellCount()
        gameArea.append(this.playerTank)
        gameArea.append(this.tankTurret)
        this.updatePosition(100,this.positionY)
    },

    adjustAimPoint(x,y) {
        this.aimPointX = x;
        this.aimPointY = y;
        //console.log(`Aiming @ x:${this.aimPointX}, y:${this.aimPointY}`)
    },

    tankAction(code) {
        switch (code) {
            case 'a':
                this.updatePosition(this.positionX-5, this.positionY)
                console.log(`move left`)
                break;
            case 'd':
                this.updatePosition(this.positionX+5, this.positionY)
                console.log(`move right`)
                break
            case 'r':
                this.reloadShell();
                break;
            default:
                console.log(`do nothing`)
        }

    
    },

    updatePosition (x,y) {

        this.positionX = x;
        this.positionY = y;
        this.moveTank()
        
    },

    moveTank () {
        
        console.log(this.turretAngle)
        this.tankTurret.style.transform = `rotate(${this.turretAngle}deg)`;
        if(this.positionX - this.prevX < 0)  {
            this.playerTank.style.transform = `rotateY(180deg)`
            this.tankTurret.style.transform = `rotateY(180deg)`
            this.tankTurret.style.left = `${this.positionX+60}px`;
            
        }

        this.tankTurret.style.left = `${this.positionX+25}px`;
        this.tankTurret.style.top = `${this.positionY+5}px`;
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
    let newX = 0;
    let newY = 0;

    newX = (e.x)
    newY = (e.y)
    //console.log(`X:${e.x}, Y:${e.y}`)
    if(gameStage.running) {
        let shell = new Shell({x: player.positionX, y: player.positionY}, {x: e.x, y: e.y},player.useShell())
        shell.id = e.x+'shell'+gameStage.projectiles.length
        gameStage.projectiles.push(shell)
        console.log(gameStage.projectiles)
    }
    
    
})

// Projectiles

class Shell {
    shell = null
    shellTravelTimer = null
    currentX = null
    currentY = null
    speed = 3
    id = null

    constructor(spawnCoords, explodeCoord) {
        // spawnCoord will be at tank position x & y
        // explodeCoord will be where the mouse is click
        this.currentX = spawnCoords.x + 30;
        this.currentY = spawnCoords.y;
        this.destX = explodeCoord.x;
        this.destY = explodeCoord.y-60;

        this.shell = document.createElement('img');
        //this.shell.setAttribute('class', 'shell');
        this.shell.style.width = '20px';
        this.shell.style.height = '20px';
        this.shell.style.border = "2px solid gold"
        this.shell.style.borderRadius = "90%"
        this.shell.style.backgroundColor = 'red';
        this.shell.style.position = 'absolute';
        this.shell.style.left = `${this.currentX}px`;
        this.shell.style.top = `${this.currentY}px`;
        //console.log(`bullet @ x:${spawnCoords.x}, y:${spawnCoords.y}`)
        gameArea.append(this.shell)
        this.shellTravel()
        //this.shellExplode()
    }

    shellExplode() {
        let projectileList = gameStage.projectiles;
        let projectitleIndex = projectileList.indexOf(this.id)
        console.log(gameStage.projectiles[projectitleIndex])
        setTimeout(() => {
            projectileList.splice(projectitleIndex,1)
            
            this.shell.remove()
            console.log(gameStage.projectiles)
        }, 0);
        
            
    }

    shellTravel() {
        // the flight path should be distance x/4000, distance y/4000
        let distanX = (this.destX - this.currentX)
        let distanY = (this.destY - this.currentY)

        let angle = Math.atan2(distanY, distanX)
        
        player.turretAngle = angle*180/Math.PI
        
        let verlocityX = Math.cos(angle)*this.speed
        let verlocityY = Math.sin(angle)*this.speed

        console.log(`verlocityX: ${verlocityX}`)
        console.log(`verlocityY: ${verlocityY}`)

        this.shellTravelTimer = setInterval(() => {

            this.currentX += verlocityX;
            this.currentY += verlocityY;

            if((this.currentX * -1 >= this.destX || this.currentX >= gameStage.leftBoundary-10) ||
                (this.currentY >= gameStage.bottomBoundary || this.currentY <= this.destY)) {
                clearInterval(this.shellTravelTimer);
                this.shellExplode()
            }

            this.shell.style.left = `${this.currentX}px`;
            this.shell.style.top = `${this.currentY}px`;
            
        }, 1);
    }
}