//iniciando o trabalho com canvas!
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const numscore = document.querySelector(".numscore--value")
const finalScore = document.querySelector(".finalScore > span")
const menu = document.querySelector(".menu_screen")
const buttonPlay = document.querySelector(".btn_play")

const incrementScore = () => {
    numscore.innerText = +numscore.innerText+ (0.5)
}

//tamanho de cada quadradinho de array
const size = 30;

//variaveis de direção e de loop
let direction;
let loopId;

//background-music

    const backgroundMusic = new Audio('../assets/15 - sans..mp3')
    backgroundMusic.play()

//variavel de audio e gerador de numeros aleatorios
const audio = new Audio('../assets/roblox-eating-sound-effect-nom-nom-nom.mp3')
const randomNumber = (min, max) => {
    return Math.round(Math.random()* (max - min) + min )
}

//gerador de posições aleatórias
const randomPosition = () => {
    const number = randomNumber(0, canvas.width-size)
    return Math.round(number/30)*30
}

//gerador de cores aleatórias
const randomColor = () => {
    const red = randomNumber(0,255)
    const green = randomNumber(0,255)
    const blue = randomNumber(0,255)

    return `rgb(${red}, ${green}, ${blue})`
}

//valores da comida
const comida = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
};

//função para desenhar a comida
const drawFood = () => {
     const { x , y , color } = comida

    ctx.shadowColor = color,
    ctx.shadowBlur = 6,
    ctx.fillStyle = color,
    ctx.fillRect(x, y, size,size),
    ctx.shadowBlur = 0}

//array da cobra
let snake = [
    {x : 300, y: 300},
];

//função de desenhar a cobra baseado em cada array, sendo o ultimo elemento com cor cinza.
const drawSnake = () =>  {
 ctx.fillStyle = "#46FF23"

  snake.forEach((posição, index) => {
    if(index == snake.length-1){
        ctx.fillStyle = "#51FF2C"
    }
    ctx.fillRect(posição.x, posição.y, size, size)
  })

}

//função de mover a cobra baseado em shift(retirar o primeiro elemento) e push(colocar um elemento no fim)
const moveSnake = () => {

if(!direction) return
    const head = snake[snake.length -1]

    if(direction == "left"){
        snake.push({x : head.x - size, y: head.y})
    } 
    if(direction == "right"){
        snake.push({x : head.x + size, y: head.y})
    } 
    if(direction == "down"){
        snake.push({x : head.x , y: head.y + size})
    } 
    if(direction == "up"){
        snake.push({x : head.x , y: head.y - size})
    } 
    
    snake.shift()
}

//função de desenhar o quadriculado
const drawGrid = () => {
    ctx.lineWidth = 1,
    ctx.strokeStyle = "#191919";

    for (let i = 30; i < canvas.width; i += 30){
    ctx.beginPath()
    ctx.lineTo(i, 0)
    ctx.lineTo(i,600)
    ctx.stroke()

    ctx.beginPath()
    ctx.lineTo(0, i)
    ctx.lineTo(600,i)
    ctx.stroke()
    }

    
}

//Função de mapear os eventos do teclado
document.addEventListener("keydown", ({key}) => {
    
if(key == "ArrowRight" && direction != "left"){
    direction = "right"
}

if(key == "ArrowLeft" && direction != "right"){
    direction = "left" 
}

if(key == "ArrowDown" && direction != "up"){
    direction = "down"
}

if(key == "ArrowUp" && direction != "down"){
    direction = "up"
}
})

//Instruções de comportamento do botão "Jogar novamente"
buttonPlay.addEventListener("click" , () => {
 numscore.innerText = "00"
 menu.style.display = "none"
 canvas.style.filter = "none"

 snake = [{x : 300, y: 300},];
})


//função para checar se a cobra "comeu" a comida
const checkEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == comida.x && head.y == comida.y){
    
    snake.push(head),
    incrementScore(),
    audio.play(),
   
        comida.x = randomPosition(),
        comida.y = randomPosition(),
        comida.color = randomColor()

        let x = randomPosition()
        let y = randomPosition()

        while(snake.find((position) => position.x == x && position.y ==y)){
            x = randomPosition()
            y = randomPosition()

        }
        comida.x = x
        comida.y = y
        comida.color = randomColor()
        incrementScore()
    }
}

//Função para checar a colisão
const checkCollision = () =>{
    const head = snake[snake.length-1]
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2
    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0|| head.y > canvasLimit
    const selfCollision = snake.find((position,index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })
    if(wallCollision||selfCollision){
        gameOver()
    }

}

//Função da tela de game over
const gameOver = () => {
    direction = undefined
    canvas.style.filter = "blur(2px)"; 
    menu.style.display = "flex";
    finalScore.innerText = numscore.innerText
    backgroundMusic.pause()
    
    
     
}

//Função de começar o loop do jogo
const gameLoop = () => {
    clearInterval(loopId)
    ctx.clearRect(0, 0, 600, 600)
    backgroundMusic.play()

    moveSnake()
    drawSnake()
    drawGrid()
    drawFood()
    checkEat()
    checkCollision()
   

    loopId = setTimeout(() =>{
        gameLoop()
    }, 300)
    
}

//hora de chamar as funções!
gameLoop()


