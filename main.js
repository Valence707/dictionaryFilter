// Stores objects each containing word & filtered information.
let words = [];

// Uses dictionary api to populate words array.
let grabWord = () => {

    // Grabs value of user word input and that word's part of speech.
    let word = $("#userTextInput").val();
    let partOfSpeech = $("#userSpeechPartInput").val();

    let finalWord = {
        "word": word,
        "def1": ``,
        "syns1": [],
        "sentence1": ``,
        "def2": ``,
        "syns2": [],
        "sentence2": ``
    }

    // Clears text input fields.
    $(`#userTextInput`).val("");
    $(`#userSpeechPartInput`).val("");

    // Access Dictionary API to pull the information about the input word.
    // This is used to grab the word's definitions and synonyms. These are filtered by
    // the word's part of speech, which is inputted by the user. The filtered
    // words are added to the wordInfo array for further filtering.
    $.getJSON(`https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=0d870a14-7aad-4361-8131-c69a997d9a2c`,
        function (data) {

            for (let wordVar of data) {
                if (wordVar.fl == partOfSpeech && finalWord.def1 == "") {
                    finalWord.def1 = wordVar.shortdef[0];
                    finalWord.def2 = wordVar.shortdef[1];

                    finalWord.sentence1 = data[1].def[0].sseq[0][0][1].dt[1][1][0].t;
                    finalWord.sentence2 = data[1].def[1].sseq[0][0][1].dt[1][1][0].t;
                }
            }
        }
    );

    $.getJSON(`https://dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=a51b46ac-7b10-485c-bef5-0f7715f9eab7`,
        function (data) {
            for (let wordVar of data) {
                if (wordVar.fl == partOfSpeech) {
                    finalWord.syns1 = [...wordVar.meta.syns[0].slice(0, 3)];

                    finalWord.syns2 = [...wordVar.meta.syns[0].slice(3, 6)];
                    words.push({[word]: finalWord});
                }
            }
        }
    );

    console.log(words);

    $("#finalDisplay").html(
        `WORD: ${}
DEFINITION 1: ${}
SYNONYMS: ${}
SENTENCE: ${}
DEFINITION 2: ${}
SYNONYMS: ${}
SENTENCE: ${}`
    );
}