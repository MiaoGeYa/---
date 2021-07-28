//
var scene;
var cube;
var camera;
var renderer;
var clock;
var holder;
var intersects;
var particles = [];
var level = 1;   //第几关
var totalLevels = 4;
var score = 0;
var totalTargets = 3;
var speed = 0.01;
var complete = false;
var comments = ["简单","中等","困难","疯狂"];

var myLevel = document.getElementById("level");
var myScore = document.getElementById("score");
var myNextbutton = document.getElementById("nextbutton");
var mylevelchoice = document.getElementById("Levelchoice");

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function myScene()
{
	scene = new THREE.Scene();
	var light = new THREE.AmbientLight(0xffffff);
	var width = window.innerWidth;
	var height = window.innerHeight;
	camera = new THREE.PerspectiveCamera(75,width/height,0.1,1000);
	camera.position.z = 18;
	
	renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
	renderer.setSize(width,height);
	
	document.getElementById("webgl-container").appendChild(renderer.domElement);
	
	clock = new THREE.Clock();
	
	var sLight = new THREE.SpotLight(0xffffff);
	sLight.position.set(-100,100,100);
	scene.add(sLight);
}

//
function addHolder()
{
	holder = new THREE.Object3D();
	holder.name = "holder";
	
	for(var i=0; i<totalTargets; i++)
	{
		var randCol = new THREE.Color();
		randCol.setRGB(Math.random(),Math.random(),0);
		
		var geometry = new THREE.BoxGeometry(2,2,2);
		var material = new THREE.MeshPhongMaterial({ color:randCol, ambient:randCol });
		
		var cube = new THREE.Mesh(geometry,material);
		cube.position.x = i*5;
		cube.name = "cubeName" + i;
		
		var spinner = new THREE.Object3D();
		spinner.rotation.x = i*2.5*Math.PI;
		spinner.name = "spinnerName" + i;
		spinner.add(cube);
		holder.add(spinner);
	}
	scene.add(holder);
}

//
function addExplosion(point)
{
	var timeNow = clock.getElapsedTime();
	
	for(var i=0; i<4; i++)
	{
		var geometry = new THREE.BoxGeometry(1,1,1);
		var material = new THREE.MeshBasicMaterial({ color:0x999999 });
		
		var part = new THREE.Mesh(geometry,material);
		part.position.x = point.x;
		part.position.y = point.y;
		part.position.z = point.z;
		part.name = "part" + i;
		part.birthDay = timeNow;
		scene.add(part);
		particles.push(part);
	};
}

function render()
{
	holder.children.forEach
	(
		function(elem,index,array)
		{
			elem.rotation.y += (speed*(6-index));
			elem.children[0].rotation.x += 0.01;
			elem.children[0].rotation.y += 0.01;
		}
	);
	
	if(particles.length > 0)
	{
		particles.forEach
		(
			function(elem,index,array)
			{
				switch(elem.name)
				{
					case "part0":
						elem.position.x += 1;
						break;
					case "part1":
						elem.position.x -= 1;
						break;
					case "part2":
						elem.position.y += 1;
						break;
					case "part3":
						elem.position.y -= 1;
						break;
					default:
						break;
				}
				
				if(elem.birthDay - clock.getElapsedTime() < -1)
				{
					scene.remove(elem);
					particles.splice(index,1);
				}
			}
		);
	};
	
	renderer.render(scene,camera);
}

function onDocumentMouseDown(event)
{
	 event.preventDefault();
	 if(complete)
	 {
	  	complete = false;
	 	score = 0;
		myNextbutton.onclick = function(){alert("点击按钮进入下一关");restartScene();};
    	myNextbutton.click();
	 	return;
	 }
	
	mouse.x = (event.clientX / window.innerWidth)*2-1;
	mouse.y = -(event.clientY / window.innerHeight)*2+1;
	
	raycaster.setFromCamera(mouse,camera);
	
	if(score < totalTargets)
	{
		holder.children.forEach(
			function(elem,index,array)
			{
				intersects = raycaster.intersectObjects(elem.children);
				if(intersects.length > 0 && intersects[0].object.visible)
				{
					intersects[0].object.visible = false;
					
					addExplosion(intersects[0].point);
					score += 1;
					
					if(score < totalTargets)
					{
						myScore.innerHTML = "<span class = 'hit'>命中！</span>得分：" + score + "/" + totalTargets;
					}
					
					else
					{
						complete = true;
						
						if(level < totalLevels)
						{
							myScore.innerHTML = "<strong>恭喜过关！</strong>点击下一关按钮进入第" + (level+1) + "&nbsp;关！";
						}
						
						else
						{
							myScore.innerHTML = "<strong>通关成功！</strong>点击屏幕重新开始";
						}
					}
				}
			}
		);
	}
}

function buttonDown()
{
	if(complete)
	{
		complete = false;
		score = 0;
		restartScene();
		return;
	}
}

//
function restartScene()
{
	myScore.innerHTML = "";
	
	if(level < totalLevels)
	{
		speed += 0.005;
		totalTargets += 1;
		level += 1;
	}
	
	else
	{
		speed = 0.01;
		totalTargets = 3;
		level = 1;
	}
	
	myLevel.innerText = comments[level-1] + ":第" + level + "关，共" + totalLevels + "关";
	scene.remove(holder);
	addHolder();
}

document.getElementById("webgl-container").addEventListener('mousedown', onDocumentMouseDown, false);

function onWindowResize() 
{

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();
}
//重绘
function animate() 
{
    requestAnimationFrame(animate);
    render();
}

//
window.onload = function()
{
	myLevel.innerText = comments[level-1] + ":第" + level + "关，共" + totalLevels + "关";
	myScene();
	addHolder();
	animate();
	
	window.addEventListener('resize',onWindowResize,false);
}










