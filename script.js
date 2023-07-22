url_system = "https://raw.githubusercontent.com/lluisg/GameDevTycoon_BestOption/main/GetInfo/values_system.json"
url_topic = "https://raw.githubusercontent.com/lluisg/GameDevTycoon_BestOption/main/GetInfo/values_topics.json"
url_genre = "https://raw.githubusercontent.com/lluisg/GameDevTycoon_BestOption/main/GetInfo/values_genre.json"
url_multigenre = "https://raw.githubusercontent.com/lluisg/GameDevTycoon_BestOption/main/GetInfo/values_multigenre.json"

// Fetch the JSON data using an HTTP request
fetch(url_system)
  .then(response => response.json())
  .then(data => {
    const el = document.getElementById("cbtns-sys");
    createListItems(el, Object.keys(data), 'sys-btn');
  })
  .catch(error => {
    console.error('Error fetching the first system:', error);
  });

fetch(url_topic)
.then(response => response.json())
.then(data => {
  const el = document.getElementById("cbtns-tpc");
  createListItems(el, Object.keys(data), 'tpc-btn');
})
.catch(error => {
  console.error('Error fetching the first topic:', error);
});
  

function createListItems(parentElement, dataArray, nameClass) {
  dataArray.forEach(item => {
    var btnElement = document.createElement('button');

    btnElement.addEventListener("click", () => {
      btnElement.classList.toggle("on"); // Toggle the "on" class on click
    });
    btnElement.className = 'btn-select';
    btnElement.classList.add(nameClass)
    btnElement.id = item
    btnElement.textContent = item
    parentElement.appendChild(btnElement);
  });
}

function expandButtons(elementID, currentElementID){
  let el = document.getElementById(elementID)
  let btn = document.getElementById(currentElementID)
  isHidden = el.classList.contains('hidden')
  if (isHidden){
    el.classList.remove('hidden')
    btn.innerHTML = 'hide'
  }else{
    el.classList.add('hidden')
    btn.innerHTML = 'expand'
  }
}

// ----------------------------------- CALCULATE THE BEST GAMES TO DEVELOP -----------------------------------

function saveButtonStates(className) {
  // saves the state of the buttons
  const buttons = document.querySelectorAll('.'+className);
  const buttonStates = {};

  buttons.forEach((button) => {
    const buttonId = button.id;
    const isToggledOn = button.classList.contains('on');
    buttonStates[buttonId] = isToggledOn;
  });

  // console.log(buttonStates);
  return buttonStates
}

function getValidValues(states, data){
  var valid = {};
  for (const [btnk, btnv] of Object.entries(states)) {
    if (btnv == true){
      valid[btnk] = data[btnk]
    }
  }
  return valid
}

function calculateBestGames(vsys, vtpc){

  for (const [sysk, sysv] of Object.entries(vsys)) {
    console.log('k:', sysk, ', v:', sysv)
  }

  // genre sys * genre tpc + aud sys * aud tpc


  // system topic 
  // audience genre 

  
}

function CalculateGames(sys_data, topic_data, genre_data, multigenre_data, statesBtnSys, statesBtnTpc){
  valid_sys = getValidValues(statesBtnSys, sys_data)
  valid_tpc = getValidValues(statesBtnTpc, topic_data)

  best_games = calculateBestGames(valid_sys, valid_tpc)
}


function searchGames(){
  statesBtnSys = saveButtonStates('sys-btn')
  statesBtnTpc = saveButtonStates('tpc-btn')

  fetch(url_system)
    .then(response => response.json())
    .then(sys_data => {
      fetch(url_topic)
        .then(response => response.json())
        .then(topic_data => {
          fetch(url_genre)
            .then(response => response.json())
            .then(genre_data => {
              fetch(url_multigenre)
                .then(response => response.json())
                .then(multigenre_data => {

                  CalculateGames(sys_data, topic_data, genre_data, multigenre_data, statesBtnSys, statesBtnTpc)

                })
                .catch(error => {
                  console.error('Error fetching multigenres:', error);
                });
            })
            .catch(error => {
              console.error('Error fetching the genres:', error);
            });
        })
        .catch(error => {
          console.error('Error fetching the topics:', error);
        });
    })
    .catch(error => {
      console.error('Error fetching the systems:', error);
    });
}