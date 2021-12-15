

class EnemyShell extends Shell {

    constructor(spawnCoords, explodeCoord) {
        super(spawnCoords, explodeCoord, 'enemy', 1)
        this.shell.style.border = "2px solid orange"
        this.shell.style.borderRadius = "90%"
        this.shell.style.backgroundColor = 'purple';
        
        
    }
    
}