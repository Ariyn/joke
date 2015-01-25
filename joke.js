var iNetas = []
var selectNeta = null
var blenderIndex = 0, blenderBox = [null, null, null, null];

var map = []
var playerTeratory = [], enemyTeratory = []
var playerMovableTe = [], enemyMovableTe = []

var infos = [
	"......",
	"음, 발표했다간 몰매맞을듯한 내용이다.",
	"쫌 괜찮은거 같다. 인터넷에 익명으로 올린다면.",
	"흠. 동네 복덕방에서 읽어볼만한 수준인거 같다.",
	"TV에 나가도 안티는 안생길것 같다.",
	"시학 2권이 여기있구나...."
]

var slotMode = false;
var joke = null;

var map = []
var jokes = []
var netaIndex = 0, netaCategory = ["인구", "문화", "전투", "기술", "경제"]
var money = 10000, godPower = 0

var upgrades = {
	"":0
}
var ctx = null;

var country = {
	"인구":{"value":100,"vector":0,"upgrade":0},
	"문화":{"value":0,"vector":0,"upgrade":0},
	"전투":{"value":0,"vector":0,"upgrade":0},
	"기술":{"value":0,"vector":0,"upgrade":0},
	"종교":{"value":0,"vector":0,"upgrade":0},
	"경제":{"value":0,"vector":0,"upgrade":0},
	"행복":{"value":0,"vector":1,"upgrade":0},
	_time:0,
	property:[0,0],
	indexOf:function(e) {
		return ["인구", "문화", "전투", "기술", "종교", "경제"].indexOf(e)
	},
	updateCheck:function() {
		var date = new Date();
		var n = date.getTime();
		if(this._time+1000 <= n) {
			this._time = n
			return true
		}
	}
}

Math.rad = function(e) {
	return Math.PI * e / 180
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor(obj.category);
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function Tile(x, y, type, owner) {
	this.x = x, this.y = y
	this.type = type, this.owner = owner

	return this
}

function MakeNeta(type, subject, tile) {
	if(type != "undefined") {
		this.type = type;
	} else {
		this.type = "테스트 타입"
	}
	this.sub = subject
	this.funSize = Math.floor(Math.random()*10%10);
	this.tile = tile

	return this
}

function Joke(jc) {
	this.createTime = new Date().getTime();
	this.name = "농담의 이름이다."
	this.tier = "12등급 썰렁함"
	this.category = jc

	this.quality = (function(jc) {
		sum = 0
		for(var i in jc)
			sum += jc[i][2].funSize
		return sum;
	}(jc));

	this.categoryType = []

	num = this.quality
	for(var i=0; i<5;i++) {
		// _num = Math.floor(Math.random()*100%100)
		_num = num / 5
		this.categoryType.push(_num)
	}
	// console.log(this.quality, Math.floor(this.quality / 20 % 5))
	this.targetAge = (Math.floor(Math.random()*70/10)*10+10)+"대"
	this.info = infos[Math.floor(this.quality / 20 % 5)]

	return this
}

function reset() {
	iNetas = []
	slotMode = false

	$(".MakeRow").html("")

	$("#MakeDiv").css("visibility", "hidden")
	$("#gameDiv").css("visibility", "visible")

	$("#ObjectDiv>button").text("주제")
	$("#TypeDiv>button").text("타입")
}

function refresh() {

	for(var i in country) {
		_ind = country.indexOf(i)
		var statusInd = (function(e) {
			// console.log(e)
			if(e<=3)
				return 1
			else
				return 2
		}(_ind+1));
		
		var childInd = (function(e) {
			// console.log(e)
			if(4<=e)
				return e-3
			else
				return e
		}(_ind+1));

		// console.log(statusInd, childInd)

		$("#status"+statusInd+">li"+":nth-child("+childInd+")").text(i+" : "+Math.floor(country[i]["value"]))
	}

	$("#moneySpan").text("헌금 : "+money)
}

function _drawHexagon(ctx, x, y, radius) {
	ctx.beginPath();
	for(var i=0;i<7;i++){
	    var angle = 2 * 3.141592 / 6 * (i+0.5)

	    _x = x + radius * Math.cos(angle)
	    _y = y + radius * Math.sin(angle)
	    // console.log(i,angle,_x,_y)
	    if(i == 0)
	        ctx.moveTo(_x, _y)
	    else
	        ctx.lineTo(_x, _y)
	    ctx.fill()
	    ctx.stroke()
	}
}

function DrawHexagon(ctx, x, y, type) {
	var typeColor = {
		"player":"#00CCCC",
		"playerMovable":"#007777",
		"enemy":"#FF0000",
		"enemyMovableTe":"#770000",
		"none":"rgba(0, 0, 0, 0)"
	}
	var radius = 30
	var _xOde = Math.cos(Math.rad(30))*radius
	var _x = (_xOde*2*x)
	var _y = (Math.sin(Math.rad(30))+1)*radius*y + 30
	var ode = (y%2)*_xOde

	ctx.fillStyle = typeColor[type]
	_drawHexagon(ctx, _x+ode, _y, 30)
}

function realloc(tile, index, teratory, mTeratory) {
	for(var i in index) {
		var _x = tile.x + index[i][0], _y = tile.y+index[i][1]

		if(0<=_x && _x<9 && 0<=_y && _y<6) {
			// console.log(_x,_y)
			var ok = true

			for(var e in mTeratory) {
				var _tile = mTeratory[e]
				if(_tile.x == _x && _tile.y == _y)
					ok = false
			}
			for(var e in teratory) {
				var _tile = teratory[e]
				if(_tile.x == _x && _tile.y == _y)
					ok = false
			}

			if(ok)
				mTeratory.push(map[_y][_x])
		}
	}
}
function occupy(tile, owner) {
	var teratory = {
		"player":playerTeratory,
		"enemy":enemyTeratory
	}
	var mTeratory = {
		"player":playerMovableTe,
		"enemy":enemyMovableTe	
	}
	var index = [
		[[-1,-1], [0,-1], [1,0], [0,1], [-1,1], [-1,0]], 
		[[0,-1], [1,-1], [1,0], [1,1], [0,1], [-1,0]]
	][tile.y%2]


	for(var i in teratory) {
		if(i != owner) {
			var enemyTe = teratory[i].indexOf(tile)
			if(enemyTe != -1) {
				teratory[i].splice(enemyTe,1)
				// mTeratory[i].
				mTeratory[i].length = 0
				for(var e in teratory[i])
					realloc(teratory[i][e], index, teratory[i], mTeratory[i])
			}
		}
	}

	// console.log(index)
	tile.owner = owner
	teratory[owner].push(tile)

	for(var i in mTeratory[owner]) {
		var _tile = mTeratory[owner][i]
		if(_tile.x == tile.x && _tile.y == tile.y) {
			// console.log("remove",tile.x, tile.y, _tile.x, _tile.y, i)
			mTeratory[owner].splice(i,1)
		}
	}
	realloc(tile, index, teratory[owner], mTeratory[owner])
}

function DrawBubble(ctx, string, tier, x, y) {
	var index = [
		[[-1,-1], [0,-1], [1,0], [0,1], [-1,1], [-1,0]], 
		[[0,-1], [1,-1], [1,0], [1,1], [0,1], [-1,0]]
	][tile.y%2]

	var radius = 30
	var _xOde = Math.cos(Math.rad(30))*radius
	var _x = (_xOde*2*x)
	var _y = (Math.sin(Math.rad(30))+1)*radius*y + 30
	var ode = (y%2)*_xOde

	ctx.fillStyle = "black"
	ctx.fillText(string, _x+ode-string.length*6, _y)
	ctx.fillText(tier, _x+ode-4, _y+15)
}

function refreshScreen() {
	

	for(var i in playerMovableTe) {
		var _tile = playerMovableTe[i]
		DrawHexagon(ctx, _tile.x, _tile.y, "playerMovable")
	}

	for(var i in enemyMovableTe) {
		var _tile = enemyMovableTe[i]
		DrawHexagon(ctx, _tile.x, _tile.y, "enemyMovableTe")
	}

	for(var i in map) {
		for(var e in map[i]) {
			tile = map[i][e]
			DrawHexagon(ctx, tile.x, tile.y, tile.owner)
		}
	}

	var neta = blenderBox[netaIndex-1]
	if(neta) {
		DrawBubble(ctx, neta.type, neta.funSize, neta.tile.x, neta.tile.y)
	}
	
}

function init() {

	var width=$(document).width(), height=$(document).height()
	$("#mapCanvas").attr("width",width*0.87+"px").attr("height",height*0.6+"px")

	ctx = $("#mapCanvas")[0].getContext('2d')
	ctx.font="14px Verdana";
	// ctx.fillText("Hello World!",10,30);
	// drawHexagon(ctx, 30, 30, 30)

	for(var e=0;e<6;e++) {
		var _map = []
		for(var i=0;i<9;i++){
			_tile = new Tile(i, e, "land", "none")
			_map.push(_tile)
		}
		map.push(_map)
	}
	
	occupy(map[0][1], "player")
	occupy(map[5][7], "enemy")

	console.log(playerMovableTe)

	refreshScreen()

	$(".Neta").click(function(e) {
		if(slotMode && blenderIndex < 5) {
			// console.log($(this).parent().index(), blenderBox[$(this).index()])
			// console.log(blenderBox)
			var _selectNeta = blenderBox[$(this).parent().index()]
			var thisBox = $(".MakeRow:eq("+blenderIndex+")")

			iNetas.push([$(thisBox).index()+1, 0, _selectNeta])

			$(thisBox).append($("<span>"+_selectNeta.type+"</span></br><span>재미 : "+_selectNeta.funSize+"</span>"))
			$($(this).children()[0]).text("")
			blenderIndex += 1
		}
	})

	var slot = function() {
		if(!slotMode) {
			
			$("#MakeDivBlender").css("visibility", "visible")
			$("#MakeDivInfo").css("visibility", "hidden")
			// $("#gameDiv").css("visibility", "hidden")

			$("#DELETE").css("visibility", "visible")
			$("#SELL").css("visibility", "visible")	

			refresh()

			slotMode = true
		}
	}

	$("#SLOT").click(function() {
		slot()
		$(this).css("visibility", "hidden")
	})

	$("#SELL").click(function() {
		if(slotMode && 1 <= blenderIndex) {
			$("#MakeDivBlender").css("visibility", "hidden")
			$("#MakeDivInfo").css("visibility", "visible")
			$("#SELL").text("발표!")
			// console.log("lenderIndex",blenderIndex)
				
			$("#MakeDivInfo").html("")
			
			randomCategory = []
			categoryNum = 0
			blenderIndex = 0

			// console.log("category", categoryNum)
			divString = ""
			joke = new Joke(iNetas);

			var netas = [
				["인구",0],
				["문화",0],
				["전투",0],
				["기술",0],
				["종교",0],
				["경제",0]
			]
			for(var i in iNetas) {
				// console.log(iNetas[i])
				// divString += "<div class=\"col-md-3\">"+iNetas[i][2].type+"</div>"
				var _neta = iNetas[i][2]
				var _ind = netaCategory.indexOf(_neta.type)
				netas[_ind][1] += _neta.funSize
				// divString += _neta.type + " " + _neta.sub
			}
			console.log(netas)
			for(var i in netas) {
				var e = netas[i]
				if(e[1] != 0) {
					divString += e[0] + " " + e[1]
					console.log(e[0], e[1])
				}
			}

			if(divString != "") {
				$("#ResultDiv")
					.css("visibility", "visible")
					.css("display","inline")

				$("#JokeName").text(joke.name)
				$("#JokeTier").text(joke.tier)
				$("#JokeRecipe").text(divString)
				$("#JokeInfo").text(joke.info)
				$("#JokeReactionDiv").text(joke.targetAge)
			}
			refresh()
			reset()
		} else {
			if(joke != null){
				jokes.push(clone(joke))
				
				for(var i in joke.category) {
					var _i = joke.category[i]
					// console.log(_i[2], _i[2].funSize)
					var _ind = netaCategory.indexOf(_i[2].type)
					country[_i[2].type]["vector"] += _i[2].funSize * 0.1
				}

				console.log(country)
				refresh()
				reset()

				$("#ResultDiv").css("visibility", "hidden")

				$("#ResultDiv")
					.css("visibility", "hidden")
					.css("display","none")

				$("#MakeDivInfo").css("visibility","hidden")

				$("#DELETE").css("visibility", "hidden")
				$("#SELL").css("visibility", "hidden").text("믹스!")

				$("#SLOT").css("visibility","visible")
			}
		}
	})

	$("#DELETE").click(function() {
		refresh()
		reset()

		$("#ResultDiv").css("visibility", "hidden")
		$("#MakeDivBlender").css("visibility", "hidden")
		$("#MakeDivInfo").css("visibility","hidden")

		$("#ObjectDiv").css("visibility", "visible")
		$("#TypeDiv").css("visibility", "visible")

		$("#DELETE").css("visibility", "hidden")
		$("#SELL").css("visibility", "hidden").text("믹스!")

		$("#SLOT").css("visibility","visible")
	})
}

function newNeta() {
	netaIndex += 1
	if(4 < netaIndex) {
		netaIndex = 1
	}

	var catInd = Math.floor(Math.random()*5)
	var cat = netaCategory[catInd]

	var upgrade = country[cat].upgrade
	var sub = Math.floor(Math.random()*upgrade)

	var _tile = playerTeratory[Math.floor(Math.random()*playerTeratory.length)]

	blenderBox[netaIndex-1] = new MakeNeta(cat, sub, _tile)
	// $("#C"+netaIndex+"Div>span").text(cat+" "+sub)

	// console.log($("#C"+netaIndex+"Div>span").text(), netaIndex)
	
	// console.log(netaCategory[cat], sub)
	
}

function calcCountry() {
	for(var i in country) {
		country[i]["value"] += country[i].vector
	}
}

function timeout() {
	var up = country.updateCheck()
	if(up) {
		newNeta()
		var length = playerMovableTe.length
		if(0<length) {
			var _tile = playerMovableTe[Math.floor(Math.random()*length)]
			occupy(_tile,"player")
			// refreshScreen()
		}
		length = enemyMovableTe.length
		if(0<length) {
			var _tile = enemyMovableTe[Math.floor(Math.random()*length)]
			occupy(_tile,"enemy")
		}

		refreshScreen()
	}
		

	calcCountry()
	refresh()
	// console.log(country)

	setTimeout(timeout, 30)
}

// setInterval(newNeta,500)
setTimeout(timeout, 30)
console.log(country)
$(document).ready(init)
