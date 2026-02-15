$(function() {
    boss.setup()
});

var boss ={
	edis:[],
	
	addEdi:function(edi,type,tabM,obj){
		var o = {edi:edi,type:type,tabM:tabM,obj:obj}
		this.edis.push(o)
		console.log(this.edis)
		return o
	},
	
	clearEdis:function(){
		var arr = this.edis
		console.log(arr)
		for(var x=0; x < arr.length; x++){
			arr[x].edi.load("")
		}
	},
	
	getEdis:function(){
		return this.edis
	},
	
	findEdi:function(type){
		var arr = this.edis
		for(var x=0; x < arr.length; x++){
			if(arr[x].type === type) return arr[x]
		}
	},
	
	setup:function(){
		this.setupButtons()
		this.setupPreviewB()
		this.setupTabs()
		this.setupMainTabs()
		this.setupJsTabs()
		this.setupMenuB() 
		this.setupLeftM()
		this.setupDbBoss()
		this.setupSrcChecker() 
	},
	
	setTopD:function(d){
		if(this.topD){
			this.topD.addClass("zI1")
			this.topD.removeClass("topD")
		}
		this.topD = d
		d.addClass("topD")
	},
	
}

