var bratLocation = 'https://nlp.stanford.edu/js/brat/';
head.js(
  // External libraries
  bratLocation + '/client/lib/jquery.svg.min.js',
  bratLocation + '/client/lib/jquery.svgdom.min.js',

  // brat helper modules
  bratLocation + '/client/src/configuration.js',
  bratLocation + '/client/src/util.js',
  bratLocation + '/client/src/annotation_log.js',
  bratLocation + '/client/lib/webfont.js',

  // brat modules
  bratLocation + '/client/src/dispatcher.js',
  bratLocation + '/client/src/url_monitor.js',
  bratLocation + '/client/src/visualizer.js',

  // parse viewer
  './corenlp-parseviewer.js'
);


// Uses Dagre (https://github.com/cpettitt/dagre) for constinuency parse
// visualization. It works better than the brat visualization.
var useDagre = true;
var currentQuery = 'The quick brown fox jumped over the lazy dog.';
var currentSentences = '';
var currentText = '';

// ----------------------------------------------------------------------------
// HELPERS
// ----------------------------------------------------------------------------

/**
 * Add the startsWith function to the String class
 */
if (typeof String.prototype.startsWith !== 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) === 0;
  };
}


// ----------------------------------------------------------------------------
// RENDER
// ----------------------------------------------------------------------------

/**
 * Render a given JSON data structure
 */
function render(text) {
  console.log(text);
  var collData = {
    entity_types: [ {
            type   : 'Person',
            labels : ['Person', 'PER'],
            bgColor: '#FFCCAA',
            // Use a slightly darker version of the bgColor for the border
            borderColor: 'darken'},
    {
            type   : 'Location',
            labels : ['Location', 'LOC'],
            bgColor: '#95DFFF',
            // Use a slightly darker version of the bgColor for the border
            borderColor: 'darken'},
    {
            type   : 'Organization',
            labels : ['Organization', 'ORG'],
            bgColor: '#8FB2FF',
            // Use a slightly darker version of the bgColor for the border
            borderColor: 'darken'},
    {
            type   : 'Miscellaneous',
            labels : ['Miscellaneous', 'MISC'],
            bgColor: '#F1F447',
            // Use a slightly darker version of the bgColor for the border
            borderColor: 'darken'},
    {
            type   : 'Disease',
            labels : ['Disease', 'DIS'],
            bgColor: '#FFA22B',
            // Use a slightly darker version of the bgColor for the border
            borderColor: 'darken'},
    {
            type   : 'Chemical',
            labels : ['Chemical', 'CHEM'],
            bgColor: '#FFFFFF',
            // Use a slightly darker version of the bgColor for the border
            borderColor: 'darken'},
    {
            type   : 'Trigger-1',
            labels : ['Trigger-1', 'T-1'],
            bgColor: '#E3E3E3',
            // Use a slightly darker version of the bgColor for the border
            borderColor: 'darken'},
    {
            type   : 'Trigger-2',
            labels : ['Trigger-2', 'T-2'],
            bgColor: '#E3E3E3',
            // Use a slightly darker version of the bgColor for the border
            borderColor: 'darken'},
    {
            type   : 'Trigger-3',
            labels : ['Trigger-3', 'T-3'],
            bgColor: '#E3E3E3',
            // Use a slightly darker version of the bgColor for the border
            borderColor: 'darken'}]
  };

  var triggerDatas  = [];
  if (text == "1"){
    var originalData = {
      // Our text of choice
      text     : "Paris is the president of the student union .",
      // The entities entry holds all entity annotations
      entities : [
          /* Format: [${ID}, ${TYPE}, [[${START}, ${END}]]]
              note that range of the offsets are [${START},${END}) */
          ['T1', 'Person', [[0, 5]]],
      ],
    };

    var triggerData1 = {
      // Our text of choice
      text     : "Paris is the president of the student union .",
      // The entities entry holds all entity annotations
      entities : [
          /* Format: [${ID}, ${TYPE}, [[${START}, ${END}]]]
              note that range of the offsets are [${START},${END}) */
          ['T1', 'Person', [[0, 5]]],
          ['T2', 'Trigger-1', [[8, 25]]]
      ],
    };
    triggerDatas.push(triggerData1);
  }

  if (text == "2"){
    var originalData = {
      // Our text of choice
      text     : "Germany 's representative to the European Union 's veterinary committee Werner Zwingmann said on Wednesday consumers should buy sheepmeat from countries other than Britain until the scientific advice was clearer .",
      // The entities entry holds all entity annotations
      entities : [
          /* Format: [${ID}, ${TYPE}, [[${START}, ${END}]]]
              note that range of the offsets are [${START},${END}) */
          ['T1', 'Location', [[0, 7]]],
          ['T2', 'Organization', [[33, 47]]],
          ['T3', 'Person', [[71, 88]]],
          ['T4', 'Location', [[164, 171]]],
      ],
    };

    var triggerData1 = {
      // Our text of choice
      text     : "Germany 's representative to the European Union 's veterinary committee Werner Zwingmann said on Wednesday consumers should buy sheepmeat from countries other than Britain until the scientific advice was clearer .",
      // The entities entry holds all entity annotations
      entities : [
          /* Format: [${ID}, ${TYPE}, [[${START}, ${END}]]]
              note that range of the offsets are [${START},${END}) */
          ['T1', 'Location', [[0, 7]]],
          ['T2', 'Trigger-1', [[8, 25]]],
      ],
    };
    var triggerData2 = {
      // Our text of choice
      text     : "Germany 's representative to the European Union 's veterinary committee Werner Zwingmann said on Wednesday consumers should buy sheepmeat from countries other than Britain until the scientific advice was clearer .",
      // The entities entry holds all entity annotations
      entities : [
          /* Format: [${ID}, ${TYPE}, [[${START}, ${END}]]]
              note that range of the offsets are [${START},${END}) */
          ['T1', 'Trigger-1', [[26, 32]]],
          ['T2', 'Organization', [[33, 47]]],
          ['T3', 'Trigger-2', [[48, 50]]],
          ['T4', 'Trigger-2', [[62, 71]]],
      ],
    };
    var triggerData3 = {
      // Our text of choice
      text     : "Germany 's representative to the European Union 's veterinary committee Werner Zwingmann said on Wednesday consumers should buy sheepmeat from countries other than Britain until the scientific advice was clearer .",
      // The entities entry holds all entity annotations
      entities : [
          /* Format: [${ID}, ${TYPE}, [[${START}, ${END}]]]
              note that range of the offsets are [${START},${END}) */
          ['T1', 'Trigger-1', [[62, 71]]],
          ['T2', 'Person', [[71, 88]]],
          ['T3', 'Trigger-2', [[89, 96]]],
      ],
    };
    var triggerData4 = {
      // Our text of choice
      text     : "Germany 's representative to the European Union 's veterinary committee Werner Zwingmann said on Wednesday consumers should buy sheepmeat from countries other than Britain until the scientific advice was clearer .",
      // The entities entry holds all entity annotations
      entities : [
          /* Format: [${ID}, ${TYPE}, [[${START}, ${END}]]]
              note that range of the offsets are [${START},${END}) */
          ['T1', 'Trigger-1', [[138, 163]]],
          ['T2', 'Location', [[164, 171]]],
      ],
    };
    triggerDatas.push(triggerData1);
    triggerDatas.push(triggerData2);
    triggerDatas.push(triggerData3);
    triggerDatas.push(triggerData4);

  }

  if (text == "3"){
    var originalData = {
      // Our text of choice
      text     : "Spanish Farm Minister Loyola de Palacio had earlier accused Fischler at an EU farm ministers ' meeting of causing unjustified alarm through dangerous generalisation .",
      // The entities entry holds all entity annotations
      entities : [
          /* Format: [${ID}, ${TYPE}, [[${START}, ${END}]]]
              note that range of the offsets are [${START},${END}) */
          ['T1', 'Miscellaneous', [[0, 7]]],
          ['T2', 'Person', [[21, 39]]],
          ['T3', 'Person', [[60, 68]]],
          ['T4', 'Organization', [[75, 77]]],

      ],
    };

    var triggerData1 = {
      // Our text of choice
      text     : "Spanish Farm Minister Loyola de Palacio had earlier accused Fischler at an EU farm ministers ' meeting of causing unjustified alarm through dangerous generalisation .",
      // The entities entry holds all entity annotations
      entities : [
          /* Format: [${ID}, ${TYPE}, [[${START}, ${END}]]]
              note that range of the offsets are [${START},${END}) */
          ['T1', 'Miscellaneous', [[0, 7]]],
          ['T2', 'Trigger-1', [[8, 12]]],
      ],
    };

    var triggerData2 = {
      // Our text of choice
      text     : "Spanish Farm Minister Loyola de Palacio had earlier accused Fischler at an EU farm ministers ' meeting of causing unjustified alarm through dangerous generalisation .",
      // The entities entry holds all entity annotations
      entities : [
          /* Format: [${ID}, ${TYPE}, [[${START}, ${END}]]]
              note that range of the offsets are [${START},${END}) */
          ['T1', 'Trigger-1', [[8, 20]]],
          ['T2', 'Person', [[21, 39]]],
          ['T3', 'Trigger-2', [[40, 43]]],
          ['T4', 'Trigger-2', [[52, 59]]],
      ],
    };

    var triggerData3 = {
      // Our text of choice
      text     : "Spanish Farm Minister Loyola de Palacio had earlier accused Fischler at an EU farm ministers ' meeting of causing unjustified alarm through dangerous generalisation .",
      // The entities entry holds all entity annotations
      entities : [
          /* Format: [${ID}, ${TYPE}, [[${START}, ${END}]]]
              note that range of the offsets are [${START},${END}) */
          ['T1', 'Trigger-1', [[40, 43]]],
          ['T2', 'Trigger-1', [[52, 59]]],
          ['T3', 'Person', [[60, 68]]],
      ],
    };

    var triggerData4 = {
      // Our text of choice
      text     : "Spanish Farm Minister Loyola de Palacio had earlier accused Fischler at an EU farm ministers ' meeting of causing unjustified alarm through dangerous generalisation .",
      // The entities entry holds all entity annotations
      entities : [
          /* Format: [${ID}, ${TYPE}, [[${START}, ${END}]]]
              note that range of the offsets are [${START},${END}) */
          ['T1', 'Trigger-1', [[69, 74]]],
          ['T2', 'Organization', [[75, 77]]],
          ['T3', 'Trigger-2', [[93, 102]]],

      ],
    };
    triggerDatas.push(triggerData1);
    triggerDatas.push(triggerData2);
    triggerDatas.push(triggerData3);
    triggerDatas.push(triggerData4);
  }

    if (text == "4"){
    var originalData = {
      // Our text of choice
      text     : "They offer protection against seizures in a range of models and seem to inhibit certain stages of drug dependence in preclinical assessments .",
      // The entities entry holds all entity annotations
      entities : [
          /* Format: [${ID}, ${TYPE}, [[${START}, ${END}]]]
              note that range of the offsets are [${START},${END}) */
          ['T1', 'Disease', [[30, 38]]],
          ['T2', 'Disease', [[97, 113]]],
      ],
    };

    var triggerData1 = {
      // Our text of choice
      text     : "They offer protection against seizures in a range of models and seem to inhibit certain stages of drug dependence in preclinical assessments .",
      // The entities entry holds all entity annotations
      entities : [
          /* Format: [${ID}, ${TYPE}, [[${START}, ${END}]]]
              note that range of the offsets are [${START},${END}) */
          ['T1', 'Trigger-1', [[10, 29]]],
          ['T2', 'Disease', [[30, 38]]],

      ],
    };

    var triggerData2 = {
      // Our text of choice
      text     : "They offer protection against seizures in a range of models and seem to inhibit certain stages of drug dependence in preclinical assessments .",
      // The entities entry holds all entity annotations
      entities : [
          /* Format: [${ID}, ${TYPE}, [[${START}, ${END}]]]
              note that range of the offsets are [${START},${END}) */
          ['T1', 'Trigger-1', [[71, 79]]],
          ['T2', 'Trigger-2', [[87, 97]]],
          ['T3', 'Disease', [[97, 113]]],
      ],
    };
    triggerDatas.push(triggerData1);
    triggerDatas.push(triggerData2);
  }

  if (text == "5"){
    var originalData = {
      // Our text of choice
      text     : "All of these positive GABA(A) modulators suppressed the expression of kindled seizures , whereas only alleopregnanolone and ganaxolone inhibited the development of kindling .",
      // The entities entry holds all entity annotations
      entities : [
          /* Format: [${ID}, ${TYPE}, [[${START}, ${END}]]]
              note that range of the offsets are [${START},${END}) */
          ['T1', 'Chemical', [[22, 26]]],
          ['T2', 'Disease', [[78, 86]]],
          ['T3', 'Chemical', [[102, 119]]],
          ['T4', 'Chemical', [[124, 134]]],
      ],
    };

    var triggerData1 = {
      // Our text of choice
      text     : "All of these positive GABA(A) modulators suppressed the expression of kindled seizures , whereas only alleopregnanolone and ganaxolone inhibited the development of kindling .",
      // The entities entry holds all entity annotations
      entities : [
          /* Format: [${ID}, ${TYPE}, [[${START}, ${END}]]]
              note that range of the offsets are [${START},${END}) */
          ['T1', 'Trigger-1', [[13, 21]]],
          ['T2', 'Chemical', [[22, 26]]],
          ['T3', 'Trigger-2', [[29, 40]]],

      ],
    };

    var triggerData2 = {
      // Our text of choice
      text     : "All of these positive GABA(A) modulators suppressed the expression of kindled seizures , whereas only alleopregnanolone and ganaxolone inhibited the development of kindling .",
      // The entities entry holds all entity annotations
      entities : [
          /* Format: [${ID}, ${TYPE}, [[${START}, ${END}]]]
              note that range of the offsets are [${START},${END}) */
          ['T1', 'Trigger-1', [[69, 77]]],
          ['T2', 'Disease', [[78, 86]]],
      ],
    };
    var triggerData3 = {
      // Our text of choice
      text     : "All of these positive GABA(A) modulators suppressed the expression of kindled seizures , whereas only alleopregnanolone and ganaxolone inhibited the development of kindling .",
      // The entities entry holds all entity annotations
      entities : [
          /* Format: [${ID}, ${TYPE}, [[${START}, ${END}]]]
              note that range of the offsets are [${START},${END}) */
          ['T1', 'Chemical', [[102, 119]]],
          ['T2', 'Trigger-1', [[135, 144]]],
      ],
    };
    var triggerData4 = {
      // Our text of choice
      text     : "All of these positive GABA(A) modulators suppressed the expression of kindled seizures , whereas only alleopregnanolone and ganaxolone inhibited the development of kindling .",
      // The entities entry holds all entity annotations
      entities : [
          /* Format: [${ID}, ${TYPE}, [[${START}, ${END}]]]
              note that range of the offsets are [${START},${END}) */

          ['T1', 'Chemical', [[124, 134]]],
          ['T2', 'Trigger-1', [[135, 144]]],
      ],
    };
    triggerDatas.push(triggerData1);
    triggerDatas.push(triggerData2);
    triggerDatas.push(triggerData3);
    triggerDatas.push(triggerData4);
  }


  // Render each annotation
  head.ready(function() {
      Util.embed('original', collData, originalData);
      for (var i = 0; i < triggerDatas.length; i++) {
        var s = triggerDatas[i];
        var id = 'trigger' + i;
        $('#annotations').append('<div id="' + id + '" style="display: block;"></div><br/>');
        Util.embed(id, collData, s);
      }
  });

}  // End render function


// ----------------------------------------------------------------------------
// MAIN
// ----------------------------------------------------------------------------

/**
 * MAIN()
 *
 * The entry point of the page
 */
$(document).ready(function() {
  // Some initial styling
  $('.chosen-select').chosen();
  $('.chosen-container').css('width', '100%');
  $('#annotations').hide();

  // Submit on shift-enter
  $('#text').keydown(function (event) {
    if(event.shiftKey){
      event.preventDefault();  // don't register the enter key when pressed
      return false;
    }
  });
  $('#text').keyup(function (event) {
    if(event.shiftKey){
      $('#submit').click();  // submit the form when the enter key is released
      event.stopPropagation();
      return false;
    }
  });

  // Submit on clicking the 'submit' button
  $('#submit').click(function() {
    // Get the text to annotate
    currentQuery = $('#text').val();
    $('#text').val(currentQuery);

    console.log(currentQuery);
    // Update the UI
    $('#submit').prop('disabled', true);
    $('#annotations').hide();
    $('#patterns_row').hide();
    $('#loading').show();

    function createAnnotationDiv(id, annotator, selector, label) {
            // (make sure we requested that element)
      $('#annotations').append('<h5 class="red">' + label + ':</h5><div id="' + id + '" style="display: block;"></div><br/>');

    }
    $('#annotations').empty();
    createAnnotationDiv('original',      'original',        'original',                        'Original Dataset'          );
    createAnnotationDiv('trigger',    'trigger',      'trigger',                               'Trigger Dataset'           );

    $('#loading').hide();
    $('.corenlp_error').remove();  // Clear error messages
    $('#annotations').show();
    $('#submit').prop('disabled', false);
    render(currentQuery);
    return false;
  });
});