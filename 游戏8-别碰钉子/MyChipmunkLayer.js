//
var MyChipmunkLayer = cc.Layer.extend
({
	_debugNode : null,
	
	space : null,
	
	blockBatchNode : null,
	
	box : null,
	downUpAction : null,
	boxDirectionX : 1,
	
	titleLabel : null,
	scoreLable : null,
	
	leftBlockArray : null,
	rightBlockArray : null,
	leftBodyArray : null,
	rightBodyArray : null,
	
	ctor : function()
	{
		this._super();
		this.space = new cp.Space();
	},
	
	init : function()
	{
		var bRet = false;
		if(this._super())
		{
			winSize = cc.director.getWinSize();
			
			var bg = cc.LayerColor.create(cc.color(255,255,255));
			bg.attr({ anchorX:0, anchorY:0, x:0, y:0});
			this.addChild(bg);
			
			cc.spriteFrameCache.addSpriteFrames(res.block_plist);
			var b_texture = cc.textureCache.addImage(res.block_png);
			
			this.blockBatchNode = cc.SpriteBatchNode.create(res.block_png);
			this.addChild(this.blockBatchNode);
			
			this.titleLabel = new cc.LabelTTF("Chipmunk实现","Arial Black",30);
			this.titleLabel.x = winSize.width/2;
			this.titleLabel.y = winSize.height/4*3;
			this.titleLabel.color = cc.color(255,0,0);
			this.addChild(this.titleLabel);
			
			this.scoreLable = new cc.LabelTTF("0","Arial Black",80);
			this.scoreLable.x = winSize.width/2;
			this.scoreLable.y = winSize.height/2;
			this.scoreLable.color = cc.color(200,200,200);
			this.addChild(this.scoreLable);
			this.scoreLable.setVisible(false);
			
			//
			this.initPhysics();
			//
			this.initBoxWithBody();
			//
			this.initUpAndBottom();
			
			bRet = true;
		}
		return bRet;
	},
	
	onEnter : function()
	{
		this._super();
		
		cc.sys.dumpRoot();
		cc.sys.garbageCollect();
		
		if('touches' in cc.sys.capabilities)
		{
			cc.eventManager.addListener
			({
				event : cc.EventListener.TOUCH_ALL_AT_ONCE,
				onTouchesEnded : function(touches,event)
				{
					event.getCurrentTarget().processEvent(touches[0]);
				}
			},this);
		}
		
		else if('mouse' in cc.sys.capabilities)
		{
			cc.eventManager.addListener
			({
				event : cc.EventListener.MOUSE,
				onMouseDown : function(event)
				{
					event.getCurrentTarget().processEvent(event);
				}
			},this);
		}
		
		//
		this.resetDatas();
		//
		this.scheduleUpdate();
		//
		this.space.addCollisionHandler
		(1,2, this.collisionBegin.bind(this),
			  this.collisionPre.bind(this),
			  this.collisionPost.bind(this),
			  this.collisionSeparate.bind(this));
			  
		this.space.addCollisionHandler
		(1,3, this.collisionBegin.bind(this),
			  this.collisionPre.bind(this),
			  this.collisionPost.bind(this),
			  this.collisionSeparate.bind(this));
			  
		this.space.addCollisionHandler
		(1,4, this.collisionBegin.bind(this),
			  this.collisionPre.bind(this),
			  this.collisionPost.bind(this),
			  this.collisionSeparate.bind(this));
	},
	
	onExit :  function()
	{
		this.space.removeCollisionHandler(1,2);
		this.space.removeCollisionHandler(1,3);
		this.space.removeCollisionHandler(1,4);
		
		this._super();
	},
	
	processEvent : function(event)
	{
		var location = event.getLocation();
		
		if(MW.CUR_GAME_STATUS == MW.GAME_STATUS.GAME_START)
		{ this.startGame(); }
		
		else if(MW.CUR_GAME_STATUS == MW.GAME_STATUS.GAME_IN)
		{
			if(!MW.TOUCH_FLAG)
				return;
				
			this.doForceBox();
		}
	},
	
	doForceBox : function()
	{
		var speed = 450;
		var x = this.boxDirectionX * speed * Math.cos(45*Math.PI/180);
		var y = speed * Math.sin(60*Math.PI/180);
		this.box.getBody().setVel(cp.v(0,0));
		this.box.getBody().applyImpulse(cp.v(x,y),cp.v(0,0));
	},
	
	initDebugMode : function()
	{
		this._debugNode = cc.PhysicsDebugNode.create(this.space);
		this.addChild(this._debugNode);
	},
	
	initPhysics : function()
	{
		var space = this.space;
		var staticBody = space.staticBody;
		
		//
		space.gravity = cp.v(0,-980);
		space.sleepTimeThreshold = 0.5;
		space.collisionSlop = 0.5;
		
		//
		var walls = [ new cp.SegmentShape(staticBody,cp.v(0,0-1),cp.v(winSize.width,0),0-1),
					  new cp.SegmentShape(staticBody,cp.v(0,winSize.height),cp.v(winSize.width,winSize.height),0),
					  new cp.SegmentShape(staticBody,cp.v(0,0),cp.v(0,winSize.height),0),
					  new cp.SegmentShape(staticBody,cp.v(winSize.width,0),cp.v(winSize.width,winSize.height),0)
					];
					
		for(var i=0; i<walls.length; i++)
		{
			var shape = walls[i];
			shape.setElasticity(1);
			shape.setFriction(0);
			space.addShape(shape);
			
			if(i >= 2)
			{ shape.setCollisionType(3); }
			
			shape.setLayers(1);
		}
	},
	
	initBoxWithBody : function()
	{
		var mass = 1;
		var boxWidth = 32;
		
		var body = new cp.Body(mass,cp.momentForBox(mass,boxWidth,boxWidth));
		body.setPos(cc.p(winSize.width/2,winSize.height/2));
		this.space.addBody(body);
		
		var shape = new cp.BoxShape(body,boxWidth,boxWidth);
		shape.setElasticity(0.5);
		shape.setFriction(0.3);
		shape.setCollisionType(1);
		shape.setLayers(3);
		this.space.addShape(shape);
		
		var v_texture = cc.textureCache.addImage(res.box_png);
		this.box = new cc.PhysicsSprite(v_texture,cc.rect(0,0,boxWidth,boxWidth));
		this.box.setBody(body);
		this.addChild(this.box,1);
		this.box.setTag(101);
		
		var moveTo1 = cc.MoveTo.create(0.5,winSize.width/2,this.box.y+40);
		var moveTo2 = cc.MoveTo.create(0.5,winSize.width/2,this.box.y-40);
		this.downUpAction = cc.RepeatForever.create(cc.Sequence.create(moveTo1,moveTo2));
		this.box.runAction(this.downUpAction);
	},
	
	initUpAndBottom : function()
	{
		var beginX = 10;
		for(var i=0; i<MW.TOP_BLOCK_CNT; i++)
		{
			var upX = beginX + (i+1)*MW.BLOCK_HEIGHT/2 + i*MW.BLOCK_SPACES;
			var upY = winSize.height - MW.BLOCK_WIDTH/2;
			var upPos = cc.p(upX,upY);
			var upTag = MW.BLOCK_UP_TAG + i;
			this.createBlockWithBody(1,upPos,upTag);
			
			var downX = upX;
			var downY = MW.BLOCK_WIDTH/2;
			var downPos = cc.p(downX,downY);
			var downTag = MW.BLOCK_DOWN_TAG + i;
			this.createBlockWithBody(2,downPos,downTag);
		}
	},
	
	updateBoxAndBlocks : function()
	{
		MW.SCORE += MW.LEVEL_UP_EVERY;
		this.scoreLable.setString(""+MW.SCORE);
		this.updateBlocks();
	},
	
	updateBlocks : function()
	{
		this.removeBlocks();
		this.addBlocks();
	},
	
	removeBlocks : function()
	{
		if(this.boxDirectionX == 1)
		{
			if(this.leftBodyArray.length > 0)
			{
				var len = this.leftBodyArray.length;
				for(var i=0; i<len; i++)
				{
					var shape = this.leftBodyArray[i];
					this.space.removeShape(shape);
				}
				this.leftBodyArray = [];
			}
			
			if(this.leftBlockArray.length > 0)
			{
				var len = this.leftBlockArray.length;
				for(var i=0; i<len; i++)
				{
					var tmpNode = this.leftBlockArray[i];
					tmpNode.removeFromParent();
				}
				this.leftBlockArray = [];
			}
		}
		
		else
		{
			if(this.rightBodyArray.length > 0)
			{
				var len = this.rightBodyArray.length;
				for(var i=0; i<len; i++)
				{
					var shape = this.rightBodyArray[i];
					this.space.removeShape(shape);
				}
				this.rightBodyArray = [];
			}
			
			if(this.rightBlockArray.length > 0)
			{
				var len = this.rightBlockArray.length;
				for(var i=0; i<len; i++)
				{
					var tmpNode = this.rightBlockArray[i];
					tmpNode.removeFromParent();
				}
				this.rightBlockArray = [];
			}
		}
	},
	
	addBlocks : function()
	{
		var beginX, endX, _tag, _direction;
		
		if(this.boxDirectionX == 1)
		{
			beginX = winSize.width + MW.BLOCK_HEIGHT;
			endX = winSize.width - MW.BLOCK_HEIGHT/2;
			_tag = MW.BLOCK_RIGHT_TAG;
			_direction = 4;
		}
		else
		{
			beginX = MW.BLOCK_HEIGHT;
			endX = MW.BLOCK_HEIGHT/2;
			_tag = MW.BLOCK_LEFT_TAG;
			_direction = 3;
		}
		
		var curViewNum = getBlockCount(this.boxDirectionX);
		
		if(curViewNum < 1)
		{ curViewNum = 1; }
		
		var beginHeight = 200;
		var endHeight = winSize.height - 200;
		var tmpHeight = beginHeight;
		var tmpH = Math.floor(cc.random0To1()*7)+1;
		
		for(var i=0; i<curViewNum; i++)
		{
			tmpHeight += tmpH  *MW.BLOCK_HEIGHT + cc.random0To1()*20;
			
			if((tmpHeight + 60) >= endHeight)
			{ tmpHeight = (8 - tmpH + curViewNum - i) * MW.BLOCK_HEIGHT * cc.random0To1()*20; }
			
			var posX = endX;
			var posY = tmpHeight;
			var blockSp = this.createBlockWithBody(_direction,cc.p(posX,posY),_tag+i);
			
			if(this.boxDirectionX == 1)
			{ this.rightBlockArray[i] = blockSp; }
			
			else
			{ this.leftBlockArray[i] = blockSp; }
		}
	},
	
	update : function(dt)
	{
		if(MW.CUR_GAME_STATUS == MW.GAME_STATUS.GAME_IN)
		{ this.space.step(1/60.0); }
	},
	
	collisionBegin : function(arbiter,space)
	{
		var shapes = arbiter.getShapes();
		
		var shapeA = shapes[0];
		var shapeB = shapes[1];
		
		var collTypeA = shapeA.collision_type;
		var collTypeB = shapeB.collision_type;
		
		if(collTypeB == 3)
		{
			this.boxDirectionX = -this.boxDirectionX;
			
			this.space.addPostStepCallback(function(){this.updateBoxAndBlocks();}.bind(this));
		}
		
		else if(collTypeB == 2 || collTypeB == 4)
		{
			this.gameOver();
		}
		return true;
	},
	
	collisionPre : function(arbiter,space)
	{
		return true;
	},
	
	collisionPost : function(arbiter,space)
	{},
	
	collisionSeparate : function(arbiter,space)
	{}
});

MyChipmunkLayer.prototype.resetDatas = function()
{
	this.boxDirectionX = 1;
	
	MW.TOUCH_FLAG = true;
	
	MW.CUR_GAME_STATUS = MW.GAME_STATUS.GAME_START;
	
	MW.SCORE = 0;
	
	this.leftBlockArray = [];
	this.rightBlockArray = [];
	this.leftBodyArray = [];
	this.rightBodyArray = [];
};

MyChipmunkLayer.prototype.hideBeginUI = function()
{
	var fadeOut1 = cc.FadeOut.create(0.4);
	
	var actionFinish = cc.CallFunc.create(function(){ this.scoreLable.setVisible(true); },this);
	
	this.titleLabel.runAction(cc.Sequence.create(fadeOut1,actionFinish));
};

MyChipmunkLayer.prototype.createBlockWithBody = function(direction,pos,tag)
{
	if(direction < 1 || direction > 4)
		return;
		
	var boxX = direction < 3 ? MW.BLOCK_HEIGHT : MW.BLOCK_WIDTH;
	var boxY = direction < 3 ? MW.BLOCK_WIDTH : MW.BLOCK_HEIGHT;
	
	var spName = "#block_" + direction + ".png";
	
	var body = new cp.Body(Infinity,Infinity);
	body.nodeIdleTime = Infinity;
	body.setPos(pos);
	
	var verts;
	
	if(direction == 1)
	{ 
		verts = [ -boxX/2,boxY/2,
				  boxX/2,boxY/2,
				  boxX/2,16,
				  0,-boxY/2,
				  -boxX/2,16 ];
	}
	
	else if(direction == 2)
	{
		verts = [ -boxX/2,-boxY/2,
				  -boxX/2,-16,
				  0,boxY/2,
				  boxX/2,16,
				  boxX/2,-boxY/2 ];
	}
	
	else if(direction == 3)
	{
		verts = [ -boxX/2,-boxY/2,
				  -boxX/2,-boxY/2,
				  -16,boxY/2,
				  boxX/2,0,
				  -16,-boxY/2 ];
	}
	
	else
	{
		verts = [ -boxX/2,0,
				  16,boxY/2,
				  boxX/2,boxY/2,
				  boxX/2,-boxY/2,
				  16,-boxY/2 ];
	}
	
	var shape = new cp.PolyShape(body,verts,cp.vzero);
	shape.setElasticity(1);
	shape.setFriction(0.5);
	shape.setCollisionType(2);
	shape.setLayers(2);
	this.space.addShape(shape);
	
	if(direction == 3)
	{ this.leftBodyArray[tag-MW.BLOCK_LEFT_TAG] = shape; }
	
	else if(direction == 4)
	{ this.rightBodyArray[tag-MW.BLOCK_RIGHT_TAG] = shape; }
	
	var blockSp = cc.PhysicsSprite.create(spName);
	blockSp.setBody(body);
	this.blockBatchNode.addChild(blockSp);
	blockSp.setTag(tag);
	
	return blockSp;
};

MyChipmunkLayer.prototype.startGame = function()
{
	this.hideBeginUI();
	this.box.stopAllActions();
	
	MW.CUR_GAME_STATUS = MW.GAME_STATUS.GAME_IN;
	
	this.doForceBox();
};

MyChipmunkLayer.prototype.gameOver = function()
{
	MW.TOUCH_FLAG = false;
	
	this.box.getBody().applyImpulse(cp.v(this.boxDirectionX*20,600),cp.v(10,0));
	
	this.scheduleOnce
	(function()
	{
		MW.CUR_GAME_STATUS = MW.GAME_STATUS.GAME_OVER;
		cc.director.runScene(cc.TransitionFade.create(1.2,GameOver.scene()));
	},1);
};

MyChipmunkLayer.create = function()
{
	var sg = new MyChipmunkLayer();
	if(sg && sg.init())
	{ return sg; }
	
	return null;
};

MyChipmunkLayer.scene = function()
{
	var scene = cc.Scene.create();
	var layer = MyChipmunkLayer.create();
	scene.addChild(layer);
	return scene;
};









