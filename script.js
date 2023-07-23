url_system = "https://raw.githubusercontent.com/lluisg/GameDevTycoon_BestOption/main/GetInfo/values_system.json"
url_topic = "https://raw.githubusercontent.com/lluisg/GameDevTycoon_BestOption/main/GetInfo/values_topics.json"
url_genre = "https://raw.githubusercontent.com/lluisg/GameDevTycoon_BestOption/main/GetInfo/values_genre.json"
url_multigenre = "https://raw.githubusercontent.com/lluisg/GameDevTycoon_BestOption/main/GetInfo/values_multigenre.json"

// Fetch the JSON data using an HTTP request
fetch(url_system)
  .then(response => response.json())
  .then(data => {
    const el = document.getElementById("cbtns-sys");
    createListButtons(el, Object.keys(data), 'sys-btn');
  })
  .catch(error => {
    console.error('Error fetching the first system:', error);
  });

fetch(url_topic)
.then(response => response.json())
.then(data => {
  const el = document.getElementById("cbtns-tpc");
  createListButtons(el, Object.keys(data), 'tpc-btn');
})
.catch(error => {
  console.error('Error fetching the first topic:', error);
});
  

function createListButtons(parentElement, dataArray, nameClass) {
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

function calculateScores(vsys, vtpc){
  scores = []

  for (const [sysk, sysv] of Object.entries(vsys)) {
    for (const [tpck, tpcv] of Object.entries(vtpc)) {
      // console.log('k:', sysk, ', v:', sysv)
      // console.log('k:', tpck, ', v:', tpcv)
      for (const [genrek, genresys] of Object.entries(sysv['Genres'])) {
        for (const [audk, audsys] of Object.entries(sysv['Audiences'])) {
          genretpc = tpcv['Genres'][genrek]
          audtpc = tpcv['Audiences'][audk]
          // console.log(genrek, genrev)
          // console.log(audk, audv)

          value_score = genresys * genretpc + audsys * audtpc
          scores.push([value_score, sysk, tpck, genrek, audk])
        }
      }
    }
  }

  return scores  
}

function compareFirstValue(a, b) {
  const firstValueA = a[0];
  const firstValueB = b[0];
  
  if (firstValueA < firstValueB) {
    return 1;
  } else if (firstValueA > firstValueB) {
    return -1;
  } else {
    return 0;
  }
}


function removeSameTopicGenre(scores){
  topics_used = []
  unique_games = []

  scores.forEach(element => {
    [scores, sysk, tpck, genrek, audk] = element
    genretopic = genrek +'/'+ tpck
    if (!topics_used.includes(genretopic)){
      unique_games.push(element)
      topics_used.push(genretopic)
    }
  });
  return unique_games
}

function CalculateGames(sys_data, topic_data, genre_data, multigenre_data, statesBtnSys, statesBtnTpc){
  valid_sys = getValidValues(statesBtnSys, sys_data)
  valid_tpc = getValidValues(statesBtnTpc, topic_data)

  scores_games = calculateScores(valid_sys, valid_tpc)
  scores_ord = scores_games.sort(compareFirstValue);
  console.log(scores_ord)

  scores_unique = removeSameTopicGenre(scores_ord)
  // ADD MULTIGENRE
  // ADD SOME RANDOMNESS
  // ADD THE INFO ON THE DEVELOPMENT BELOW
  // CHECK THAT THE EXPAND WORKS

  putScoresWebpage(scores_unique)

}

var maxRecommended;
function searchGames(){
  maxRecommended = document.getElementById('inputRecommend').value;

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
                // .catch(error => {
                //   console.error('Error fetching multigenres:', error);
                // });
            })
            // .catch(error => {
            //   console.error('Error fetching the genres:', error);
            // });
        })
        // .catch(error => {
        //   console.error('Error fetching the topics:', error);
        // });
    })
    // .catch(error => {
    //   console.error('Error fetching the systems:', error);
    // });
}

// ----------------------------------- PUT THE GAMES ON THE WEBSITE -----------------------------------

function putScoresWebpage(scores){
  const parentElement = document.getElementById("container-results");

  // detach previous shown results from parent
  var results = parentElement.getElementsByClassName('result');
  var resultsArray = Array.from(results);
  resultsArray.forEach(function(result) {
    parentElement.removeChild(result);
  });

  // now add the new ones
  scores.forEach((item, ind) => {
    if (ind < maxRecommended){
      var divElement = document.createElement('div');
      divElement.className = 'result';

      var infoElement = document.createElement('div');
      infoElement.className = 'result-info';

      infoElement = addInfo2Table(item, infoElement)

      var appendElement = document.createElement('a');
      appendElement.className = 'expand';
      appendElement.id = 'btne-'+ind;
      appendElement.onclick = function() { expandButtons('dev-phases'+ind, 'btne-'+ind); };

      divElement.appendChild(infoElement);
      divElement.appendChild(appendElement);

      parentElement.appendChild(divElement);
    }
  });
}

function addInfo2Table(info, table){
  [scores, sysk, tpck, genrek, audk] = info

  var score_a = document.createElement('a');
  score_a.className = 'result-punctuation';
  score_a.textContent = scores

  var sys_a = document.createElement('a');
  sys_a.className = 'result-console';
  sys_a.textContent = sysk

  var topic_a = document.createElement('a');
  topic_a.className = 'result-topic';
  topic_a.textContent = tpck

  var genre1_a = document.createElement('a');
  genre1_a.className = 'result-genre1';
  genre1_a.textContent = genrek

  var genre2_a = document.createElement('a');
  genre2_a.className = 'result-genre2';
  genre2_a.textContent = 'Other'

  var aud_a = document.createElement('a');
  aud_a.className = 'result-audience';
  aud_a.textContent = audk


  table.appendChild(score_a)
  table.appendChild(sys_a)
  table.appendChild(topic_a)
  table.appendChild(genre1_a)
  table.appendChild(genre2_a)
  table.appendChild(aud_a)

  return table
}