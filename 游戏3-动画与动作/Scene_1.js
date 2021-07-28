var Scene1Layer = cc.Layer.extend
({
	ctor : function()
	{
		this._super();
		var size = cc.director.getWinSize();

		var bg = new cc.Sprite(res.Background_png);
		bg.x = size.width/2;
		bg.y = size.height/2;
		this.addChild(bg);
		
		var placeLabel = new cc.LabelBMFont("Place",res.fnt2_fnt);
		var placeMenu = new cc.MenuItemLabel(placeLabel,this.onMenuCallback,this);
		
		var flipXLabel = new cc.LabelBMFont("FlipX",res.fnt2_fnt);
		var flipXMenu = new cc.MenuItemLabel(flipXLabel,this.onMenuCallback,this);

		var flipYLabel = new cc.LabelBMFont("FlipY",res.fnt2_fnt);
		var flipYMenu = new cc.MenuItemLabel(flipYLabel,this.onMenuCallback,this);
		
		var hideLabel = new cc.LabelBMFont("Hide or Show",res.fnt2_fnt);
		var hideMenu = new cc.MenuItemLabel(hideLabel,this.onMenuCallback,this);

		var toggleLabel = new cc.LabelBMFont("Toggle",res.fnt2_fnt);
		var toggleMenu = new cc.MenuItemLabel(toggleLabel,this.onMenuCallback,this);

		var Allmenu = new cc.Menu(placeMenu,flipXMenu,flipYMenu,hideMenu,toggleMenu);
		Allmenu.alignItemsVertically();
		this.addChild(Allmenu);
		
		return true;
	},
	
	onMenuCallback : function(sender)
	{
		cc.log("tag = " + sender.tag);
		var scene = new MyActionScene();
		var layer = new MyActionLayer(sender.tag);
		
		scene.addChild(layer);
		cc.director.pushScene(new cc.TransitionSlideInR(1,scene));
	}
});

var Scene_1 = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new Scene1Layer();
		this.addChild(layer);
	}
});
