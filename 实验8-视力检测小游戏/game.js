//全局变量
var btn = document.querySelector('button');
var z = 30.00;
var times = document.getElementById('times');
var uls = document.querySelector('ul');
var li_1 = document.getElementsByClassName('list1')[0];
var score = document.getElementById('score');  //分数
var level = 1;
var n = 0;
var back = document.getElementById('back');

//开始游戏按钮响应函数
btn.onclick = function()
{
	//计时器
	var timer = setInterval
	( function()
		{
			z -= 0.01;
			z = z.toFixed(2);
			times.innerHTML = z;
			if(z <= 0)
			{
				clearInterval(timer);
				if(n < 8)
				{ alert('Game Over !' + ' ' + '等级：高度近视');}
			
				else if(n <= 12)
				{ alert('Game Over !' + ' ' + '等级：正常视力');}
			
				else if(n <= 20)
				{ alert('Game Over !' + ' ' + '等级：天兵天将');}
			
				else
				{ alert('Game Over !' + ' ' + '等级：悟空转世');}
				
				back.style.display = 'block';
			}
		},10);
		
	//点击按钮消失
	btn.remove();
	li_1.remove();
	
	app();
	function app()
	{
		level += 1;
		for(var i=0; i<level*level; i++)
		{
			var newLi = document.createElement('li');
			uls.appendChild(newLi);
			var newImg = document.createElement('img');
			newLi.appendChild(newImg);
			newLi.style.width = 100/level+'%';
			newLi.style.float = 'left';
			newImg.style.display = 'block';
			newImg.style.width = 100+'%';
			newImg.src = 'img/1.png';
			
			newLi.style.backgroundColor = 'rgb(' + rand(50,255) + ',' + rand(50,255) + ',' + rand(50,255) + ')';
		}
		
		var x = rand(0,level*level-1);
		var imgsl = document.querySelectorAll('img');
		imgsl[x].src = 'img/2.png';
		
		var li = document.querySelectorAll('li');
		li[x].onclick = function()
		{
			for(var i=0; i<level*level; i++)
			{ li[i].remove(this); }
			
			n += 1;
			
			score.innerHTML = n;
			if(level > 10)
			{ level = 10; }
		
			app();
		}
	}
}

//随机函数
function rand(min,max)
{
	return Math.round(Math.random()*(max-min) + min);
}










