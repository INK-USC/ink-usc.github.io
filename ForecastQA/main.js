// Demo action function.

// Define elements.
let /** $ElementType */ keyword = document.getElementById("keyword");

function getInput() {
  return {
    keyword: keyword.value,
  };
}

/**
 * Request to API and get results.
 */
function search() {
    let input = getInput();
    const app = document.querySelector('#results');
    app.innerHTML = "";
    function loadJSON(callback) {
      var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("application/json");
      xobj.open('GET', 'converted_dev_questions.json', true);
      // xobj.open('GET', 'https://inklab.usc.edu/ForecastQA/converted_dev_questions.json', true);
      xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
          return callback(JSON.parse(xobj.responseText));
        }
      };
      xobj.send(null);
    }

    loadJSON(function (response){
      var json_file = JSON.parse(JSON.stringify(response));
      var keyword_value = input.keyword.toLowerCase();

      console.log(keyword_value);

      var results = [];
      for (var i = 0; i < json_file.examples.length; i++){
          var question = json_file.examples[i].question.toLowerCase();
          if (question.indexOf(keyword_value) != -1){
              results.push(json_file.examples[i]);
          }
          if (i === 20) {
            break;
          }
      }


      for (var i = 0; i < results.length; i++){
          var question = results[i].question;
          var choices = results[i].choices;
          var answer = results[i].answer;
          app.innerHTML += `<div class="row"><div class="col-md-12">${question}</div>`;
          app.innerHTML += `<div class="col-md-12"><div class="row">`;
          for (var j = 0; j < choices.length; j++) {
              if (answer === choices[j]){
                  app.innerHTML += `<strong>${choices[j]}</strong><br>`;
              }
              else{
                  app.innerHTML += `${choices[j]}<br>`;
              }
          }
          app.innerHTML += `</div></div></div>`;
          app.innerHTML += '<br>'
      }

    }
    )
}

