var computerPlays = true;

// Starting question for game
setTimeout(function () {
    $(".settings").removeClass("hide");
}, 1500);

$(".with-friend").on("click", function () {
    console.log("with friend");
    $(".settings").addClass("hide");
    computerPlays = false;
});

$(".against-computer").on("click", function () {
    console.log("against computer");
    $(".settings").addClass("hide");
    computerPlays = true;
    $(".computer").text("Computer: ");
});

// SET VARIABLE FOR COMPUTER PLAYING:
// var computerPlays = true;

// SET VARIABLES FOR WIN COUNTER:
var winCounterOne = 0;
var winCounterTwo = 0;

// SET VARIABLE FOR THE DIAGONAL COMBINATIONS OF FOURS:
var diagonals = [
    [0, 7, 14, 21],
    [1, 8, 15, 22],
    [2, 9, 16, 23],
    [3, 8, 13, 18],
    [4, 9, 14, 19],
    [5, 10, 15, 20],
    [6, 13, 20, 27],
    [7, 14, 21, 28],
    [8, 15, 22, 29],
    [9, 14, 19, 24],
    [10, 15, 20, 25],
    [11, 16, 21, 26],
    [12, 19, 26, 33],
    [13, 20, 27, 34],
    [14, 21, 28, 35],
    [15, 20, 25, 30],
    [16, 21, 26, 31],
    [17, 22, 27, 32],
    [18, 25, 32, 39],
    [19, 26, 33, 40],
    [20, 27, 34, 41],
    [21, 26, 31, 36],
    [22, 27, 32, 37],
    [23, 28, 33, 38],
];

// SET VARIABLE FOR CURRENT PLAYER
var currentPlayer = "player-1";
var messageText = "";

// Function for setting announce player display
function announcePlayer() {
    if (computerPlays && currentPlayer == "player-2") {
        $(".announce-player span").text("computer");
    } else {
        $(".announce-player span").text(currentPlayer);
    }
    if (currentPlayer == "player-1") {
        $(".announce-player").css("backgroundColor", "#679e15");
    } else {
        $(".announce-player").css("backgroundColor", "#6b6bd6");
    }
}

announcePlayer();

// SELECT THE COLUMNS AND ALL SLOTS:
var columns = $(".column");
var slots = $(".hole");

// ADD MOUSEOVER EVENT LISTENER TO COLUMS TO HIGHLIGHT THEM:
columns.on("mouseover", function (e) {
    if (currentPlayer != "player-2" && computerPlays) {
        // SELECT THE LIST OF SLOTS IN CURRENT COLUMN:
        var currentColumn = $(e.currentTarget).children();
        // ADD COLUMN-HIGHLIGHT CLASS TO EACH HOLE IN COLUMN:
        for (var i = currentColumn.length - 1; i >= 0; i--) {
            currentColumn.eq(i).addClass("column-highlight");
        }
    } else if(!computerPlays) {
        // SELECT THE LIST OF SLOTS IN CURRENT COLUMN:
        var currentColumn = $(e.currentTarget).children();
        // ADD COLUMN-HIGHLIGHT CLASS TO EACH HOLE IN COLUMN:
        for (var i = currentColumn.length - 1; i >= 0; i--) {
            currentColumn.eq(i).addClass("column-highlight");
        }
    }
});

// ADD MOUSEOUT EVENT LISTENER TO COLUMS TO REMOVE HIGHLIGHT:
columns.on("mouseout", function (e) {
    // SELECT THE LIST OF SLOTS IN CURRENT COLUMN:
    var currentColumn = $(e.currentTarget).children();
    // ADD COLUMN-HIGHLIGHT CLASS TO EACH HOLE IN COLUMN:
    for (var i = currentColumn.length - 1; i >= 0; i--) {
        currentColumn.eq(i).removeClass("column-highlight");
    }
});

// ADD CLICK EVENT LISTENER TO COLUMNS TO INSERT COINS
columns.on("click", function (e) {
    // SELECT THE CURRENT COLUMN:
    if (computerPlays) {
        if (currentPlayer == "player-1") {
            var currentColumn = $(e.currentTarget);
        } else {
            var randomColumn = Math.floor(Math.random() * 6);
            var currentColumn = $(".column").eq(randomColumn);
        }
    } else {
        var currentColumn = $(e.currentTarget);
    }

    // SELECT THE LIST OF SLOTS IN CURRENT COLUMN:
    var slotsInCurrentColumn = currentColumn.children().children();
    // CALL INSERTCOIN AND GET THE ROW OF THE INSERTED COIN:
    var rowNumber = insertCoin(slotsInCurrentColumn);

    // CHECK VICTORIES:
    var slotsInCurrentRow = $(".row-" + rowNumber).children();
    if (checkVictory2()) {
        winCount();
        computerWinCheck();
        messageText = "Diagonal win for " + currentPlayer;
        victoryDeclaration(messageText);
    } else if (checkVictory1(slotsInCurrentColumn)) {
        winCount();
        computerWinCheck();
        messageText = "Column win for " + currentPlayer;
        victoryDeclaration(messageText);
    } else if (checkVictory1(slotsInCurrentRow)) {
        winCount();
        computerWinCheck();
        messageText = "Row win for " + currentPlayer;
        victoryDeclaration(messageText);
    }

    // CREATE A FUNCTION FOR COUNTING THE WINS:
    function winCount() {
        // First highlight the 4 winning slots:
        flashWinningFour();
        if (currentPlayer == "player-1") {
            winCounterOne++;
            setTimeout(function() {
                $(".wins-1").text(winCounterOne);
                $(".wins-1").fadeOut(250).fadeIn(250).fadeOut(250).fadeIn(250);
            }, 2100);
            // $(".wins-1").text(winCounterOne);
        } else {
            winCounterTwo++;
            setTimeout(function() {
                $(".wins-2").text(winCounterTwo);
                $(".wins-2").fadeOut(250).fadeIn(250).fadeOut(250).fadeIn(250);
            }, 2100);
            // $(".wins-2").text(winCounterTwo);
        }
    }

    function flashWinningFour() {
        $(".possible-win")
            .hide(350)
            .show(350)
            .hide(350)
            .show(350)
            .hide(350)
            .show(350);
    }

    // Function for checking if current player is the computer
    function computerWinCheck() {
        if (computerPlays && currentPlayer == "player-2") {
            currentPlayer = "computer";
        }
    }

    // SWITCH PLAYER EXCEPT IF A COIN IS INSERTED IN A FULL COLUMN:
    if (rowNumber < 0) {
        // IF THE COLUMN IS FULL:
        return;
    } else {
        switchPlayer();
    }
});

// CREATE A FUNCTION FOR INSERTING THE COINS:
function insertCoin(slotsInCurrentColumn) {
    // LOOP THROUGH LIST OF CURRENT COLUMN FROM BOTTOM TO TOP:
    for (var i = slotsInCurrentColumn.length - 1; i >= 0; i--) {
        // CHECK IF COLUMN IS FILLED (HAS A BACKGROUND COLOR CLASS):
        if (
            !slotsInCurrentColumn.eq(i).hasClass("player-1") &&
            !slotsInCurrentColumn.eq(i).hasClass("player-2")
        ) {
            // ADD BACKGROUND COLOR CLASS TO THAT SLOT:
            slotsInCurrentColumn.eq(i).addClass(currentPlayer);
            return i;
            // break;
        }
    }
}

// CREATE A FUNCTION FOR SWITCHING THE PLAYER
function switchPlayer() {
    if (currentPlayer == "player-1") {
        currentPlayer = "player-2";
    } else {
        currentPlayer = "player-1";
    }
    announcePlayer();
}

// CREATE A FUNCTION FOR CHECKING THE VICTORY IN COLUMS AND ROWS:
function checkVictory1(slots) {
    // CREATE A VARIABLE FOR COUNTING OF COINS NEXT TO EACH OTHER:
    var count = 0;
    // LOOP THROUGH THE COLUMNS / ROWS:
    for (var i = 0; i < slots.length; i++) {
        // CHECK IF THE SLOT HAS A COIN OF THE CURRENT PLAYER
        if (slots.eq(i).hasClass(currentPlayer)) {
            count++;
            slots.eq(i).addClass("possible-win");
            if (count === 4) {
                return true;
            }
        } else {
            // RESET THE COUNT IF THE SLOT HAS NO COIN OF CURRENT PLAYER:
            count = 0;
            removePossibleWin();
        }
    }
}

function removePossibleWin() {
    for (var i = 0; i < slots.length; i++) {
        slots.eq(i).removeClass("possible-win");
    }
}

// CREATE A FUNCTION TO CHECK FOR DIAGONAL VICTORIES:
function checkVictory2() {
    var count = 0;
    var positionNumber = 0;
    // LOOP THROUGH THE ARRAY OF DIAGONALS ARRAYS (OUTER LOOP):
    for (var i = 0; i < diagonals.length; i++) {
        // RESET THE COUNT VARIABLE FOR THE INNER LOOP:
        count = 0;
        removePossibleWin();
        // LOOP THROUGH EACH NUMBERS ARRAY (INNER LOOPS):
        for (var k = 0; k < 4; k++) {
            positionNumber = diagonals[i][k];
            // CHECK IF ALL POSITIONS HAVE A COIN OF THE CURRENT PLAYER:
            if (slots.eq(positionNumber).hasClass(currentPlayer)) {
                slots.eq(positionNumber).addClass("possible-win");
                count++;
                if (count === 4) {
                    return true;
                }
            }
        }
    }
}

// CREATE A FUNCTION FOR THE VICTORY MESSAGE DECLARATION:
function victoryDeclaration(message) {
    setTimeout(function () {
        $(".message").removeClass("hide");
        $(".message-text p").text(messageText);
        // switchPlayer();
    }, 3000);
}

// CREATE AN EVENT LISTENER ON RESET BUTTON FOR RESETTING THE GAME:
$(".restart-game").on("click", function () {
    location.reload();
});

// CREATE AN EVENT LISTENER ON PLAY AGAIN BUTTON TO CONTINUE PLAYING:
$(".play-again").on("click", function () {
    resetBoard();
    $(".message").addClass("hide");
});

// CREATE FUNCTION FOR RESETTING THE BOARD:
function resetBoard() {
    for (var i = 0; i < slots.length; i++) {
        slots.eq(i).removeClass("player-1");
        slots.eq(i).removeClass("player-2");
        slots.eq(i).removeClass("possible-win");
        slots.eq(i).removeClass("flash");
    }
}
