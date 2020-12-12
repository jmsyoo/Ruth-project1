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
    this.data = [ //DB
      {
        level: 1, // javascript
        words: [
          "let",
          "length",
          "scope",
          "global",
          "const",
          "ajax",
          "json",
          "var",
          "each",
          "while",
          "substring"
        ],
        drawSpeed: 2000,
        downSpeed: 1000,
        point: 100,
      },
      {
        level: 2, // C#
        words: [
          "public",
          "protected",
          "private",
          "property",
          "abstract",
          "decimal",
          "internal",
          "interface",
          "linq",
          "delegate"
        ],
        drawSpeed: 1000,
        downSpeed: 500,
        point: 100,
      },
    ];
  }
}
class Game {
  constructor($eq) {
    this.nickName = null;
    this.level = null;
    this.data = []; //DB
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
    this.words.length = 0; // reset words array when generating new player
    this.count = 0; // reset word count to 0

    const newPlayer = new Player(nickName, this.level);
    this.startGame = true;
    newPlayer.isGameOn = this.startGame;
    newPlayer.level = 1;
    newPlayer.life = 5;
    this.data.push(newPlayer);

    // Set current game's nickname property
    const findName = this.data.map((item) => {
      if (item.isGameOn == true) {
        this.nickName = item.nickName;
      }
    });
    findName;

    this.words = this.setWords(this.nickName); // Assign words for current player
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

    this.words.length = 0;
    // Find words based on current player's level
    if (this.startGame == true) {
      // Check if game is on
      const words = new Words(); // create word instance from word class

      const index = this.data
        .map((item) => {
          return item.nickName;
        })
        .indexOf(nickName); // Get current player's index in object of array data.

      const level = this.data[index].level; // current level
      console.log(`current level: ${level}`) // checking current level
      this.drawSpeed = words.data[level - 1].drawSpeed; // star drawing speed found
      this.downSpeed = words.data[level - 1].downSpeed; // star falling speed found
      this.score = words.data[level - 1].point; // current level word point found

      /////// If player's level is 1 then return word array when generating player.(I am going to fix this later)
      if (level == 1) {
        return (this.words = this.shuffle(words.data[level - 1].words));
      } else {
        this.words = this.shuffle(words.data[level - 1].words); // directly assign words for current player
      }
      ///////////////////////////////
    }
  }
  //////// Below code is not mine. Fisher-Yates Shuffle (This works better than mine.)
  shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
  ///////////////////////////////////////////////////////////////////////////////////
  setLeftWidth() {
    let body = $("body").width(); // Get body width
    let container = $(this.$eq).width(); // Get container width
    let extraLeft = (body - container) / 2; // get margin between
    let randomLeft = Math.floor(Math.random() * this.$eq.width()); // Get random left

    return randomLeft + extraLeft;
  }
  draw() {
    let left = this.setLeftWidth(); // Genearate random left

    // check if star is drew outside of container
    if (left + 150 >= this.$eq.width()) {
      left = left - 150 + "px"; // if it's outside, deduct word div length
    } else {
      left + "px";
    }

    // Create div for star
    const $div = $("<div>")
      .addClass("star")
      .css("width", this.width)
      .css("height", this.height)
      .css("position", "absolute")
      .css("left", left) // assign left
      .css("text-align", "center")
      .text(this.words[this.count]);

    //console.log(this.words[this.count]) // Check words are drawing ok.
    this.$wordsDivs.push($div); // push stars inside div array
    $div.appendTo(this.$eq); // draw star in the sky one by one
    this.count++;
  }
  SetTop() {
    // This function create array for reseting each star div's top to 0. Each element will be designated to start div top.
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
  const $sky = $(".container");
  const $nickName = $("#nickName"); // nick name input
  const $submitNickNameBtn = $("#submitNickName"); // submit nickname button
  const $wordInput = $("#wordInput"); // word input
  const $startBtn = $("#startBtn"); // start button
  const $quitBtn = $("#quitBtn"); // quit game button
  const $instBtn = $("#instBtn"); // open instruction modal button
  const $closeBtn = $("#close"); // close instructon modal button
  const $recordBtn = $("#recordBtn") // Record modal button
  const $closeRecordBtn = $("#closeRecord");
  // Global variables
  var $playerLife = $("#playerLife");
  var $playerLevel = $("#playerLevel");
  var totalScore = 0;
  var $playerScore = $("#playerScore");
  var drawingStars = null;
  var fallingStars = null;
  var tempArray = [];
  var wordInputArr = [];
  var plusTop = null;
  var flashing = null;
  // Create Instance
  const game = new Game($sky);

  const openModal = () => {
    $("#modal").css("display", "flex");
  };
  const closeModal = () => {
    $("#modal").css("display", "none");
  };

  const openRecordModal = () => {
    $("#modal2").css("display", "flex");
  };
  const closeRecordModal = () => {
    $("#modal2").css("display", "none");
  }
  const loadPlayData = () => {
    let html = "";
    html += '<thead>'
    html += '<tr>'
    html += '<th>' + 'Nickname' + '</th>'
    html += '<th>' + 'Score' + '</th>'
    html += '<th>' + 'Level' + '</th>'
    html += '</tr>'
    html += '</thead>'
    html += '<tbody>';
    $(game.data).each(function (key, value) {
      html += '<tr>';
      html += '<td style="text-align:left;">' + value.nickName + '</td>';
      html += '<td>' + value.score + '</td>';
      html += '<td>' + value.level + '</td>';
      html += '</tr>';
    });
    html += "</tbody>";
    $(".table").html(html);
  };
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
    let totalHeight = $(game.$eq).height(); // get total height of falling area
    let groundHeight = $("#ground").height(); // get ground height
    let bottomLine = totalHeight - groundHeight; // get line where star to hit and deduct player's life.

    for (let i = 0; i < game.words.length; i++) { // Loop current stars
      if (i < game.$wordsDivs.length) {
        game.$wordsDivs[i].css("top", topArray[i] + "px");
        topArray[i] += downHeight;

        if (topArray[i] > bottomLine + downHeight) {
          // This line of code!!!!!!!!! 
          game.$wordsDivs[i].remove(); 
          // This remove the star from container but
          // code only works disapearing star from sky and still running behind.
          // so eventhough the star is disappeard, it keeps deducting player's life.

          //*** In order to solve the problem, I have to go around.(Not sure this is the right way but it works)***
          // 1. Declare tempArray
          // 2. push word name into tempArray if's it's not duplicated whenever star hit groud.
          // 3. Keep doing until tempArray length is same as player's life.
          ////////////////////////////////////////////////////
          let playerLifeTest = game.data[game.currentPlayerIndex].life;
          if(!tempArray.includes(game.words[i])){ // remove duplicated star

              let prvLenth =  tempArray.length; // previous length of temp array
              tempArray.push(game.words[i]); // push only unique word
              let curLength = tempArray.length; // current length of temp array

              console.log(tempArray)
              game.data[game.currentPlayerIndex].life--; // when star hit the ground, it pushed into temp array and life in data is deducted.            
              $playerLife.text(life - (curLength - prvLenth )); // display current life 

              if(tempArray.length == 5){ // So if temparray length becomes 5 stops the falling star. I will callback function here.
                  clearInterval(fallingStars);
                  $wordInput.prop("disabled", true);
                  alert('Game Over');
                  $quitBtn.text('RESART');
              }
          }
          /////////////////////////////////////////////////////

          if (game.words.length == game.$wordsDivs.length) {
            if ($(".star").length === 0) {
            //   alert("clear");
              clearInterval(fallingStars);
              clearInterval(drawingStars);
              winngingCondition();
            }
          }
        }
      }
    }
  };
  const down = () => {
    downWords(plusTop);
  };
  const flashingButton = () => {
    $startBtn.fadeOut(500).fadeIn(500).on("click", (event) => {
        clearInterval(flashing);
        $(event.target).prop("disabled",true).removeClass('buttonAble').addClass("buttonDsiable")
    })
  };
  const winngingCondition = () => {
    // Below code is winning condition
    if ($playerLife.text() != 0) { // life is not 0
      let totalWordCount = wordInputArr.length + tempArray.length;
     if ($(".star").length === 0 && totalWordCount == game.words.length) { 
      // I don't like this winning condition. No time to fix. ㅠ.ㅠ

       //Win Alert. Going to add display pop up when clear the level
       alert("You cleared level");
       //

       clearInterval(fallingStars); // clear falling star          
       clearInterval(drawingStars); // clear drawing star function
      game.data[game.currentPlayerIndex].level ++; // level up
      $playerLevel.text(game.data[game.currentPlayerIndex].level); // display player's current level
      game.$wordsDivs.length = 0;
      game.count = 0;
      tempArray.length = 0;
      wordInputArr.length = 0;
      game.data[game.currentPlayerIndex].life = 5;
      // Start button flashing
      flashing = setInterval(() => {
         flashingButton();
      }, 1000);
      $startBtn.prop("disabled", false);
      game.setWords(game.nickName); // Set word for current level
          
     }
   }
 //////////////////////////////////
}

  // Event Listiner
  $submitNickNameBtn.on("click", (event) => {
    if($nickName.val()!= ''){
        game.generatePlayer($nickName.val()); // Generate player functin confirmed.
    
    // Play button to show.
    $(".btn-group").hide();
    $(".playBtn-group").fadeIn("slow");

    // Letting plyer knows where to click for starting the game.
    flashing = setInterval(() => {
        flashingButton();
     }, 1000);
    }else{
        alert('Please write your nickname');
    }  
  });
  $startBtn.on("click", (event) => {
    game.findNickName(game.nickName); // find current player index for data array
    $wordInput.prop("disabled", false);
    $quitBtn.text('QUIT');

    $playerLife.text(game.data[game.currentPlayerIndex].life); // Display player life
    $playerLevel.text(game.data[game.currentPlayerIndex].level); // Display player level

    plusTop = game.SetTop(); // Set falling star top default 0

    drawingStars = setInterval(draw, game.drawSpeed);
    fallingStars = setInterval(down, game.downSpeed);
  });
  $wordInput.on("keyup", (event) => {
    let currentStarCount = $(".container").find(".star").length; // Check if stars in the sky

    if (currentStarCount > 0) {
      let inputValue = $(event.target).val();
      // if so start looping stars to check if typed word is matching.
      $(game.$wordsDivs).each(function (key, value) {

        if (inputValue.toLowerCase() === value.text()) {
          wordInputArr.push(inputValue); // This push in array is for checking winning condition.
          totalScore = totalScore + game.score; 
          game.data[game.currentPlayerIndex].score = totalScore; // update data for changed score
          $playerScore.text(totalScore); // update total score

          // if typed value is matching with falling words
          game.$wordsDivs[key].remove(); // remove falling word from sky
          plusTop[key] = -10000; // This line of code need to be replaced with something else.

          $(event.target).val(""); // set input value default empty

        winngingCondition(); // Call function
        }      
      });
    }
  });
  // Quit button to stop the game
  $quitBtn.on("click", (event) => {
    clearInterval(fallingStars); // clear fallin star function
    clearInterval(drawingStars); // clear drawing star function

    // start button ables to click
    $startBtn.removeClass("buttonDsiable").addClass("buttonAble")

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
    $playerLife.text('');
    $playerLevel.text('');
    wordInputArr.length = 0;
    tempArray.length = 0;
  });

  $instBtn.on('click',openModal)
  $closeBtn.on('click',closeModal);

  $recordBtn.on("click",(event) => {
      openRecordModal();
      loadPlayData();
  });
  $closeRecordBtn.on("click", (event) => {
      closeRecordModal();
  })
  
});