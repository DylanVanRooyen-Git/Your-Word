// Variables
const button = document.querySelector(".NW");
const FW = document.querySelector(".W1");
const SW = document.querySelector(".W2");
const submitBtn = document.querySelector(".submit");
const inputField = document.querySelector(".inputField");
const scoreDisplay = document.querySelector(".Score");

let allowedLetters  = "";
let score           = 0;

const pointsPerWord = 5;
const penalty       = 5;

// Audio
const successAudio  = new Audio("success.mp3");
successAudio.preload = "auto";

const failAudio     = new Audio("Fail.mp3");
failAudio.preload   = "auto";


// Listeners
button.addEventListener("click", generateWords);

inputField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") submitBtn.click();
});

button.addEventListener("click", () => {
    refreshWords();
    generateWords();
});

submitBtn.addEventListener("click", () => {
    const userWord = inputField.value.toUpperCase();

    if (!isWordValid(userWord, allowedLetters)) {
        failAudio.play();
        applyPenalty();
        return;
    }

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${userWord}`)
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                successAudio.play();
                score += pointsPerWord * userWord.length;
                scoreDisplay.textContent = score;
                afterSubmit();
            } else {
                failAudio.play();
                applyPenalty();
            }
        })
        .catch(() => {
            failAudio.play();
            score -= penalty;
            scoreDisplay.textContent = score;
        });
});


// Functions
function refreshWords() {
    score -= penalty;
    if (score < 0) score = 0;
    scoreDisplay.textContent = score;
}

function applyPenalty() {
    failAudio.play();
    score -= penalty;
    if (score < 0) score = 0;
    scoreDisplay.textContent = score;
}

function generateWords() {
    fetch("https://random-word-api.vercel.app/api?words=2&type=uppercase")
        .then(response => response.json())
        .then(data => {
            FW.textContent = data[0];
            SW.textContent = data[1];
            allowedLetters = (data[0] + data[1]).toUpperCase();
        })
        .catch(() => console.error("error fetching wordz from API"));
}

function isWordValid(word, allowed) {
    let copy = allowed.split("");
    for (let letter of word) {
        let index = copy.indexOf(letter);
        if (index === -1) return false;
        copy.splice(index, 1);
    }
    return true;
}

function afterSubmit() {
    inputField.value = "";
    generateWords();
}

function openRules() {
    document.getElementById("rulesModal").style.display = "block";
}

function closeRules() {
    document.getElementById("rulesModal").style.display = "none";
}
