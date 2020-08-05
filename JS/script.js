class AudioControls {
    constructor() {
        this.mainMusic = new Audio("assets/soundFX/interstellarJourney.mp3");
        this.flipMusic = new Audio("assets/soundFX/flipCardSound.wav");
        this.cardMatchMusic = new Audio("assets/soundFX/cardMatchSound.wav");
        this.victoryMusic = new Audio("assets/soundFX/victorySound.wav");
        this.gameOverMusic = new Audio("assets/soundFX/gameOverSound.wav");
        this.mainMusic.loop = true;
        this.mainMusic.volume = 0.5;
        this.flipMusic.volume = 0.5;
        this.victoryMusic.volume = 0.5;
    }

    startMusic() {
        this.mainMusic.play();
    }

    stopMusic() {
        this.mainMusic.pause();
        this.mainMusic.currentTime = 0;

    }

    flip() {
        this.flipMusic.play();
    }

    match() {
        this.cardMatchMusic.play();
    }

    victory() {
        this.stopMusic();
        this.victoryMusic.play();
    }

    gameOver() {
        this.stopMusic();
        this.gameOverMusic.play();
    }


}

class gameLevel {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.facts = document.getElementById("spaceText");
        this.timer = document.getElementById("timer-countDown");
        this.ticker = document.getElementById("flips-made");
        this.audioController = new AudioControls();
    }
    startGame() { //this function gets called everytime the game is started
        this.cardToCheck = null; // this property checks to see if the card is already flipped
        this.totalClicks = 0; //will reset the clicks to 0 at the start of game
        this.timeRemaining = this.totalTime; //We want the time to reset when the game starts
        this.matchedCards = []; // all matched cards that we get will go here and we will also use this to check if we have a victory
        this.randomFact = null;
        this.facts.innerHTML = "";
        this.busy = true;
        

        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleCards();
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 500);

        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;

    }

    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove("visible");
            card.classList.remove("matched");

        });

    }

    flipCard(card) {
        if (this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add("visible");

            if (this.cardToCheck)
                this.checkForCardMatch(card);
            else
                this.cardToCheck = card;
        }
    }

    checkForCardMatch(card) {
        if (this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else
            this.cardMisMatch(card, this.cardToCheck);

        this.cardToCheck = null;
    }

    cardMatch(card1, card2) {
        this.matchedCards.push(card1); 
        this.matchedCards.push(card2);
        card1.classList.add("matched");
        card2.classList.add("matched");
        this.audioController.match();
        this.getRandomFact();
    

        if (this.matchedCards.length === this.cardsArray.length) {
            this.victory();
        }
        
    }

    cardMisMatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove("visible");
            card2.classList.remove("visible");
            this.busy = false;
        }, 1000);
    }
    getCardType(card) {
        return card.getElementsByClassName("frontIMG")[0].src;
    }
    startCountDown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if (this.timeRemaining === 0)
                this.gameOver();
        }, 1000);

    }

    gameOver() {
        clearInterval(this.countDown);
        this.audioController.gameOver();
        document.getElementById("fail").classList.add("visible");
    }

    victory() {
        clearInterval(this.countDown);
        this.audioController.victory();
        document.getElementById("win").classList.add("visible");
    }


    shuffleCards() { /* using the fisher/Yates shuffling algorithm
                            1) this algorithm takes an array and works through it backwards from [-1] to [0]
                            2) for each iteration, it creates a random INT which is >= 0 and <= to i
                            3) it then exchanges the random number created with the position of the one being iterated, And thats the shuffle! */

        for (let i = this.cardsArray.length - 1; i > 0; i--) {
            let randomIndex = Math.floor(Math.random() * (i + 1));
            this.cardsArray[randomIndex].style.order = i;
            this.cardsArray[i].style.order = randomIndex;
        }
    }


    canFlipCard(card) {
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }

    getRandomFact() {
        const spaceFacts = ["At a constant temperature of 462° Celsius The hottest planet in our solar system is Venus",
        "The highest mountain discovered is the Olympus Mons on Mars which at its peak is 25km making it 3 times taller than MT.Everest", 
        "The Martian day (referred to as a Sol) is 24 hours 39 minutes and 35 seconds long",
        "At 119 yards (109 meters) long, the International Space Station is the largest manned object ever sent into space.",
        "At any given moment, there are at least 2,000 thunderstorms happening on Earth.", 
        "There are approximately 100 thousand million stars in the Milky Way.", 
        "The word “astronaut” means “star sailor” in its origins It is derived from the Greek words “astron”, meaning “star”, and “nautes”, which means “sailor”.",
        "There are 5 Dwarf Planets recognized in our Solar System. The Dwarf Planets are Ceres, Makemake, Haumea, Eris and Pluto"];
        const spaceText = document.getElementById('spaceText');
        const options = spaceFacts.filter(fact => fact !== spaceText.textContent);
        const randomIndex = Math.floor(Math.random() * options.length);
        spaceText.textContent = options[randomIndex];
    }


}


function ready() {
    let overlays = Array.from(document.getElementsByClassName("status-overlay"));
    let cards = Array.from(document.getElementsByClassName("card"));
    let game = new gameLevel(100, cards);
    
    startLevelOne();
    startLevelTwo();

    overlays.forEach((overlay) => {
        overlay.addEventListener("click", () => {
            overlay.classList.remove("visible");
            game.startGame();
        });
    });

    cards.forEach((card) => {
        card.addEventListener("click", () => {
            game.flipCard(card);
        });
    });
}


document.addEventListener("DOMContentLoaded", ready());


function startLevelOne(){
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get("difficulty");
    if(myParam == "cadet"){
        let cards = Array.from(document.getElementsByClassName("level1"));
        killLevel2Cards();
        killLevel3Cards();
    }
}

function startLevelTwo(){
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get("difficulty");
    if(myParam == "pilot"){
        killLevel3Cards();
    }
}





function killLevel2Cards(){
    let levelTwoCards = Array.from(document.getElementsByClassName("level2")); 
    for (i of levelTwoCards){
    i.classList.add("cardKiller")
    }
}

function killLevel3Cards(){
    let levelThreeCards = Array.from(document.getElementsByClassName("level3")); 
    for (i of levelThreeCards){
    i.classList.add("cardKiller")
    }
}s