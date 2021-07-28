//
var score = 0;  //得分
var walkNum = 0;  //步数

var pokes = {};
pokes.matchingGame = {};
pokes.matchingGame.cardWidth = 80;  //牌宽
pokes.matchingGame.cardHight = 120;  //牌高
pokes.matchingGame.deck
=[ "cardAK","cardAK",
	"cardAQ","cardAQ",
	"cardAJ","cardAJ",
	"cardBK","cardBK",
	"cardBQ","cardBQ",
	"cardBJ","cardBJ",
	"cardCK","cardCK",
	"cardCQ","cardCQ",
	"cardCJ","cardCJ",
	"cardDK","cardDK",
	"cardDQ","cardDQ",
	"cardDJ","cardDJ"];  //存放6对牌的数组
		
//随机排序扑克牌函数
function shuffle()
{
	return Math.random() > 0.5 ? -1 :1		
}

//翻牌功能
function selectCard()
{
	var $fcard = $(".card-flipped");
	//翻了两张牌后退出翻牌
	if($fcard.length > 1)
	{ return; }
	
	$(this).addClass("card-flipped");
	
	//翻动两张牌后检测这两张牌是否一样
	var $fcards = $(".card-flipped");
	if($fcards.length == 2)
	{
		walkNum++;
		setTimeout(function(){ checkPattern($fcards);},700);
	}
}

//检测两张牌是否一样
function checkPattern(cards)
{
	var pattern1 = $(cards[0]).data("pattern");
	var pattern2 = $(cards[1]).data("pattern");
	
	$(cards).removeClass("card-flipped");
	if(pattern1 == pattern2)
	{
		$(cards).addClass("card-removed")
		.bind("webkitTransitionEnd",
			  function(){ $(this).remove();});
			  score++;
	}
}

function getScore()
{
	return score;
}

function getwalkNum()
{
	return walkNum;
}







