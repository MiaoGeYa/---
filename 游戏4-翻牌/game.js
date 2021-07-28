//全局变量
var gameLayer;
var gameArray = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7];
var pickedTiles = [];
var scoreText;
var moves = 0;

var gameScene = cc.Scene.extend
({
    onEnter:function () 
	{
        this._super();
		gameArray = shuffle(gameArray);
		gameLayer = new game();
		gameLayer.init();
	    this.addChild(gameLayer);
    }
});

var game = cc.Layer.extend
({
    init:function () 
    {
        this._super();
      
        var backgroundLayer = new cc.LayerColor(new cc.Color(40,40,40,255),64,960);
        this.addChild(backgroundLayer);
        
        var gradient = new cc.LayerGradient(cc.color(0,0,0,255),cc.color(0x46,0x82,0xB4,255));
        this.addChild(gradient);
		
        //点击的步数
        scoreText = new cc.LabelTTF("Moves: 0","Arial","48");
		this.addChild(scoreText);
		scoreText.setPosition(800,580);
		
		//返回按钮
		var backText = new cc.LabelTTF("Back","Arial","48");
		var backmenu = new cc.MenuItemLabel(backText,function(){cc.director.runScene(new gameScene())});
		var menu = new cc.Menu(backmenu);
		menu.x = 800;
		menu.y = 400;
		this.addChild(menu);
		
		for(i=0; i<16; i++)
		{
			var tile = new MemoryTile();
			tile.pictureValue = gameArray[i];
			this.addChild(tile);
			tile.setPosition(100+i%4*155,800-Math.floor(i/4)*165-230);
			
		}
		
		//查看按钮
		var lookText = new cc.LabelTTF("Look","Arial","48");
		var lookmenu = new cc.MenuItemLabel(lookText,lookall());
		var menu1 = new cc.Menu(lookmenu);
		menu1.x = 800;
		menu1.y = 240;
		this.addChild(menu1);
		
        return true;
    }
});

var MemoryTile = cc.Sprite.extend
({
	ctor:function()
	{
		 this._super();
		 this.initWithFile("res/cover.jpg");   //卡片背景
		 
		 var listener = cc.EventListener.create
		 ({
			 event :cc.EventListener.TOUCH_ONE_BY_ONE,
			 swallowTouches : true,
			 onTouchBegan :function(touch,event)
			 {
				 if(pickedTiles.length<2)
				 {
					 var target = event.getCurrentTarget();
					 var location = target.convertToNodeSpace(touch.getLocation());
					 var targetSize = target.getContentSize();
					 var targetRectangle = cc.rect(0,0,targetSize.width,targetSize.height);
					 if(cc.rectContainsPoint(targetRectangle,location))
					 {
						 if(pickedTiles.indexOf(target)==-1)
						 {
							 target.initWithFile("res/tile_"+target.pictureValue+".jpg");
							 pickedTiles.push(target);
							 if(pickedTiles.length==2)
							 {
								 checkTiles();
							 }
						 }
					 }
				 }
			 }
		 });
		 cc.eventManager.addListener(listener.clone(),this);
	}
});

function lookall()
{
	for(i=0; i<16; i++)
	{
		var tile = new MemoryTile();
		tile.pictureValue = gameArray[i];
		tile.initWithFile("res/tile_"+tile.pictureValue+".jpg"); 
	}
}

function checkTiles()
{
	moves++;
	scoreText.setString("Moves :" + moves);
	var pause = setTimeout
	(function()
		{
			if(pickedTiles[0].pictureValue != pickedTiles[1].pictureValue)
			{
				pickedTiles[0].initWithFile("res/cover.jpg");
				pickedTiles[1].initWithFile("res/cover.jpg");
			}
			else
			{
				gameLayer.removeChild(pickedTiles[0]);
				gameLayer.removeChild(pickedTiles[1]);
			}
			pickedTiles = [];
		},500);
}

//打乱数组
shuffle = function(v)
{
	for(var j,x,i = v.length;i;j = parseInt(Math.random()*i),x = v[--i],v[i] = v[j],v[j] = x);
	return v;
};











