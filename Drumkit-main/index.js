
/*

This is very bad code
document.querySelectorAll("button")[0].addEventListener("click",handleclick);
document.querySelectorAll("button")[1].addEventListener("click",handleclick);
document.querySelectorAll("button")[2].addEventListener("click",handleclick);
document.querySelectorAll("button")[3].addEventListener("click",handleclick);
document.querySelectorAll("button")[4].addEventListener("click",handleclick);
document.querySelectorAll("button")[5].addEventListener("click",handleclick);
document.querySelectorAll("button")[6].addEventListener("click",handleclick);*/
var len=document.querySelectorAll(".drum").length-1;
for(var i=0;i<=6;i++){
  document.querySelectorAll("button")[i].addEventListener("click",handleclick);
}
function handleclick(){
    var playit=this.innerHTML;
    makesound(playit);
    buttonAnimation(playit);

  }
  function makesound(key){
    switch (key) {
      case "w":
        var tom1= new Audio("sounds/tom-1.mp3");
        tom1.play();
        break;
      case "a":
          var tom2=new Audio("sounds/tom-2.mp3");
          tom2.play();
          break;
      case 's':
         var tom3=new Audio("sounds/tom-3.mp3");
         tom3.play();
         break;
      case "d":
        var tom4=new Audio("sounds/tom-4.mp3");
        tom4.play();
        break;
      case "j":
          var kick = new Audio("sounds/kick-bass.mp3");
          kick.play();
          break;
      case "k":
           var snare= new Audio("sounds/snare.mp3");
           snare.play();
           break;
      case "l":
           var crash=new Audio("sounds/crash.mp3");
           crash.play();
           break;
         default:

    }

  }

    document.addEventListener("keypress",function(event){
      makesound(event.key);
      buttonAnimation(event.key);
    })
  function buttonAnimation(curentkey){
    document.querySelector("."+curentkey).classList.add("pressed");
    setTimeout(function(){document.querySelector("."+curentkey).classList.remove("pressed")},100)
  }
