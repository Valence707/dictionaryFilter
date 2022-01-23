// Stores objects containing word & filtered information.
let words = [];

// Uses dictionary api to populate words array.
let grabWord = () => {

    // Grabs value of user word input and that word's part of speech.
    let word = $("#userTextInput").val().toLowerCase();
    let partOfSpeech = $("#userSpeechPartInput").val().toLowerCase();

    // Stores word's 
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
                if (wordVar.fl == partOfSpeech && finalWord.def1 == "") {
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
                if (wordVar.fl == partOfSpeech) {
                    finalWord.syns1 = [...wordVar.meta.syns[0].slice(0, 3)];

                    finalWord.syns2 = [...wordVar.meta.syns[0].slice(3, 6)];
                }
            }
        }
    );

    words.push(finalWord);

    // Clears text input fields.
    $(`#userTextInput`).val("");
    $(`#userSpeechPartInput`).val("");
}