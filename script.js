const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
const aliensImg = ['img/monster-4.png','img/monster-5.png','img/monster-6.png'];
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
const score = document.querySelector('.score');
let scoreValue;
let alienInterval;
const somDisparo=document.getElementById("somDisparo");
const somExplosao=document.getElementById("somExplosao");
const somMusica=document.getElementById("somMusica");

//movimento da nave
function flyShip(event) {
  //console.log(`${yourShip.style.top} - ${yourShip.style.left}`);
  if(event.key === 'ArrowUp'){
    event.preventDefault();
    moveUp();
  } else if ( event.key === 'ArrowDown' ){
    event.preventDefault();
    moveDown();
  } 
}

// Atirar no inimigo
function fireShip(event) {
   if ( event.key === ' ' ){
    //event.preventDefault();
    somDisparo.play();
    setTimeout(() => {
      fireLaser();
    }, 500);    
  }
}

//função de subir
function moveUp() {
  let topPosition = getComputedStyle(yourShip).getPropertyValue('top');

  if ( topPosition === '0px'){
    return
  } else {
    let position = parseInt(topPosition);
    position -= 50;
    yourShip.style.top = `${position}px`;
  } 
}

//função de descer
function moveDown() {
  let topPosition = getComputedStyle(yourShip).getPropertyValue('top');

  topPosition = parseInt(topPosition);

  console.log(`TOP POS - ${topPosition}`);
  
  if ( topPosition >= 500){
    console.log('ENTROU');
    
    return
  } else {
    let position = topPosition;
    position += 50;
    yourShip.style.top = `${position}px`;
  } 
}

//Funcionalidade de tiro
function fireLaser() {
  let laser = createLaserElement();
  playArea.appendChild(laser);
  moveLaser(laser);
}

function createLaserElement() {
  let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
  let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));

  let newLaser = document.createElement('img');
  newLaser.src= 'img/shoot.png';
  newLaser.classList.add('laser');
  newLaser.style.left = `${xPosition}px`;
  console.log(`left - ${xPosition}px`);
  newLaser.style.top = `${yPosition - 10}px`;
  console.log(`top - ${yPosition - 10}px`);
  return newLaser;
}

function moveLaser(laser) {
  let laserInterval = setInterval(() => {
    let xPosition = parseInt(laser.style.left);
    let aliens = document.querySelectorAll('.alien');

    aliens.forEach(alien => { // comparando se cada alien foi atingido, se sim, troca o src da imagem
      if( checkLaserCollision(laser, alien) ){
        somExplosao.play();
        alien.src = 'img/explosion.png';
        alien.classList.remove('alien');
        alien.classList.add('dead-alien');
        scoreValue += 1;
        score.innerHTML = `Score: ${scoreValue}`;
        laser.remove();
      }
    });

    if ( xPosition === 340 ){
      laser.remove();
    } else {
      laser.style.left = `${xPosition + 8}px`;
    }
  }, 10);
}

//função para criar inimigos aleatórios
function createAliens() {
  let newAlien = document.createElement('img');
  let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)];
  newAlien.src = alienSprite;
  newAlien.classList.add('alien');
  newAlien.classList.add('alien-transition');
  newAlien.style.left = '370px';
  newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
  playArea.appendChild(newAlien);
  moveAlien(newAlien);
}

//função para movimentar os inimigos
function moveAlien(alien) {
  let moveAlienInterval = setInterval(() => {
    let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));

    if ( xPosition <= 50 ){
      if ( Array.from(alien.classList).includes('dead-alien') ){
        alien.remove();
      } else {
        gameover();
      }
    } else{
      alien.style.left = `${xPosition - 4}px`;
    }

  }, 30);
}

//função para colisão
function checkLaserCollision(laser, alien) {
  let laserTop = parseInt(laser.style.top);
  let laserLeft = parseInt(laser.style.left);
  let laserBottom = laserTop - 20;

  let alienTop = parseInt(alien.style.top);
  let alienLeft = parseInt(alien.style.left);
  let alienBottom = alienTop - 70;

  if ( laserLeft != 340 && laserLeft + 40 >= alienLeft){
    if ( laserTop <= alienTop && laserTop >= alienBottom){
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

startButton.addEventListener('click', (event) =>{
  playGame();
})

//inicio do jogo
function playGame() {
  somMusica.play();
  startButton.style.display='none';
  instructionsText.style.display='none';
  scoreValue = 0;
  score.innerHTML =`Score: ${scoreValue}`;
  score.style.display='block';
  window.addEventListener('keydown', flyShip);
  window.addEventListener('keydown', fireShip);
  alienInterval = setInterval(() => {
    createAliens();
  }, 2000);

}

//função de game over
function gameover() {
  somMusica.pause();
  window.removeEventListener('keydown', flyShip);
  clearInterval(alienInterval);
  let aliens = document.querySelectorAll('.alien');
  aliens.forEach(alien => {
    alien.remove();
  });
  let lasers = document.querySelectorAll('.laser');
  lasers.forEach(laser => {
    laser.remove();
  });
  setTimeout(() => {
    alert('Game Over');
    yourShip.style.top = '250px';
    startButton.style.display = 'block';
    instructionsText.style.display = 'block'; 
  });
}