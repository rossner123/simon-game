let buttonColours = ["red", "blue", "green", "yellow"]
let gamePattern = []
let userClickedPattern = []
let startGame = false
let level = 0

if(window.innerWidth <= 768){
  $("h1").text("Touch the screen to start");
}

updateHighScoreText();

function startGameHandler() {
  if (!startGame) {
    nextSequence();
    startGame = true;
    $("button").attr("disabled", false);

    $(document).off("keypress click touchstart");
  } 
}

function enableStartEvents() {
  $(document).on("keypress click touchstart", () => {
    startGameHandler();
  });
}

enableStartEvents();

function nextSequence() {
    level++
    $("h1").text(`Level ${level}`)

    userClickedPattern = []

    let randomNumber = Math.floor(Math.random() * 4)
    let randomChosenColour = buttonColours[randomNumber]

    gamePattern.push(randomChosenColour)

    playSound(randomChosenColour)

    animatePress($(`#${randomChosenColour}`))

    console.log(gamePattern)
}

$("button").click(function() {
    let userChosenColour = $(this).attr("id")
    userClickedPattern.push(userChosenColour)

    playSound(userChosenColour)
    
    animatePress($(this))

    checkAnswer(userClickedPattern.length - 1)
})

function playSound(name) {
    let audio = new Audio(`./sounds/${name}.mp3`);
    audio.play();
}

function animatePress(btn){
    btn.addClass("pressed")

    setTimeout(() => {
        btn.removeClass("pressed")
    }, 100)
}

function checkAnswer(currentIndex) {
    if (gamePattern[currentIndex] === userClickedPattern[currentIndex]) {

      if (gamePattern.length === userClickedPattern.length) {
        setTimeout(() => {
          nextSequence();
        }, 1000);
      }
   
    } 
    else {
      playSound("wrong")

      if (window.innerWidth <= 768) {
        $("h1").text("Game Over, Touch to Restart")
      }
      else{
         $("h1").text("Game Over, Press Any Key to Restart")
      }

      $("button").attr("disabled", true)

      $("body").addClass("game-over")

      setTimeout(() => {
        $("body").removeClass("game-over")
      }, 200)

      startOver()
    }
}

function startOver() {
    let highScore = parseInt(localStorage.getItem("highScore")) || 0;

    if(highScore < level){
      localStorage.setItem("highScore", level);
    }

    updateHighScoreText();

    level = 0
    gamePattern = []
    startGame = false

    setTimeout(() => {
    enableStartEvents();
  }, 100);
}

function updateHighScoreText() {
  let savedScore = localStorage.getItem("highScore") || 0
  $("#high-score").text(`High Score: ${savedScore}`)
}
