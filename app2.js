class Player {
  constructor(nickName) {
    this.nickName = nickName;
    this.score = 0;
    this.life = 0;
    this.level = null;
    this.isGameOn = false;
  }
}
class Words {
  constructor() {
    this.data = [
      {
        level: 1,
        words: [
          "let",
          "length",
          "scope",
          "global",
          "const",
          "ajax",
          "json",
          "var",
          "for",
          "while",
        ],
        drawSpeed: 2000,
        downSpeed: 1000,
        point: 100,
      },
      {
        level: 2,
        words: ["public", "protected", "private", "property", "abstract"],
        drawSpeed: 1000,
        downSpeed: 500,
        point: 200,
      },
    ];
  }
}
class Game {
  constructor($eq) {
    this.nickName = null;
    this.level = null;
    this.data = [];
    this.startGame = false;
    this.isGameOver = false;
    this.width = "200px";
    this.height = "30px";
    this.count = 0;
    this.words = [];
    this.drawSpeed = null;
    this.downSpeed = null;
    this.score = 0;
    this.$wordsDivs = [];
    this.$eq = $eq;
    this.currentPlayerIndex = null;
  }
  generatePlayer(nickName) {
    this.words.length = 0; // reset array
    this.count = 0; // reset count

    const newPlayer = new Player(nickName, this.level);
    this.startGame = true;
    newPlayer.isGameOn = this.startGame;
    newPlayer.level = 1;
    newPlayer.life = 5;
    this.data.push(newPlayer);

    // Find isGameOn Nickname // Replace this with function later!!!!!!!!!!
    const findName = this.data.map((item) => {
      if (item.isGameOn == true) {
        this.nickName = item.nickName;
      }
    });
    findName;
    this.words = this.setWords(this.nickName);
  }
  findNickName(nickName) {
    const index = this.data
      .map((item) => {
        if (item.isGameOn == true) {
          return item.nickName;
        }
      })
      .indexOf(nickName);
    this.currentPlayerIndex = index;
  }
  setWords(nickName) {
    if (this.startGame == true) {
      const words = new Words();

      const index = this.data
        .map((item) => {
          return item.nickName;
        }).indexOf(nickName);

      const level = this.data[index].level;
      this.drawSpeed = words.data[level - 1].drawSpeed;
      this.downSpeed = words.data[level - 1].downSpeed;
      this.score = words.data[level - 1].point;
      return this.shuffle(words.data[level - 1].words); // return words
    }
  }
  shuffle(array) { // Fisher-Yates Shuffle 
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }
  setLeftWidth() {
    let body = $("body").width(); // Get body width
    let container = $(this.$eq).width(); // Get container width
    let extraLeft = (body - container) / 2; // get margin between
    let randomLeft = Math.floor(Math.random() * this.$eq.width()); // Get random left

    return randomLeft + extraLeft;
  }
  draw() {
    let left = this.setLeftWidth();

    // check if word is drew outside of container
    if (left + 150 >= this.$eq.width()) {
      left = left - 150 + "px"; // if it's outside, deduct word div length
    } else {
      left + "px";
    }

    const $div = $("<div>")
      .addClass("star")
      .css("width", this.width)
      .css("height", this.height)
      .css("position", "absolute")
      .css("left", left)
      .css("text-align", "center")
      .text(this.words[this.count]);

    //console.log(this.words[this.count]) // Check words are drawing ok.
    this.$wordsDivs.push($div);
    $div.appendTo(this.$eq);
    this.count++;
  }
  SetTop() {
    let addTop = [];
    addTop = new Array(this.words.length);
    for (let i = 0; i < addTop.length; i++) {
      addTop[i] = 0;
    }
    return addTop;
  }
}

// Cache the dom nodes
$(() => {
  const $sky = $(".container"); // content for putting words
  const $wordInput = $("#wordInput");
  const $submitNickNameBtn = $("#submitNickName");
  const $nickName = $("#nickName");
  const $startBtn = $("#startBtn");
  const $quitBtn = $("#quitBtn");
  var $playerLife = $("#playerLife");
  var totalScore = 0;
  var $playerScore = $("#playerScore");
  var drawingStars = null;
  var fallingStars = null;
  var tempArray = [];
  var plusTop = null;

  const game = new Game($sky);
  // Event Listiner

  // Drawing stars
  const draw = () => {
    game.draw();
    const maxIndex = game.words.length;

    if (maxIndex == game.count) {
      clearInterval(drawingStars); // if words are all drawn, clear draw function.
    }
  };
  const downWords = (plusTop) => {
    
    // declare empty array for top array
    let topArray = [];
    topArray = plusTop;


    let life = $playerLife.text();

    // set height interval
    let downHeight = parseInt(game.height.replace("px", ""));

    // Calculate bottom line where word to hit damage life
    let totalHeight = $(game.$eq).height(); // total height of falling area
    let groundHeight = $("#ground").height(); // ground height
    let bottomLine = totalHeight - groundHeight;

    for (let i = 0; i < game.words.length; i++) {
      if (i < game.$wordsDivs.length) {
        game.$wordsDivs[i].css("top", topArray[i] + "px");
        topArray[i] += downHeight;

        if (topArray[i] > bottomLine + downHeight) {
          console.log(game.words[i] + ' : '+ topArray[i] + ':' + bottomLine);

          // This line of code!!!!!!!!! 
          game.$wordsDivs[i].remove(); // remove from container // this code works only disapearing star from container div and still running behind.
          //so it keeps deducting player life eventhough star is landed on the ground.

          // In order to solve the problem, I have to go around.(Not sure this is the right way but it made works)
          // Add words to temp array
          ////////////////////////////////////////////////////
          if(!tempArray.includes(game.words[i])){ // remove duplicated star

              let prvLenth =  tempArray.length; // previous length of temp array
              tempArray.push(game.words[i]); // push only unique word
              let curLength = tempArray.length; // current length of temp array

              game.data[game.currentPlayerIndex].life--; // when star hit the ground, it pushed into temp array and life in data is deducted.            
              $playerLife.text(life - (curLength - prvLenth )); // display current life 

              if(tempArray.length == 5){ // So if temparray length becomes 5 stops the falling star.
                  clearInterval(fallingStars);
              }
          }
          ////////////////////////////////////////////////////

          if (game.words.length == game.$wordsDivs.length) {
            if ($(".star").length === 0) {
            //   alert("clear");
              clearInterval(fallingStars);
            }
          }
        }
      }
    }
  };
  const down = () => {
    downWords(plusTop);
  };

  $submitNickNameBtn.on("click", (event) => {
    game.generatePlayer($nickName.val()); // Generate player functin confirmed.
    // Play button to show.
    $(".btn-group").hide();
    $(".playBtn-group").fadeIn("slow");

     const flashingStartButton = setInterval(() => {
        $startBtn.fadeOut(500).fadeIn(500).on("click", (event) => {
            clearInterval(flashingStartButton);
            $(event.target).prop("disabled",true);
        })
     }, 1000);
     
  });
  $startBtn.on("click", (event) => {
    game.findNickName(game.nickName); // set current player index for data array
    console.log(game.data) // Checking current user
    $playerLife.text(game.data[game.currentPlayerIndex].life);

    plusTop = game.SetTop(); // Set words top default 0

    drawingStars = setInterval(draw, game.drawSpeed);
    fallingStars = setInterval(down, game.downSpeed);
  });

  $wordInput.on("keyup", (event) => {
    let currentStarCount = $(".container").find(".star").length; // Check if stars in the sky

    if (currentStarCount > 0) {
      let inputValue = $(event.target).val();
      // if so start looping stars to check if typed word is matching.
      $(game.$wordsDivs).each(function (key, value) {
        console.log(`${inputValue} : ${value.text()} ${currentStarCount}`);
        if (inputValue === value.text()) {
          totalScore = totalScore + game.score;
          game.data[game.currentPlayerIndex].score = totalScore;
          $playerScore.text(totalScore);

          // if typed value is matching with falling words
          console.log(game.$wordsDivs[key].text());
          game.$wordsDivs[key].remove(); // remove falling word from sky
          plusTop[key] = -10000;

          // Level up function
          // completeLevel(typed);

          $(event.target).val(""); // set input value default empty

          if (game.words.length == game.$wordsDivs.length) {
            if ($(".star").length === 0) {
            //   alert("clear");
              clearInterval(fallingStars);
            }
          }
        }
      });
    }
  });

  // Level up condition Not yet
  const winCondition = (word) => {
    const index = $tempArray
      .map((item) => {
        return item;
      }).indexOf(word);

    $tempArray.splice(index, 1);

    const currentLength = $tempArray.length;
    if (currentLength == 0) {
      const dataIndex = game.findNickName(game.nickName);
      game.data[dataIndex].level = game.data[dataIndex].level + 1; // level up
      $wordInput.prop('disabled', true);
      console.log(game.data);
    }
  };
  
  // Quit button to reset
  $quitBtn.on("click", (event) => {
    clearInterval(fallingStars);
    clearInterval(drawingStars);

    $(".playBtn-group").hide("slow");
    $(".btn-group").show("slow");

    $nickName.val("");
    for (let i = 0; i < game.data.length; i++) {
      game.data[i].isGameOn = false;
    }

    game.isGameOn = false;
    game.words.length = 0;
    game.$wordsDivs.length = 0;
    $(".star").remove();
    game.SetTop();
    totalScore = 0;
    $playerScore.text('');
    $startBtn.prop("disabled",false);
  });
});