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
    this.width = "150px";
    this.height = "30px";
    this.count = 0;
    this.words = [];
    this.drawSpeed = null;
    this.downSpeed = null;
    this.$divs = [];
    this.$eq = $eq;
  }
  generatePlayer(nickName) {
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
  }
  setWords(nickName) {
    if (this.startGame == true) {
      const words = new Words();
      const index = this.data
        .map((item) => {
          return item.nickName;
        })
        .indexOf(nickName);

      const level = this.data[index].level;
      this.drawSpeed = words.data[level - 1].drawSpeed;
      this.downSpeed = words.data[level - 1].downSpeed;
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
        
    this.$divs.push($div);
    $div.appendTo(this.$eq);
    this.count++;

    console.log(this.$divs)
  }
  setLeftWidth() {
    let body = $("body").width(); // Get body width
    let container = $(this.$eq).width(); // Get container width
    let extraLeft = (body - container) / 2; // get margin between
    let randomLeft = Math.floor(Math.random() * this.$eq.width()); // Get random left

    return randomLeft + extraLeft;
  }
  SetTop() {
    const addTop = new Array(this.words.length);
    for (let i = 0; i < addTop.length; i++) {
      addTop[i] = 0;
    }
    return addTop;
  }
  down(plusTop) {
    // set height interval
    let downHeight = parseInt(this.height.replace("px", ""));

    // Calculate bottom line where word to hit damage life
    let totalHeight = $(this.$eq).height(); // total height of falling area
    let groundHeight = $("#ground").height(); // ground height
    let bottomLine = totalHeight - groundHeight;

    // declare empty array for top array
    let topArray = [];
    topArray = plusTop;
    $(this.$divs).each(function (key, value) {
      value.css("top", topArray[key] + "px");
      if (topArray[key] >= bottomLine) {
        $(this).remove();
      }
      topArray[key] += downHeight;
    });
  }
}



$(() => {
  // Cache the dom nodes
  const $sky = $(".container");
  const $wordInput = $("#wordInput");
  const $submitNickNameBtn = $("#submitNickName");
  const $nickNameValue = $("#nickName");
  const $quitBtn = $("#quitBtn");

  // Create instance
  const newGame = new Game($sky);

  $submitNickNameBtn.on("click", (event) => {
    newGame.generatePlayer($nickNameValue.val()); // Genearate Player

    $(".btn-group").hide();
    $(".playBtn-group").fadeIn("slow");

    const plusTop = newGame.SetTop(); // Set words top default 0
    // Down words
    const down = () => {
      newGame.down(plusTop);
    };
    // Draw words on top of the page
    const draw = () => {
      newGame.draw();
      const maxIndex = newGame.words.length;
      if (maxIndex == newGame.count) {
        clearInterval(drawingStars); // if words are all drawn clear draw function.
      }
    };
    const drawingStars = setInterval(draw, newGame.drawSpeed);
    const fallingStars = setInterval(down, newGame.downSpeed);
    drawingStars;
    fallingStars;
  });

  // Quit button to reset
  $quitBtn.on("click", (event) => {
    $nickNameValue.val("");
    $(".playBtn-group").hide();
    $(".btn-group").fadeIn("slow");

    for (let i = 0; i < newGame.data.length; i++) {
      newGame.data[i].isGameOn = false;
    }

    $($eq).find(".star").remove();
    console.log(newGame.data);
  });

  console.log(newGame.data);
  $wordInput.on("keyup", (event) => {
    $(newGame.$divs).each(function (key, value) {
      let typed = $(event.target).val(); // typed value

      if (typed === value.text()) {
        // if typed value is matching with falling words
        value.remove(); // remove falling word
        $(event.target).val(""); // set input value default empty
      }
    });
  });
});