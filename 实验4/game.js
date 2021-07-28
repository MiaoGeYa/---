
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

//背景
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function()
{
	bgReady = true;
}
bgImage.src = "background.png";

var setbg = function()
{
	bgImage.src = "background2.png";
}

//士兵
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function()
{
	heroReady = true;
}
heroImage.src = "hero.png"; 

//贼
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function()
{
	monsterReady = true;
}
monsterImage.src = "monster.png";

//游戏对象设置
var hero ={ speed:256 };  //移动的速度
var monster = {};
var monstersCaught = 0;
var life = 5;
//键盘响应
var keysDown = {};

addEventListener("keydown",
                function(e){keysDown[e.keyCode] = true;},
				false);

addEventListener("keyup",
                function(e){delete keysDown[e.keyCode];},
				false);

//士兵初始位置				
hero.x = canvas.width/2;
hero.y = canvas.height/2;
				
//士兵抓到贼之后重置游戏
var reset = function()
{
	//随机放置贼
	monster.x = 32 + (Math.random()*(canvas.width-64));
	monster.y = 32 + (Math.random()*(canvas.width-64));
	//判断贼的位置是否出界
	if(monster.x<30 || monster.x>452 || monster.y <32 || monster.y >400)
	{
		monster.x = 32 + (Math.random()*(canvas.width-64));
		monster.y = 32 + (Math.random()*(canvas.width-64));
	}
};

//更新游戏对象
var update = function(modifier)
{
	//判断失步移动的位置是否出界 出界重置
	if(hero.x<30 || hero.x>452 || hero.y <32 || hero.y >413)
	{
		life--;
		hero.x = canvas.width/2;
		hero.y = canvas.height/2;
	}
	
	if(38 in keysDown)   //向上移动
	{
		hero.y -= hero.speed*modifier;
	}
	
	if(40 in keysDown)   //向下移动
	{
		hero.y += hero.speed*modifier;
	}
	
	if(37 in keysDown)  //向左移动
	{
		hero.x -= hero.speed*modifier;
	}
	
	if(39 in keysDown)   //向右移动
	{
		hero.x += hero.speed*modifier;
	}
	
	//判断是否抓到贼
	if( hero.x <= (monster.x+32) && monster.x<= (hero.x+32)
		&&hero.y <= (monster.y+32) && monster.y <= (hero.y+32))
	{
		++monstersCaught;
		reset();
	}
	
};

//绘制所有的对象
var render = function()
{
	if(bgReady)
	{
		ctx.drawImage(bgImage,0,0);
	}
	
	if(heroReady)
	{
		ctx.drawImage(heroImage,hero.x,hero.y);
	}
	
	if(monsterReady)
	{
		ctx.drawImage(monsterImage,monster.x,monster.y);
	}
	
	//计算得分
	ctx.fillStyle = "rgb(250,250,250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("成功抓获： " + monstersCaught,32,32);
	
	ctx.fillStyle = "rgb(250,250,250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("生命值： " + life,350,32);
	
	if(life==0)
	{
		ctx.fillStyle = "rgb(250,250,250)";
		ctx.font = "50px Helvetica";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText("GameOver!",130,200);
	}
	
};

//主循环函数
var main = function()
{
	var now = Date.now();
	var delta = now - then;
	
	update(delta/1000);
	render();
	
	then = now;
	
	//重新绘制
	requestAnimationFrame(main);
};

// 多浏览器支持
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

//开始游戏
var then = Date.now();
reset();
main();

