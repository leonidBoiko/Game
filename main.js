const btnStartPause = document.getElementById('btn-start')
const pointOutput = document.getElementById('point-output')
const modal = document.querySelector('.modal')
const resultForm = document.getElementById('result-form')
const timer = document.getElementById('timer')
const btnNewGame = document.getElementById('btn-new-game')
const playField = document.getElementById('play-field')
const btnClearResults = document.getElementById('btn-clear-results')
const playerList = document.getElementById('player-list')
const sizeInput = document.getElementById('size-input')

let point = 0;
let time = 60;
let runTime = -1;

function updateTimer() {
    time--
    const seconds = time < 10 ? '0' + time : time
    timer.value = `00:${seconds}`
    if (time === 0 ) {
        handleWindowResult()
        clearInterval(runTime)
    }
}

const handleFormSubmit = (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget);
    const username = form.get("username");

    let players = JSON.parse(localStorage.getItem('Players'));
    players = players ? players : []

    const elementIndex = players.findIndex(el => el.name == username)
    if (elementIndex != -1) {
        let newArr = [...players]
        newArr[elementIndex] = {...newArr[elementIndex], points:newArr[elementIndex].points.push(point)}
    } else {
        players.push({name:username, points:[point]})
    }
    localStorage.setItem('Players', JSON.stringify(players));

    location.reload()
}

const showListResults = () => {
    const players = JSON.parse(localStorage.getItem('Players'));
    players && players.map(({name, points}) => {
        playerList.innerHTML += `<ul class="list-group"><li class="list-group-item my-1">${name} <span class="d-block pl-2">${points}</span></li> </ul>`
    })
}

function handleClickPlayBlock(element, sizePlayBlock) {
    element.style.width = 0
    element.style.height = 0
    if (sizePlayBlock <= 2) {
        point = point + 2
    } else {
        point++
    }
    pointOutput.value = point
    setTimeout(() => element.remove(), 200)
    setTimeout(() => handleStartGame(1), 150)
}

const setStyleToPlayBlock = (element, sizePlayBlock) => {
    sizePlayBlock = sizePlayBlock == 1 ? 50 : 50 + (sizePlayBlock - 1) * 10
    element.style.width = `${sizePlayBlock}px`
    element.style.height = `${sizePlayBlock}px`
    const randomPosition = Math.floor(Math.random() * 620) 
    element.style.transform = `translateX(${randomPosition}px)`
    element.style.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16)
}

const handleStartGame = (countBlocks) => {
    let sizePlayBlock = sizeInput.value ? sizeInput.value : 1
    for (let i = 0; i < countBlocks; i++) {
        playField.innerHTML += '<div class="play-block rounded shadow m-1"></div>'
    }
    const playBlocks = document.querySelectorAll('.play-block') 
    playBlocks.forEach((element, index) => {
        if (countBlocks == 10) {
            setStyleToPlayBlock(element, sizePlayBlock)
        } else {
            if (index == playBlocks.length -1) {
                setStyleToPlayBlock(element, sizePlayBlock)
            }
        }
        element.addEventListener('click', () => handleClickPlayBlock(element, sizePlayBlock))
    });
}

const handleWindowResult = () => {
    modal.style.zIndex = 99
    modal.style.opacity = 1
    document.querySelector('.modal-body span').innerHTML += `Your score: ${point}`
}

btnStartPause.addEventListener('click', () => {
    sizeInput.setAttribute('disabled', 'true')
    if (runTime == -1) {
        handleStartGame(countBlocks = 10)
        btnStartPause.innerHTML = 'Pause'
        btnStartPause.classList.add('bg-danger')
        const blocker = document.getElementById('play-field-blocker')
        blocker && blocker.remove()
        runTime = setInterval(updateTimer, 1000);
    } else {
        playField.innerHTML += '<div id="play-field-blocker" class="position-absolute w-100 h-100"></div>'
        btnStartPause.innerHTML = 'Start'
        btnStartPause.classList.remove('bg-danger')
        clearInterval(runTime)
        runTime = -1
        return 
    }
})
sizeInput.addEventListener('keypress', (e) => {
    const sizeNum = ['1','2','3','4','5']
    if (!sizeNum.includes(e.key)) {
        e.preventDefault()
    } 
})
btnNewGame.addEventListener('click', () => location.reload())
resultForm.addEventListener('submit', handleFormSubmit)
btnClearResults.addEventListener('click', () => {
    localStorage.clear()
    playerList.innerHTML = ''
})

showListResults()