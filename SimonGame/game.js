var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = [];

var userClickedPattern = [];

var level = 0;

var started = false;

$("body").keydown(function (e) {

  if (!started) {
    started = true;
    nextSequence();
  }
});

$(".btn").click(function () {



  userChosenColour = $(this).attr("id");

  userClickedPattern.push(userChosenColour);

  console.log(userClickedPattern.length);
  console.log(gamePattern.length);

  playSound(userChosenColour);

  animatePress(userChosenColour);

  checkAnswer();


});

function nextSequence() {

  userClickedPattern = [];

  if (started === true) {

    level++;
    $("h1").text("level " + level);

    var randomNumber = Math.floor(Math.random() * 4);

    var randomChosenColour = buttonColours[randomNumber];

    gamePattern.push(randomChosenColour);

    console.log(gamePattern);

    $("#" + randomChosenColour).fadeOut(250).fadeIn(250);

    playSound(randomChosenColour);

  }
}

function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function animatePress(currentColour) {
  $("#" + currentColour).addClass("pressed").delay(100).queue(function () {
    $(this).removeClass("pressed").dequeue();
  });
}

function checkAnswer() {
  if (gamePattern[userClickedPattern.length - 1] === userClickedPattern[userClickedPattern.length - 1]) {

    if (gamePattern.length === userClickedPattern.length) {
      setTimeout(nextSequence, 1000);
    }

  }
  else {
    $("h1").text("Game Over, Press Any Key to Restart");

    $("body").addClass("game-over").delay(200).queue(function () {
      $(this).removeClass("game-over").dequeue();

      playSound(wrong);

      startOver();
    });


  }
}

function startOver() {
  gamePattern = [];
  started = false;
  level = 0;
}