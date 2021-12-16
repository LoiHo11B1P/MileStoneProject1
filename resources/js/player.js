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