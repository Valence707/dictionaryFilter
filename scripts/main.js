// Stores objects containing word & filtered information.
let wordCollection = [];

/* Grabs information from the Dictionary and Thesaurus APIs about a particular
word and returns that information as an object. */
function grabWord(word, speechPart) {

    // Stores word information.
    let finalWord = {
        "word": word,
        "def1": ``,
        "syns1": [],
        "sentence1": ``,
        "def2": ``,
        "syns2": [],
        "sentence2": ``
    }

    // Access Dictionary API to grab word's two definitions and sentences.
    // Word is filtered by part of speech.
    $.getJSON(`https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=0d870a14-7aad-4361-8131-c69a997d9a2c`,
        function (dictData) {
            for (let wordVar of dictData) {
                if (wordVar.fl == speechPart && finalWord.def1 == "") {
                    finalWord.def1 = wordVar.shortdef[0];
                    finalWord.def2 = wordVar.shortdef[1];
        
                    finalWord.sentence1 = dictData[1].def[0].sseq[0][0][1].dt[1][1][0].t;
                    finalWord.sentence2 = dictData[1].def[1].sseq[0][0][1].dt[1][1][0].t;
                }
            }
        }
    );

    // Access Thesaurus API to grab 6 synonyms of word, 
    // add to the finalWord object as two arrays.
    $.getJSON(`https://dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=a51b46ac-7b10-485c-bef5-0f7715f9eab7`,
        function (thesData) {
            for (let wordVar of thesData) {
                if (wordVar.fl == speechPart) {
                    finalWord.syns1 = [...wordVar.meta.syns[0].slice(0, 3)];

                    finalWord.syns2 = [...wordVar.meta.syns[0].slice(3, 6)];
                }
            }
        }
    );

    // Returns object containing collected word's information.
    return finalWord;
}

function populateDisplay() {
    let words = $(`#userTextInput`).val()
    .replace(/[\s\d]/gi, "")
    .split(",");

    let partsOfSpeech = $(`#userSpeechPartInput`).val()
    .replace(/[\s\d]/gi, "")
    .split(",");

    // call grabWord() for each user-inputted word.
    // Populate wordCollection array with word objects returned by each grabWord call.
    // Use an interval to delay calling of grabWord to make Firefox stop crashing
    // because I'm making too many calls to the API or something.
    if (words.length == partsOfSpeech.length) {
        let tempCounter = 0;
        let populateWords = setInterval(function() {
            console.log(words.length);
            console.log(wordCollection.length);
            wordCollection.push(grabWord(words[tempCounter], partsOfSpeech[tempCounter]));
            tempCounter++;
            if (words.length == wordCollection.length) {
                console.log(wordCollection);
                clearInterval(populateWords);
            }
        }, 1000);
    }
    
    // Clears text input fields.
    $(`#userTextInput`).val("");
    $(`#userSpeechPartInput`).val("");
}