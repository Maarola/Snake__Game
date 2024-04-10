

const canvas = document.querySelector('canvas')
const h1 = document.querySelector('h1')
const ctx = canvas.getContext("2d")

const scoreValue = document.querySelector('.score__value')
const scoreText = document.querySelector(".score")
const finalScore = document.querySelector('.final__score > span')
const bestScore = document.querySelector(".best__score-value")
const menu = document.querySelector(".menu__screen")
const menuStart = document.querySelector(".menu__start")
const buttonPlay = document.querySelector(".btn__play")
const buttonPlayStart = document.querySelector(".btn__play-start")
const speed = document.querySelector(".snake__speed")
const speedValue = document.querySelector(".speed__value")
const imgLogo = document.querySelector(".img__logo")

const audio__eating = new Audio("../audio/eating.mp3")
const audio__move = new Audio("../audio/move.mp3")

const size = 30

let snake = [
    {x: 270, y: 240},
    {x: 300, y: 240},
]

let direction, loopID, bestScoreATT = "00"

const score = () => {

    let pontuacaoAtual = parseInt(scoreValue.innerText);
    let melhorPontuacaoAtual = parseInt(bestScore.innerText);

    let novaPontuacao = pontuacaoAtual + randomNumber(7, 10);

    scoreValue.innerText = novaPontuacao;

    if (novaPontuacao > melhorPontuacaoAtual) {
        bestScoreATT = novaPontuacao;
    }


}

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)

}

const randomPosition = () =>{
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

const randomColor = () => {
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 155)
    const blue = randomNumber(0, 255)

    return `rgb(${red},${green},${blue})` 
}

const food = {
    x : randomPosition(),
    y : randomPosition(),
    color: randomColor(),
}

const drawSnake = () =>{

    const color = "#086856"
    ctx.fillStyle = color

    
    snake.forEach((position, index) => {

        if (index == snake.length -1){
            ctx.fillStyle = "#005344"
        }


        ctx.shadowColor = "#00000070"
        ctx.shadowBlur = 5
        ctx.fillRect(position.x, position.y, size, size)
        
    })
}

const moveSnake = () =>{

    if(!direction) return
    const head = snake[snake.length - 1]

    snake.shift()

    if (direction == "right"){
        snake.push({x: head.x + size, y: head.y})
    }if (direction == "left"){
        snake.push({x: head.x - size, y: head.y})
    }if (direction == "down"){
        snake.push({x: head.x, y: head.y + size})
    }if (direction == "up"){
        snake.push({x: head.x, y: head.y - size})
    }

}

const drawFood = () => {

    const { x, y , color} = food

    ctx.shadowColor = color
    ctx.shadowBlur = 15
    ctx.fillStyle = color
    ctx.fillRect( x, y, size, size)
    ctx.shadowBlur = 0
}

const drawGrid = () =>{
    ctx.lineWidth = 1
    ctx.strokeStyle = "#36363619"

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}

const checkEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y){
        score()
        snake.push(head)
        audio__eating.play()

        let x = randomPosition()
        let y = randomPosition()

        while (snake.find((position) => position.x == x && position.y == y )){
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
        food.color = randomColor()
    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1]
    const wallLimit = canvas.width - size
    const neckIndex = snake.length - 2

    const WallCollision = head.x < 0 || head.x > wallLimit || head.y < 0 || head.y > wallLimit

    const selfCollision = snake.find((position, index) =>{
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if (WallCollision || selfCollision){
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    scoreText.style.display = "none"
    finalScore.innerText = scoreValue.innerText
    canvas.style.filter = "blur(3px)" 
    imgLogo.style.display = "none"

    bestScore.innerText = bestScoreATT
    
    speed.disabled = false
}

const gameStart = () => {

    canvas.style.filter = "blur(3px)"
}
const gameLoop = () =>{

    ctx.clearRect(0, 0, 600, 600)
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    checkCollision()  



    speedValue.innerText = speed.value

    let velocidade = speed.value

    loopID = setTimeout(() =>{
        gameLoop()
    }, velocidade)

}

gameLoop()
gameStart()


document.addEventListener("keydown", ({key}) =>{
    if(key == "ArrowRight" && direction != "left"){
        audio__move.play()
        setTimeout(() => {
            direction = "right"
        }, 150)
    }
    if(key == "ArrowLeft" && direction != "right"){
        audio__move.play()       
        setTimeout(() => {
            direction = "left"
        }, 150)
    }
    if(key == "ArrowDown" && direction != "up"){
        audio__move.play()      
        setTimeout(() => {
            direction = "down"
        }, 100)
    }
    if(key == "ArrowUp" && direction != "down"){
        audio__move.play()  
        setTimeout(() => {
            direction = "up"
        }, 100)
    }
})


buttonPlay.addEventListener("click", () => {
    scoreValue.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"
    scoreText.style.display = "flex"

    speed.disabled = true
    direction = "right"

    snake = [
        {x: 270, y: 240},
        {x: 300, y: 240},
    ]

})

buttonPlayStart.addEventListener("click", () => {
    menuStart.style.display = "none"
    scoreText.style.display = "flex"
    canvas.style.filter= "none"
    imgLogo.style.display = "none"
    

    direction = "right"

    speed.disabled = true
})

