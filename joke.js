var jokeCategory = ["소재1", "소재2", "소재3", "소재4", "소재5", "소재6", "소재7", "소재8"]
var iNetas = [], totalMass = 0
var selectNeta = null

var jokeType = null, jokeObject = null

var blenderIndex = 0;

var categorys = [0, 0, 0, 0, 0]
var concentRate = 100, money = 10000;
var infos = [
	"......",
	"음, 발표했다간 몰매맞을듯한 내용이다.",
	"쫌 괜찮은거 같다. 인터넷에 익명으로 올린다면.",
	"흠. 동네 복덕방에서 읽어볼만한 수준인거 같다.",
	"TV에 나가도 안티는 안생길것 같다.",
	"시학 2권이 여기있구나...."
]

var slotMode = false;
var ctx = null;
var joke = null;

function MakeNeta(type) {
	if(type != "undefined") {
		this.type = type;
	} else {
		this.type = "테스트 타입"
	}

	this.funSize = Math.floor(Math.random()*10%10);

	return this
}

function Joke(jc) {
	this.name = "농담의 이름이다."
	this.tier = "12등급 썰렁함"
	this.category = jc

	this.quality = function(jc) {
		sum = 0
		for(var i in jc)
			sum += jc[i][2].funSize
		return sum;
	}(jc);

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

function calcCM() {
	var x=0, y=0
	for(var i in iNetas) {
		console.log(iNetas[i])
		e = iNetas[i]
		x += e[0]*e[2].funSize
		y += e[1]*e[2].funSize
	}
	x /= totalMass, y /= totalMass

	return [x, y]
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
	$("#concentRate").text("집중력 : "+concentRate)
}

function init() {

	// $(".MakeRow").click(function(e) {
	// 	// console.log($(this).index()+1, $(this).parent().index()+1);
	// 	if(selectNeta) {
	// 		console.log(selectNeta)
	// 		iNetas.push([$(this).index()+1, $(this).parent().index()+1, selectNeta])
	// 		totalMass += selectNeta.funSize
	// 		$(this).append($("<span>"+selectNeta.type+"</span></br><span>재미 : "+selectNeta.funSize+"</span>"))
	// 		selectNeta = null
	// 		$("#netaDiv").html("")

	// 		// console.log(calcCM())
	// 	}
	// }).css("cursor", "auto")

	$(".Neta").click(function(e) {
		if(slotMode && blenderIndex < 5) {
			var _selectNeta = new MakeNeta($(this).text())
			var thisBox = $(".MakeRow:eq("+blenderIndex+")")

			iNetas.push([$(thisBox).index()+1, 0, _selectNeta])

			totalMass += _selectNeta.funSize
			$(thisBox).append($("<span>"+_selectNeta.type+"</span></br><span>재미 : "+_selectNeta.funSize+"</span>"))

			blenderIndex += 1
		}
	})


	var slot = function() {
		if(!slotMode) {
			$("#MakeDivBlender").css("visibility", "visible")
			$("#MakeDivInfo").css("visibility", "hidden")
			// $("#gameDiv").css("visibility", "hidden")
			concentRate -= 10
			refresh()

			slotMode = true
		}
	}

	$(".dropdown-menu>li").click(function() {
		var thisLi = $(this)
		var type = thisLi.parent().parent().attr("id"), index = thisLi.index()
		if(type == "TypeDiv") {
			jokeType = thisLi.text()
			$("#TypeDiv>button").text(jokeType)
		} else {
			jokeObject = thisLi.text()
			$("#ObjectDiv>button").text(jokeObject)
		}

		if(jokeObject != null && jokeType != null) {
			slot()
			$("#ObjectDiv").css("visibility", "hidden")
			$("#TypeDiv").css("visibility", "hidden")

			$("#DELETE").css("visibility", "visible")
			$("#SELL").css("visibility", "visible")	
		}
	})

	$("#SELL").click(function() {
		if(slotMode && 1 < blenderIndex) {
			$("#MakeDivBlender").css("visibility", "hidden")
			$("#MakeDivInfo").css("visibility", "visible")
			$("#SELL").text("발표!")
			console.log("lenderIndex",blenderIndex)

			if(0 < concentRate) {
				
				$("#MakeDivInfo").html("")
				$("#jokeDiv").html("")
				
				randomCategory = []
				categoryNum = 0
				blenderIndex = 0

				// console.log("category", categoryNum)
				divString = ""
				joke = new Joke(iNetas);

				for(var i in iNetas) {
					console.log(iNetas[i])
					// divString += "<div class=\"col-md-3\">"+iNetas[i][2].type+"</div>"
					divString += iNetas[i][2].type+"\t\t"
				}

				if(divString != "") {
					$("#ResultDiv")
						.css("visibility", "visible")
						.css("display","inline")
						// .left

					$("#JokeName").text(joke.name)
					$("#JokeTier").text(joke.tier)
					$("#JokeRecipe").text(divString)
					$("#JokeInfo").text(joke.info)
					$("#JokeReactionDiv").text(joke.targetAge)

					// divString += "<div>퀄리티 : "+joke.quality+"</div><div>수준 연령대 : "+joke.targetAge+"</div><div>"+joke.info+"</div>"
					// $("#MakeDivInfo").append($(divString))

					// $("#jokeDiv").append($(
					// "<div class=\"col-md-3\">분야1 : "+joke.categoryType[0]+"</div>"+
					// "<div class=\"col-md-3\">분야2 : "+joke.categoryType[1]+"</div>"+
					// "<div class=\"col-md-3\">분야3 : "+joke.categoryType[2]+"</div>"+
					// "<div class=\"col-md-3\">분야4 : "+joke.categoryType[3]+"</div>"+
					// "<div class=\"col-md-3\">분야5 : "+joke.categoryType[4]+"</div>"))
				}
				refresh()
				reset()
			}
		} else {
			joke = new Joke(iNetas);

			console.log(joke.quality, joke.jc, joke.CategoryType, joke)

			if(joke != null){
				concentRate += joke.quality
				money += joke.quality * 1000

				refresh()
				reset()
				jokeObject = null, jokeType = null

				$("#ResultDiv")
					.css("visibility", "hidden")
					.css("display","none")

				$("#MakeDivInfo").css("visibility","hidden")

				$("#ObjectDiv").css("visibility", "visible")
				$("#TypeDiv").css("visibility", "visible")

				$("#DELETE").css("visibility", "hidden")
				$("#SELL").css("visibility", "hidden")
			}
		}
	})

	$("#DELETE").click(function() {
		jokeObject = null, jokeType = null

		refresh()
		reset()

		$("#MakeDivBlender").css("visibility", "hidden")
		$("#MakeDivInfo").css("visibility","hidden")

		$("#ObjectDiv").css("visibility", "visible")
		$("#TypeDiv").css("visibility", "visible")

		$("#DELETE").css("visibility", "hidden")
		$("#SELL").css("visibility", "hidden")
	})
}


$(document).ready(init)
