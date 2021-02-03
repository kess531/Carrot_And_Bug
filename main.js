'use strict'

const carrot_size = 80;
const carrot_count = 10;
const bug_count = 10;
const Game_Duration_sec = 20;

const field = document.querySelector('.game__field');
const fieldRect= field.getBoundingClientRect();
const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');
const popup = document.querySelector('.pop-up');
const popupText =document.querySelector('.pop-up__message');
const popupRefresh = document.querySelector('.pop-up__refresh');

//sound
const carrotSound = new Audio('./sound/carrot_pull.mp3');
const bugSound = new Audio('./sound/bug_pull.mp3');
const alertSound = new Audio('./sound/alert.wav');
const backgroundSound = new Audio('./sound/bg.mp3');
const winSound = new Audio('./sound/game_win.mp3');


let started = false;
let score = 0;
let timer = undefined;

field.addEventListener('click',onFiledClick);

gameBtn.addEventListener('click',()=>{
   
    if(started){
        stopGame();
    }
    else{
        startGame();
    }
    


});



popupRefresh.addEventListener('click',()=>{
startGame();
hidePopup();

});




function startGame(){
    started=true;
    initGame();
    showStopButton();
    showTimerAndScore();
    startGameTimer();
    playSound(backgroundSound);
    
}

function stopGame(){
    started=false;
    stopGameTimer();
    hidegameButton();
    showPopUpWithText('Replay?');
    playSound(alertSound);
    stopSound(backgroundSound);

}

function finishGame(win){
    started= false;
    hidegameButton();
    if(win){
        playSound(winSound);
    }
    else {
        playSound(bugSound);
    }
    stopGameTimer();
    stopSound(backgroundSound);
    showPopUpWithText(win?'You Won' : 'You Lost');
    
    
    }

    function onFiledClick(event){
    
        if(!started){
            return;
        }
       const target = event.target;
       if(target.matches('.carrot')){
           //당근!!
        target.remove();
        score++;
        playSound(carrotSound);
        updateScoreBoard();
        if(score===carrot_count){
            
            finishGame(true);
        }
       }
       else if(target.matches('.bug')){
           //벌레!!
           
           finishGame(false);
       }
    }
function playSound(sound){
        sound.play();
    }

function stopSound(sound){
        sound.pause();
    }


function startGameTimer(){
    let remainingTimeSec = Game_Duration_sec;
    updateTimerText(remainingTimeSec);
    timer=setInterval(() => {
    if(remainingTimeSec<=0)
    {
        clearInterval(timer);
        finishGame(score===carrot_count);
        return;
    }
    updateTimerText(--remainingTimeSec);
    
    }, 1000);
}

function updateTimerText(time){
    const min = Math.floor(time/60);
    const sec = time%60;
    gameTimer.innerHTML=`${min}:${sec}`
}

function showPopUpWithText(text){
    popupText.innerHTML=text;
    popup.classList.remove('pop-up--hide');
}
function hidePopup(){
    popup.classList.add('pop-up--hide');
}


function showTimerAndScore(){
    gameTimer.style.visibility='visible';
    gameScore.style.visibility='visible';
}

function stopGameTimer(){
    clearInterval(timer);
}

function initGame(){
    score=0;
    //벌레와 당근을 생성한뒤 fieldRect에 추가해둠
    field.innerHTML='';
    gameScore.innerHTML=carrot_count;
    addItem('carrot',carrot_count,'img/carrot.png');
    addItem('bug',bug_count,'img/bug.png');
    
}




function updateScoreBoard(){
    gameScore.innerText = carrot_count-score;
}
function addItem(className,count,imgPath){

    const x1=0;
    const y1=0;
    const x2= fieldRect.width-carrot_size;
    const y2= fieldRect.height-carrot_size;

    for(let i=0; i<count; i++ ){
        const item = document.createElement('img');
        item.setAttribute('class',className);
        item.setAttribute('src',imgPath);
        item.style.position='absolute';

        const x = randomNumber(x1, x2);
        const y = randomNumber(y1,y2);
        item.style.left =`${x}px`;
        item.style.top =`${y}px`;
        field.appendChild(item);
    }
}


function randomNumber(min,max){
    return Math.random()*(max-min) + min;
}


// 버튼 함수
function showStopButton(){
    const icon = document.querySelector('.fas');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    gameBtn.style.visibility='visible';
}



function hidegameButton(){
    gameBtn.style.visibility='hidden';
}