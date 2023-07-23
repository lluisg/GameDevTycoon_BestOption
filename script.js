url_platforms_genres = "https://raw.githubusercontent.com/lluisg/GameDevTycoon_BestOption/main/PrepareData/values_platform_genres.json"
url_platforms_audiences = "https://raw.githubusercontent.com/lluisg/GameDevTycoon_BestOption/main/PrepareData/values_platform_audiences.json"
url_topics_genres = "https://raw.githubusercontent.com/lluisg/GameDevTycoon_BestOption/main/PrepareData/values_topics_genres.json"
url_topics_audiences = "https://raw.githubusercontent.com/lluisg/GameDevTycoon_BestOption/main/PrepareData/values_topics_audiences.json"

// url_genre = "https://raw.githubusercontent.com/lluisg/GameDevTycoon_BestOption/main/GetInfo/values_genre.json"
// url_multigenre = "https://raw.githubusercontent.com/lluisg/GameDevTycoon_BestOption/main/GetInfo/values_multigenre.json"

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

          // console.log('genres', genre, plat_genre_value, topic_genre_value)
          // console.log('audiences', aud, plat_aud_value, topic_aud_value)

          value_score = plat_genre_value * topic_genre_value * topic_aud_value
          value_sell = value_score * plat_aud_value
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


function CalculateGames(plat_genre_data, plat_aud_data, topic_genre_data, topic_aud_data, statesBtnSys, statesBtnTpc){
  valid_plat_genre = getValidValues(statesBtnSys, plat_genre_data)
  valid_plat_aud = getValidValues(statesBtnSys, plat_aud_data)
  valid_tpc_genre = getValidValues(statesBtnTpc, topic_genre_data)
  valid_tpc_aud = getValidValues(statesBtnTpc, topic_aud_data)

  let scores_games = calculateScores(valid_plat_genre, valid_plat_aud, valid_tpc_genre, valid_tpc_aud)
  console.log('scores', scores_games)
  let scores_ord = scores_games.sort(orderScoresGames);
  console.log('ordered', scores_ord)
  let scores_unique = removeSameTopicGenre(scores_ord) // only keep the first with the same topic/genre
  console.log('unique', scores_unique)

  let scores_shuffled = shuffleWithinGroups(scores_unique); // shuffle the elements with the same score
  console.log(scores_shuffled);

  // ADD MULTIGENRE
  // ADD THE INFO ON THE DEVELOPMENT BELOW
  // CHECK THAT THE EXPAND WORKS

  putScoresWebpage(scores_shuffled)
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

                  CalculateGames( platform_genre_data, 
                                  platform_audience_data, 
                                  topic_genre_data, 
                                  topic_audience_data, 
                                  statesBtnSys, 
                                  statesBtnTpc)

                })
                // .catch(error => {
                //   console.error('Error fetching topics & audiences:', error);
                // });
            })
            // .catch(error => {
            //   console.error('Error fetching the topics & genres:', error);
            // });
        })
        // .catch(error => {
        //   console.error('Error fetching the platforms & audiences:', error);
        // });
    })
    // .catch(error => {
    //   console.error('Error fetching the platforms & genres:', error);
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
