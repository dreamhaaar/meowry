const randomBox = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
];
var playerPattern = [];
var gamePattern = [];
var level = 1;
var difficulty = 1;
var isGameRunning = false;
var isAnimating = false;

let message = "Memory Sequence Game";
function animatePressAdd(box) {
  isAnimating = true;
  $("#" + box).addClass("press-effect");
}

function animatePressRemove(box) {
  $("#" + box).removeClass("press-effect");
  isAnimating = false;
}

function removePress() {
  for (let i = 0; i < playerPattern.length; i++) {
    setTimeout(function () {
      animatePressRemove(playerPattern[i]);
    }, playerPattern.length * 100);
  }
}

function meow() {
  var audio = new Audio("meow.mp3");
  audio.playbackRate = 2.0;
  audio.play();
}

function showPopUp(isWin = true) {
  $(".start").addClass("hide-startbutton");
  $(".main-box").addClass("hide-mainbox");
  $(".popup").addClass("show-popup");
  
  if (isWin) {
    $(".popup-title").html("Congratulations!");
    $(".popup h2").html("You reached");
    $(".level").html("Level " + (level - 1));
  } else {
    $(".popup-title").html("Game Over! ");
    $(".popup h2").html("You made it to");
    $(".level").html("Level " + (level - 1));
  }
}

function closePopUp() {
  $(".start").removeClass("hide-startbutton");
  $(".main-box").removeClass("hide-mainbox");
  $(".popup").removeClass("show-popup");
  message = "Memory Sequence Game";
  $(".title").html(message);
  $(".t").html(message);
  isGameRunning = false;
  isStartClicked();
}

function gameOver() {
  isGameRunning = false;
  message = "Wrong Sequence";
  $(".title").html(message);
  $(".t").html(message);
  var audio = new Audio("wrong.mp3");
  audio.play();
  $(".box").off("click");
  showPopUp(false);
  removePress();
}
function startGame() {
  level = 1;
  difficulty = 1;
  isGameRunning = true;
  $(".start").addClass("hide-startbutton");
  setTimeout(gameSequence, 1000);
}

function gameSequence() {
  playerPattern = [];
  gamePattern = [];
  isAnimating = true;
  $(".title").html("Level " + level);
  $(".t").html("Level " + level);

  for (var i = 0; i < difficulty; i++) {
    let generatedRandomBox;
    do {
      var randomNumber = Math.floor(Math.random() * randomBox.length);
      generatedRandomBox = randomBox[randomNumber];
    } while (gamePattern.includes(generatedRandomBox));
    gamePattern.push(generatedRandomBox);
  }

  for (let i = 0; i < difficulty; i++) {
    setTimeout(function () {
      meow();
      animatePressAdd(gamePattern[i]);
    }, i * 300);
  }
  for (let i = 0; i < gamePattern.length; i++) {
    setTimeout(function () {
      animatePressRemove(gamePattern[i]);
    }, (i + 1) * 300 + gamePattern.length * 100);
  }
  
  setTimeout(function () {
    isAnimating = false;
  }, (difficulty + 1) * 300);

  console.log(gamePattern);
}

function playerSequence() {
  $(".box").off("click").on("click", function () {
      if (!isAnimating && isGameRunning) {
        var idName = this.id;
        playerPattern.push(idName);
        animatePressAdd(idName);
        console.log("player" + playerPattern);
        meow();
        setTimeout(function() {
          animatePressRemove(playerPattern[playerPattern.length - 1]);
        }, 150);
        playerSequenceChecker(playerPattern.length - 1);
      }
    });
}

function playerSequenceChecker(index) {
  console.log("player" + playerPattern.length);
  console.log("game" + gamePattern.length);
  if (playerPattern[index] === gamePattern[index]) {
    if (playerPattern.length === gamePattern.length) {
      $(".box").off("click");
      difficulty++;
      level++;
      setTimeout(function() {
        playerSequence();
        gameSequence();
      }, 800);
    }
  } else {
    isGameRunning = false;
    $(".box").off("click");
    setTimeout(function () {
      gameOver();
    }, 500);
  }
}

function isStartClicked() {
  $(".start-button")
    .off("click")
    .on("click", function () {
      if (!isGameRunning) {
        startGame();
        setTimeout(playerSequence, 1500);
        console.log("start clicked");
      }
    });
}

isStartClicked();
