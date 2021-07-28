//
cc.animate = cc.Animate.create;

//全局变量
var OFFSET_X = 4,
	OFFSET_Y = 32,
	OFFSET_ODD = 16,
	
	ROW = COL = 9,
	
	BLOCK_W = 32,
	BLOCK_H = 36,
	BLOCK_XREGION = 33,
	BLOCK_YREGION = 28,
	BLOCK1_RECT = cc.rect(0,0,BLOCK_W,BLOCK_H),
	BLOCK2_RECT = cc.rect(BLOCK_W,0,BLOCK_W,BLOCK_H),
	
	PLAYER_W = 66,
	PLAYER_H = 118,
	PLAYER_OX = 0,
	
	MOVEING_OY = 118,
	TRAPPED_OY = 0,
	
	START_UI_SIZE = cc.size(256,454),
	FAIL_UI_SIZE = cc.size(292,277),
	WIN_UI_SIZE = cc.size(308,276);
	
var layers = [];   //存储所有的层

var vert_passed = [], hori_passed = [];
for(var r=0; r<ROW; r++)
{
	vert_passed.push([]);
	hori_passed.push([]);
	
	for(var c=0; c<COL; c++)
	{
		vert_passed[r][c] = false;
		hori_passed[r][c] = false;
	}
}

var reinit_passed = function(passed)
{
	for(var r=0; r<ROW; r++)
	{
		for(var c=0; c<COL; c++)
		{
			passed[r][c] && (passed[r][c] = false);
		}
	}
}

//游戏层
var GameLayer = cc.Layer.extend
({
	blocks : null,
	batch : null,   
	block_tex : null,
	player : null,
	player_r : 4,
	player_c : 4,
	moving_action : null,
	trapped_action : null,
	active_blocks : null,    //记录点击到的橙色六边形的坐标
	trapped : false,
	inited : false,
	active_nodes : null,    //记录点击到的橙色六边形
	step : 0,
	
	ctor : function()
	{
		this._super();
		this.anchorX = 0;
		this.anchorY = 0;
		this.active_nodes = [];
		this.active_blocks = [];
		
		for(var r=0; r<ROW; r++)
		{
			this.active_blocks.push([]);
			for(var c=0; c<COL; c++)
			{
				this.active_blocks[r][c] = false;
			}
		}
		
		this.blocks = new cc.Layer();
		this.blocks.x = OFFSET_X;
		this.blocks.y = OFFSET_Y;
		this.addChild(this.blocks);
		
		this.batch = new cc.SpriteBatchNode(res.block,81);
		this.block_tex = this.batch.texture;
		
		//游戏地图区域 9*9六边形组成  这里是一开始灰色的六边形
		var ox = x = y = 0, odd = false, block, tex = this.batch.texture;
		for(var r=0; r<ROW; r++)
		{
			y = BLOCK_YREGION * r;
			ox = odd * OFFSET_ODD;
			for(var c=0; c<COL; c++)
			{
				x = ox + BLOCK_XREGION * c;
				block = new cc.Sprite(tex,BLOCK2_RECT);
				block.attr
				({
					anchorX : 0,
					anchorY : 0,
					x : x,
					y : y,
					width : BLOCK_W,
					height : BLOCK_H
				});
				this.batch.addChild(block);
			}
			odd = !odd;
		}
		
		this.blocks.addChild(this.batch);
		this.blocks.bake();
		
		tex = cc.textureCache.addImage(res.player);
		
		var frame,
		rect = cc.rect(0,0,PLAYER_W,PLAYER_H), 
		moving_frames = [],trapped_frames = [];
		
		for(var i=0; i<6; i++)
		{
			rect.x = PLAYER_OX+i*PLAYER_W;
			frame = new cc.SpriteFrame(tex,rect);
			trapped_frames.push(frame);
		}
		rect.y = MOVEING_OY;
		for(var i=0; i<4; i++)
		{
			rect.x = PLAYER_OX+i*PLAYER_W;
			frame = new cc.SpriteFrame(tex,rect);
			moving_frames.push(frame);
		}
		
		var moving_animation = new cc.Animation(moving_frames,0.2);
		this.moving_action = cc.animate(moving_animation).repeatForever();
		
		var trapped_animation = new cc.Animation(trapped_frames,0.2);
		this.trapped_action = cc.animate(trapped_animation).repeatForever();
		//
		this.player = new cc.Sprite(moving_frames[0]);
		cc.log("1234567");
		this.addChild(this.player,10);
		
		//事件监听 点击橙色方块 移动羊驼 步数+1
		cc.eventManager.addListener
		({
			event : cc.EventListener.TOUCH_ALL_AT_ONCE,
			onTouchesBegan : function(touches,event)
			{
				var touch = touches[0];
				var pos = touch.getLocation();
				var target = event.getCurrentTarget();
				if(!target.inited) return;
				
				pos.y -= OFFSET_Y;
				var r = Math.floor(pos.y/BLOCK_YREGION);
				
				pos.x -= OFFSET_X+(r%2 == 1) * OFFSET_ODD;
				var c = Math.floor(pos.x/BLOCK_XREGION);
				
				if(c >= 0 && r >=0 && c < COL && r < ROW)
				{
					  //点击橙色方块后
					if(target.activateBlock(r,c))
					{
						target.step ++;  //点击步数加1
						target.movePlayer();  //移动羊驼
					}
				}
			}
		},this);
	},
	
	//游戏初始化
	initGame : function()
	{
		if(this.inited) return;
		
		this.player_c = this.player_r = 4;
		this.step = 0;
		
		for(var i=0,l=this.active_nodes.length; i<l; i++)
		{
			this.active_nodes[i].removeFromParent();
		}
		this.active_nodes = [];
		
		for(var r=0; r<ROW; r++)
		{
			for(var c=0; c<COL; c++)
			{
				this.active_blocks[r][c] = false;
			}
		}
		
		this.randomBlocks();
		
		this.player.attr
		({
			anchorX : 0.5,
			anchorY : 0,
			x : OFFSET_X + BLOCK_XREGION * this.player_c + BLOCK_W/2,
			y : OFFSET_Y + BLOCK_YREGION * this.player_r - 5
		});
		
		tex = cc.textureCache.addImage(res.player);
		//cc.log("1234567");
		var frame, rect = cc.rect(0,0,PLAYER_W,PLAYER_H), moving_frames = [],trapped_frames = [];
		
		for(var i=0; i<6; i++)
		{
			rect.x = PLAYER_OX+i*PLAYER_W;
			frame = new cc.SpriteFrame(tex,rect);
			trapped_frames.push(frame);
		}
		rect.y = MOVEING_OY;
		for(var i=0; i<4; i++)
		{
			rect.x = PLAYER_OX+i*PLAYER_W;
			frame = new cc.SpriteFrame(tex,rect);
			trapped_frames.push(frame);
		}
		
		var moving_animation = new cc.Animation(moving_frames,0.2);
		this.moving_action = cc.animate(moving_animation).repeatForever();
		
		this.player.stopAllActions();
		this.player.runAction(this.moving_action);
		
		this.inited = true;
	},
	
	//一开始随机生成的橙色六边形 7-20个随机数
	randomBlocks : function()
	{
		var nb = Math.round(cc.random0To1() * 13) + 7, r, c;
		for(var i=0; i<nb; i++)
		{
			r = Math.floor(cc.random0To1()*9);
			c = Math.floor(cc.random0To1()*9);
			this.activateBlock(r,c);
		}
	},
	
	//存储点击到的橙色方块
	activateBlock : function(r,c)
	{
		if(!this.active_blocks[r][c])
		{
			var block = new cc.Sprite(this.block_tex,BLOCK1_RECT);
			block.attr
			({
				anchorX : 0,
				anchorY : 0,
				x : OFFSET_X + (r%2==1) *OFFSET_ODD + BLOCK_XREGION * c,
				y : OFFSET_Y + BLOCK_YREGION * r,
				width : BLOCK_W,
				height : BLOCK_H
			});
			
			this.active_nodes.push(block);
			this.addChild(block,2);
			this.active_blocks[r][c] = true;
			return true;
		}
		return false;
	},
	
	//移动羊驼
	movePlayer : function()
	{
		var r = this.player_r, c = this.player_c, result = -1, temp;
		temp = getDistance(r,c,l_choices,this.active_blocks,hori_passed,0);
		
		if(result == -1 || (temp != -1 && temp[2] < result[2]))
			result = temp;
		temp = getDistance(r,c,t_choices,this.active_blocks,vert_passed,0);
		
		if(result == -1 || (temp != -1 && temp[2] < result[2]))
			result = temp;
		temp = getDistance(r,c,b_choices,this.active_blocks,vert_passed,0);
		
		if(result == -1 || (temp != -1 && temp[2] < result[2]))
			result = temp;
		temp = getDistance(r,c,r_choices,this.active_blocks,hori_passed,0);
		
		if(result == -1 || (temp != -1 && temp[2] < result[2]))
			result = temp;
			
		reinit_passed(hori_passed);
		reinit_passed(vert_passed);
		
		if(result == -1)
		{
			if(!this.trapped)
			{
				this.trapped = true;
				this.player.stopAction(this.moving_action);
				
				tex = cc.textureCache.addImage(res.player);
		
				var frame, rect = cc.rect(0,0,PLAYER_W,PLAYER_H), moving_frames = [],trapped_frames = [];
		
				for(var i=0; i<6; i++)
				{
					rect.x = PLAYER_OX+i*PLAYER_W;
					frame = new cc.SpriteFrame(tex,rect);
					trapped_frames.push(frame);
				}
				rect.y = MOVEING_OY;
				for(var i=0; i<4; i++)
				{
					rect.x = PLAYER_OX+i*PLAYER_W;
					frame = new cc.SpriteFrame(tex,rect);
					trapped_frames.push(frame);
				}
		
				var trapped_animation = new cc.Animation(trapped_frames,0.2);
				this.trapped_action = cc.animate(trapped_animation).repeatForever();
		
				this.player.runAction(this.trapped_action);
			}
			
			if(!this.active_blocks[r][c-1])
				this.player_c = c-1;
				
			else if(!this.active_blocks[r][c+1])
				this.player_c = c+1;
				
			else
			{
				var odd = (r%2==1);
				var dr = r-1, tr = r+1, nc = c+(odd ? 0 : -1);
				
				if(!this.active_blocks[dr][nc])
				{
					this.player_r = dr;
					this.player_c = nc;
				}
				
				else if(!this.active_blocks[dr][nc+1])
				{
					this.player_r = dr;
					this.player_c = nc+1;
				}
				
				else if(!this.active_blocks[tr][nc])
				{
					this.player_r = tr;
					this.player_c = nc;
				}
				
				else if(!this.active_blocks[tr][nc+1])
				{
					this.player_r = tr;
					this.player_c = nc+1;
				}
				
				else
				{
					gameScene.addWin();
					this.inited = false;
				}
			}
		}
		
		else if(result[2] == 0)
		{
			gameScene.addLose();
			this.inited = false;
		}
		
		else 
		{
			this.player_r = result[0];
			this.player_c = result[1];
		}
		
		this.player.attr
		({
			anchorX : 0.5,
			anchorY : 0,
			x : OFFSET_X + (this.player_r%2 == 1) * OFFSET_ODD + BLOCK_XREGION * this.player_c + BLOCK_W/2,
			y : OFFSET_Y + BLOCK_YREGION * this.player_r - 5
		});
	}
});

//游戏开始界面  是一个层
var StartUI = cc.Layer.extend
({
	ctor : function()
	{
		this._super();
		var start = new cc.Sprite(res.start);
		start.x = cc.winSize.width/2;
		start.y = cc.winSize.height/2 + 20;
		this.addChild(start);   //”开始游戏“图标
	},
	
	onEnter : function()
	{
		this._super();
		//事件	监听
		cc.eventManager.addListener
		({
			event : cc.EventListener.TOUCH_ALL_AT_ONCE,
			onTouchesEnded : function(touches,event)
			{
				var touch = touches[0];
				var pos = touch.getLocation();
				if(pos.y < cc.winSize.height/3)
				{
					//加载游戏初始化
					layers.game.initGame();
					layers.startUI.removeFromParent();
				}
			}
		},this);
	}
});

//结果界面  显示两个结果 一个胜利 一个失败
var ResultUI = cc.Layer.extend
({
	activate : false,
	win : false,
	winPanel : null,
	losePanel : null,
	
	ctor : function(win)
	{
		this._super();
		this.win = win;
		
		//胜利
		if(win)  
		{
			this.winPanel = new cc.Sprite(res.succeed);
			this.winPanel.x = cc.winSize.width/2;
			this.winPanel.anchorY = 0.2;
			this.winPanel.y = cc.winSize.height/2;
			this.addChild(this.winPanel);
		}
		//失败
		else
		{
			this.losePanel = new cc.Sprite(res.failed);
			this.losePanel.x = cc.winSize.width/2;
			this.losePanel.anchorY = 0.2;
			this.losePanel.y = cc.winSize.height/2;
			this.addChild(this.losePanel);
		}
		
		//通知好友
		var notify = new cc.Sprite(res.notitf);
		notify.anchorX = notify.anchorY = 0;
		notify.x = cc.winSize.width/2 - FAIL_UI_SIZE.width/2;
		notify.y = cc.winSize.height/2 - FAIL_UI_SIZE.height/2;
		this.addChild(notify);
		
		//再来一次
		var replay = new cc.Sprite(res.again);
		replay.anchorX = 1;
		replay.anchorY = 0;
		replay.x = cc.winSize.width/2 + FAIL_UI_SIZE.width/2;
		replay.y = cc.winSize.height/2 - FAIL_UI_SIZE.height/2;
		this.addChild(replay);
	},
	
	onEnter : function()
	{
		this._super();
		var miny = cc.winSize.height/2 - FAIL_UI_SIZE.height/2;
		
		//步数计算
		var step = layers.game.step,percent;
		if(step < 4)
			percent = 99;
		
		else if(step < 10)  
			percent = Math.round(95+4*(10-step)/6);
		
		else if(step < 20)  
			percent = Math.round(85+10*(20-step)/10);
			
		else
			percent = 95-step/2;
		
		//胜利 显示文本
		if(this.win)
		{
			this.winPanel.removeAllChildren();
			var w = this.winPanel.width, h = this.winPanel.height;
			var label = new cc.LabelTTF("继续刷屏！\n" + step + "步围住我的小羊驼\n打败" + percent + "%朋友圈的人！\n你能超过我吗？","宋体",20);
			label.x = w/2;
			label.y = h/4;
			label.width = w;
			label.color = cc.color(0,0,0);
			this.winPanel.addChild(label);
		}
		
		//失败 显示文本
		else
		{
			this.losePanel.removeAllChildren();
			var w = this.losePanel.width, h = this.losePanel.height;
			var label = new cc.LabelTTF("我滴小羊驼呀它又跑掉了\nT_T 快帮我抓回来！","宋体",20);
			label.x = w/2;
			label.y = h/4+5;
			label.width = w;
			label.color = cc.color(0,0,0);
			this.losePanel.addChild(label,10);
		}
		
		//事件监听
		cc.eventManager.addListener
		({
			event : cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan : function(touch,event)
			{
				var target = event.getCurrentTarget();
				if(!target.activate) return;
				
				var pos = touch.getLocation();
				if(pos.y > miny-20 && pos.y < miny+100)
				{
					//再来一次
					if(pos.x > cc.winSize.width/2)
					{
						layers.game.initGame();  //重新加载游戏
						//cc.director.runScene(GameScene);
						target.win ? layers.winUI.removeFromParent() : layers.loseUI.removeFromParent();
					}
					//通知好友
					else
					{
						gameScene.addShare(); 
						target.win ? share(1,step,percent) : share(2);
					}
				}
			}
		},this);
		
		this.activate = true;
	},
	
	onExit : function()
	{
		this._super();
		this.activate = false;
	}
});

//分享界面
var ShareUI = cc.LayerColor.extend
({
	ctor : function()
	{
		this._super(cc.color(0,0,0,188),cc.winSize.width,cc.winSize.height);
		
		var arrow = new cc.Sprite(res.arrow);
		arrow.anchorX = 1;
		arrow.anchorY = 1;
		arrow.x = cc.winSize.width-15;
		arrow.y = cc.winSize.height-5;
		this.addChild(arrow);
		
		var label = new cc.LabelTTF("请点击右上角的菜单按钮\n再点\"分享到朋友圈\"\n让好友们挑战你的分数！","宋体",20,cc.size(cc.winSize.width*0.7,250),cc.TEXT_ALIGNMENT_CENTER);
		label.x = cc.winSize.width/2;
		label.y = cc.winSize.height-100;
		label.anchorY = 1;
		this.addChild(label);
	},
	
	onEnter : function()
	{
		this._super();
		cc.eventManager.addListener
		({
			event : cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan : function(touch,event)
			{
				if(this.win)
					layers.winUI.removeFromParent();
			}
		},this);
	}
});

//游戏场景
var GameScene = cc.Scene.extend
({
	onEnter : function()
	{
		this._super();
		//添加背景
		var bg = new cc.Sprite(res.bg);
		bg.attr
		({
			anchorX : 0.5,
			anchorY : 0.5,
			x : cc.winSize.width/2,
			y : cc.winSize.height/2
		});
		this.addChild(bg);
		
		//添加游戏层
		layers.game = new GameLayer();
		this.addChild(layers.game);
		//添加开始游戏层
		layers.startUI = new StartUI();
		this.addChild(layers.startUI);
	},
	
	//游戏失败
	addLose : function()
	{
		layers.loseUI = new ResultUI(false);  //游戏结果层
		this.addChild(layers.loseUI);    //失败界面
	},
	//游戏胜利
	addWin : function()
	{
		layers.winUI = new ResultUI(true); //游戏结果层
		this.addChild(layers.winUI);   //成功界面
	},
	//游戏分享
	addShare : function()
	{
		layers.shareUI = new ShareUI();   //分享层
		this.addChild(layers.shareUI);   //分享界面
	}
});

var gameScene = null;









