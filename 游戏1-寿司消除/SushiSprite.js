//

var SushiSprite = cc. Sprite.extend
({
	disappearAction : null,
	
	onEnter : function()
	{
		cc.log("onEnter");
		this._super();
		
		this.disappearAction = this.createDisappearAction();
		this.disappearAction.retain();
		this.addTouchEventListenser();
	},
	
	onExit : function()
	{
		cc.log("onExit");	
		this.disappearAction.release();
		this._super();
	},
	
	//添加触摸响应函数
	addTouchEventListenser : function()
	{
		this.touchListener = cc.EventListener.create
		({
			event : cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches : true,
			onTouchBegan : function(touch,event)
		    {
				var pos = touch.getLocation();
				var target = event.getCurrentTarget();
				if(cc.rectContainsPoint(target.getBoundingBox(),pos))
				{
					//target.remveTouchEventLister();
					cc.log("pos.x="+pos.x+",pos.y="+pos.y);
					
					target.stopAllActions();
					
					var ac = target.disappearAction;
					var seqAc =cc.Sequence.create(ac,cc.CallFunc.create
							(function(){cc.log("callfun.....");target.removeFromParent();target.getParent().addScore();}
							//target.getParent().addScore();							
							//target.visible=false;},target)
							,target));
					
					target.runAction(seqAc);
					return true;
				}
		     }
		});
		cc.eventManager.addListener(this.touchListener,this);
	},
	
	//帧动画的创建函数
	createDisappearAction : function()
	{
		var frames =[];
		for(var i=0; i<11; i++)
		{
			var str = "sushi_1n_"+i+".png"
			var frame = cc.spriteFrameCache.getSpriteFrame(str);
			frames.push(frame);
		}
		
		var animation = new cc.Animation(frames,0.02);
		var action = new cc.Animate(animation);
		return action;
	},
	
});

