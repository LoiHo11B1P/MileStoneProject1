
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
        [ {x:300, y:100}, {x:600, y:400}, {x:900, y:300},{x: 1100, y: 200} ]
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
        //console.log('move 1')
        clearInterval(this.flyTime)
        await this.Traverse(this.travelPath[0][1])
        //console.log('move 2')
        clearInterval(this.flyTime)
        await this.Traverse(this.travelPath[0][2])
        clearInterval(this.flyTime)
        await this.Traverse(this.travelPath[0][3])
        clearInterval(this.flyTime)
        this.die()
        

   
    }

    die () {
        setTimeout(() =>{
            clearInterval(this.firingTimer)
            clearInterval(this.flyTime)
            let index = gameStage.enemies.indexOf(this.id)
            gameStage.enemies.splice(index, 1)
            this.soul.remove();
        }, 150)
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
        
                    if(this.currentX >= gameStage.rightBoundary - 80 || this.currentX <= 0 ||
                        this.currentY >= gameStage.bottomBoundary || this.currentY < gameStage.topBoundary) {
                        resolve()    
                        
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