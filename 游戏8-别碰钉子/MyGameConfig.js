//
var MW = MW || {};

MW.SOUND = true;
MW.SCORE = 0;    //分数
MW.GAME_STATUS = { GAME_START : 0, GAME_IN : 1, GAME_OVER : 2};  //游戏状态

MW.CUR_GAME_STATUS = MW.GAME_STATUS.GAME_START;   //游戏当前状态

MW.BLOCK_SPACES = 40;
MW.TOP_BLOCK_CNT = 9;

MW.BLOCK_UP_TAG = 10;
MW.BLOCK_DOWN_TAG = 30;
MW.BLOCK_LEFT_TAG = 50;
MW.BLOCK_RIGHT_TAG = 70;

MW.TOUCH_FLAG = true;

MW.LEVEL_UP_EVERY = 1;

MW.BLOCK_WIDTH = 112;
MW.BLOCK_HEIGHT = 60;

var getBlockCount = function(directionX)
{
	return 2;
}

var getSpriteRect = function(sprite)
{
	var size = sprite.getContentSize();
	return cc.rect(sprite.x - size.width/2,sprite.y - size.height/2,size.width,size.height);
}