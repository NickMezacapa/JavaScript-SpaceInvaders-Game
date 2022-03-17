const scoreElement = document.querySelector('#scoreElement');
const gameOverAlert = document.querySelector('.gameOverAlert');
const gameEndScore = document.querySelector('.gameEndScore');
const restartButton = document.querySelector('.restartButton');
const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

class Player {
    constructor() {
        // initial movement speed
        this.velocity = { 
            x: 0,
            y: 0
        }
        // initial player rotation (when player is in motion, player image will slightly rotate direction of movement)
        this.rotation = 0;
        this.opacity = 1;
        const image = new Image();
        image.src = './images/spacecraft.png';
        image.onload = () => {
            this.image = image;
            // shrink image size while maintaining aspect ratio
            const scale = 0.25;  
            this.width = image.width * scale; 
            this.height = image.height * scale;
            this.position = {
                // place position on bottom center of screen
                x: canvas.width / 2 - this.width / 2, 
                y: canvas.height - this.height - 40
            }
        }
    }
    draw() {
        canvasContext.save();
        canvasContext.globalAlpha = this.opacity;
        canvasContext.translate(
            player.position.x + player.width / 2, 
            player.position.y + player.height / 2
            );
        canvasContext.rotate(this.rotation);
        // Negate values to bring rotation back to initial
        canvasContext.translate(
            -player.position.x - player.width / 2, 
            -player.position.y - player.height / 2
            );
        canvasContext.drawImage(
            this.image, 
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
            )
        canvasContext.restore();
    }
        update() {
            if (this.image) {
            this.draw();
            this.position.x += this.velocity.x;
        }
    }
}

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

class Particle {
    constructor({ position, velocity, radius, color, fades }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.opacity = 0.5;
        this.fades = fades;
    }
    draw() {
        canvasContext.save();
        canvasContext.globalAlpha = this.opacity;
        canvasContext.beginPath();
        canvasContext.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        canvasContext.fillStyle = this.color;
        canvasContext.fill();
        canvasContext.closePath();
        canvasContext.restore();
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (this.fades) this.opacity -= 0.01;
    }
}

class InvaderProjectile {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.width = 6;
        this.height = 12;
    }
    draw() {
        canvasContext.fillStyle = 'red';
        canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Invader {
    constructor({ position }) {
        // initial movement speed
        this.velocity = { 
            x: 0,
            y: 0
        }
        const image = new Image();
        image.src = './images/invader.png';
        image.onload = () => {
            this.image = image;  
            this.width = image.width; 
            this.height = image.height;
            this.position = {
                // place position in middle of screen
                x: position.x,
                y: position.y
            }
        }
    }
    draw() {
        canvasContext.drawImage(
            this.image, 
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
            )
    }
    update({ velocity }) {
        if (this.image) {
            this.draw();
            this.position.x += velocity.x;
            this.position.y += velocity.y;
        }
    }
    shoot(invaderProjectiles) {
        invaderProjectiles.push(
            new InvaderProjectile({
                position: {
                    x: this.position.x + this.width / 2,
                    y: this.position.y + this.height
                },
                velocity: {
                    x: 0,
                    y: 5
                }
            })
        )
    }
}

class InvaderGrid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: 3,
            y: 0
        }
        this.invaders = [];
        // Determine invaderGrid column and row size
        const columns = Math.floor(Math.random() * 10 + 5);
        const rows = Math.floor(Math.random() * 5 + 2);
        const invaderWidth = 30;
        const invaderHeight = 30;
        this.width = columns * invaderWidth;
        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                this.invaders.push(
                    new Invader({
                        position: {
                            x: x * invaderWidth,
                            y: y * invaderHeight
                        }
                     })
                )
            }
        }}
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.position.y;
        this.velocity.y = 0;
        // Invaders should move in opposite direction once they reach maximum canvas width
        if (
            this.position.x + this.width >= canvas.width || 
            this.position.x <= 0
            ) {
            this.velocity.x = -this.velocity.x;
        // When invaders reach max canvas width, invaderGrid will move closer to spaceship by 30px
        // 30px is the height of 1 invader
            this.velocity.y = 30;
        }
    }
}

const player = new Player();
const projectiles = [];
const invaderGrids = [];
const invaderProjectiles = [];
const particles = [];
// Keys object will be used to monitor if the key is pressed or not
const keys = {
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

let frames = 0;
let randomInterval = Math.floor((Math.random() * 500) + 500);
let game = {
    over: false,
    active: true
}
let score = 0;

// Creating background stars
for (let i = 0; i < 75; i++) {
    particles.push(
        new Particle({
        position: {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        },
        velocity: {
            x: 0,
            y: 1
        },
        radius: Math.random() * 2,
        color: 'white'
        })
    )
}
function createParticles ({ object, color, fades }) {
    for (let i = 0; i < 15; i++) {
        particles.push(
            new Particle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            radius: Math.random() * 3,
            color: color || '#BAA0DE',
            fades
            })
        )
    }
}

// animation loop
function animate() {
    if (!game.active) return;
    requestAnimationFrame(animate); 

    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    player.update();
    
    particles.forEach((particle, i) => {

        if (particle.position.y - particle.radius >= canvas.height) {
            particle.position.x = Math.random() * canvas.width;
            particle.position.y = -particle.radius;
        }

        if (particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(i, 1) 
                // Garbage collection for exploded particles 
            }, 0)
        } else particle.update();
    })

    invaderProjectiles.forEach((invaderProjectile, index) => {
        
        if (invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
            // Garbage collection for projectiles that have left the sceen
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
            }, 0)
        } else invaderProjectile.update();

        // Collision detection for spaceship
        if (
            invaderProjectile.position.y + invaderProjectile.height >= player.position.y &&
            invaderProjectile.position.x + invaderProjectile.width >= player.position.x &&
            invaderProjectile.position.x <= player.position.x + player.width
            ) {
            function endGameUI() {
                game.over = true;
                game.active = false;
                player.opacity = 0;
                gameOverAlert.classList.add('activeGameOver');
                gameEndScore.innerHTML = `${score}`;
            }
            setTimeout(() => { // Remove spacecraft on game loss
                invaderProjectiles.splice(index, 1);
                player.opacity = 0;
                game.over = true;
            }, 0)
            setTimeout(() => { // Stop game animation after 1.5s
                invaderProjectiles.splice(index, 1);
                player.opacity = 0;
                game.over = true;
                game.active = false;
            }, 1500) 
            setTimeout(() => { // Show end game UI
                endGameUI();
            }, 1500)
            createParticles({
                object: player,
                color: 'white', 
                fades: false
            })
        }
    })
    
    projectiles.forEach((projectile, index) => {
        // Garbage collection for projectiles already fired
        if (projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0)
        } else projectile.update();
    })

    invaderGrids.forEach((grid, gridIndex) => {
        grid.update();
        // Spawning invader projectiles every 100th frame
        if (frames % 100 === 0 && grid.invaders.length > 0) {
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)] // Selecting random invader
            .shoot(invaderProjectiles);
        }

        grid.invaders.forEach((invader, i) => {
            invader.update( {velocity: grid.velocity} );
            // Detecting for invader collision
            projectiles.forEach((projectile, j) => {
            // If top of projectile < bottom of invader, remove invader
            // If right or left side of projectile > right or left side of invader, remove invader
                if (
                    projectile.position.y - projectile.radius <= 
                    invader.position.y + invader.height 
                    &&
                    projectile.position.x + projectile.radius >=
                    invader.position.x 
                    && 
                    projectile.position.x - projectile.radius <= 
                    invader.position.x + invader.width
                    && 
                    projectile.position.y + projectile.radius >= 
                    invader.position.y
                    ) {
                    setTimeout(() => {
                        const invaderFound = grid.invaders.find(invader2 => invader2 === invader)
                        const projectileFound = projectiles.find(projectile2 => projectile2 === projectile)
                        // Removing invader and projectile
                        // Invader explodes into particles on projectile collision by createParticles()
                        if (invaderFound && projectileFound) {
                            score += 1; // increase score by 1 point
                            scoreElement.innerHTML = score;
                            createParticles({
                               object: invader,
                               fades: true 
                            });
                            grid.invaders.splice(i, 1)
                            projectiles.splice(j, 1)
                        // Accounting for new grid size after invaders are removed
                        if (grid.invaders.length > 0) {
                            const firstInvader = grid.invaders[0];
                            const lastInvader = grid.invaders[grid.invaders.length - 1];
                            
                            grid.width = 
                            lastInvader.position.x - 
                            firstInvader.position.x + 
                            lastInvader.width;
                            
                            grid.position.x = firstInvader.position.x;
                        } else invaderGrids.splice(gridIndex, 1) 
                        // Garbage collection if all invaders have been removed
                        }
                    }, 0)
                }
            })
        })
    })
   
    const playerSpeed = 10;
    const rotationAngle = 0.15;
    function isMovingLeft() {
        return keys.ArrowLeft.pressed && player.position.x >= 0
    }
    function isMovingRight() {
        return keys.ArrowRight.pressed && player.position.x + player.width <= canvas.width
    }
     function moveAndRotateLeft() {
        return  player.velocity.x = -playerSpeed,
                player.rotation = -rotationAngle;
    }
    function moveAndRotateRight() {
        return  player.velocity.x = playerSpeed,
                player.rotation = rotationAngle;
    }  

    if (isMovingLeft()) moveAndRotateLeft();
    else if (isMovingRight()) moveAndRotateRight();  
    else {
        player.velocity.x = 0;
        player.rotation = 0;
    }
    // Spawning a new grid of invaders for every n number of frames
    // Default minimum for new grid generation is 500 frames, max of 1000 frames
        // Random frame number is declared by randomInterval variable
    if (frames % randomInterval === 0) {
        invaderGrids.push(new InvaderGrid);
        // Rengerating randomInterval number so invaderGrids are not added at a constant rate
        randomInterval = Math.floor((Math.random() * 500) + 500);
        frames = 0;
    }

    frames++
}
animate();


addEventListener('keydown', ({ key }) => {
    if (game.over) return;

    switch (key) {
        case 'ArrowLeft': 
            keys.ArrowLeft.pressed = true;
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            break
        case 'ArrowUp':
            projectiles.push(
                new Projectile({
                position: {
                    x: player.position.x + player.width / 2, 
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -10
                }
                })
            )
            break
    }
})
addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'ArrowLeft': 
            keys.ArrowLeft.pressed = false;
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break
    }
})
restartButton.addEventListener('click', () => {
    window.location.reload(true);
})