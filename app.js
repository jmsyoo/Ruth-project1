console.log($)

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
    this.width = "150px";
    this.height = "30px";
    this.count = 0;
    this.words = [];
    this.drawSpeed = null;
    this.downSpeed = null;
    this.score = 0;
    this.$divs = [];
    this.$eq = $eq;
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

    // Find isOnGame Nickname
    const findName = this.data.map((item) => {
        if(item.isGameOn == true){
          this.nickName = item.nickName;
        }
    })
    findName;
    this.words = this.setWords(this.nickName);
    //console.log(`${this.nickName} :  ${this.words}`); // Check if new user assign word array
  }
  findNickName(nickName){
    const index = this.data.map((item) => {
      if(item.isGameOn == true){
        return item.nickName;
      }
    }).indexOf(nickName);

    return index;
  }
  setWords(nickName) {
    if (this.startGame == true) {
      const words = new Words();

      const index = this.data.map((item) => {
          return item.nickName;
        }).indexOf(nickName);

      const level = this.data[index].level;
      this.drawSpeed = words.data[level - 1].drawSpeed;
      this.downSpeed = words.data[level - 1].downSpeed;
      this.score = words.data[level -1 ].point;
      return words.data[level - 1].words; // return words
    }
  }
  draw() {
    let left = this.setLeftWidth();

    // check if word is drew outside of container
    if (left + 150 >= this.$eq.width()) {
        left = (left - 150) + "px"; // if it's outside, deduct word div length
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
    this.$divs.push($div);
    $div.appendTo(this.$eq);
    this.count++;
  }
  setLeftWidth() {
    let body = $("body").width(); // Get body width
    let container = $(this.$eq).width(); // Get container width
    let extraLeft = (body - container) / 2; // get margin between
    let randomLeft = Math.floor(Math.random() * this.$eq.width()); // Get random left

    return randomLeft + extraLeft;
  }
  SetTop() {
    let addTop = [];
    addTop = new Array(this.words.length);
    for (let i = 0; i < addTop.length; i++) {
      addTop[i] = 0;
    }
    return addTop;
  }
  down(plusTop) {

    // declare hit count
    let hitCount = 0;

    // set height interval
    let downHeight = parseInt(this.height.replace("px", ""));

    // Calculate bottom line where word to hit damage life
    let totalHeight = $(this.$eq).height(); // total height of falling area
    let groundHeight = $("#ground").height(); // ground height
    let bottomLine = totalHeight - groundHeight;

    // declare empty array for top array
    let topArray = [];
    topArray = plusTop;

    const indexData = this.findNickName(this.nickName); // Get current player index

    let $divKey = null;
    let isHit = false;

    $(this.$divs).each(function (key, value) {
      // console.log(`${$(value).text()}: ${topArray[key]}`)
      value.css("top", topArray[key] + "px");
      if (topArray[key] >= bottomLine) {

        $(this).remove(); // remove from screen
        isHit = true; // set hit ture
        $divKey = key; // assign $divs index key
      }
      topArray[key] += downHeight;
    });

    if (isHit == true) {
      this.$divs.splice($divKey, 1);
      this.data[indexData].life --;
      $("#playerLife").text(this.data[indexData].life);
      console.log(this.data); // check data

      if(this.data[indexData].life ==0){
        this.isGameOver = true;
      }    
    }
  }
}

$(() => {
  // Cache the dom nodes
  const $sky = $(".container");
  const $wordInput = $("#wordInput");
  const $submitNickNameBtn = $("#submitNickName");
  const $nickNameValue = $("#nickName");
  const $quitBtn = $("#quitBtn");
  var totalScore = 0;
  var $playerScore = $("#playerScore");
  var $tempArray = [];

  // Create instance
  const newGame = new Game($sky);
  var drawingStars = null;
  var fallingStars = null;

  $submitNickNameBtn.on("click", (event) => {

    // Generate Player
    newGame.generatePlayer($nickNameValue.val());

    // Nickname hide, play button show
    $(".btn-group").hide();
    $(".playBtn-group").fadeIn("slow");

    // Show player life
    const life = newGame.data[newGame.findNickName(newGame.nickName)].life;
    $("#playerLife").text(life);

    const drawingStar = setInterval(() => {
      draw_();

    }, newGame.drawSpeed);

    drawingStar;

  })
  const draw_ = () => {
    // create random left
    let left = newGame.setLeftWidth();

    // check if word is drew outside of container
    if (left + 150 >= newGame.$eq.width()) {
        left = (left - 150) + "px"; // if it's outside, deduct word div length
      } else {
        left + "px";
      }

    const $div = $("<div>")
      .addClass("star")
      .css("width", newGame.width)
      .css("height", newGame.height)
      .css("position", "absolute")
      .css("left", left)
      .css("text-align", "center")
      .text(newGame.words[newGame.count]);
      
    newGame.$divs.push($div); // Check this array!!! 

    $div.appendTo(newGame.$eq);
    newGame.count++;

    console.log(newGame.data);
  }





  // $submitNickNameBtn.on("click", (event) => {
  //   newGame.generatePlayer($nickNameValue.val()); // Genearate Player
  //   $(".btn-group").hide();
  //   $(".playBtn-group").fadeIn("slow");

  //   const life = newGame.data[newGame.findNickName(newGame.nickName)].life;
  //   $("#playerLife").text(life);
  //   // Draw words on top of the page
  //   const draw = () => {
  //     newGame.draw();
  //     const maxIndex = newGame.words.length;
  //     if (maxIndex == newGame.count) {
  //       clearInterval(drawingStars); // if words are all drawn clear draw function.
  //     }
  //   };
  //   var plusTop = newGame.SetTop(); // Set words top default 0
  //   // Down words
  //   const down = () => {

  //     if(newGame.isGameOver == true){
  //       clearInterval(fallingStars);
  //       console.log('Game over')
  //     }
  //     newGame.down(plusTop);
  //   };
    
  //   newGame.words.map((item) => {
  //     $tempArray.push(item);
  //   });
  //   console.log($tempArray);
  
  //   drawingStars = setInterval(draw, newGame.drawSpeed);
  //   fallingStars = setInterval(down, newGame.downSpeed);
  // });

  $wordInput.on("keyup", (event) => {

    $(newGame.$divs).each(function (key, value) {    
      let typed = $(event.target).val(); // typed value
      if (typed === value.text()) {

        // newGame.$divs.splice(key,1);      
        // console.log(newGame.$divs);

        totalScore = totalScore  + newGame.score;
        const index = newGame.findNickName(newGame.nickName);
        newGame.data[index].score = totalScore; // Score Update
        $playerScore.text(totalScore);

        // if typed value is matching with falling words
        value.remove(); // remove falling word from sky

        // Level up function
        completeLevel(typed);
        
        $(event.target).val(""); // set input value default empty
      }
    });
  });

  const completeLevel = (word) => {
    const index = $tempArray
      .map((item) => {
        return item;
      }).indexOf(word);

    $tempArray.splice(index, 1);

    const currentLength = $tempArray.length;
    if (currentLength == 0) {
      console.log(newGame.data);
      const dataIndex = newGame.findNickName(newGame.nickName);
      console.log(newGame.data[dataIndex].level)
      newGame.data[dataIndex].level = newGame.data[dataIndex].level + 1; // level up
      $wordInput.prop('disabled', true);
      console.log(newGame.data);
    }
  };
  
  // Quit button to reset
  $quitBtn.on("click", (event) => {
    $nickNameValue.val("");
    totalScore = 0;
    $(".playBtn-group").hide();
    $(".btn-group").fadeIn("slow");

    for (let i = 0; i < newGame.data.length; i++) {
      newGame.data[i].isGameOn = false;
    }
    drawingStars = clearInterval(drawingStars)
    fallingStars = clearInterval(fallingStars)
    $sky.find(".star").remove();
    newGame.$divs.length = 0; // empty $divs array
    $playerScore.text(0);
  });

});
  
const data1 = [
  {name : "prod1"},{name : "prod2"},{name : "prod3"}
];

const data2 = [
  {name : "prod1", color: "red", onhand : 1},
  {name : "prod1", color: "green", onhand : 2},
  {name : "prod1", color: "blue", onhand : 3},

  {name : "prod2", color: "red", onhand : 1},
  {name : "prod2", color: "green", onhand : 2},
  {name : "prod2", color: "blue", onhand : 3},

  {name : "prod3", color: "red", onhand : 1},
  {name : "prod3", color: "green", onhand : 2},
  {name : "prod3", color: "blue", onhand : 3},
];

const data3 = [
  {name : "prod1", color : ["red","green","blue"], onhand : [1,2,3] }
]