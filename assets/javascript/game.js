//this file will hold the main code for the word guess game.
//the user will be given a random word to guess, selected from an array
//it will be presented to the user as a series of underscores
//they will have a certain amount of guesses
//guesses will be generated by pressing a valid key on the keyboard
//guessed letters will be added to an array.  the user will be unable to guess
//the same letter again.
//the program will keep track of # of wins and # of games played.

//object to represent word game
var wordGame = {
    //properties
    numGuesses : 15,
    words : ["koreatown", "downtown", "silver lake", "echo park", "westwood", "macarthur park", "westwood", "los feliz", "venice", "marina del rey", "studio city", "century city", "mar vista", "sawtelle", "westchester", "playa del rey", "playa vista", "hollywood"],
    numWins : 0,
    numLosses : 0,
    validLetters : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    guessedLetters : [],
    currentLetterGuessed : '',
    myWord : '',
    numKeyPresses : 0,
    myUnderscoresArray: [],
    playAgain : null,
    //imgArray : [],

    //methods

    //generate a random number
    //use the random number to select a word by index
    //from the array of words 
    generateNewWord : function() {
        var myRand; 

        myRand = Math.floor(Math.random() * wordGame.words.length);
        wordGame.myWord = wordGame.words[myRand];
    },

    //calls the generate word method
    //displays the blank spaces from the underscore array
    //to the corresponding element on the page.
    startPlay : function() {
        //this function needs to be triggered on the first key press after page loads

        //get the new word
        this.generateNewWord();
        //display the blank spaces
        for (var i = 0; i < wordGame.myWord.length; i++) {
            if(wordGame.myWord.charAt(i) !== ' ') {
                wordGame.myUnderscoresArray[i] = '_';
            }
            else {
                wordGame.myUnderscoresArray[i] = '|';
            }
        }
        $("#currentWord").val(wordGame.myUnderscoresArray.join(' '));
         $("#guessesRemaining").val(wordGame.numGuesses);
         
        //document.getElementById("currentWord").value = wordGame.myUnderscoresArray.toString().replace(/,/g, ' ');
       // document.getElementById("guessesRemaining").value = wordGame.numGuesses;
    }, 

    //search the word to see if the guessed letter is found
    //if the letter is found, change the corresponding index in 
    //the array of underscores.
    searchWord : function() {
       // alert("search word function called"); 
        var isFound = false;
        for (var i = 0; i < wordGame.myWord.length; i++) {
            if (wordGame.currentLetterGuessed === wordGame.myWord[i]) {
                wordGame.myUnderscoresArray[i] = wordGame.currentLetterGuessed;
                isFound = true;
               // alert(isFound);
            }
        }
      /*  if (isFound === false) {
            alert("entered the isFound if statemet");
            debugger;
            this.numGuesses--;
            $("#guessesRemaining").val(this.numGuesses);
        }  */
        //document.getElementById("currentWord").value = wordGame.myUnderscoresArray.toString().replace(/,/g, ' ');
        $("#currentWord").val(wordGame.myUnderscoresArray.join(' '));
    },

    //deterine if the user won the game
    //called after each guess
    checkIfWon : function() {
        var i = 0;
        var isWinner = true;
        while (i < wordGame.myUnderscoresArray.length && isWinner === true) {
            if (wordGame.myUnderscoresArray[i] === '_') {
                isWinner = false;
            }
            else {
                i++;
            }
        }
        if (isWinner === true) {
            var audioElement = document.createElement("audio");
            audioElement.setAttribute("src", "assets/sounds/applause.wav");
            audioElement.play();
            //alert("congratulations");
            this.numKeyPresses = 0;
            this.numWins++;
            $("#numWins").val(this.numWins);
            //document.getElementById("myLabel").value = "Do you want to play again?\nPress any key to continue";
            $("#myLabel").text("Do you want to play again?\nPress any key to continue.").css("display", 'block');
        }
        
    },

    //reset the game
    //calls the startPlay method
    //resets the form boxes
    resetGame : function() {
        wordGame.myUnderscoresArray = [];
        wordGame.startPlay();
        wordGame.numGuesses = 15;
        $("#guessesRemaining").val(wordGame.numGuesses);
        //document.getElementById("guessesRemaining").value = wordGame.numGuesses;
        wordGame.guessedLetters = [];
        document.getElementById("guessedLetters").value = wordGame.guessedLetters;   
    }
};

//assign a function to the onkeyup event.
//this function will check to see if the user's keystroke is a letter
//if it's a letter, it will check if the user has previously guessed the letter.
//if the user has not previously guessed the letter, the keystroke is added to an array
//of guessed letters, and the current letter is stored.
document.onkeyup = function(ev) {
    var validChoice = false
    var letterFound = false;

    
    var i = 0;
    var j = 0;
   
    //check if first key press after page load/reload
    if (wordGame.numKeyPresses === 0) {
        wordGame.resetGame();
        wordGame.numKeyPresses++;
        $("#myLabel").css("display", 'none');
    }
    //not the first key press since load/reload
    else {
        //loop through array of letters until choice found
        //or until it reaches the end of the array of letters.
        while (validChoice === false && i < wordGame.validLetters.length) {
            if (ev.key === wordGame.validLetters[i]) {
                validChoice = true;
                //if valid letter loop through array of previously guessed letters 
                //until the letter is found or until it reaches the end of the array 
                //of previously guessed letters
                while (letterFound === false && j < wordGame.guessedLetters.length) {
                    if (ev.key === wordGame.guessedLetters[j]) {
                        letterFound = true;
                    }
                    else {
                        j++;
                    }
                }
                //key stroke was a valid alphabetic character and was not previously chosen
                if (letterFound === false) {
                    wordGame.guessedLetters.push(ev.key);
                    wordGame.currentLetterGuessed = ev.key;
                    $("#guessedLetters").val(wordGame.guessedLetters);
                    wordGame.numGuesses--;
                    //check if guesses left less than 0
                    if (wordGame.numGuesses <= 0) {
                        var audioElement = document.createElement("audio");
                        audioElement.setAttribute("src", "assets/sounds/boo.wav");
                        wordGame.numLosses++;
                        $("#numLosses").val(wordGame.numLosses); 
                        audioElement.play();
                        $("#myLabel").text("Do you want to play again?\nPress any key to continue.").css("display", 'block');
                        wordGame.numKeyPresses = 0;
                       // wordGame.resetGame();
                    }
                    //player still has guesses remaining
                    else {                      
                        $("#guessesRemaining").val(wordGame.numGuesses);
                    }
                    //loop through word to search for instances of guessed letter
                    for (var i = 0; i < wordGame.myWord.length; i++) {
                        if (wordGame.currentLetterGuessed === wordGame.myWord[i]) {
                            wordGame.searchWord();
                            wordGame.checkIfWon();
                        }  
                    }
                }
            }
            else {
                i++;
            }
        }
    } 
}
