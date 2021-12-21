# MileStoneProject1

Tank-em

General:

Originally, this game mean to be for both air and ground combat.
Due to limited time allowed, only air defense combat is implemented. 

Tank-em is a air defense survival game. User is the tank commander of a lone survival tank. The goals are
to stay a live as long as possible by dodging enemy projectiles and take down as many enemy aircraft as possible.
Scores are kept in the leader board ranking from highest number of enemy aircraft taken down, not for the time survived.

Focus of the Development Journey:

    The main focus in development of this brower game is to gain more understanding of CSS, JS, and programing concept. With CSS, the focus is on positioning, and transform (rotate). For JS and Programing concept become the major focus with the aim of utilizing most of the concept taugh in the class into the game such as encapsulation, class, sub-class, promises, async await, list comprehension, setInterval and how to remove the timer, and local storage to keep leader board score. 

    The most difficult part of the development is to decide whether to use a single timer loop to calculate all object movement and colission or individual instance of the object has it own timer loop. The proglem with the single timer loop is that at 1ms the inital loop haven't finish when the other one begin. In the end, I decided to to use time for each instance of the object (shell, enemyShell, player). I found this to be a better approach because I could avoid the double for loop on each object that would result in O(n^2) run time. 

Technology Used:

    HTML, CSS, JS, and Bootstrap
    I purposely avoid using 3rd party library to that I could focus on learning DOM menipulation (this my weakest area beside CSS).
    I also purposely avoid using Canvas because most of the tutorial I watch shown how to build the game using canvas.

Control:

    1. Keyboard:
        "A" key to move the tank left
        "D" key to move the tank right
        "R" to reload shell -  player can reload shell at anytime
    2. Mouse:
        Use mouse cursor for aiming (x,y)
        Mouse "Left-Click" will fire a projectile to the mouse cursor coordinate 

The Enemy:

    Randomly spawned helicopter that would travel a preset flying route (the random spawn point allow a bit of randomness in the flight pattern). 

    This is where I use an array of objects containing the set of coordinate x and y. Implemented async await successfully to allow the helicopter to fly to one way point before changing direction and fly to another.

    The enemy helicopter also have a timer using setInterval to fire a round every 1.5 second at the player by passing over the player current X and Y coordinate. 

    The enemy helicopter would disappeared after flying it set route or when it is hit by player shell (add 1 point to the player).

Wining and Losing Condiction:

    This is a how long you can survive style. The focus is to stay a live as long as possible while scoring as much point as possible with the goal to be number 1 on the leader board.

    The game will stop when the player health is less than 0. The player will have the choice to write his score down on the leader board or respawn wiping the score to start with a clean slate.

Credit:

    I. Arts use in game are from the following creator:

        1. Open Gunner Art package by Master484: http://m484games.ucoz.com/
        2. Free World War Game Theme: https://opengameart.org/content/free-world-war-game-theme
        3. Crosshair Pack: https://opengameart.org/content/20-crosshairs-for-re

    II. Verlocity Caculation 
        Use for calculating the x and y increment of the projectile to move the projectile from it point of spawn to it destination.

        At first I simply calculated the distance x and y between spawn point and destination point. Then divided by 4000, to get the increment for 4 second of flight time. The issue with this approach is the round would travel fast when 
        the destination point is farther away and slower when it is closer.

        After researching, I found and implement the velocity calculation shown by Chris
        on his Youtube video titled "HTML5 Canvas and JavaScript Game Tutorial" at https://www.youtube.com/watch?v=eI9idPTT0c4.
        His approach start out similar to what I though but later added Math.atan2(distance to Y, distance X)*180/Math.PI to get the angle. Use Math.cos(angle) to get Horizontal velocity and Math.sin(angle) to get Verticle velocity. I added the speed modifier to control how fast the shell should be moving. Giving the player an edge, I allow player shell to fly
        faster and enemy shell to fly slower. Later on the speed factor can be modified again depending on the difficulty of the game.

        Notice, I use the angle calculated to point the barrel of the turret depending on where the play click on the play area.

    III. Colision Detection - Rectangle to Rectangle
        Use for calculating Shell and Enemy Shell colision with player or enemy.
        Colision detection is learned from youtube video and credit to "Franks laboratory"
        https://www.youtube.com/watch?v=r0sy-Cr6WHY


Known Bugs:

1. Enemy sometime is not targetable - problem with colision detection or enemy array or shell array
2. Player hit by enemy shell would not register correctly - problem with colision detection