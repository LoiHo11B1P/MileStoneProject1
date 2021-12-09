const gameArea = document.querySelector('#game-area');
const shellCounter = document.querySelector('#shell-count');

// hold attribute relate to the stage of the game
const gameStage = {
    running: false,

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
    positionY: 120,
    img: '',
    playerTank: null,
    shellCount: 20,
    maxShell: 25,

    initPlayer() {
        this.playerTank = document.createElement('img')
        this.playerTank.setAttribute('id', 'player-tank')
        this.updateShellCount()
        gameArea.append(this.playerTank)
        this.updatePosition(100,120)
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
        this.playerTank.style.bottom = `${this.positionY}px`;
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

// Bullet

class Shell {
    shell = null
    shellTravelTimer = null
    currentX = null
    currentY = null

    constructor(spawnCoords, explodeCoord) {
        // spawnCoord will be at tank position x & y
        // explodeCoord will be where the mouse is click
        this.currentX = spawnCoords.x;
        this.currentY = spawnCoords.y;
        this.destX = explodeCoord.x;
        this.destY = explodeCoord.y;

        this.shell = document.createElement('img');
        //this.shell.setAttribute('class', 'shell');
        this.shell.style.width = '20px';
        this.shell.style.height = '40px';
        this.shell.style.backgroundColor = 'red';
        this.shell.style.position = 'absolute';
        this.shell.style.left = `${this.currentX}px`;
        this.shell.style.bottom = `${this.currentY}px`;
        //console.log(`bullet @ x:${spawnCoords.x}, y:${spawnCoords.y}`)
        gameArea.append(this.shell)
        this.shellTravel()
        this.shellExplode()
    }

    shellExplode() {
        setTimeout(() => {
            this.shellTravelTimer = null;
            this.shell.remove()
            
        }, 4000);
    }

    shellTravel() {
        // the flight path should be distance x/4000, distance y/4000
        let travelX = this.destX**2 - this.currentX;
        let travelY = (this.destY**2) - this.currentY;
        this.shellTravelTimer = setInterval(() => {
            

            if(travelY < 0) {
                travelY = this.currentY
            }

            if(travelX < 0) {
                this.currentX -= travelX/400000;  
            } else {
                this.currentX += travelX/400000;
            }
            
            this.currentY += travelY/400000;
            this.shell.style.bottom = `${this.currentY}px`
            this.shell.style.left = `${this.currentX}px`
        }, 1);
    }
}