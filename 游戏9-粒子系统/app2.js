//
var HelloWorldLayer = cc.Layer.extend
({
    ctor:function () 
	{
        this._super();

        var size = cc.director.getWinSize();
		
		var pItmLabel1 = new cc.LabelBMFont("Explosion",res.fnt_fnt);
		var pItmMenu1 = new cc.MenuItemLabel(pItmLabel1,this.onMenuCallback,this);
		pItmMenu1.tag = ActionTypes.kExplosion;
		
		var pItmLabel2 = new cc.LabelBMFont("Fire",res.fnt_fnt);
		var pItmMenu2 = new cc.MenuItemLabel(pItmLabel2,this.onMenuCallback,this);
		pItmMenu2.tag = ActionTypes.kFire;
		
		var pItmLabel3 = new cc.LabelBMFont("Fireworks",res.fnt_fnt);
		var pItmMenu3 = new cc.MenuItemLabel(pItmLabel3,this.onMenuCallback,this);
		pItmMenu3.tag = ActionTypes.kFireworks;
		
		var pItmLabel4 = new cc.LabelBMFont("Flower",res.fnt_fnt);
		var pItmMenu4 = new cc.MenuItemLabel(pItmLabel4,this.onMenuCallback,this);
		pItmMenu4.tag = ActionTypes.kFlower;
		
		var pItmLabel5 = new cc.LabelBMFont("Galaxy",res.fnt_fnt);
		var pItmMenu5 = new cc.MenuItemLabel(pItmLabel5,this.onMenuCallback,this);
		pItmMenu5.tag = ActionTypes.kGalaxy;
		
		var pItmLabel6 = new cc.LabelBMFont("Meteor",res.fnt_fnt);
		var pItmMenu6 = new cc.MenuItemLabel(pItmLabel6,this.onMenuCallback,this);
		pItmMenu6.tag = ActionTypes.kMeteor;
		
		var pItmLabel7 = new cc.LabelBMFont("Rain",res.fnt_fnt);
		var pItmMenu7 = new cc.MenuItemLabel(pItmLabel7,this.onMenuCallback,this);
		pItmMenu7.tag = ActionTypes.kRain;
		
		var pItmLabel8 = new cc.LabelBMFont("Smoke",res.fnt_fnt);
		var pItmMenu8 = new cc.MenuItemLabel(pItmLabel8,this.onMenuCallback,this);
		pItmMenu8.tag = ActionTypes.kSmoke;
		
		var pItmLabel9 = new cc.LabelBMFont("Snow",res.fnt_fnt);
		var pItmMenu9 = new cc.MenuItemLabel(pItmLabel9,this.onMenuCallback,this);
		pItmMenu9.tag = ActionTypes.kSnow;
		
		var pItmLabel10 = new cc.LabelBMFont("Sprial",res.fnt_fnt);
		var pItmMenu10 = new cc.MenuItemLabel(pItmLabel10,this.onMenuCallback,this);
		pItmMenu10.tag = ActionTypes.kSprial;
		
		var pItmLabel11 = new cc.LabelBMFont("Sun",res.fnt_fnt);
		var pItmMenu11 = new cc.MenuItemLabel(pItmLabel11,this.onMenuCallback,this);
		pItmMenu11.tag = ActionTypes.kSun;
		
		var allMenu = new cc.Menu(pItmMenu1,pItmMenu2,pItmMenu3,pItmMenu4,pItmMenu5,
								  pItmMenu6,pItmMenu7,pItmMenu8,pItmMenu9,pItmMenu10,pItmMenu11);
		allMenu.alignItemsInColumns(2,2,2,2,2,1);
		this.addChild(allMenu);
		
		return true;
    },
	
	onMenuCallback : function(sender)
	{
		var scene = new MyActionScene();
		var layer = new MyActionLayer(sender.tag);
		
		scene.addChild(layer);
		cc.director.pushScene(new cc.TransitionSlideInR(1,scene));
	}
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

