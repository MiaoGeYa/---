//
var SpriteTags = 
{
		kBall_Tag:102
};

var SPEED = 30.0;

var BallEventLayer = cc.Layer.extend
({
	ctor:function ()
	{
		this._super();
		cc.log("HelloWorld init");
		var size = cc.director.getWinSize();

		var bg = new cc.Sprite(res.Backeground_png);
		bg.x = size.width/2;
		bg.y = size.height/2;
		this.addChild(bg,0,0);

		var ball = new cc.Sprite(res.Ball_png);
		ball.x = size.width/2;
		ball.y = size.height/2;
		this.addChild(ball,10,SpriteTags.kBall_Tag);
		
		return true;
	},
	
	onEnter : function()
	{
		this._super();
		cc.log("HeloowWorld onEnter");
		
		var ball = this.getChildByTag(SpriteTags.kBall_Tag);
		cc.inputManager.setAccelerometerEnabled(true);
		cc.eventManager.addListener
		({
			event:cc.EventListener.ACCELERATION,
			callback : function(acc,event)
			{
				var size = cc.director.getWinSize();
				var s = ball.getContentSize();
				var p0 = ball.getPosition();
				
				var p1x = p0.x + acc.x*SPEED;
				if((p1x - s.width/2) <0)
				{
					p1x = s.width/2;
				}
				
				if((p1x + s.width/2) > size.width)
				{
					p1x = size.width - s.width/2;
				}
				
				var p1y = p0.y + acc.y*SPEED;
				if((p1y - s.height/2) < 0)
				{
					p1y = s.height/2;
				}
				
				if((p1y + s.height/2) > size.height)
				{
					p1y = size.height - s.height/2;
				}
				ball.runAction(cc.place(cc.p(p1x,p1y)));
			}
		},ball)
	},
	
	onExit : function()
	{
		this._super();
		cc.log("HelloWorld onExit");
		cc.eventManager.removeListeners(cc.EventListener.ACCELERATION);
	}
});

var BallEventScene = cc.Scene.extend
({
	onEnter:function () {
		this._super();
		var layer = new BallEventLayer();
		this.addChild(layer);
	}
});
