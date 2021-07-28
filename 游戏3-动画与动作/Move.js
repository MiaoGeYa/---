var MoveLayer = cc.Layer.extend
({
	
	ctor:function () 
	{
		this._super();
		var size = cc.director.getWinSize();

		var bg = new cc.Sprite(res.Background_png);
		bg.x = size.width/2;
		bg.y = size.height/2;
		this.addChild(bg);

		var pItmLabel1 = new cc.LabelBMFont("MoveTo",res.fnt2_fnt);
		var pItmMenu1 = new cc.MenuItemLabel(pItmLabel1,this.onMenuCallback,this);
		pItmMenu1.tag = ActionTypes.kMoveTo;
		
		var pItmLabel2 = new cc.LabelBMFont("MoveBy",res.fnt2_fnt);
		var pItmMenu2 = new cc.MenuItemLabel(pItmLabel2,this.onMenuCallback,this);
		pItmMenu2.tag = ActionTypes.kMoveBy;
		
		var pItmLabel3 = new cc.LabelBMFont("JumpTo",res.fnt2_fnt);
		var pItmMenu3 = new cc.MenuItemLabel(pItmLabel3,this.onMenuCallback,this);
		pItmMenu3.tag = ActionTypes.kJumpTo;
		
		var pItmLabel4 = new cc.LabelBMFont("JumpBy",res.fnt2_fnt);
		var pItmMenu4 = new cc.MenuItemLabel(pItmLabel4,this.onMenuCallback,this);
		pItmMenu4.tag = ActionTypes.kJumpBy;
		
		var pItmLabel5 = new cc.LabelBMFont("BezierBy",res.fnt2_fnt);
		var pItmMenu5 = new cc.MenuItemLabel(pItmLabel5,this.onMenuCallback,this);
		pItmMenu5.tag = ActionTypes.kBezierBy;
		
		var pItmLabel6 = new cc.LabelBMFont("ScaleTo",res.fnt2_fnt);
		var pItmMenu6 = new cc.MenuItemLabel(pItmLabel6,this.onMenuCallback,this);
		pItmMenu6.tag = ActionTypes.kSclaeTo;
		
		var pItmLabel7 = new cc.LabelBMFont("ScaleBy",res.fnt2_fnt);
		var pItmMenu7 = new cc.MenuItemLabel(pItmLabel7,this.onMenuCallback,this);
		pItmMenu7.tag = ActionTypes.kScaleBy;
		
		var pItmLabel8 = new cc.LabelBMFont("RotatTo",res.fnt2_fnt);
		var pItmMenu8 = new cc.MenuItemLabel(pItmLabel8,this.onMenuCallback,this);
		pItmMenu8.tag = ActionTypes.kRotatTo;
		
		var pItmLabel9 = new cc.LabelBMFont("RotatBy",res.fnt2_fnt);
		var pItmMenu9 = new cc.MenuItemLabel(pItmLabel9,this.onMenuCallback,this);
		pItmMenu9.tag = ActionTypes.kRotatBy;
		
		var pItmLabel10 = new cc.LabelBMFont("Blink",res.fnt2_fnt);
		var pItmMenu10 = new cc.MenuItemLabel(pItmLabel10,this.onMenuCallback,this);
		pItmMenu10.tag = ActionTypes.kBlink;
		
		var pItmLabel11 = new cc.LabelBMFont("TintTo",res.fnt2_fnt);
		var pItmMenu11 = new cc.MenuItemLabel(pItmLabel11,this.onMenuCallback,this);
		pItmMenu11.tag = ActionTypes.kTintTo;
		
		var pItmLabel12 = new cc.LabelBMFont("TintBy",res.fnt2_fnt);
		var pItmMenu12 = new cc.MenuItemLabel(pItmLabel12,this.onMenuCallback,this);
		pItmMenu12.tag = ActionTypes.kTintBy;
		
		var pItmLabel13 = new cc.LabelBMFont("FadeTo",res.fnt2_fnt);
		var pItmMenu13 = new cc.MenuItemLabel(pItmLabel13,this.onMenuCallback,this);
		pItmMenu13.tag = ActionTypes.kFadeTo;
		
		var pItmLabel14 = new cc.LabelBMFont("FadeIn",res.fnt2_fnt);
		var pItmMenu14 = new cc.MenuItemLabel(pItmLabel14,this.onMenuCallback,this);
		pItmMenu14.tag = ActionTypes.kFadeIn;
		
		var pItmLabel15 = new cc.LabelBMFont("FadeOut",res.fnt2_fnt);
		var pItmMenu15 = new cc.MenuItemLabel(pItmLabel15,this.onMenuCallback,this);
		pItmMenu15.tag = ActionTypes.kFadeOut;
		
		var menuall = new cc.Menu(pItmMenu1,pItmMenu2,pItmMenu3,pItmMenu4,pItmMenu5,pItmMenu6,pItmMenu7,pItmMenu8,
				pItmMenu9,pItmMenu10,pItmMenu11,pItmMenu12,pItmMenu13,pItmMenu14,pItmMenu15);
		menuall.alignItemsInColumns(3,3,3,3,3);
		this.addChild(menuall);

		return true;
	},
	
	onMenuCallback : function (sender)
	{
		cc.log("tag =" +sender.tag);
		var scene = new MyActionScene();
		var layer = new MyActionLayer(sender.tag);
		scene.addChild(layer);
		cc.director.pushScene(new cc.TransitionSlideInR(1,scene));
	}
});

var MoveScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new MoveLayer();
		this.addChild(layer);
	}
});
