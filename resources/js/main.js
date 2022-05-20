const gameArea = document.querySelector('#game-area');
const shellCounter = document.querySelector('#shell-count');
const killCounter = document.querySelector('#kill-count');
const tankMagazine = document.querySelector('#tank-magazine');
const playerHp = document.querySelector('#player-hp');
const menuBoard = document.querySelector('#menu-board');
const playerName = document.querySelector('#player-name');
const deadMessage = document.querySelector('#dead-p');
const introMessage = document.querySelector('#intro-p');
const deadMemorial = document.querySelector('#dead-memorial')
// const retireBtn = document.querySelector('#retired');
// const rebornBtn = document.querySelector('#reborn');
menuBoard.style.display = "block";
deadMessage.style.display = "none";
deadMemorial.style.display = "none";


function opLocalStorage (score) {
    // write score to local storage
    let leaderBoard;

    if(JSON.parse(localStorage.getItem('Leader Board')) !== null) {
        leaderBoard = JSON.parse(localStorage.getItem('Leader Board'))
        
    } else {
        leaderBoard = JSON.parse(localStorage.getItem('Leader Board') ||  '[]');
       
    }

    leaderBoard.push(score)
    localStorage.setItem('Leader Board', JSON.stringify(leaderBoard))
    showLeaderBoard();
    Reborn();
}

function showLeaderBoard () {
    // get leader board from local storage and display as table
    let scoreList = JSON.parse(localStorage.getItem('Leader Board') || '[]')

    if(scoreList.length < 1) {
        return;
    }
    
    scoreList = scoreList.sort((a,b) => b.point - a.point)

    const leaderBoard = document.querySelector('#leader-board');
    // clear board to be refill
    while(leaderBoard.rows.length > 1) {
        leaderBoard.deleteRow(1);
    }

    // fill in the table for leaderboard
    // learn and refence code from WS3School: https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_table_insertrow 
    scoreList.forEach((item, index) => {
        if(index <= 10) {
            let row = leaderBoard.insertRow(index+1);
            let name = row.insertCell(0);
            let point = row.insertCell(1);
            name.innerHTML = item.player;
            point.innerHTML = item.point;
        }
        
    })
}


function closeMenu() {
    menuBoard.style.display = "none"
}

function Retired() {
    let name = playerName.value;
    console.log(name)
    console.log(gameStage.killCount)
    let score = {
        player: name,
        point: gameStage.killCount
    }
    playerName.value = ''
    opLocalStorage(score)

}

// hold attribute relate to the stage of the game
const gameStage = {
    running: false,
    leftBoundary: 0,
    rightBoundary: gameArea.clientWidth - 20,
    topBoundary: 0,
    bottomBoundary: gameArea.clientHeight - 60,
    projectiles: [],
    enemies: [],
    enemyShell: [],
    spawnEnemyTimer: null,
    killCount: 0,
    gameLoop: null,
    shellColisionTimer: null,
    enemyShellColisionTimer: null

}

function gameEnd() {
    // set game state to pause,
    // clear all array and timer
    const destroyEnemy = new Promise(resolve => {
        gameStage.enemies.forEach(enemy => {
            enemy.die();

        })
        resolve()
    })

    const destroyShell =   new Promise(resolve => {
        gameStage.projectiles.forEach(shell => {
            shell.shellExplode();

        })
        resolve()
    })

    const destroyEnemyShell =  new Promise(resolve => {
        gameStage.enemyShell.forEach(shell => {
            shell.shellExplode();
        })
        resolve()
    })

    Promise.all([destroyEnemy, destroyShell, destroyEnemyShell])
        .then(() => {
            gameStage.running = false;
            introMessage.style.display = "none"
            deadMessage.style.display = "block"
            deadMemorial.style.display = "block"
            pauseGame();
        })

}

function alertAndWarning(msg, color) {
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
        if (gameStage.running) {

            randX = (Math.random() * gameStage.rightBoundary + 1)
            randY = (Math.random() * gameStage.bottomBoundary)

            let enemy = new Enemy({
                randX,
                randY
            });
            enemy.id = randX + 'shell' + gameStage.enemies.length
            gameStage.enemies.push(enemy)
            killCounter.textContent = `Enemy Killed: ${gameStage.killCount}`
            //console.log(gameStage.enemies)
        }
    }, 3000)
}

// reborn again 
function Reborn() {
    location.reload();
}

// toggle start or pause game
function startPause(e) {
    gameStage.running = !gameStage.running;

    if (!gameStage.running) {
        // game in pause state, all timer clear and resume button is available
        menuBoard.style.display = "block"
        e.target.style.backgroundColor = 'green'
        e.target.textContent = "Resume"
        pauseGame()

    } else {
        // game in run state
        e.target.style.backgroundColor = 'orange'
        e.target.textContent = "Pause"
        //gameStage.gameLoop = gamgeLoop()
        spawnEnemy()
    }
}

function pauseGame() {
    // when the game is pause, all timers are destroy
    clearInterval(gameStage.spawnEnemyTimer)
    clearInterval(gameStage.shellColisionTimer)
    clearInterval(gameStage.enemyShellColisionTimer)
    
    menuBoard.style.display = "block"
}

// listen for key press to take action on moving the tank or reload
document.addEventListener('keydown', e => {

    if (gameStage.running) {
        player.tankAction(e.key)
    }

})


// target cursor show the location the round will travel
// player use this for aiming
const targetCursor = {
    currentX: 0,
    currentY: 0,
    cursor: null,

    targetCursorInit() {
        this.cursor = document.createElement('img');
        this.cursor.setAttribute('src', 'resources/media/circle-042.png');
        this.cursor.setAttribute('id', 'target-cursor')
        this.cursor.setAttribute('draggable', false);
        this.cursor.style.width = '30px';
        this.cursor.style.height = '30px';
        gameArea.append(this.cursor);
        this.moveCursor()
    },

    moveCursor() {
        setInterval(() => {
                this.cursor.style.left = `${this.currentX-90}px`;
                this.cursor.style.top = `${this.currentY-90}px`;
            }, 1

        )

    }

}
targetCursor.targetCursorInit()

function mouseCoord(e) {
    targetCursor.currentX = e.pageX;
    targetCursor.currentY = e.pageY;
}

// Play Tank
const player = {
    aimPointX: 0,
    aimPointY: 0,
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
        this.tankTurret.setAttribute('src', 'resources/media/gun.gif')
        this.tankTurret.setAttribute('id', 'tank-turret');
        this.tankTurret.setAttribute('draggable', false);

        this.playerTank = document.createElement('img')
        this.playerTank.setAttribute('src', 'resources/media/tank.gif')
        this.playerTank.setAttribute('draggable', false);
        this.playerTank.setAttribute('id', 'player-tank');
        this.playerTank.style.width = `${this.width}px`;
        this.playerTank.style.height = `${this.height}px`;

        this.updateShellCount();
        this.loadShell(this.shellCount);
        gameArea.append(this.playerTank);
        gameArea.append(this.tankTurret);
        this.updatePosition(100, this.positionY);
        this.updatePlayerHP();
    },

    updatePlayerHP(life) {
        if (life) {
            this.hp += life;
        }
        playerHp.textContent = `Health: ${this.hp}`

        if (this.hp <= 0) {
            gameEnd();
        }

    },

    adjustAimPoint(x, y) {
        this.aimPointX = x;
        this.aimPointY = y;
        let distanX = (this.aimPointX - this.currentX)
        let distanY = (this.aimPointY - this.currentY)

        let angle = Math.atan2(distanY, distanX)

        this.turretAngle = angle * 180 / Math.PI
        this.tankTurret.style.transform = `rotate(${this.turretAngle}deg)`;


    },

    loadShell(n) {
        for (let i = 0; i < n; i++) {
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
                this.updatePosition(this.positionX - 10, this.positionY)
                this.direction = 'left'
                break;
            case 'd':
                this.updatePosition(this.positionX + 10, this.positionY)
                this.direction = 'right'
                break
            case 'r':
                this.reloadShell();
                break;
            default:
                //console.log(`do nothing`)
        }
    },

    updatePosition(x, y) {
        if (x < gameStage.rightBoundary - 60 && x > 0) {
            this.positionX = x;
            this.positionY = y;
        }

        this.moveTank()

    },

    moveTank() {


        // rotate tank and turret to face the direction of travel
        if (this.direction === 'left') {
            this.playerTank.style.transform = `rotateY(180deg)`
            //this.tankTurret.style.transform = `rotateY(180deg)`
            if (this.prevDirection != 'left') {
                this.turretAngle -= 90
                this.tankTurret.style.transform = `rotate(${this.turretAngle}deg)`;
                this.prevDirection = this.direction
            }
            this.tankTurret.style.left = `${this.positionX+25}px`;
            this.tankTurret.style.top = `${this.positionY+10}px`;


        }
        if (this.direction === 'right') {
            this.playerTank.style.transform = `rotateY(0deg)`
            this.tankTurret.style.transform = `rotateY(0deg)`
            if (this.prevDirection != 'right') {
                this.turretAngle += 90
                this.tankTurret.style.transform = `rotate(${this.turretAngle}deg)`;
                this.prevDirection = this.direction
            }
            this.tankTurret.style.left = `${this.positionX+30}px`;
            this.tankTurret.style.top = `${this.positionY+10}px`;
        }

        // only rotate turret if we change direction
        if (this.direction === this.prevDirection) {
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
        if (this.shellCount + 10 > this.maxShell) {
            let rounds = this.maxShell - this.shellCount;
            this.shellCount += rounds;
            this.loadShell(rounds);

        } else {
            this.shellCount += 5;
            this.loadShell(5);
        }

        this.updateShellCount()

    },

    updateShellCount() {
        shellCounter.textContent = `Shell: ${this.shellCount}`

    }
}
player.initPlayer()
showLeaderBoard()

// Mouse action
gameArea.addEventListener('click', (e) => {
    // listen for click to fire shell
    if (gameStage.running) {
        if (player.shellCount - 1 >= 0) {

            let shell = new Shell({
                x: player.positionX,
                y: player.positionY
            }, {
                x: e.x,
                y: e.y
            })
            player.useShell()
            shell.id = e.x + 'shell' + gameStage.projectiles.length
            gameStage.projectiles.push(shell)

        } else {
            alertAndWarning('RELOAD! RELOAD!', 'red')
        }


    }

})