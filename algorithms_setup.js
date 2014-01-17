toBeSorted = [];



$(document).ready(function(){
	
	
	var spinner = $("#numberbox").spinner({min:-1,max:101,step:1,spin: function(e,ui){
	if(ui.value > 100){
		$(this).spinner("value",0);
		return false;
	}
	else if(ui.value < 0){
		$(this).spinner("value",100);
		return false;
	}
	}});
	
	$("#getvalue").click(function(e){
		var n;
		if(validateInputAsInterger(n = $("#elemInput").val())){
			console.log("valid: n =" + n);
			generateRandomizedList(n);
			toBeSorted.forEach(function(element,index,array){
				console.log(index+ " = " + element);
			});
		}
		else{
			console.log("invalid");
			$("#elemInput").val("")
		}
	});
	
	$("#start").click(function(e){
		nextLine(1,2);
	});
	
//	$("#numberbox").spin(function(e,ui){
//	if(ui.value > 100){
//		$(this).spinner("value",0);
//		return false;
//	}
//	else if(ui.value < 0){
//		$(this).spinner("value",100);
//		return false;
//	}
//	});


});

function getRandomInt(max,min){
	return Math.floor(Math.random() * (max -min + 1) + min);
}

function generateRandomizedList(num){
	for(i = 0;i< num;i++){
		toBeSorted[i] = getRandomInt(num,0);
	}
}

function validateInputAsInterger(input){
	var numRegex = /^\d+$/;
	return numRegex.test(input);
}

function nextLine(lineCurrent,lineNext){
	$("#line"+lineCurrent).removeClass("selectedLine");
	$("#line"+lineNext).addClass("selectedLine");
}

