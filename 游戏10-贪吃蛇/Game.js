//游戏场景类

var GameLayer = cc.Layer.extend
({
	bodys : [],
	tail : null,
	star : null,
	canNewBody : 0,
	score : null,
	ctor : function()
	{
		this._super();
		this.bodys = [];
		this.canNewBody = 0;
		this.star = null;
		this.tail = null;
		this.score = null;
		return true;
	},
	
	onEnter : function()
	{
		this._super();
		
		cc.eventManager.addListener
		({
			event : cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches : true,
			onTouchBegan : this.touchbegan,
			onTouchMoved : this.touchmoved,
			onTouchEnded : this.touchended
		},this);
		
		var head = new SnakeBody(null,4);
		head.setPosition(300,300);
		this.addChild(head);
		this.bodys.push(head);
		head.setTag(1);
		this.tail = head;
		
		for(var i=0; i<4; i++)
		{
			var node = new SnakeBody(this.tail,this.tail.direction);
			this.addChild(node);
			this.bodys.push(node);
			this.tail = node;
		}
		
		this.schedule(this.snakeMove,Constants.frequency);
		
		this.schedule(this.updateStar);
		
		var scoreName = new cc.LabelTTF("分数","",30);
		scoreName.setPosition(scoreName.width/2+10,cc.winSize.height-scoreName.height-10);
		this.addChild(scoreName);
		
		this.score = new cc.LabelTTF("0","",30);
		this.score.setPosition(scoreName.getPositionX()+scoreName.width/2+20,scoreName.getPositionY());
		this.addChild(this.score);
		
		return true;
		
	},
	
	touchbegan : function(touch,event)
	{
		var x = touch.getLocation().x;
		var y = touch.getLocation().y;
		
		var head = event.getCurrentTarget().getChildByTag(1);
		var headx = head.getPositionX();
		var heady = head.getPositionY();
		
		switch(head.direction)
		{
			case 1:
			case 2:
				if(x <= headx - Constants.errDistance)
				{
					head.nextDirection = 3;
				}
				else if(x >= headx + Constants.errDistance)
				{
					head.nextDirection = 4;
				}
				break;
				
			case 3:
			case 4:
				if(y <= heady - Constants.errDistance)
				{
					head.nextDirection = 2;
				}
				else if(y >= heady + Constants.errDistance)
				{
					head.nextDirection = 1;
				}
				break;	
		}
		return true;
	},
	
	touchmoved : function()
	{
		return true;
	},
	
	touchended : function()
	{
		return true;
	},
	
	updateStar : function()
	{
		if(this.star == null)
		{
			this.star = new cc.Sprite(res.star);
			
			var randomX = Math.random()*(cc.winSize.width - this.star.width) + this.star.width;
			var randomY = Math.random()*(cc.winSize.height - this.star.width) + this.star.height;
			
			this.star.setPosition(randomX,randomY);
			this.addChild(this.star);
			
			if((randomX > cc.winSize.width - this.star.width/2)
				|| (randomX < this.star.width/2) 
				|| (randomY > cc.winSize.height - this.star.height/2)
				|| (randomY < this.star.height/2))
			{
				this.removeChild(this.star);
				this.star = null;
				return;
			}
			
			for(var index in this.bodys)
			{
				if(cc.rectIntersectsRect(this.bodys[index].getBoundingBox(),this.star.getBoundingBox()))
				{
					this.removeChild(this.star);
					this.star = null;
					return;
				}
			}
		}
	},
	
	snakeMove : function()
	{
		for(var index in this.bodys)
		{
			if(!this.bodys[index].move(this))
			{
				this.unschedule(this.snakeMove);
				this.unschedule(this.updateStar);
				
				var overScene = new OverScene(Number(this.score.getString()),false);
				cc.director.runScene(new cc.TransitionFade(1,overScene));				
			}
		}
		
		for(var index in this.bodys)
		{
			this.bodys[index].direction = this.bodys[index].nextDirection;
		}
		
		if(this.canNewBody == 1)
		{
			var node = new SnakeBody(this.tail,this.tail.direction);
			this.addChild(node);
			this.bodys.push(node);
			this.tail = node;
			this.canNewBody = 0;
		}
	}
});

var GameScene = cc.Scene.extend
({
	onEnter : function()
	{
		this._super();
		var layer = new GameLayer();
		this.addChild(layer);
	}
})