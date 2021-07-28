//键盘响应事件
var SpriteTags = 
{
		kBoxA_Tag:102,
		kBoxB_Tag:103,
		kBoxC_Tag:104
};

var KeyEventLayer = cc.Layer.extend
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

		var boxA = new cc.Sprite(res.BoxA2_png);
		boxA.x = size.width/2 -120;
		boxA.y = size.height/2 +120;
		this.addChild(boxA,10,SpriteTags.kBoxA_Tag);

		var boxB = new cc.Sprite(res.BoxB2_png);
		boxB.x = size.width/2;
		boxB.y = size.height/2;
		this.addChild(boxB,20,SpriteTags.kBoxB_Tag);

		var boxC = new cc.Sprite(res.BoxC2_png);
		boxC.x = size.width/2 + 120;
		boxC.y = size.height/2 + 160;
		this.addChild(boxC,30,SpriteTags.kBoxC_Tag);

		return true;
	},

	onEnter : function()
	{
		this._super();
		cc.log("HeloowWorld onEnter");
		
		cc.eventManager.addListener
		({
			event:cc.EventListener.KEYBOARD,
			onKeyPressed : function(keyCode,event)
			{
				cc.log("Key with KeyCode " + keyCode + " pressed");
			},
			
			onKeyReleased : function(keyCode,event)
			{
				cc.log("Key with KeyCode " + keyCode + " released");
			}
		},this);
	},

	onExit : function()
	{
		this._super();
		cc.log("HelloWorld onExit");
		cc.eventManager.removeListeners(cc.EventListener.KEYBOARD);
	}
});

var KeyEventScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new KeyEventLayer();
		this.addChild(layer);
	}
});
