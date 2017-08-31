/*
功能实现：
1.可以选择游戏角色
2.可以进行游戏
3.游戏结束自动开始下一局

棋盘布局：
a1  b1  c1
a2  b2  c2
a3  b3  c3
获胜的可能：
var winSituation=[
  ['a1', 'b1', 'c1'],
  ['a2', 'b2', 'c2'],
  ['a3', 'b3', 'c3'],
  ['a1', 'a2', 'a3'],
  ['b1', 'b2', 'b3'],
  ['c1', 'c2', 'c3'],
  ['a3', 'b2', 'c1'],
  ['a1', 'b2', 'c3'],
];
共8种
*/
//首先隐藏和显示游戏界面

$(document).ready(function() {
	$("#playGame").hide();
	$("#restart").hide();
	$("#rX").attr('checked', 'checked');
});
var game = {
	user: "X",  //我使用的角色
	computer: "O",  //电脑使用的角色
	currentPlayer: "",  //当前玩家
	turnCount:0// turn count - if 9 moves and no win, draw game.
}
var winSituation=[
['a1', 'b1', 'c1'],
['a2', 'b2', 'c2'],
['a3', 'b3', 'c3'],
['a1', 'a2', 'a3'],
['b1', 'b2', 'b3'],
['c1', 'c2', 'c3'],
['a3', 'b2', 'c1'],
['a1', 'b2', 'c3'],
];
var playChoose=$("#startBtn");

var restart=$("#restart");
playChoose.on("click",checkInfo);
restart.on("click",restartGame);
function checkInfo(){
	$("#startChoose").hide();
	$("#playGame").show();	
	$("#restart").show();
	if($("#rO").prop("checked")){
		game.user='O';
		game.computer='X';
		game.currentPlayer="computer";
		computerMove() ;
		
	}else{
		game.user='X';
		game.computer='O';
		game.currentPlayer="player";
	}
}
function restartGame() {
	if (game.turnCount>0&&!$(".td_game").hasClass('winner')) {//应该加上&&winner!=true，在已经获胜时不需要弹窗
		var cue=confirm('Do you want to quit without ending?');
		if(cue===false){return;}
	}
	game.turnCount=0;
	game.currentPlayer="";
	game.user="X";
	game.computer="O"
	$(".td_game").text("");
	$(".td_game").removeClass("winner"); //移除获胜行的高亮显示
	$("#playGame").hide();	
	$("#restart").hide();
	$("#startChoose").show();
}
$(".td_game").click(function(e) {
	var thisPoint=$("#"+e.currentTarget.id);
	if  (thisPoint.text()==="") {
		thisPoint.text(game.user);
		game.currentPlayer='user';
		game.turnCount+=1;
		(game.turnCount>4)?checkforWin():computerMove();
	}else{
		return;
	}
});

function checkforWin() {
	winSituation.map(function(item){
		var a=$("#"+item[0]).text(), 
		b=$("#"+item[1]).text(), 
		c=$("#"+item[2]).text();
		
		if (a !=="" &&a===b&&b===c) {
			$("#"+item[0]).addClass('winner');
			$("#"+item[1]).addClass('winner');
			$("#"+item[2]).addClass('winner');
			alert(a+"wins!");
			setTimeout(function(){
				restartGame();
			},800);
			game.turnCount=0;
			return;
		}
	});
	if (game.turnCount===9) {
		alert("It is Draw!");
		setTimeout(function(){
				restartGame();
			},800);
		game.turnCount=0;
		return;
	}
	if(game.currentPlayer !=='computer'){
		computerMove();
		return;
	}
}
function computerMove() {
	game.currentPlayer="computer";
	var cellPoints=['a1', 'b1', 'c1', 'a2', 'b2', 'c2', 'a3', 'b3', 'c3'];
	var cellCorner=['a1', 'a3', 'c1', 'c3'];
	var comWin="", comBlock="";

	if(game.turnCount===0){
		comBlock=cellCorner[Math.floor(Math.random()*(cellCorner.length))];
	}
	if (game.turnCount !==0 &&comBlock.length<1&&comWin<1) {
		var randomPoints=cellPoints.filter(function(item){return $("#"+item).text()==="";});
		comBlock=randomPoints[Math.floor(Math.random()*(randomPoints.length))];
	}
	//如果棋盘上有两个连着的符号，则走第三个
	//有两种可能，一种是电脑两个子连在一起，走第三个，获胜
	//或者玩家两个子连在一起，需要走第三个位置，进行堵截
	if (game.turnCount>2) {
		winSituation.forEach(function(item) {
			var a=$("#"+item[0]).text(), 
			b=$("#"+item[1]).text(), 
			c=$("#"+item[2]).text();
			if(a===game.user&&a===b&&c===""){
				comBlock=item[2];
			}else if (a===game.user&&a===c&&b==="") {
				comBlock=item[1];
			}else if (b===game.user&&b===c&&a==="") {
				comBlock=item[0];
			}else if (a===game.computer&&a===b&&c==="") {
				comWin=item[2];
			}else if (a===game.computer&&a===c&&b==="") {
				comWin=item[1];
			}else if (b===game.computer&&b===c&&a==="") {
				comWin=item[0];
			}
		});
	}
	if (comWin>0) {
		$("#"+comWin).text(game.computer);
	}else{
		$("#"+comBlock).text(game.computer);
	}
	game.turnCount+=1;
	if (game.turnCount>4) {checkforWin();}
	return;
}