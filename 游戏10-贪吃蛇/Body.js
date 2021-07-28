//关节类

var SnakeBody = cc.Sprite.extend
({
	frontBody : null,
	nextDirection : 0,
	direction : 0,
	ctor : function(frontBody,direction)
	{
		this._super();
		this.frontBody = frontBody;
		this.direction = direction;
		this.nextDirection = direction;
		return true;
	},
	
	onEnter : function()
	{
		this._super();
		if(this.frontBody == null)
		{
			switch(this.direction)
			{
				case 1:
					this.setTexture(res.head_up);
					break;
					
				case 2:
					this.setTexture(res.head_down);
					break;
					
				case 3:
					this.setTexture(res.head_left);
					break;
					
				case 4:
					this.setTexture(res.head_right);
					break;
			}
		}
		
		else
		{
			this.setTexture(res.body);
			
			var frontX = this.frontBody.getPositionX();
			var frontY = this.frontBody.getPositionY();
			
			var frontWidth = this.frontBody.width;
			var frontHeight = this.frontBody.height;
			
			var width = this.width;
			var height = this.height;
			
			switch(this.frontBody.direction)
			{
				case 1:
					this.setPosition(frontX,frontY - frontHeight/2 - height/2 - 1);
					break;
					
				case 2:
					this.setPosition(frontX,frontY + frontHeight/2 + height/2 + 1);
					break;
					
				case 3:
					this.setPosition(frontX + frontWidth/2 + width/2 + 1,frontY);
					break;
					
				case 4:
					this.setPosition(frontX - frontWidth/2 - width/2 - 1,frontY);
					break;
			}
		}
		
		return true;
	},
	
	move : function(layer)
	{
		var star = layer.star;
		var direct;
	
		if(this.frontBody == null)
		{
			direct = this.nextDirection;
		}
	
		else
		{
			this.nextDirection = direct = this.frontBody.direction;
		}
	
		switch(direct)
		{
			case 1:
				this.setPosition(this.getPositionX(),this.getPositionY() + Constants.speed);
				break;
			
			case 2:
				this.setPosition(this.getPositionX(),this.getPositionY() - Constants.speed);
				break;
			
			case 3:
				this.setPosition(this.getPositionX() - Constants.speed,this.getPositionY());
				break;
			
			case 4:
				this.setPosition(this.getPositionX() + Constants.speed,this.getPositionY());
				break;
		}
	
		if(this.frontBody == null)
		{
			switch(this.nextDirection)
			{
				case 1:
					this.setTexture(res.head_up);
					break;
				
				case 2:
					this.setTexture(res.head_down);
					break;
				
				case 3:
					this.setTexture(res.head_left);
					break;
				
				case 1:
					this.setTexture(res.head_right);
					break;
			}
		
			var size = cc.winSize;
			if((this.getPositionX() > size.width - this.width/2)
				|| (this.getPositionX() < this.width/2) 
				|| (this.getPositionY() > size.height - this.height/2)
				|| (this.getPositionY() < this.height/2))
			{
				return false;
			}
		
			for(var index in layer.bodys)
			{
				if(layer.bodys[index] != this && cc.rectIntersectsRect(this.getBoundingBox(),layer.bodys[index].getBoundingBox()))
				{
					return false;
				}
			}
		
			if(star != null)
			{
				if(cc.rectIntersectsRect(this.getBoundingBox(),star.getBoundingBox()))
				{
					star.runAction
					(
						cc.sequence(cc.spawn(cc.scaleTo(0.2,3),cc.fadeOut(0.2)),
									cc.callFunc(function(star){ star.removeFromParent(); },star))
					);
				
					layer.star = null;
					layer.canNewBody = 1;
					
					layer.score.setString("" + (Number(layer.score.getString()) + Math.round(Math.random()*3+1)));
					layer.score.runAction(cc.sequence(cc.scaleTo(0.1,2),cc.scaleTo(0.1,0.5),cc.scaleTo(0.1,1)));
				}
			}
		}
	
		return true;
	}
})












