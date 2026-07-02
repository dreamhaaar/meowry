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
var highScore = localStorage.getItem("meowry_highscore") || 0;

function animatePressAdd(box) {
  $("#" + box).addClass("press-effect");
}

function animatePressRemove(box) {
  $("#" + box).removeClass("press-effect");
}

function meow() {
  var audio = new Audio("meow.mp3");
  audio.playbackRate = 2.0;
  audio.play().catch(function (error) {
    console.log("Audio playback failed or was interrupted:", error);
  });
}

function showPopUp(isWin = true) {
  $(".start").addClass("hide-startbutton");
  $(".popup").addClass("show-popup");
  
  if (isWin) {
    $(".popup-title").html("Congratulations! 🎉");
    $(".popup h2").html("You reached");
    $(".level").html("Level " + level);
  } else {
    $(".popup-title").html("Game Over! 😿");
    $(".popup h2").html("You made it to");
    $(".level").html("Level " + level);
  }
}

function closePopUp() {
  $(".start").removeClass("hide-startbutton");
  $(".popup").removeClass("show-popup");
  
  isGameRunning = false;
  isAnimating = false;
  level = 1;
  difficulty = 1;
  
  updateScoreboard();
  updateStatus("READY", "ready");
  $(".main-box").addClass("grid-locked");
}

function gameOver() {
  isGameRunning = false;
  isAnimating = false;
  
  var audio = new Audio("wrong.mp3");
  audio.play().catch(function (error) {
    console.log("Audio playback failed or was interrupted:", error);
  });
  
  showPopUp(false);
}

function startGame() {
  level = 1;
  difficulty = 1;
  isGameRunning = true;
  isAnimating = true;
  playerPattern = [];
  gamePattern = [];
  
  $(".start").addClass("hide-startbutton");
  $(".main-box").removeClass("grid-locked");
  
  updateScoreboard();
  
  setTimeout(gameSequence, 600);
}

function gameSequence() {
  playerPattern = [];
  isAnimating = true;
  $(".main-box").addClass("grid-locked");
  updateStatus("WATCHING...", "watching");

  // Generate sequence (allowing duplicates to avoid the infinite loop bug at level 17+)
  gamePattern = [];
  for (var i = 0; i < difficulty; i++) {
    var randomNumber = Math.floor(Math.random() * randomBox.length);
    gamePattern.push(randomBox[randomNumber]);
  }

  const stepInterval = 600;
  const flashDuration = 400;

  // Flash sequence with precise timing
  gamePattern.forEach(function (box, i) {
    setTimeout(function () {
      if (isGameRunning) {
        meow();
        animatePressAdd(box);
      }
    }, i * stepInterval);

    setTimeout(function () {
      if (isGameRunning) {
        animatePressRemove(box);
      }
    }, i * stepInterval + flashDuration);
  });

  // Enable player clicks precisely after the last tile finishes flashing
  setTimeout(function () {
    if (isGameRunning) {
      isAnimating = false;
      $(".main-box").removeClass("grid-locked");
      updateStatus("YOUR TURN!", "player-turn");
    }
  }, difficulty * stepInterval);
}

function playerSequenceChecker(index) {
  if (playerPattern[index] === gamePattern[index]) {
    // If they completed the entire pattern for this level
    if (playerPattern.length === gamePattern.length) {
      isAnimating = true;
      $(".main-box").addClass("grid-locked");
      
      // Update high score
      if (level > highScore) {
        highScore = level;
        localStorage.setItem("meowry_highscore", highScore);
      }

      difficulty++;
      level++;
      
      updateScoreboard();
      updateStatus("CORRECT!", "correct");

      setTimeout(function () {
        if (isGameRunning) {
          gameSequence();
        }
      }, 1000);
    }
  } else {
    // Incorrect box clicked
    isAnimating = true;
    $(".main-box").addClass("grid-locked");
    updateStatus("WRONG!", "wrong");
    
    setTimeout(function () {
      gameOver();
    }, 600);
  }
}

function updateScoreboard() {
  $("#current-level").html(level);
  $("#high-score").html(highScore);
}

function updateStatus(text, className) {
  var pill = $("#status-pill");
  pill.html(text);
  pill.removeClass("ready watching player-turn correct wrong");
  pill.addClass(className);
}

// Bind handlers on page load
$(document).ready(function () {
  updateScoreboard();
  updateStatus("READY", "ready");
  $(".main-box").addClass("grid-locked"); // Lock grid before start

  // Grid box clicks
  $(".box").on("click", function () {
    if (isGameRunning && !isAnimating) {
      var idName = this.id;
      playerPattern.push(idName);
      
      animatePressAdd(idName);
      meow();
      
      setTimeout(function () {
        animatePressRemove(idName);
      }, 150);
      
      playerSequenceChecker(playerPattern.length - 1);
    }
  });

  // Start Button Click
  $(".start-button").on("click", function () {
    if (!isGameRunning) {
      startGame();
    }
  });
});

