var MyActionLayer2 = cc.Layer.extend
({
	flagTag : 0,
	hiddenFlag : true,
	ctor : function(flagTag)
	{
		this._super();
		this.flagTag = flagTag;
		this.hiddenFlag = true;
		cc.log("MyActionLayer init flagTag " + this.flagTag);
		
		var size = cc.director.getWinSize();
		
		var bg = new cc.Sprite(res.Background_png);
		bg.x = size.width/2;
		bg.y = size.height/2;
		this.addChild(bg);
		
		var sprite = new cc.Sprite(res.hero_png);
		sprite.x = size.width/2;
		sprite.y = size.height/2;
		this.addChild(sprite,1,SP_TAG);
		
		var backMenuItem = new cc.MenuItemImage(res.Back_up_png,res.Back_down_png,
												function(){cc.director.popScene();},this);
		backMenuItem.x = 100;
		backMenuItem.y  = size.height-50;
		
		var goMenuItem = new cc.MenuItemImage(res.Go_up_png,res.Go_down_png,
											  this.onMenuCallback,this);
		goMenuItem.x = size.width/2;
		goMenuItem.y = 100;
		
		var allmenu = new cc.Menu(backMenuItem,goMenuItem);
		this.addChild(allmenu,1);
		allmenu.x = 0;
		allmenu.y = 0;
		allmenu.anchorX = 0.5;
		allmenu.anchorY = 0.5;
		
		return true;
	},
	
	onMenuCallback : function(sender)
	{
		//cc.log("");
		var sprite = this.getChildByTag(SP_TAG);
		var size = cc.director.getWinSize();

		switch (this.flagTag)
		{
			case ActionTypes.kSequence:
				this.onSequence(sender);
				break;
				
			case ActionTypes.kSpawn:
				this.onSpawn(sender);
				break;
				
			case ActionTypes.kRepeate:
				this.onRepeat(sender);
				break;
				
			case ActionTypes.kRepeatForever1:
				this.onRepeatForever(sender);
				break;
				
			case ActionTypes.kReverse:
				this.onReverse(sender);
				break;
		}
	},
	
	onSequence : function(sender)
	{
		var size = cc.director.getWinSize(); 
		var sprite = this.getChildByTag(SP_TAG);
		var p = cc.p(size.width/2,200);
		
		var ac0 = cc.place(p);
		var ac1 = cc.moveTo(2,cc.p(size.width-130,size.height-200));
		var ac2 = cc.jumpBy(2,cc.p(8,8),6,3);
		var ac3 = cc.blink(2,3);
		var ac4 = cc.tintBy(0.5,0,255,255);
		
		sprite.runAction(cc.sequence(ac0,ac1,ac2,ac3,ac4,ac0));
	},
	
	onSpawn : function(sender)
	{
		var size = cc.director.getWinSize(); 
		var sprite = this.getChildByTag(SP_TAG);
		var p = cc.p(size.width/2,200);
		
		sprite.setRotation(0);
		sprite.setPosition(p);
		
		var ac1 = cc.moveTo(2,cc.p(size.width-100,size.height-100));
		var ac2 = cc.rotateTo(2,40);
		
		sprite.runAction(cc.spawn(ac1,ac2));
	}
	
	onRepeat : function(sender)
	{
		var size = cc.director.getWinSize(); 
		var sprite = this.getChildByTag(SP_TAG);
		var p = cc.p(size.width/2,200);
		
		sprite.setRotation(0);
		sprite.setPosition(p);
		
		var ac1 = cc.moveTo(2,cc.p(size.width-100,size.height-100));
		var ac2 = cc.jumpBy(2,cc.p(10,10),20,5);
		var ac3 = cc.jumpBy(2,cc.p(-10,-10),20,3);
		var seq = cc.sequence(ac1,ac2,ac3);
		
		sprite.runAction(cc.repeat(seq,3));
	}
	
	onRepeatForever : function(sender)
	{
		var size = cc.director.getWinSize(); 
		var sprite = this.getChildByTag(SP_TAG);
		var p = cc.p(size.width/2,200);
		
		sprite.setRotation(0);
		sprite.setPosition(p);
	
		var besizer = [cc.p(0,size.height/2),cc.p(10,-size.height/2),cc.p(10,20)];
		
		var ac1 = cc.besizerBy(2,besizer);
		var ac2 = cc.tintTo(2,255,0,255);
		var ac1Reverse = ac1.reverse();
		var ac2Repeat = cc.repeat(ac2,4);
		
		var ac3 = cc.spawn(ac1,ac2Repeat);
		var ac4 = cc.spawn(ac1Reversee,ac2Repeat);
		var seq = cc.sequence(ac3,ac4);
		
		sprite.runAction(cc.repeatForever(seq));
	}
	
	onReverse : function(sender)
	{
		var size = cc.director.getWinSize(); 
		var sprite = this.getChildByTag(SP_TAG);
		var p = cc.p(size.width/2,200);
		
		sprite.setRotation(0);
		sprite.setPosition(p);
		
		var ac1 = cc.moveBy(2,cc.p(40,60));
		var ac2 = ac1.reverse();
		var seq = cc.sequence(ac1,ac2);
		
		sprite.runAction(cc.repeat(seq,2);
	}
	
});

var MyActionScene2 = cc.Scene.extend
({
	onEnter : function()
	{
		this._super();
	}
})