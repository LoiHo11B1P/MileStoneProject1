# MileStoneProject1
Browser game

General:

Originally, this game mean to be for both air and ground combat.
Due to limited time allowed, only air defense combat is implemented. 

Tank-em is a air defense survival game. User is the tank commander of a lone survival tank. The goals are
to stay a live as long as possible by dodging enemy projectiles and take down as many enemy aircraft as possible.
Scores are kept in the leader board ranking from highest number of enemy aircraft taken down, not for the time survived.

Control:

    1. Keyboard:
        "A" key to move the tank left
        "D" key to move the tank right
        "R" to reload shell -  player can reload shell at anytime
    2. Mouse:
        Use mouse cursor for aiming (x,y)
        Mouse "Left-Click" will fire a projectile to the mouse cursor coordinate 

Credit:

    I. Arts use in game are from the following creator:

        1. Open Gunner Art package by Master484: http://m484games.ucoz.com/
        2. Free World War Game Theme: https://opengameart.org/content/free-world-war-game-theme
        3. Crosshair Pack: https://opengameart.org/content/20-crosshairs-for-re

    II. Verlocity Caculation 
        Use for calculating the x and y increment of the projectile to move the projectile 
        from it point of spawn to it destination.

    III. Colision Detection - Rectangle to Rectangle
        Use for calculating Shell and Enemy Shell colision with player or enemy.
        Colision detection is learned from youtube video and credit to "Franks laboratory"
        https://www.youtube.com/watch?v=r0sy-Cr6WHY


Known Bugs:

1. Enemy sometime is not targetable - problem with colision detection or enemy array or shell array
2. Player hit by enemy shell would not register correctly - problem with colision detection