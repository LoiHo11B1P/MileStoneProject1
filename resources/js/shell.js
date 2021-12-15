
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
        if(type === 'enemy') {
            this.destX = explodeCoord.x;
            this.destY = explodeCoord.y;
        } else {
            this.destX = explodeCoord.x-80;
            this.destY = explodeCoord.y-80;
        }
        
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
        clearInterval(this.shellTravelTimer)

        setTimeout(() => {
            
            projectileList.splice(projectitleIndex,1)
            this.shell.remove()
            //console.log(gameStage.projectiles)
        }, 250);
        
            
    }

    shellTravel(type) {
        // the flight distance
        let distanX = (this.destX - this.currentX)
        let distanY = (this.destY - this.currentY)

        // 
        let angle = Math.atan2(distanY, distanX)
        
        //
        let aimAngle = angle*180/Math.PI
        //console.log(aimAngle)
        
        // if aim angle is not more than 
        if((aimAngle < 0  && aimAngle > -180) || type === 'enemy' ) {
            
            player.turretAngle = aimAngle

            let verlocityX = Math.cos(angle)*this.speed
            let verlocityY = Math.sin(angle)*this.speed
    
            this.shellTravelTimer = setInterval(() => {
                if(gameStage.running) {
                    this.currentX += verlocityX;
                    this.currentY += verlocityY;
                }
                
                if((this.currentX == this.destX && this.currentY == this.destY) || 
                    this.currentX >= gameStage.rightBoundary-100 ||
                    this.currentY >= gameStage.bottomBoundary || 
                    this.currentY < 0 ||
                    this.currentX <= gameStage.leftBoundary) {
                    clearInterval(this.shellTravelTimer);
                    this.shellExplode()
                }
    
                this.shell.style.left = `${this.currentX}px`;
                this.shell.style.top = `${this.currentY}px`;

                // attemp to do colision detection by individual shell
                if(type !== 'enemy') {
                    if(gameStage.enemies.length > 0) {
                    gameStage.enemies.forEach((enemy) => {
                        // colision detection is learned from youtube video and credit to "Franks laboratory"
                        // https://www.youtube.com/watch?v=r0sy-Cr6WHY
                        if(this.currentX <= enemy.currentX + enemy.width &&
                            this.currentX + this.width >= enemy.currentX &&
                            this.currentY <= enemy.currentY + enemy.height &&
                            this.currentY + this.height >= enemy.currentY) {
                                //console.log('HIT!!!!!!!!!')
                                clearInterval(this.shellTravelTimer);
                                this.shellExplode()
                                enemy.die()
                                gameStage.killCount += 1;
                            }
                        })
                    }
                } else {
                    if(gameStage.enemyShell.length > 0) {
                                gameStage.enemyShell.forEach(projectile => {
                                    // colision detection is learned from youtube video and credit to "Franks laboratory"
                                    // https://www.youtube.com/watch?v=r0sy-Cr6WHY
                                    if(projectile.currentX <= player.positionX + player.width &&
                                        projectile.currentX + projectile.width >= player.positionX &&
                                        projectile.currentY <= player.positionY + player.height &&
                                        projectile.currentY + projectile.height >= player.positionY) {
                                            //console.log('HIT!!!!!!!!!')
                                            projectile.shellExplode()
                                            player.updatePlayerHP(-1)
                                    }
                                })
                            }
                }
                
            }, 1);
            
        } else {
            this.shell.remove()
        }

       
    }
}