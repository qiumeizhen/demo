var td = new Array(), 	 //保存每个格子的地鼠
	playing = false,  	//游戏是否开始
	score = 0,			//分数
	beat = 0,			//鼠标点击次数
	success = 0,		//命中率
	knock = 0,			//鼠标点中老鼠图片次数
	countDown = 30,		//倒计时
	interId = null,		//指定setInterval()的变量
	timeId = null;		//指定setTimeout()的变量


console.log(td)
//随机循环显示老鼠的位置
function show(){
	if(playing){
		var current = Math.floor(Math.random()*25);
		console.log("开始循环显示"+playing+current);
		//随机显示图片位置
		document.getElementById("td["+current+"]").innerHTML = "<img src='img/fire.png'/>";
		//显示3秒后隐藏
		setTimeout("document.getElementById('td["+current+"]').innerHTML = ''",3000)
	}
}

//倒计时开始
function timeShow(){
	console.log("倒计时开始！")
	document.form1.remtime.value =  countDown;
	if(countDown == 0){
		console.log("时间到，游戏结束！")
		GameOver();
		return false;
	}else{
		countDown = countDown-1;
		timeId = setTimeout("timeShow()",1000)
	}
}
//停止游戏
function timeStop(){
	clearInterval(interId); //清空函数返回setInterval的id
	clearTimeout(timeId);//null 清空函数返回setTimeout的id
	console.log("停止游戏！")
}

//游戏结束
function GameOver(){
	timeStop();//停止游戏
	playing = false;
	clearMouse();
	console.log("恭喜你的分数为"+score+",命中率为"+success+"，欢迎下次挑战。")
	score = 0;
	success = 0;
	knock = 0;
	beat = 0;
	countDown = 0;
}

//清空所有老鼠图片
function clearMouse(){
	for(var i=0;i<=24;i++){
		console.log("老鼠图片"+i);
		document.getElementById("td["+i+"]").innerHTML = '';
	}
}

// 点击事件函数，判断是否点中老鼠
function hit(id){
	if(playing == false){
		alert("请点击开始游戏");
		return;
	}else{
		beat += 1;
		if(document.getElementById("td["+id+"]").innerHTML != ''){
			console.log("点击了td"+id+"有老鼠");
			score += 1;
			knock += 1;
			var indexOf = knock/beat
			success = Math.round(indexOf*100)/100 + "%";//取两位数
			document.form1.score.value = score;
			document.form1.success.value = success;
			document.getElementById("td["+id+"]").innerHTML = '0';
		}else{
			score += -1;
			var indexOf1 = knock/beat
			success = Math.round(indexOf1*100)/100 + "%";//取两位数
			// success = knock/beat;
			document.form1.score.value = score;
			document.form1.success.value = success;
			console.log("点击了td"+id+"没有老鼠");
		}
	}
}



//游戏开始
function GameStart(){
	playing = true;
	countDown = 30;
	interId = setInterval("show()",1000);
	document.form1.score.value = score;
	document.form1.success.value = success;
	timeShow();
	console.log("开始游戏")
}