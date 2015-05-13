
function algorithmBuilder(context){
  //I think the reason I used the constructor pattern rather than the Object.create pattern is because 
  //of personal educational reason.
  
  //I'm thinking of definind a variable named welcomePackage and returnPackage which one will have the args,
  //and the other will have the return value, name of method that is being returned from
	var builder = {};
	var lineNumber = 0;
	var execOrder = 0;
	var indentionLevel = 0;
	var indentionConst = 5;
  
  builder.MethodLookUp = {};
	
	function StackBuilder(){
		var stackLimit = 1000;
		var _stack = [];
    var _currentFrame = new FrameBuilder();
    var _mostRecentReturnVal;

    Object.defineProperties(this,
      {"currentFrame":{
        set: function(theValue){
          if(theValue instanceof FrameBuilder){
            _currentFrame = theValue;
          }
          else{
              var errorMsg = "Tried to assign invalid object to currentFrame. That is not an instance of Framebuilder!\n" + "invalid object:\n"+theValue+"\n";
              var err = new Error(errorMsg);
              throw err;       
          }
        },
        get: function(){return _currentFrame;}
      }},
      {"nextExecution":{
        set:function(theValue){
        this.currentFrame.nextExecution = theValue;
        },
        get:function(){return this.curentFrame.nextExecution;}
      },
       "returnAddress":{
         set:function(theValue){
            this.currentFrame.returnAddress = theValue;
          },
         get:function(){return this.curentFrame.returnAddress;}
       },
       "resultValue":{
         set: function(theValue){_mostRecentReturnVal = theValue;},
         get: function(){return _mostRecentReturnVal;}
       }
      }
     );
    
    
		this.PopStack = function(){
			if(this.IsEmpty()){
              var errorMsg = "Underflow exception!\n";
              var err = new Error(errorMsg);
              throw err;  
            }
            else{
              return _stack.pop(); 
            }
		};
		this.PushStack = function(frameNew){
        if(!(frameNew instanceof FrameBuilder)){
          var errorMsg = "Tried to add an object to stack that is not an instance of Framebuilder!\n";
          errorMsg += "invalid object:\n" + frameNew;
          var err = new Error(errorMsg);
          throw err;   
        }
      
        if(_stack.length+1 > stackLimit){
            var overflowErrorMsg = "overflow exception!\n";
            overflowErrorMsg += "invalid object:\n" + frameNew;
            var overflowErr = new Error(overflowErrorMsg);
            throw overflowErr;  
        }
			  _stack.push(frameNew);
		};
      
    this.IsEmpty = function(){
      return _stack.length === 0;
    };
    
    
	}
  
  StackBuilder.prototype.addLocalVariables = function(freshVariables){
    this.currentFrame.addLocalVariables(freshVariables);
  };
  
  StackBuilder.prototype.getInScopeVariables = function(){
    return this.currentFrame.getLocals();
  };

  
  function FrameBuilder(returnAddress,methodName,args){

    var _locals = {};
    var _nextExecution  = new builder.Terminal().terminalExe;
    var _returnAddress =  new builder.Terminal().terminalExe;
    if(typeof methodName === "string"){
      this.name = methodName;
    }

    this.addLocalVariables(args);
    
    Object.defineProperties(this,{
      "nextExecution":{
        set: function(theValue){
           if(typeof theValue === "function"){
             _nextExecution = theValue;
           }
           else{
             var errorMsg = "Tried to assign a non-function to nextExecution!\n";
             errorMsg += "invalid object:\n" + theValue;
             var err = new Error(errorMsg);
             throw err;   
           }
         },
        get: function(){return _nextExecution;}
      },"returnAddress":{
        set: function(theValue){
           if(typeof theValue === "function"){
             _returnAddress = theValue;
           }
           else{
             var errorMsg = "Tried to assign a non-function to returnAddress!\n";
             errorMsg += "invalid object:\n" + theValue;
             var err = new Error(errorMsg);
             throw err;  
           }      
          },
        get: function(){return _returnAddress;}
      }
      
    }
    );
    
    if(returnAddress){
          this.returnAddress = returnAddress;
    }
    else{
          this.returnAddress = new builder.Terminal().terminalExe;
    }
    
    this.getLocals = function(){
      return _locals;
    };
     
  }
  
  
  FrameBuilder.prototype.addLocalVariables = function(freshVariables){
      if(freshVariables){
        var ownPropKeyList = Object.getOwnPropertyNames(freshVariables);
        for(var prop in ownPropKeyList){
          var key = ownPropKeyList[prop];
           //I only want to deal with numbers and arrays because everything else is beyond scope
          var item = freshVariables[key];
          if((item instanceof Array)|| typeof item === "number"){
              this.getLocals()[key] = item;
           }
           else{
            var errorMsg = "Numbers and arrays only!\n";
            var err = new Error(errorMsg);
            throw err; 
           }
        }
      }
  };
  

var MathOperation = {
    init: function(inputA,inputB){
      var self = Object.create(this);
      self.storedInputB = inputB;
      self.storedInputA = inputA;
      
      self.codeLine = self.formatCodeLine(self.storedInputA) +" " + self.operator +" "+ self.formatCodeLine(self.storedInputB);
      return self;
    },
    validateNumber: function(op,variableSet){
      //theoretically this should work recusively
      if(MathOperation.isPrototypeOf(op)){
         return op.operation(variableSet);
      }
      if(variableSet){
        
        if(typeof variableSet[op] === "number" ){
        return variableSet[op];  
        }
      }
      if(typeof op === "number"){
        return op;
      }
      var errorMsg = "You tried to do a math operation with something that is not a number!";
      var err = new Error(errorMsg);
      throw err;
    },
  formatCodeLine: function(input){
    if(MathOperation.isPrototypeOf(input)){
      return "("+ input.codeLine + ")" ;
    }
    else{
      return input ;
    }
  }
  };

  

  builder.addition = Object.create(MathOperation);
  builder.addition.operator = "+";
  builder.addition.operation = function(variableSet){
    var opA = MathOperation.validateNumber(this.storedInputA,variableSet);
    var opB = MathOperation.validateNumber(this.storedInputB,variableSet);
    return opA + opB;
  };
  
  builder.subtraction = Object.create(MathOperation);
  builder.subtraction.operator = "-";
  builder.subtraction.operation = function(variableSet){
    var opA = MathOperation.validateNumber(this.storedInputA,variableSet);
    var opB = MathOperation.validateNumber(this.storedInputB,variableSet);
    return opA - opB;
  };
  
  builder.multiplication = Object.create(MathOperation);
  builder.multiplication.operator = "*";
  builder.multiplication.operation = function(variableSet){
    var opA = MathOperation.validateNumber(this.storedInputA,variableSet);
    var opB = MathOperation.validateNumber(this.storedInputB,variableSet);
    return opA * opB;
  };
  
  builder.division = Object.create(MathOperation);
  builder.division.operator = "/";
  builder.division.operation = function(variableSet){
    var opA = MathOperation.validateNumber(this.storedInputA,variableSet);
    var opB = MathOperation.validateNumber(this.storedInputB,variableSet);
    return opA / opB;
  };  
  
  builder.mod = Object.create(MathOperation);
  builder.mod.operator = "%";
  builder.mod.operation = function(variableSet){
    var opA = MathOperation.validateNumber(this.storedInputA,variableSet);
    var opB = MathOperation.validateNumber(this.storedInputB,variableSet);
    return opA / opB;
  };  
  
	function GenericStatement(){
    
    var _linkedFunction = new builder.Terminal().terminalExe;
    
    Object.defineProperty(this,"linkedFunction",
         {set: function(theValue){
           if(typeof theValue === "function"){
             _linkedFunction = theValue;
           }
           else{
             var errorMsg = "Tried to assign a non-function to linkedFunction!\n";
             errorMsg += "invalid object:\n" + theValue;
             var err = new Error(errorMsg);
             throw err; 
           }
         },
          get: function(){return _linkedFunction;}
    });

	}
  

  function ObjectInputValidator(input,compareTo){
    
    if(!(compareTo.isPrototypeOf(input))){
        var errorMsg = "Tried to pass the wrong kind of object! Don't do that!\n";
        //errorMsg += "invalid object:\n" + input;
        var err = new Error(errorMsg);
        throw err; 
      }
  }
  
  function throwException(message){
    var err = new Error(message);
    throw err;
  }
  
  
  builder.Terminal = function(){
        var self = this;
        //console.log("End of program");
        self.terminalExe = function(theStack){
          theStack = undefined;
          console.log("It's Over!");
          return theStack;
        };
	};builder.Terminal.prototype = Object.create(GenericStatement.prototype);
  
	
	builder.BeforeEverything = function(){
        var self = this;
        GenericStatement.call(self);
        console.log("begin: ");
        self.beforeEverythingExe = function(){
          var theStack = new StackBuilder();
          console.log("begin: ");
          theStack.nextExecution = self.linkedFunction;
          return theStack;
		    };
	};builder.BeforeEverything.prototype = Object.create(GenericStatement.prototype);
	
  
	builder.MethodDef = function(methodName,paramList){
        if(typeof methodName !== "string"){
          var errorMsg = "Method name needs to be a string!\n";
                 //errorMsg += "invalid object:\n" + theValue;
                 var err = new Error(errorMsg);
                 throw err; 
        }
        var self = this;
        GenericStatement.call(self);
        console.log(methodName);
        self.Name = methodName;
        
        self.methodDefExe = function(theStack,methodArgs){
          ObjectInputValidator(theStack,StackBuilder.prototype);
          if(paramList && methodArgs){
            var objLength = Object.keys(methodArgs).length;
            
            if(paramList.length !== objLength){
              throwException("parameters does not match arguements!");
            }
            else{
              
            }
          }
          else if((paramList&&!methodArgs)||(!paramList&&methodArgs)){
            throwException("parameters does not match arguements!");
          }
          else{
            
          }
          console.log("method call: "+methodName);          
          theStack.PushStack(theStack.currentFrame);
          theStack.currentFrame = new FrameBuilder();
          if(methodArgs){
            theStack.addLocalVariables(methodArgs);
          }
          console.log("locals: "+ JSON.stringify(theStack.getInScopeVariables()));
          
          theStack.nextExecution = self.linkedFunction;
          return theStack;
        };

        builder.MethodLookUp[methodName] = self;
	};builder.MethodDef.prototype = Object.create(GenericStatement.prototype);
	
  
	builder.BlankSpace = function(prev){
        var self = this;
        GenericStatement.call(self);
        ObjectInputValidator(prev,GenericStatement.prototype);
        console.log("\n");
        self.blankSpaceExe = function(theStack){
          ObjectInputValidator(theStack,StackBuilder.prototype);      
          theStack.nextExecution = self.linkedFunction;
          console.log("blank locals: "+ JSON.stringify(theStack.getInScopeVariables()));
          return theStack;
        };
        prev.linkedFunction = self.blankSpaceExe;
	};builder.BlankSpace.prototype = Object.create(GenericStatement.prototype);
	
  //TODO- figure out how to handle return value
  builder.ReturnFrom = function(prev,returnVarName){
        ObjectInputValidator(prev,GenericStatement.prototype);
        var self = this;
        GenericStatement.call(self);
        console.log("returnVarName");
        self.returnFromExe = function(theStack){
          ObjectInputValidator(theStack,StackBuilder.prototype);  
          console.log("returning from somewhere? ");
          if(returnVarName){
            theStack.resultValue = theStack.GetInScopeVariables()[returnVarName];
          }
          else{
            theStack.resultValue = undefined;
          }
          theStack.currentFrame = theStack.PopStack();
          theStack.nextExecution = theStack.returnAddress;
          return theStack;
        };
        prev.linkedFunction = self.returnFromExe;
  }; builder.ReturnFrom.prototype = Object.create(GenericStatement.prototype);
  
	
  builder.MethodCall = function(prev,methodName,methodArgs){
        ObjectInputValidator(prev,GenericStatement.prototype);
        var self = this;
        GenericStatement.call(self);
        self.codeLine = methodName +JSON.stringify(methodArgs);
        console.log(self.codeLine);
        self.methodCallExe = function(theStack){
          ObjectInputValidator(theStack,StackBuilder.prototype);    
          var methodToCall = builder.MethodLookUp[methodName];
          theStack = methodToCall.methodDefExe(theStack,methodArgs);
          
          
          theStack.nextExecution = methodToCall.linkedFunction;
          theStack.returnAddress = self.linkedFunction;
          return theStack;
        };
        prev.linkedFunction = self.methodCallExe;
  };builder.MethodCall.prototype = Object.create(GenericStatement.prototype);
  
  
  builder.Branch = function(prev,condition){
        var self = this;
        GenericStatement.call(self);
        ObjectInputValidator(prev,GenericStatement.prototype);
        if(typeof condition !== "function"){
           var errorMsg = "condition needs to be a function!\n";
           errorMsg += "invalid object:\n" + condition;
           var err = new Error(errorMsg);
           throw err;   
        }
        console.log("if condition\nthen");
        self.branchExe = function(theStack){
          ObjectInputValidator(theStack,StackBuilder.prototype);
          console.log("branch");
          if(condition()){
            theStack.nextExecution = self.linkedFunction;
          }
          else{
            theStack.nextExecution = self.elseLinkedFunction;
          }
          return theStack;
        };
        self.elseLinkedFunction = new builder.Terminal().terminalExe;
        self.branchConvergenceFunction = self.elseLinkedFunction;
        prev.linkedFunction = self.branchExe;
  };builder.Branch.prototype = Object.create(GenericStatement.prototype);
  
  
  builder.BranchEnd = function(prev,prevIf){
        ObjectInputValidator(prev,GenericStatement.prototype);
        ObjectInputValidator(prevIf,builder.Branch.prototype);
        var self = this;
        GenericStatement.call(self);
        console.log("branch end");
        self.branchEndExe = function(theStack){
          ObjectInputValidator(theStack,StackBuilder.prototype);
          console.log("end branch");
          theStack.nextExecution = prevIf.branchConvergenceFunction;
          return theStack;
        };
        prev.linkedFunction = self.branchEndExe;
  };builder.BranchEnd.prototype = Object.create(GenericStatement.prototype);
  
  
  builder.AfterBranch = function(prevBranch){
        var self = this;
        GenericStatement.call(self);
        if(!(prevBranch instanceof builder.Branch||prevBranch instanceof builder.LoopStart)){
          var errorMsg = "Tried to pass the wrong kind of object! Don't do that!\n";
          //errorMsg += "invalid object:\n" + input;
          var err = new Error(errorMsg);
          throw err; 
        }
        self.afterBranchExe = function(theStack){
          ObjectInputValidator(theStack,StackBuilder.prototype);
          console.log("after branch");
          theStack.nextExecution = self.linkedFunction;
          return theStack;
        };
        prevBranch.branchConvergenceFunction = self.afterBranchExe;
  };builder.AfterBranch.prototype = Object.create(GenericStatement.prototype);
  
  
  builder.ElseBranch = function(prevIf){
        ObjectInputValidator(prevIf,builder.Branch.prototype);
        var self = this;
        GenericStatement.call(self);
        console.log("else");
        self.elseBranchExe = function(theStack){
          ObjectInputValidator(theStack,StackBuilder.prototype);
          console.log("else");
          theStack.nextExecution = self.linkedFunction;
          return theStack;
        };
        prevIf.elseLinkedFunction = self.elseBranchExe;
	};builder.ElseBranch.prototype = Object.create(GenericStatement.prototype);
  
  
  builder.LoopStart = function(prev,condition){
        ObjectInputValidator(prev,GenericStatement.prototype);
        if(typeof condition !== "function"){
           var errorMsg = "condition needs to be a function!\n";
           errorMsg += "invalid object:\n" + condition;
           var err = new Error(errorMsg);
           throw err;   
        }    
        var self = this;
        GenericStatement.call(self);
        console.log("loop untill");
        self.loopStartExe = function(theStack){
          ObjectInputValidator(theStack,StackBuilder.prototype);
          console.log("loop start");
          if(condition()){
            theStack.nextExecution = self.linkedFunction;
          }
          else{
            theStack.nextExecution = self.branchConvergenceFunction;
          }
          return theStack;
        };
        prev.linkedFunction = self.loopStartExe;
  };builder.LoopStart.prototype = Object.create(GenericStatement.prototype);
  
  
  builder.LoopRepeater = function(prev,prevLoop){
        ObjectInputValidator(prev,GenericStatement.prototype);
        ObjectInputValidator(prevLoop,builder.LoopStart.prototype);
        var self = this;
        GenericStatement.call(self);
        console.log("end loop");
        self.loopRepeaterExe = function(theStack){
          ObjectInputValidator(theStack,StackBuilder.prototype);
          console.log("Loop repeat");
          theStack.nextExecution = self.linkedFunction;
          return theStack;
        };
        self.linkedFunction = prevLoop.loopStartExe;
        prev.linkedFunction = self.loopRepeaterExe;
  };builder.LoopRepeater.prototype = Object.create(GenericStatement.prototype);
  
  
  //TODO - have a condition to test if prev is a returnFrom or MathOp;
  builder.StoreVal = function(prev,nameOfVar,valOfVar){
    ObjectInputValidator(prev,GenericStatement.prototype);
    var self = this;
    GenericStatement.call(self);
    self.storeValExe = function(theStack){
      ObjectInputValidator(theStack,StackBuilder.prototype);
      var temp;
      if(MathOperation.isPrototypeOf(valOfVar)){
        temp = theStack.resultValue;
      }
      else{
        temp = valOfVar;
      }
      var objForVar = {};
      objForVar[nameOfVar] = temp;
      theStack.addLocalVariables(objForVar);
      console.log("storing: " + nameOfVar +" = "+valOfVar);
      console.log("locals: "+ JSON.stringify(theStack.getInScopeVariables()));
      theStack.nextExecution = self.linkedFunction;
      return theStack;
    };
    prev.linkedFunction = self.storeValExe;
  };builder.StoreVal.prototype = Object.create(GenericStatement.prototype);
  
  

  //<ops> needs to be a MathOperation object
  builder.DoMathOp = function(prev,ops){
    ObjectInputValidator(prev,GenericStatement.prototype);
    ObjectInputValidator(ops,MathOperation);
    var self = this;
    GenericStatement.call(self);
    self.codeLine = ops.codeLine;

    self.doMathOpExe = function(theStack){
      ObjectInputValidator(theStack,StackBuilder.prototype);
      theStack.resultValue = ops.operation(theStack.getInScopeVariables());
      console.log("math op:"+self.codeLine);
      console.log(theStack.resultValue);
      theStack.nextExecution = self.linkedFunction;
      return theStack;
    };
    prev.linkedFunction = self.doMathOpExe;
  };builder.DoMathOp.prototype = Object.create(GenericStatement.prototype);
	
	return builder;
}

var myBuilder = algorithmBuilder();
//var execList = [];
var i = 0;
var j = 0;

var methodDef = new myBuilder.MethodDef("somethingA");
var hammerJass = new  myBuilder.BlankSpace(methodDef);
var mthO1 = myBuilder.addition.init("A",7);
var mthO2 = myBuilder.multiplication.init(mthO1,"D");
hammerJass = new myBuilder.DoMathOp(hammerJass,mthO2);
hammerJass = new myBuilder.StoreVal(hammerJass,"r",mthO2);
hammerJass = new myBuilder.BlankSpace(hammerJass);
hammerJass = new myBuilder.ReturnFrom(hammerJass);

var whojamahavit = new myBuilder.BeforeEverything();
var workIt = new myBuilder.MethodCall(whojamahavit,"somethingA",{A:4,D:5});
var iffer = new myBuilder.Branch(workIt,function(){return false;});
workIt = new myBuilder.BlankSpace(iffer);
workIt = new myBuilder.BlankSpace(workIt);
workIt = new myBuilder.BranchEnd(workIt,iffer);
workIt = new myBuilder.ElseBranch(iffer);
workIt = new myBuilder.MethodCall(workIt,"somethingA",{A: 7, D: 9});
workIt = new myBuilder.BranchEnd(workIt,iffer);
workIt = new myBuilder.AfterBranch(iffer);
var myCond = true;
var looper = new myBuilder.LoopStart(workIt,function(){return myCond;});
workIt = new myBuilder.BlankSpace(looper);
workIt = new myBuilder.BlankSpace(workIt);
workIt = new myBuilder.LoopRepeater(workIt,looper);
workIt = new myBuilder.AfterBranch(looper);


var myStack = whojamahavit.beforeEverythingExe(); //begin
myStack = myStack.nextExecution(myStack); //method call something A
//console.log(myStack);
myStack = myStack.nextExecution(myStack); //somethingsomething
myStack = myStack.nextExecution(myStack); //somethingsomething
myStack = myStack.nextExecution(myStack); //returning from somewhere

myStack = myStack.nextExecution(myStack); //branch
myStack = myStack.nextExecution(myStack); //somethingsomething/ else
myStack = myStack.nextExecution(myStack); //somethingsomthing / method call something A
myStack = myStack.nextExecution(myStack); //end branch / somethingsomething
myStack = myStack.nextExecution(myStack); //after branch / somethingsomething
myStack = myStack.nextExecution(myStack); //somethingsomething / returning from somewhere
myStack = myStack.nextExecution(myStack); //it's over / end branch
myStack = myStack.nextExecution(myStack); //  --- /after branch
myStack = myStack.nextExecution(myStack); //loop start
myStack = myStack.nextExecution(myStack); //somethingsomething
myStack = myStack.nextExecution(myStack); //somethingsomething
myStack = myStack.nextExecution(myStack); //loop repeat
myStack = myStack.nextExecution(myStack); //loop start
myStack = myStack.nextExecution(myStack); 
myStack = myStack.nextExecution(myStack); 
myStack = myStack.nextExecution(myStack); 
myStack = myStack.nextExecution(myStack); 
myCond = false;
myStack = myStack.nextExecution(myStack); 
myStack = myStack.nextExecution(myStack); 
myStack = myStack.nextExecution(myStack); 
myStack = myStack.nextExecution(myStack); 
myStack = myStack.nextExecution(myStack); 
myStack = myStack.nextExecution(myStack); 
