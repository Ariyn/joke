var jokeCategory = ["소재1", "소재2", "소재3", "소재4", "소재5", "소재6", "소재7", "소재8"]
var iNetas = [], totalMass = 0
var selectNeta = null

var categorys = [0, 0, 0, 0, 0]
var concentRate = 100, money = 10000;
var infos = [
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
	this.category = jc
	this.quality = Math.floor(Math.random()*100%100)
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
}

function refresh() {
	$("#concentRate").text("집중력 : "+concentRate)
}

function init() {

	$(".MakeRow").click(function(e) {
		// console.log($(this).index()+1, $(this).parent().index()+1);
		if(selectNeta) {
			iNetas.push([$(this).index()+1, $(this).parent().index()+1, selectNeta])
			totalMass += selectNeta.funSize
			$(this).append($("<span>"+selectNeta.type+"</span></br><span>재미 : "+selectNeta.funSize+"</span>"))
			selectNeta = null
			$("#netaDiv").html("")

			// console.log(calcCM())
		}
	}).css("cursor", "auto")

	$(".Neta").click(function(e) {
		if(slotMode) {
			if(!selectNeta) {
				selectNeta = MakeNeta($(this).text())
				$("#netaDiv").append($("<span>"+selectNeta.type+"</span></br><span>재미 : "+selectNeta.funSize+"</span>"))
				// console.log(selectNeta)

				$(".MakeRow").css("cursor", "pointer")
			} else {

			}
		}
	})

	$("#SLOT").click(function(e) {
		if(!slotMode) {
			$("#MakeDiv").css("visibility", "visible")
			$("#gameDiv").css("visibility", "hidden")
			concentRate -= 10
			refresh()

			slotMode = true
		}
	})

	$("#SELL").click(function() {
		joke = new Joke(function() {
			var x = []
			for(var i in iNeta)
				x.push(i[2])

			return x
		});

		console.log(joke.quality, joke.jc, joke.CategoryType, joke)

		if(joke != null){
			concentRate += joke.quality
			money += joke.quality * 1000

			refresh()
			reset()
		}
	})

	$("#DELETE").click(function() {
		if(joke != null){
			console.log(joke.quality)


		}
	})
}


$(document).ready(init)

// $(".Neta").click(function(e) {
// 	var context = $($(this).children()[1]);
// 	var index = jokeCategory.indexOf($($(this).children()[0]).text())
// 	console.log(context)
// 	// console.log(index)

// 	if(selectCategory[index])
// 		selectCategory[index] += 1
// 	else
// 		selectCategory[index] = 1

// 	context.text(context.text()+"*")
// 	console.log(selectCategory)
// })
// $("#SLOT").click(function(e) {
// 		// console.log($(e.target).text())
// 		if(0 < conrentrate) {
// 			$("#slotmachine").html("")
// 			$("#jokeDiv").html("")

// 			randomCategory = []
// 			categoryNum = 0
// 			for(var i in selectCategory) {
// 				categoryNum += 1
// 				randomCategory.push(i)
// 			}
// 			// console.log("category", categoryNum)

// 			divString = "", joke = MakeJoke(jokeCategory)
// 			for(var i in selectCategory) {
// 				// console.log("i", i, selectCategory[i])
// 				r = Math.floor(Math.random()*10+selectCategory[i])%categoryNum

// 				// console.log("r", r, jokeCategory[r])
// 				divString += "<div class=\"col-md-3\">"+jokeCategory[randomCategory[r]]+"</div>"
// 			}
			
// 			// r1 = Math.floor(Math.random()*10)%3
// 			// r2 = Math.floor(Math.random()*10)%3
// 			// r3 = Math.floor(Math.random()*10)%3

// 			// joke = MakeJoke(jokeCategory)

// 			// divString = "<div class=\"col-md-3\">"+jokeCategory[r1]+"</div>" + "<div class=\"col-md-3\">"+jokeCategory[r2]+"</div>" + "<div class=\"col-md-3\">"+jokeCategory[r3]+"</div>"+"<div>퀄리티 : "+joke.quality+"</div><div>"+joke.info+"</div>"
// 			if(divString != "") {
// 				divString += "<div>퀄리티 : "+joke.quality+"</div><div>수준 연령대 : "+joke.targetAge+"</div><div>"+joke.info+"</div>"
// 				$("#slotmachine").append($(divString))

// 				conrentrate -= 10;
// 				$("#concentRate>#concVal").text(conrentrate)

// 				$("#jokeDiv").append($(
// 					"<div class=\"col-md-3\">분야1 : "+joke.categoryType[0]+"</div>"+
// 					"<div class=\"col-md-3\">분야2 : "+joke.categoryType[1]+"</div>"+
// 					"<div class=\"col-md-3\">분야3 : "+joke.categoryType[2]+"</div>"+
// 					"<div class=\"col-md-3\">분야4 : "+joke.categoryType[3]+"</div>"+
// 					"<div class=\"col-md-3\">분야5 : "+joke.categoryType[4]+"</div>"))
// 			}
// 		}
// 	})
