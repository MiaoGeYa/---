//
var HelloWorldLayer = cc.Layer.extend
({
    ctor:function () 
	{
        this._super();

        var size = cc.director.getWinSize();
		
		var bg = new cc.Sprite(res.zippo_png);
		bg.x = size.width/2;
		bg.y = size.height/2;
		this.addChild(bg);
		
		var particleSystem = new cc.ParticleFire();
		
		particleSystem.texture = cc.textureCache.addImage(res.s_fire);
		//
		particleSystem.setGravity(cc.p(45,300));
		//
		particleSystem.setRadialAccel(58);
		//
		particleSystem.setStartSize(84);
		//
		particleSystem.setStartSizeVar(73);
		//
		particleSystem.setEndSize(123);
		//
		particleSystem.setEndSizeVar(17);
		//
		particleSystem.setTangentialAccel(70);
		//
		particleSystem.setTangentialAccelVar(47);
		//
		particleSystem.setLife(0.79);
		//
		particleSystem.setLifeVar(0.45);
		
		particleSystem.x = 270;
		particleSystem.y = size.height-380;
		this.addChild(particleSystem);
		
		return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

