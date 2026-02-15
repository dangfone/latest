boss.mainCListenerSetup = function(){
	var mainCListen ={d:$(".mainCont"),data:[],
		setup:function(){
			this.d.on('mousedown',function(){
				console.log("mainC clicky")
				mainCListen.checkStuff()
			})
		},
		checkStuff:function(){
			var arr = this.data
			for(var x =0; x < arr.length; x++){
				arr[x].mainCheck()
			}
		},
		
		add:function(obj){
			this.data.push(obj)
		},
		
		rm:function(obj){
			boss.helper.removeObjFromArr(obj,this.data)
		}
	}
	mainCListen.setup()
	this.mainCListen = mainCListen
}