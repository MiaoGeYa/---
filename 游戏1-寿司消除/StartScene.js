//游戏开始菜单界面

var StartLayer = cc.Layer.extend
(
	{
		ctor:function()
		{
			this._super();
			var size = cc.winSize;   //窗口显示的大小
			
				//helloworld文本显示
				//var helloLbel = new cc.LabelTTF("Hello World","",38);
		       // helloLbel.x = size.width/2;
				//helloLbel.y = size.height/2;
				//this.addChild(helloLbel);
				
			//添加游戏菜单界面的背景
			this.bgSprite = new cc.Sprite(res.BackGround_png);  //添加游戏背景图片
			this.bgSprite.attr   //设置大小
			({
				x : size.width/2,    
				y : size.height/2,
			});
			this.addChild(this.bgSprite,0);    //添加背景图片精灵
				
			//添加“START”的按钮
			var startItem = new cc.MenuItemImage(res.Start_N_png,res.Start_S_png,
					function()
					{cc.log("Menu is chicked!");
					cc.director.replaceScene(cc.TransitionPageTurn(1,new PlayScene(),false));  //加载新的场景  TransitionPageTurn翻页效果
					 },this);   //鼠标响应函数
			
			startItem.attr    //设置按钮位置
			({
				x:size.width/2,
				y:size.height/2,
				anchorX:0.5,
				anchorY:0.5
			});
			
			var menu = new cc.Menu(startItem);
			menu.x = 0;
			menu.y = 0;
			this.addChild(menu,1);
				
			return true;
		}
	
	}
);

//场景的调用
var StartScene = cc.Scene.extend
(
		{
			onEnter:function()
			{
				this._super();
				var layer = new StartLayer();
				this.addChild(layer);
			}
		}
);