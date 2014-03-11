function ShellSort(context)
{
	var formatStr = JSON.stringify;
	var sorter = {};
	sorter.sourceCode = [
		["shellsort(v[],int n)","0"],
		["{","0"],
		["int gap, i, j,temp;","5em"],
		["for(gap = n/2;gap>0;gap /=2","5em"],
		["for(i = gap;i<n;i++)","10em"],
		["for(j=i-gap;j>=0 && v[j]>v[j+gap];j -=gap){","15em"],
		["temp = v[j];","20em"],
		["v[j] = v[j+gap];","20em"],
		["v[j+gap] = temp","20em"],
		["}","15em"],
		["}","0"]
	];
	
	sorter.LoadCode = function(toBeSorted)
	{
		qSortScope = {v:toBeSorted,returnAddressFunction: sorter.terminalCall,left: 0, right: toBeSorted.length -1}
		var myFrame = new Frame(qSortScope);
	
		//myFrame.nextFunction = 
	
		return myFrame;
	};
	
	sorter.terminalCall = function(qSortFrame)
	{
		qSortFrame.scope = undefined;
		context.pageCleanUp();
	};
	
	return sorter;
}
