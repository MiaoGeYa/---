//
var MyActionLayer = cc.Layer.extend
({
	flagTag : 0,
	pLabel : null,
	
    ctor:function (flagTag) 
	{
        this._super();
		
		this.flagTag = flagTag;
		
		var size = cc.director.getWinSize();
		
		var backMenuItem = new cc.LabelBMFont("<Back",res.fnt_fnt);
		var backMenuItem = new cc.MenuItemLabel(backMenuItem,this.backMenu,this);
		backMenuItem.x = size.width-100;
		backMenuItem.y = 100;
		
		var menu = new cc.Menu(backMenuItem);
		menu.x = 0;
		menu.y = 0;
		menu.anchorX = 0.5;
		menu.anchorY = 0.5;
		this.addChild(menu);
		
		this.pLabel = new cc.LabelBMFont("",res.fnt_fnt);
		this.pLabel.x = size.width/2;
		this.pLabel.y = size.height-50;
		this.addChild(this.pLabel,3);
		
		return true;
	},
	
	backMenu : function(sender)
	{
		cc.director.popScene();
	},
	
	onEnterTransitionDidFinish : function()
	{
		var sprite = this.getChildByTag(SP_TAG);
		var size = cc.director.getWinSize();
		
		var system;
		switch(this.flagTag)
		{
			case ActionTypes.kExplosion:
				 system = new cc.ParticleExplosion();
				 this.pLabel.setString("Explosion");
				 break;
			
			case ActionTypes.kFire:
				 system = new cc.ParticleFire();
				 system.texture = cc.textureCache.addImage(res.s_fire);
				 this.pLabel.setString("Fire");
				 break;
				 
			case ActionTypes.kFireworks:
				 system = new cc.ParticleFireworks();
				 this.pLabel.setString("Fireworks");
				 break;
				 
			case ActionTypes.kFlower:
				 system = new cc.ParticleFlower();
				 this.pLabel.setString("Flower");
				 break;
				 
			case ActionTypes.kGalaxy:
				 system = new cc.ParticleGalaxy();
				 this.pLabel.setString("Galaxy");
				 break;
				 
			case ActionTypes.kMeteor:
				 system = new cc.ParticleMeteor();
				 this.pLabel.setString("Meteor");
				 break;
				 
			case ActionTypes.kRain:
				 system = new cc.ParticleRain();
				 this.pLabel.setString("Rain");
				 break;
				 
			case ActionTypes.kSmoke:
				 system = new cc.ParticleSmoke();
				 this.pLabel.setString("Smoke");
				 break;
				 
			case ActionTypes.kSnow:
				 system = new cc.ParticleSnow();
				 this.pLabel.setString("Snow");
				 break;
			
			case ActionTypes.kSprial:
				 system = new cc.ParticleSprial();
				 this.pLabel.setString("Sprial");
				 break;
				 
			case ActionTypes.kSun:
				 system = new cc.ParticleSun();
				 this.pLabel.setString("Sun");
				 break;
		}
		
		system.x = size.width/2;
		system.y = size.height/2;
		this.addChild(system);
	}
	
});

var MyActionScene = cc.Scene.extend({
    onEnter:function () 
	{
        this._super();
    }
});

