url_platforms_genres = "https://raw.githubusercontent.com/lluisg/GameDevTycoon_BestOption/main/PrepareData/values_platform_genres.json"
url_platforms_audiences = "https://raw.githubusercontent.com/lluisg/GameDevTycoon_BestOption/main/PrepareData/values_platform_audiences.json"
url_topics_genres = "https://raw.githubusercontent.com/lluisg/GameDevTycoon_BestOption/main/PrepareData/values_topics_genres.json"
url_topics_audiences = "https://raw.githubusercontent.com/lluisg/GameDevTycoon_BestOption/main/PrepareData/values_topics_audiences.json"
url_genres_development = "https://raw.githubusercontent.com/lluisg/GameDevTycoon_BestOption/main/PrepareData/values_genre_development.json"

// Fetch the JSON data using an HTTP request
fetch(url_platforms_genres)
  .then(response => response.json())
  .then(data => {
    const el = document.getElementById("cbtns-sys");
    createListButtons(el, Object.keys(data), 'sys-btn');
  })
  .catch(error => {
    console.error('Error fetching the first system:', error);
  });

fetch(url_topics_genres)
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


function expandButtons(elementID, currentElementID, force_hide=false){
  let el = document.getElementById(elementID)
  let btn = document.getElementById(currentElementID)
  isHidden = el.classList.contains('hidden')
  if (isHidden){
    if (force_hide == false ){ // force_hide makes it hide anyway
      el.classList.remove('hidden')
      if (screenWidth < 430) {
        btn.textContent = 'H'
      }else{
        btn.textContent = 'hide'
      }  
    }
  }else{
    el.classList.add('hidden')
    if (screenWidth < 430) {
      btn.textContent = 'E'
    }else{
      btn.textContent = 'expand'
    }  
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


function calculateScores(vsys_genre, vsys_aud, vtpc_genre, vtpc_aud){
  scores = []

  for (const [platform, platform_genre_values] of Object.entries(vsys_genre)) {
    for (const [topic, topic_genre_values] of Object.entries(vtpc_genre)) {
      platform_audience_values = vsys_aud[platform]
      topic_audience_values = vtpc_aud[topic]

      for (const [genre, plat_genre_value] of Object.entries(platform_genre_values)) {
        for (const [aud, plat_aud_value] of Object.entries(platform_audience_values)) {
          topic_genre_value = topic_genre_values[genre]
          topic_aud_value = topic_audience_values[aud]

          let value_score = plat_genre_value * topic_genre_value * topic_aud_value
          value_score = value_score.toFixed(2)
          let value_sell = value_score * plat_aud_value
          value_sell = value_sell.toFixed(2)
          scores.push([value_score, value_sell, platform, topic, genre, aud])
        }
      }
    }
  }
  return scores  
}


function orderScoresGames(a, b) {
  const firstValueA = a[0];
  const firstValueB = b[0];
  
  const secondValueA = a[1];
  const secondValueB = b[1];
  
  if (firstValueA < firstValueB) {
    return 1;
  } else if (firstValueA > firstValueB) {
    return -1;
  } else {
    // If the first values are equal, compare the second values
    if (secondValueA < secondValueB) {
      return 1;
    } else if (secondValueA > secondValueB) {
      return -1;
    } else {
      return 0;
    }
  }
}


function removeSameTopicGenre(scores){
  topics_used = []
  unique_games = []
  scores.forEach(element => {
    [score1, score2, platform, topic, genre, aud] = element
    genretopic = genre +'/'+ topic
    if (!topics_used.includes(genretopic)){
      unique_games.push(element)
      topics_used.push(genretopic)
    }
  });
  return unique_games
}


function shuffleWithinGroups(arrayOfArrays) {
  function shuffleArray(array) {
    // Fisher-Yates (Knuth) Shuffle Algorithm
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Group elements based on their first and second values
  const groupedElements = {};
  arrayOfArrays.forEach(arr => {
    const key = arr.slice(0, 2).toString();
    if (!groupedElements[key]) {
      groupedElements[key] = [];
    }
    groupedElements[key].push(arr);
  });

  // Shuffle the first array within each group
  Object.values(groupedElements).forEach(group => {
    shuffleArray(group);
  });

  // Combine the shuffled groups back together
  const shuffledArray = [];
  Object.values(groupedElements).forEach(group => {
    shuffledArray.push(...group);
  });

  return shuffledArray;
}


function CalculateGames(plat_genre_data, plat_aud_data, topic_genre_data, topic_aud_data, genre_dev_data, statesBtnSys, statesBtnTpc){
  valid_plat_genre = getValidValues(statesBtnSys, plat_genre_data)
  valid_plat_aud = getValidValues(statesBtnSys, plat_aud_data)
  valid_tpc_genre = getValidValues(statesBtnTpc, topic_genre_data)
  valid_tpc_aud = getValidValues(statesBtnTpc, topic_aud_data)

  let scores_games = calculateScores(valid_plat_genre, valid_plat_aud, valid_tpc_genre, valid_tpc_aud)
  let scores_ord = scores_games.sort(orderScoresGames);
  let scores_unique = removeSameTopicGenre(scores_ord) // only keep the first with the same topic/genre
  let scores_shuffled = shuffleWithinGroups(scores_unique); // shuffle the elements with the same score

  addScoresWebpage(scores_shuffled, genre_dev_data)

  // hide all the upper lists
  expandButtons('cbtns-sys', 'btne-sys', true)
  expandButtons('cbtns-tpc', 'btne-tpc', true)
}


var maxRecommended;
function searchGames(){
  maxRecommended = document.getElementById('inputRecommend').value;



  statesBtnSys = saveButtonStates('sys-btn')
  statesBtnTpc = saveButtonStates('tpc-btn')

  fetch(url_platforms_genres)
    .then(response => response.json())
    .then(platform_genre_data => {
      fetch(url_platforms_audiences)
        .then(response => response.json())
        .then(platform_audience_data => {
          fetch(url_topics_genres)
            .then(response => response.json())
            .then(topic_genre_data => {
              fetch(url_topics_audiences)
                .then(response => response.json())
                .then(topic_audience_data => {
                  fetch(url_genres_development)
                    .then(response => response.json())
                    .then(genre_dev_data => {
    
                      CalculateGames( platform_genre_data, 
                                      platform_audience_data, 
                                      topic_genre_data, 
                                      topic_audience_data, 
                                      genre_dev_data,
                                      statesBtnSys, 
                                      statesBtnTpc)
    
                    })
                })
            })
        })
    })
}


// ----------------------------------- PUT THE GAMES ON THE WEBSITE -----------------------------------
function putScore(ind, item, parentElement){
  var divElement = document.createElement('div');
  divElement.className = 'results';

  var infoElement = document.createElement('div');
  infoElement.className = 'result-info';

  infoElement = addInfo2Table(item, infoElement)

  var appendElement = document.createElement('a');
  appendElement.className = 'expand2';
  appendElement.id = 'btne-'+ind;
  appendElement.onclick = function() { expandButtons('rdev'+ind, 'btne-'+ind); };
  appendElement.textContent = 'expand'

  divElement.appendChild(infoElement);
  divElement.appendChild(appendElement);

  parentElement.appendChild(divElement);
}

var firstPhase = ['Engine', 'Gameplay' ,'Story']
var secondPhase = ['Dialogues', 'Level Design' ,'AI']
var thirdPhase = ['World Design', 'Graphic' ,'Sound']

function putDevelopment(ind, dev_data, parentElement){
  // <div class="results-dev hidden" id="rdev">
  //   <div class="results-phase1">
  //     <div class="result-dev-title">
  //       <a class="dev-title1">Engine</a>
  //       <a class="dev-title1">Gameplay</a>
  //       <a class="dev-title1">Story</a>
  //     </div>
  //     <div class="result-dev">
  //       <a class="dev-name1">0.9</a>
  //       <a class="dev-name1">0.7</a>
  //       <a class="dev-name1">0.6</a>
  //     </div>  
  //   </div>
  //   ...

  var devContainerElement = document.createElement('div');
  devContainerElement.className = 'results-dev';
  devContainerElement.classList.add('hidden')
  devContainerElement.id = 'rdev'+ind

  // -- phase 1 --
  let phase1Element = document.createElement('div');
  phase1Element.className = 'results-phase1';

  var devTitleElement1 = document.createElement('div');
  devTitleElement1.className = 'result-dev-title';
  firstPhase.forEach(function(value) {
    var titleElement = document.createElement('a');
    titleElement.className = 'dev-title1';
    titleElement.textContent = value
    devTitleElement1.appendChild(titleElement)
  });

  var devValuesElement1 = document.createElement('div');
  devValuesElement1.className = 'result-dev';
  for (const [devk, devv] of Object.entries(dev_data)) {
    var valueElement = document.createElement('a');
    if (firstPhase.includes(devk)){
      valueElement.className = 'dev-name1';
      valueElement.textContent = devv
      devValuesElement1.appendChild(valueElement)    
    }
  }

  phase1Element.appendChild(devTitleElement1);
  phase1Element.appendChild(devValuesElement1);
  devContainerElement.appendChild(phase1Element)

  // -- phase 2 --
  var phase2Element = document.createElement('div');
  phase2Element.className = 'results-phase2';

  var devTitleElement2 = document.createElement('div');
  devTitleElement2.className = 'result-dev-title';
  secondPhase.forEach(function(value) {
    var titleElement = document.createElement('a');
    titleElement.className = 'dev-title2';
    titleElement.textContent = value
    devTitleElement2.appendChild(titleElement)
  });

  var devValuesElement2 = document.createElement('div');
  devValuesElement2.className = 'result-dev';
  for (const [devk, devv] of Object.entries(dev_data)) {
    var valueElement = document.createElement('a');
    if (secondPhase.includes(devk)){
      valueElement.className = 'dev-name2';
      valueElement.textContent = devv
      devValuesElement2.appendChild(valueElement)    
    }
  }

  phase2Element.appendChild(devTitleElement2);
  phase2Element.appendChild(devValuesElement2);
  devContainerElement.appendChild(phase2Element)

  // -- phase 3 --
  var phase3Element = document.createElement('div');
  phase3Element.className = 'results-phase3';

  var devTitleElement3 = document.createElement('div');
  devTitleElement3.className = 'result-dev-title';
  thirdPhase.forEach(function(value) {
    var titleElement = document.createElement('a');
    titleElement.className = 'dev-title3';
    titleElement.textContent = value
    devTitleElement3.appendChild(titleElement)
  });

  var devValuesElement3 = document.createElement('div');
  devValuesElement3.className = 'result-dev';
  for (const [devk, devv] of Object.entries(dev_data)) {
    var valueElement = document.createElement('a');
    if (thirdPhase.includes(devk)){
      valueElement.className = 'dev-name3';
      valueElement.textContent = devv
      devValuesElement3.appendChild(valueElement)    
    }
  }

  phase3Element.appendChild(devTitleElement3);
  phase3Element.appendChild(devValuesElement3);
  devContainerElement.appendChild(phase3Element)

  parentElement.appendChild(devContainerElement);
}

function addScoresWebpage(scores, genre_dev_data){
  const parentElement = document.getElementById("container-results");

  // detach previous shown results from parent
  var container_results = parentElement.getElementsByClassName('container-info');
  var resultsArray = Array.from(container_results);
  resultsArray.forEach(function(result) {
    parentElement.removeChild(result);
  });

  // now add the new ones
  scores.forEach((item, ind) => {
    if (ind < maxRecommended){
      let container_results = document.createElement('div');
      container_results.className = 'container-info'

      putScore(ind, item, container_results)
      genre = item[4]
      dev_data = genre_dev_data[genre]
      putDevelopment(ind, dev_data, container_results)
      parentElement.appendChild(container_results)
    }
  });
}


function addInfo2Table(info, table){
  [score1, score2, platform, topic, genre, audience] = info

  var score1_a = document.createElement('a');
  score1_a.className = 'result-score1';
  score1_a.textContent = score1

  var score2_a = document.createElement('a');
  score2_a.className = 'result-score2';
  score2_a.textContent = score2

  var platform_a = document.createElement('a');
  platform_a.className = 'result-platform';
  platform_a.textContent = platform

  var topic_a = document.createElement('a');
  topic_a.className = 'result-topic';
  topic_a.textContent = topic

  var genre_a = document.createElement('a');
  genre_a.className = 'result-genre';
  genre_a.textContent = genre

  var aud_a = document.createElement('a');
  aud_a.className = 'result-audience';
  aud_a.textContent = audience

  table.appendChild(score1_a)
  table.appendChild(score2_a)
  table.appendChild(platform_a)
  table.appendChild(topic_a)
  table.appendChild(genre_a)
  table.appendChild(aud_a)

  return table
}


// ----------------------------------- UPDATE TEXT ON SIZE -----------------------------------
function updateText() {
  var screenWidth = window.innerWidth;
  if (screenWidth < 545) {
    document.getElementById('scr1').textContent = 'Scr.1';
    document.getElementById('scr2').textContent = 'Scr.2';
  } else {
    document.getElementById('scr1').textContent = 'Score 1';
    document.getElementById('scr2').textContent = 'Score 2';
  }

  if (screenWidth < 430) {
    document.getElementById('aud').textContent = 'A.';
  } else if (screenWidth < 690) {
    document.getElementById('aud').textContent = 'Aud.';
  } else {
    document.getElementById('aud').textContent = 'Audience';
  }

  var expands = document.getElementsByClassName('expand2')
  for (var i = 0; i < expands.length; i++) {
    let expand = expands.item(i)
    if (screenWidth < 430) {
      if (expand.textContent == 'expand' || expand.textContent == 'E'){
        expand.textContent = 'E';
      }else{
        expand.textContent = 'H';
      }
    } else {
      if (expand.textContent == 'expand' || expand.textContent == 'E'){
        expand.textContent = 'expand';
      }else{
        expand.textContent = 'hide';
      }
    }
  }

}

// Call the function initially to set the default text
updateText();

// Call the function whenever the window is resized
window.addEventListener('resize', function() {
  updateText();
});