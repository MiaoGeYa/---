//var enemyspeed = 5;   //病毒移动速度
//var powerspeed = 2;

//子弹的产生
function bullet(x,y)
{
    this.x=x;
    this.y=y;
    this.islive=true;
    this.timmer=null;
	
    this.run=function run()
	{
        if(this.y<-10||this.islive==false)
		{
            clearInterval(this.timmer);
            this.islive=false;
        }
		else
		{
            this.y -= 30;
        }
    }
}

//病毒的产生
function enemy(x,y,speed)
{
    this.x=x;
    this.y=y;
    this.islive=true;
    this.timmer=null;
	
    this.run=function run()
	{
        if(this.y>boxheight||this.islive==false){
            clearInterval(this.timmer);
            this.islive=false;
        }else{
            this.y += speed;
        }
    }
}

//能量的产生
function power(x,y,speed)
{
	this.x=x;
    this.y=y;
    this.islive=true;
    this.timmer=null;
	
    this.run=function run()
	{
        if(this.y>boxheight||this.islive==false){
            clearInterval(this.timmer);
            this.islive=false;
        }else{
            this.y += speed;
        }
    }
}
