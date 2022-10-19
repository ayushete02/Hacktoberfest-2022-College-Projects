
function rate(a){

    var rateScore = a;
    
    if (!rateScore) {
      console.log('Sorry');
    }else{
    
      console.log(rateScore);
      document.getElementById('score').innerHTML = `You selected ${rateScore} out of 5`;

    }
    
    const mainContainer = document.querySelector(".container-main")
    const thanksContainer = document.querySelector(".thankyou")
    const submitButton = document.getElementById("submit")
    const rateAgain = document.getElementById("rate-again")
    
    
    submitButton.addEventListener("click", () =>{
    
        thanksContainer.classList.remove("hidden1")
        mainContainer.style.display = "none"
    })
    
    rateAgain.addEventListener("click", () =>{
        thanksContainer.classList.add("hidden1")
        mainContainer.style.display = "block"
    })
    
    
    }
    
    