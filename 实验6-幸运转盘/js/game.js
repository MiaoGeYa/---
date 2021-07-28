//
var lottery = 
{
	index:-1,
	count:0,
	timer:0,
	speed:20,
	times:0,
	cycle:50,
	prize:-1,
	
	init:function(id)
	{
		if($("#"+id).find(".lottery-unit").length > 0)
		{
			$lottery = $("#"+id);
			$units = $lottery.find(".lottery-unit");
			this.obj = $lottery;
			this.count = $units.length;
			$lottery.find(".lottery-unit-" + this.index).addClass("active");
		};
	},
	
	roll:function()
	{
		var index = this.index;
		var count = this.count;
		var lottery = this.obj;
		$(lottery).find(".lottery-unit-"+index).removeClass("active");
		index += 1;
		if(index > count-1)
		{ index = 0; }
		
		$(lottery).find(".lottery-unit-"+index).addClass("active");
		this.index = index;
		return false;
	},
	
	stop:function(index)
	{
		this.prize = index;
		return false;
	}
};

function roll()
{
	lottery.times += 1;
	lottery.roll();
	if(lottery.times > lottery.cycle+10 && lottery.prize == lottery.index)
	{
		clearTimeout(lottery.timer);
		lottery.prize = -1;
		lottery.times = 0;
		click = false;
	}
	else
	{
		if(lottery.times < lottery.cycle)
		{ lottery.speed -= 10;}
	
		else if(lottery.times == lottery.cycle)
		{
			var index = Math.random()*(lottery.count) | 0;
			lottery.prize = index;
		}
		
		else
		{
			if(lottery.times > lottery.cycle+10 && ((lottery.prize == 0 && lottery.index == 7) || lottery.prize == lottery.index+1))
			{ lottery.speed += 110; }
		
			else
			{ lottery.speed += 20; }
		}
		
		if(lottery.speed < 40)
		{ lottery.speed = 40; };
	
		lottery.timer = setTimeout(roll,lottery.speed);
	}
	
	return false;
}

//
var click = false;
window.onload = function()
{
	lottery.init('lottery');
	$("#lottery a").click
	(
		function()
		{
			if(click)
			{ return false; }
			
			else
			{
				lottery.speed = 100;
				roll();
				click = true;
				return fasle;
			}
		}
	);
};




