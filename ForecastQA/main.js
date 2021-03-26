// Demo action function.

// Define elements.
let /** $ElementType */ keyword = document.getElementById("keyword");
// let /** $ElementType */ keyword2 = document.getElementById("keyword2");

function getInput() {
  return {
    keyword: keyword.value,
    // keyword2: keyword2.value,
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
      // xobj.open('GET', 'converted_dev_questions.json', true);
      xobj.open('GET', 'https://inklab.usc.edu/ForecastQA/converted_dev_questions.json', true);
      xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
          return callback(JSON.parse(xobj.responseText));
        }
      };
      xobj.send(null);
    }

    loadJSON(function (response){
      var json_file = JSON.parse(JSON.stringify(response));
      var original_keywords = input.keyword.split(" ");
      var keyword_values = input.keyword.toLowerCase().split(" ");
      for (var jj=0; jj < keyword_values.length; jj++){
     

        console.log(keyword_values[jj]);

        var results = [];
        for (var i = 0; i < json_file.examples.length; i++){
            var question = json_file.examples[i].question.toLowerCase();
            if (question.split(" ").includes(keyword_values[jj])){
                results.push(json_file.examples[i]);
            }
        }
        if (keyword_values[jj].length != 0) {

          if (results.length != 0){
            app.innerHTML += `<div class="row"><div class="col-md-12"><h4>Questions with '${original_keywords[jj]}'</h4></div>`;
          }
        
          for (var i = 0; i < results.length; i++){
              if (i === 2) {
                break;
              }
              var question = results[i].question;
              var choices = results[i].choices;
              var answer = results[i].answer;
              app.innerHTML += `<div class="row"><div class="col-md-12"><h5>&nbsp;${question}</h5></div>`;
              app.innerHTML += `<div class="col-md-12"><div class="row">`;
              for (var j = 0; j < choices.length; j++) {
                  if (answer === choices[j]){
                      app.innerHTML += `&emsp;<strong>${choices[j]}</strong><br>`;
                  }
                  else{
                      app.innerHTML += `&emsp;${choices[j]}<br>`;
                  }
              }
              app.innerHTML += `</div></div></div>`;
              app.innerHTML += '<br>'
          }
        }
      }

      // var keyword_value2 = input.keyword2.toLowerCase();

      // console.log(keyword_value2);

      // var results2 = [];
      // for (var i = 0; i < json_file.examples.length; i++){
      //     var question2 = json_file.examples[i].question.toLowerCase();
      //     if (question2.indexOf(keyword_value2) != -1){
      //         results2.push(json_file.examples[i]);
      //     }
      // }
      // if (keyword_value2.length != 0) {
          
      //   if (results2.length != 0){
      //     app.innerHTML += `<div class="row"><div class="col-md-12"><h4>Questions with '${input.keyword2}'</h4></div>`;
      //   }
      //   for (var i = 0; i < results2.length; i++){
      //       if (i === 2) {
      //         break;
      //       }
      //       var question2 = results2[i].question;
      //       var choices2 = results2[i].choices;
      //       var answer2 = results2[i].answer;
      //       app.innerHTML += `<div class="row"><div class="col-md-12"><h5>&nbsp;${question2}</h5></div>`;
      //       app.innerHTML += `<div class="col-md-12"><div class="row">`;
      //       for (var j = 0; j < choices2.length; j++) {
      //           if (answer2 === choices2[j]){
      //               app.innerHTML += `&emsp;<strong>${choices2[j]}</strong><br>`;
      //           }
      //           else{
      //               app.innerHTML += `&emsp;${choices2[j]}<br>`;
      //           }
      //       }
      //       app.innerHTML += `</div></div></div>`;
      //       app.innerHTML += '<br>'
      //   }
      // }

    }
    )
}

