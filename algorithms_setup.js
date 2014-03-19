function Frame(pScope)
{
	this.scope = pScope|| {};
	this.callStack = [];
	this.nextFunction = {};

	this.popStack = function(){
	
		//this.negCallStack.push($.extend({},this.scope));
		if(this.callStack.length == 0){
			this.scope = {};
		}
		else{
			this.scope = this.callStack.pop(); 
		}
	
	};

}

	$(document).ready(function(){

		var maxallowedsize = 100;
		var maxallowedelements = 185;
		var spinnerinitialvalue = 0;
		var controller = {};
		$("#start").attr("disabled","disabled");
		$("#autostepfast").attr("disabled","disabled");
		$("#autostepslow").attr("disabled","disabled");
		$("#autostepnormal").attr("disabled","disabled");
		$("#pause").attr("disabled","disabled");

		controller = sortController();

		
		
	
		var spinner = $("#numberbox").spinner({min: -1,max:maxallowedelements +1, step:1,spin: function(e,ui){
		if(ui.value > maxallowedelements){
			$(this).spinner("value",spinnerinitialvalue);
			return false;
		}
		else if(ui.value < spinnerinitialvalue){
			$(this).spinner("value",maxallowedelements);
			return false;
		}
		}});
	
		$("#getvalue").click(function(e){
			controller.getValueAction();
		});
	
		$("#start").click(function(e){
			controller.stepAction();
		});
	
		$("#autostepslow").click(function(e){
			
			controller.autoSort(5000);
		});
	
		$("#autostepnormal").click(function(e){
			
			controller.autoSort(500);
		});
	
		$("#autostepfast").click(function(e){
			controller.autoSort(50);
		});
	
		$("#pause").click(function(e){
			controller.pauseAction();
		});
		
		$("#shellsort").click(function(e){
			controller.funcLoader("shell_sort");	
		});


	});


	

	

