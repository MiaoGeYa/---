var choice = 0;   //模式选择

var sp = 5;   //玩家移动速度
var sp2 = 3;
var fps = 55;
var score=  0;

//生命值
var playlive = 0;
var playliveImage = new Image();
playliveImage.src = "images/live.png";
var playlivex = 100;
var playlivey = 550;
var playlivewidth = 60;
var playliveheight = 40;

//画布属性
var boxx  = 0;
var boxy = 0;
var boxwidth = 640;
var boxheight = 600;

//玩家信息
var planeImage;
var planex = 0;
var planey =0;
var planewidth = 100;
var planeheight = 100;

//子弹信息
var bulletImage = new Image();
bulletImage.src="images/newbullet.PNG";
var bulletwidth = 30;
var bulletheight = 30;

//病毒信息
var enemyIamgeArray = [];   //图片数组
for(var i=0; i<6; i++)
{
	enemyIamgeArray[i] = new Image();
	enemyIamgeArray[i].src = "images/"+i+".PNG";
}
//病毒图片大小
var enemywidth =60;  
var enemyheight=58;

//能量信息
var powerImage = new Image();
powerImage.src = "images/power.png";
var powerImagewidth = 45;
var powerImageheight = 45;

//子弹数组
var bulletArray;
var allbullets = new Array();

//病毒数组
var enemyArray;
var allenemys = new Array();

//能量数组
var powerArray;
var allpowers = new Array();

//小Boss病毒数组
var sBossenemyArray;
var allsBossenemys = new Array();
var sBossenemylive = 0;  
var sBossenemywidth =130;  
var sBossenemyheight = 130;

//大Boss病毒数组
var bBossenemyArray;
var allbBossenemys = new Array();
var bBossenemylive = 0;   
var bBossenemywidth =180;  
var bBossenemyheight = 180;

var gameTimmer;  //游戏计时器
var btimmer;   //子弹图片显示和消失
var etimmer;   //病毒图片显示和消失
var sBosstimmer; 
var bBosstimmer; 
var ptimer;   //能量的显示和小时



//创建地球卫士
function beginplane()
{
	planex = boxwidth/2 ;
	planey = boxheight/2;
	planeImage = new Image();
	planeImage.src="images/hero0.png"; 
}

//游戏初始化
function init()
{
	clearInterval(sBosstimmer); 
	choice = 1;   //简单
	playlive = 3;
	stopinit1();
}

//困难
function init2()
{
	choice = 2;   //简单
	playlive = 5;
	stopinit2();
}

function stopinit1()
{
	sBossenemylive = 3;
	gameTimmer = 0;
	
	canvas = document.getElementById('canvas');
	cxt = canvas.getContext('2d');
	cxt.lineWidth=10;
	beginplane();
	
	var body = document.getElementsByTagName('body')[0];
	btimmer = setInterval(producebullet,400);
	etimmer = setInterval(produceenemy,2000);
	sBosstimmer = setInterval(producesBossenemy,10000);
	ptimmer = setInterval(producepower,10000);
	
	body.addEventListener('keydown',function (event)
	{
		switch(event.keyCode)
		{

			case 37 : 
				if(planex > boxy+10)
				{  sp = 5; } 
				else
				{ sp = 0; }
				
				planex -= sp;
				break;
			
			case 38 : 
				if(planey > boxy+30)
				{  sp = 7; } 
				else
				{ sp = 0; }
				
				planey -= sp;
				break;
				
			case 39 : 
				if((planex+planewidth) < boxwidth)
				{ sp = 7; }
				else
				{ sp = 0;} 
				
				planex = planex+sp;
				break;
				
			case 40 : 
				if((planey+planeheight) < boxheight-30)
				{ sp = 7; }
				else
				{ sp = 0; } 
				
				planey += sp;
				break;
				
			default:break; 
		}
	},false);
	
	gameTimmer = setInterval(run,1000/fps);
}

function stopinit2()
{
	gameTimmer = 0;
	sBossenemylive = 3;
	bBossenemylive = 5;
	
	canvas = document.getElementById('canvas');
	cxt = canvas.getContext('2d');
	cxt.lineWidth=10;
	beginplane();
	
	var body = document.getElementsByTagName('body')[0];
	btimmer = setInterval(producebullet,200);
	etimmer = setInterval(produceenemy,500);
	sBosstimmer = setInterval(producesBossenemy,8000);
	bBosstimmer = setInterval(producebBossenemy,20000);
	ptimmer = setInterval(producepower,30000);
	body.addEventListener('keydown',function (event)
	{
		switch(event.keyCode)
		{
			case 37 : 
				if(planex > boxx)
				{ sp = 3; }
				else
				{ sp = 0 ;}
				
				planex -=sp;
				break;
			
			case 38 : 
				if(planey > boxy+30)
				{  sp = 3; } 
				else
				{ sp = 0; }
				
				planey -= sp;
				break;
				
			case 39 : 
				if((planex+planewidth) < boxwidth)
				{ sp = 3; }
				else
				{ sp = 0;} 
				
				planex += sp;
				break;
				
			case 40 : 
				if((planey+planeheight) < boxheight-30)
				{ sp = 3; }
				else
				{ sp = 0; } 
				
				planey += sp;
				break;
				
			default:break; 
		}
	},false);
	
	gameTimmer = setInterval(run,1000/fps);
}

//绘制小Boss病毒
function drawsBossenemy()
{
	for (var i=0;i<allsBossenemys.length;i++)
	{
		if(allsBossenemys[i].islive)
		{
			var x = 0;
			cxt.drawImage(enemyIamgeArray[4],allsBossenemys[i].x,allsBossenemys[i].y,sBossenemywidth,sBossenemyheight);
			//drawsBossenemylive();
			for(var j=0; j<sBossenemylive;j++)
			{
				cxt.drawImage(playliveImage,allsBossenemys[i].x+10+x,allsBossenemys[i].y+10,40,25);
				x += 35;
			}
		}
	}
}

//绘制小Boss病毒
function drawbBossenemy()
{
	for (var i=0;i<allbBossenemys.length;i++)
	{
		if(allbBossenemys[i].islive)
		{
			var x = 0;
			cxt.drawImage(enemyIamgeArray[5],allbBossenemys[i].x,allbBossenemys[i].y,bBossenemywidth,bBossenemyheight);
			//drawsBossenemylive();
			for(var j=0; j<bBossenemylive;j++)
			{
				cxt.drawImage(playliveImage,allbBossenemys[i].x+15+x,allbBossenemys[i].y+10,40,25);
				x += 25;
			}
		}
	}
}

//绘制病毒
function drawenemy()
{
	var r = 0;
	for (var i=0;i<allenemys.length;i++)
	{
		if(allenemys[i].islive)
		{
			cxt.drawImage(enemyIamgeArray[r],allenemys[i].x,allenemys[i].y,enemywidth,enemyheight);
		}
		r++;
		if(r == 4)
		{ r = 0;}
	}
}

//绘制生命值
function drawplaylive()
{
	var x = 0;
	for(var i=0; i<playlive; i++)
	{
		cxt.drawImage(playliveImage,playlivex+x,playlivey,playlivewidth,playliveheight);
		x += 35;
	}
	
}

//绘制地球卫士
function drawplane()
{
	cxt.clearRect(boxx,boxy,boxwidth,boxheight);
	cxt.drawImage(planeImage,planex,planey,planewidth,planeheight);
}

//绘制子弹
function drawbullet()
{
	for(var i=0;i<allbullets.length;i++)
	{
		if(allbullets[i].islive)
		{
			cxt.drawImage(bulletImage,allbullets[i].x-14,allbullets[i].y-40,bulletwidth,bulletheight);
		}
	}
}

//绘制掉落的能量
function drawpower()
{
	for (var i=0;i<allpowers.length;i++)
	{
		if(allpowers[i].islive)
		{
			cxt.drawImage(powerImage,allpowers[i].x,allpowers[i].y,powerImagewidth,powerImageheight);
		}
	}
}

//绘制分数
function drawscore()
{
	document.getElementById('score').innerHTML=score;
}

//小Boss产生
function producesBossenemy()
{
	var x = Math.ceil(Math.random()*(boxwidth-planeheight)+10);
	if(choice == 1)
		sBossenemyArray = new enemy(x,5,2);
		
	else 
		sBossenemyArray = new enemy(x,5,3);
	
	allsBossenemys.push(sBossenemyArray);
	
	var timmer = setInterval("allsBossenemys["+ (allsBossenemys.length-1) + "].run()",200);
	allsBossenemys[allsBossenemys.length-1].timmer=timmer;
}

//大Boss产生
function producebBossenemy()
{
	var x = Math.ceil(Math.random()*(boxwidth-planeheight)+10);
	bBossenemyArray = new enemy(x,5,2);
		
	allbBossenemys.push(bBossenemyArray);
	
	var timmer = setInterval("allbBossenemys["+ (allbBossenemys.length-1) + "].run()",200);
	allbBossenemys[allbBossenemys.length-1].timmer=timmer;
}

//病毒产生
function produceenemy()
{
	var x = Math.ceil(Math.random()*(boxwidth-planeheight)+10);
	if(choice == 0)
		enemyArray = new enemy(x,5,4);
		
	else 
		enemyArray = new enemy(x,5,3);
	
	allenemys.push(enemyArray);
	
	var timmer = setInterval("allenemys["+ (allenemys.length-1) + "].run()",200);
	allenemys[allenemys.length-1].timmer=timmer;
	
}

//产生子弹
function producebullet()
{
	bulletArray = new bullet(planex+planewidth/2,planey+10);
	allbullets.push(bulletArray);
	
	var timmer = setInterval("allbullets[" + (allbullets.length-1) + "].run()",40);
	allbullets[(allbullets.length-1)].timmer=timmer;
}

//产生能量
function producepower()
{
	var x = Math.ceil(Math.random()*(boxwidth-planeheight)+10);
	if(choice == 0)
		powerArray = new power(x,5,5);
		
	else
		powerArray = new power(x,5,3);
		
	allpowers.push(powerArray);
	
	var timmer = setInterval("allpowers["+ (allpowers.length-1) + "].run()",200);
	allpowers[allpowers.length-1].timmer=timmer;
}

//检测子弹是否与病毒碰撞
function checkbullet()
{
	//子弹是否与小病毒碰撞
	for(var i=0;i<allenemys.length;i++)
	{
		if(allenemys[i].islive)
		{
			var e =allenemys[i];
			for(var j=0;j<allbullets.length;j++)
			{
				if(allbullets[j].islive)
				{
					var b = allbullets[j];
					if(b.x>e.x-bulletwidth && b.x+bulletwidth<e.x+enemywidth+10 && b.y<e.y)
					{
						e.islive=false;
						b.islive=false;
						score += 5;
					}
				}
			}
		}
	}
	
	//小Boss碰撞
	for(var i=0;i<allsBossenemys.length;i++)
	{
		if(allsBossenemys[i].islive)
		{
			var e =allsBossenemys[i];
			for(var j=0;j<allbullets.length;j++)
			{
				if(allbullets[j].islive)
				{
					var b = allbullets[j];
					if(b.x>e.x-bulletwidth&&b.x+bulletwidth<e.x+sBossenemywidth+10&&b.y<e.y)
					{
						sBossenemylive--;
						b.islive=false;
					}
					
					if(sBossenemylive==0)
					{
						e.islive=false;
						score += 10;
						sBossenemylive = 3;
					}
				}
			}
		}
	}
	
	//大Boss碰撞
	for(var i=0;i<allbBossenemys.length;i++)
	{
		if(allbBossenemys[i].islive)
		{
			var e =allbBossenemys[i];
			for(var j=0;j<allbullets.length;j++)
			{
				if(allbullets[j].islive)
				{
					var b = allbullets[j];
					if(b.x>e.x-bulletwidth&&b.x+bulletwidth<e.x+bBossenemywidth+10&&b.y<e.y)
					{
						bBossenemylive--;
						b.islive=false;
					}
					
					if(bBossenemylive==0)
					{
						e.islive=false;
						score += 20;
						bBossenemylive = 5;
					}
				}
			}
		}
	}
}

//检查地球卫士是否与病毒碰撞 /病毒是否落地
function checkplane()
{
	for(var i=0;i<allenemys.length;i++)
	{
		if(allenemys[i].islive)
		{
			var e = allenemys[i];
			if(e.x+enemywidth > planex && e.x < planex+planewidth && e.y > planey-1 || e.y > boxheight-120)
			{
				e.islive=false;
				playlive -= 1;
				//游戏结束
				checkplaylive();
			}
		}
	}
	
	//玩家与小boss碰撞
	for(var i=0;i<allsBossenemys.length;i++)
	{
		if(allsBossenemys[i].islive)
		{
			var e = allsBossenemys[i];
			if(e.x+130 > planex && e.x < planex+planewidth && e.y > planey-100 || e.y > boxheight-120)
			{
				e.islive=false;
				playlive -= 2;
				//游戏结束
				checkplaylive();
			}
		}
	}
	
	//玩家与大boss碰撞
	for(var i=0;i<allbBossenemys.length;i++)
	{
		if(allbBossenemys[i].islive)
		{
			var e = allbBossenemys[i];
			if(e.x+130 > planex && e.x < planex+planewidth && e.y > planey-100 || e.y > boxheight-120)
			{
				e.islive=false;
				playlive -= 3;
				//游戏结束
				checkplaylive();
			}
		}
	}
	
	//玩家与能量的碰撞
	for(var j=0; j<allpowers.length; j++)
	{
		if(allpowers[j].islive)
		{
			var p = allpowers[j];
			
			if(p.x+powerImagewidth > planex && p.x < planex+planewidth && p.y > planey-1)
			{
				p.islive=false;
				if(choice == 1)
					if(playlive < 3)	
						playlive += 1;
				
				else
					if(playlive <5)
						playlive += 1;
			}
		}
	}
}

//检查玩家生命
function checkplaylive()
{
	//游戏结束
	if(playlive <= 0)
	{
		gameovershow();
		playlive = 3;
	}
}
//游戏运行
function run()
{
	drawplane();
	drawbullet();
	drawscore();
	drawplaylive();
	drawpower();
	drawenemy();
	drawsBossenemy();
	drawbBossenemy();
	checkbullet();
	checkplane();
}

//保存分数
function showSite(Mscore)
{
    if (Mscore=="")
    {
        document.getElementById("txtHint").innerHTML="";
        return;
    } 
    if (window.XMLHttpRequest)
    {
        // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xmlhttp=new XMLHttpRequest();
    }
    else
    {
        // IE6, IE5 浏览器执行代码
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            document.getElementById("txtHint").innerHTML=xmlhttp.responseText;
        }
    }
    xmlhttp.open("GET","score.php?Score=" + Mscore ,true);
    xmlhttp.send();
}