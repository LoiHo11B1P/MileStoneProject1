const gameArea = document.querySelector('#game-area');

// Play Tank
const player = {
    positionX: 100,
    positionY: 120,
    img: '',
    playerTank: null,

    initPlayer() {
        this.playerTank = document.createElement('img')
        this.playerTank.setAttribute('id', 'player-tank')
        gameArea.append(this.playerTank)
        this.playerTank.addEventListener('click', (e) => {
            console.log(e)
        })
        this.updatePosition(100,120)
    },

    updatePosition (x,y) {

        this.positionX = x;
        this.positionY = y;
        this.moveTank()
        
    },

    moveTank () {
        this.playerTank.style.left = `${this.positionX}px`;
        this.playerTank.style.bottom = `${this.positionY}px`;
    }


}
player.initPlayer()

// Mouse action
gameArea.addEventListener('click', (e) => {
    let newX = 0;
    if(e.x + 60 > 1200) {
        newX = (e.x - 420);
        
    } else {
        newX = e.x-350;
        
    }

    console.log(e.x)
    
    player.updatePosition(newX)
})