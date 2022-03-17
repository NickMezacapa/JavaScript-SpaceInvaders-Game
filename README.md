# JavaScript-SpaceInvaders-Game
## Summary 
The classic Space Invaders arcade game, written in Vanilla JavaScript with use of HTML canvas. This was a great exercise to get my feet wet in game development. No plugins, jQuery, frameworks, etc.. I've always loved classic arcade games, and using html canvas and vanilla javascript made this fun and easy. 

The original Space Invaders arcade game was developed in 1978. In most of the old game systems, you didn't exactly have a lot of memory or processor power to play with and had to make the best of what you had - using compiled code added bloat, since compilers back then weren't nearly as efficient as they are now, and in a system that had maybe 64K of memory and a 1.6MHz processor, you had no room for inefficiency.

Fun fact: The original Space Invaders arguably set the template for fixed shooter games, and found nearly 8 million daily players in Japan quickly after its launch.

## Play Live Game:
https://nickmezacapa.github.io/JavaScript-SpaceInvaders-Game/

## How To Play
The game is very simple. You, as the shooter, control your spaceship using the arrow keys. You have to shoot down hoardes of space invaders before they reach you or before they shoot you themselves. Every invader that's eliminated results in +1 point to your score. You use the left and right arrow keys to move your spaceship left or right, and you use the ArrowUp key to fire projectiles. Upon game end you have the option to restart the game. 

## Task
Rebuild the classic arcade game "Space Invaders". Game should be bug-free and follow the functionality of the original game as closely as possible.

## Summary of Tech Stack
No framework, plugin, library, or jQuery was used - just raw Vanilla JavaScript, the use of HTML canvas and some CSS. I've dabbled in some game development before this, but this was my first full game build. Becuase it was more or less of a learning exercise, the JavaScript is kept all in one file. By using the canvas element, we are able to implement fundamental game mechanics such as rendering and moving objects, updating object position, collision detection, win/lose states and much more. 

#### Simple example from the source code:
```
canvasContext.beginPath();
canvasContext.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
canvasContext.fillStyle = this.color;
canvasContext.fill();
canvasContext.closePath();
```
- In this snippet, instructions for the `canvas` are located between the `.beginPath()` and `.closePath()` methods. <br /> 
- We are defining an arc (circle) using `.arc()` method, where the first two values are specifying the arc's center coordinates according to a class constructor. It also specifies an arc radius which will be the distance from arc center, giving the arc its total diameter or size. <br />
- The `.fillStyle` property stores a color that will be used by the `.fill()` method to paint the inside of the arc whatever color was specified using `.fillStyle`. <br />
- The `.closePath()` method signifies the end of our "instructions" and a colored circle is drawn to the `canvas`. <br />

Throughout my code, I used iterations of this same concept to achieve my desired outcomes, reproduce simple and not so simple animations, define player movement mechanisms, and much more. See the Helpful Links section below to review some information on working with HTML `canvas`.

## Design Strategy
I made use of class constructors to dynamically store and reference data for when new objects are instantiated. These objects have specific attributes that make the game what it is, such as projectile speed, player movement speed, projectile width and more.

#### See an example of one of my classes:
```
class Projectile {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 4;
    }
    draw() {
        canvasContext.beginPath();
        canvasContext.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        canvasContext.fillStyle = 'green';
        canvasContext.fill();
        canvasContext.closePath();
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}
```
From the Projectile class I am giving my projectiles a position, velocity, radius, and even a color which are then drawn to the screen. Take a look at my source code to review more examples of class constructors.

## Run Locally
1. Run this command `git clone https://github.com/NickMezacapa/JavaScript-SpaceInvaders-Game.git`
2. Run `npm install`
3. Double check your ports to avoid errors
4. Run `npm run start-dev`
5. You are now in the dev environment and you're free to play around

## Manual Test Cases for functionality
- User is able to move player left or right
- When player reaches end of screen (max canvas width) they are not able to move further
- When player moves left or right, player character is slightly rotated in direction of movement
- When a player is not moving, there is no rotation angle
- Player is able to fire projectiles by clicking the ArrowUp key
- When a projectile hits an invader, invader explodes into particles
- When a projectile hits an invader, score is increased by 1 point
- Invaders can fire projectiles towards player
- If player is hit by invader projectile, player character explodes into particles
- If player is hit by invader projectile, game is over
- If game is over, an alert will appear on screen with the score and prompt user to restart
- Invaders regenerate in grids at random intervals
- Every time a grid of invaders reaches the end of the screen (max canvas width) they move in opposite direction and down the page by 30px towards the player (y position decreases)(x velocity negates)
- If a grid of invaders reaches the player before being shot down, game is over
- Only the arrow keys control player movement

## Screen Recordings and Snapshots
#### Live gameplay recording
https://user-images.githubusercontent.com/89874146/158728350-3f1333bc-26aa-42fd-bf30-e8aa7d60ffbf.mov
#### Gameplay screenshot
![spaceInv-gameplay-sc](https://user-images.githubusercontent.com/89874146/158728388-4816375f-5068-43b8-b57c-83e3768c88c2.png)

## License
Feel free to do whatever you want with this code under the MIT License.

## Helpful Links
- https://css-tricks.com/easing-animations-in-canvas/
- https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript
- https://www.codemahal.com/javascript-and-html5-canvas-game-tutorial-code/
- https://teamtreehouse.com/library/game-class-constructor-method-solution


