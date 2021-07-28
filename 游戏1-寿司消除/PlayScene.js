//游戏开始玩的界面

var PlayLayer = cc.Layer.extend
({ 
	bgSpeite:null,     //背景图片精灵
	SushiSprites:null,  //寿司图片精灵
	timeout:5,    //时间倒计时  60s
	ctor : function()
	{
		this._super();
		this.SushiSprites = [];   //寿司精灵数组
		var size = cc.winSize;
		
		//添加背景
		this.bgSprite = new cc.Sprite(res.BackGround_png);   //添加背景图片
		this.bgSprite.attr    //设置大小
		({
			x:size.width/2,
			y:size.height/2,
			rotation:180
		});
		this.addChild(this.bgSprite,0);  //生成背景图片精灵
		
		//分数文本标签
		this.scoreLabel = new cc.LabelTTF("score: 40","Arial",25);
		this.scoreLabel.attr
		({
			x : size.width/2+100,
			y : size.height-30
		});
		this.addChild(this.scoreLabel, 5);
		
		//倒计时文本标签
		this.timeoutLabel = cc.LabelTTF.create(""+this.timeout,"Arial",35);
		this.timeoutLabel.x = 30;
		this.timeoutLabel.y = size.height-30;
		this.addChild(this.timeoutLabel, 5);
		
		cc.spriteFrameCache.addSpriteFrames(res.Sushi_plist);  //寿司图片的帧序列
		this.addSushi();   //调用生成寿司精灵的函数
		
		this.schedule(this.update,1,16*1024,1);   //定时器  16*1024
		              //（调用名，间隔多久，重复次数，延迟多久）
		this.schedule(this.timer, 1, this.timeout, 1);   //倒计时 一秒调用一次 时间-1
		return true;
	},
	
	//分数
	addScore : function()
	{
		this.score += 1;
		this.scoreLabel.setString("score: " + this.score);
	},
	
	//倒计时
	timer : function()
	{
		if(this.timeout == 0 )
		{
			var gameOver = new cc.LayerColor(cc.color(225,225,225,100));  //游戏结束时的一个显示层
			var size = cc.winSize;
			
			var titleLabel = new cc.LabelTTF("Game Over","Arial",38);    //游戏结束显示文本标签
			titleLabel.attr    //设置位置
			({
				x : size.width/2,
				y : size.height/2
			});
			gameOver.addChild(titleLabel, 5);
			
			//重新开始游戏的鼠标点击响应按钮
			var TryAgainItem = new cc.MenuItemFont("重新开始",
					function()
					{cc.log("Menu is chicked!");
					 var transition = cc.TransitionFade(1,new PlayScene(),cc.color(255,255,255,255));
					 cc.director.runScene(transition);},this);
			TryAgainItem.attr
			({
				x : size.width/2,
				y : size.height/2-60,
				anchorX : 0.5,
				anchorY : 0.5
			});
			
			var menu = new cc.Menu(TryAgainItem);
			menu.x = 0;
			menu.y = 0;
			gameOver.addChild(menu, 1);
			this.getParent().addChild(gameOver);
			
			this.unschedule(this.update);
			this.unschedule(this.timer);
			
			return;
		}
		
		this.timeout -= 1;
		this.timeoutLabel.setString("" + this.timeout);
	},
	
	//添加寿司精灵
	addSushi : function()
	{
		//var sushi = new cc.Sprite(res.Sushi_png);    //添加寿司图片
		var sushi = new SushiSprite(res.Sushi_png);
		var size = cc.winSize;

		var x = sushi.width/2+size.width/2*cc.random0To1();  //寿司随机生成的X坐标
		sushi.attr    //寿司精灵的位置
		({
			x : x,
			y : size.height - 30
		});
		this.addChild(sushi,5);    //添加寿司精灵
		
		//使寿司精灵动起来  向下落     MoveTo直线运动
		var dorpAction = cc.MoveTo.create(4,cc.p(sushi.x,-30));
		sushi.runAction(dorpAction);   //调用运动函数
		
		this.SushiSprites.push(sushi);   //放入精灵数组
	},
	
	//更新
	update : function()
	{
		this.addSushi();  //调用添加寿司精灵的
		this.removeSushi();   //调用移除到达底部的寿司精灵
	},
	
	//移除底部的寿司精灵
	removeSushi : function()
	{
		for(var i = 0; i < this.SushiSprites.length; i++)
		{
			cc.log("removeSushi......");
			if(-30 == this.SushiSprites[i].y)
			{
				cc.log("======remove:"+i);
				this.SushiSprites[i].removeFromParent();
				this.SushiSprites[i] = undefined;
				this.SushiSprites.splice(i,1);
				i = i-1;
			}
		}
	}

});

var PlayScene = cc.Scene.extend
({
	onEnter:function()
	{
		this._super();
		var layer = new PlayLayer();
		this.addChild(layer);
	}
});