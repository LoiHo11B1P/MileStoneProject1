const gameArea = document.querySelector('#game-area');
const shellCounter = document.querySelector('#shell-count');

// hold attribute relate to the stage of the game
const gameStage = {
    running: false,
    leftBoundary: gameArea.clientWidth,
    rightBoundary: 0,
    bottomBoundary: gameArea.clientHeight-160,
    
}

function startPause() {
    gameStage.running = !gameStage.running;
}

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
    img: '',
    playerTank: null,
    shellCount: 20,
    maxShell: 25,

    initPlayer() {
        this.playerTank = document.createElement('img')
        this.playerTank.setAttribute('id', 'player-tank')
        this.updateShellCount()
        gameArea.append(this.playerTank)
        this.updatePosition(100,this.positionY)
    },

    adjustAimPoint(x,y) {
        this.aimPointX = x;
        this.aimPointY = y;
        console.log(`Aiming @ x:${this.aimPointX}, y:${this.aimPointY}`)
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
        this.playerTank.style.left = `${this.positionX}px`;
        this.playerTank.style.top = `${this.positionY}px`;
    },

    useShell() {
        this.shellCount--;
        this.updateShellCount()
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
    }
    
    
})

// Projectiles

class Shell {
    shell = null
    shellTravelTimer = null
    currentX = null
    currentY = null

    constructor(spawnCoords, explodeCoord) {
        // spawnCoord will be at tank position x & y
        // explodeCoord will be where the mouse is click
        this.currentX = spawnCoords.x + 30;
        this.currentY = spawnCoords.y;
        this.destX = explodeCoord.x;
        this.destY = explodeCoord.y-60;

        this.shell = document.createElement('img');
        //this.shell.setAttribute('class', 'shell');
        this.shell.style.width = '10px';
        this.shell.style.height = '10px';
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
       
        this.shellTravelTimer = null;
        this.shell.remove()
            
    }

    shellTravel() {
        // the flight path should be distance x/4000, distance y/4000
        let distanX = (this.destX - this.currentX)
        let distanY = (this.destY - this.currentY)

        let angle = Math.atan2(distanY, distanX)

        let verlocityX = Math.cos(angle)
        let verlocityY = Math.sin(angle)

        console.log(`verlocityX: ${verlocityX}`)
        console.log(`verlocityY: ${verlocityY}`)

        this.shellTravelTimer = setInterval(() => {

            this.currentX += verlocityX;
            this.currentY += verlocityY;

            if((this.currentX * -1 >= this.destX || this.currentX >= gameStage.leftBoundary-10) ||
                (this.currentY >= gameStage.bottomBoundary || this.currentY <= this.destY)) {
                this.shellExplode()
            }

            this.shell.style.left = `${this.currentX}px`;
            this.shell.style.top = `${this.currentY}px`;
            
        }, 1);
    }
}