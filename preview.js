boss.setupPreviewB = function(){
	var pBoss = {
		create: async function(d,o){
			console.log(o)
			var txt = ''
			var chkBoxD = "<div class=''><input class='chkbox' type='checkbox'></div>"
			txt += this.getProjects(o.projects,chkBoxD)
			
			txt += this.getTabs(o.tabs,chkBoxD)
			d.append(txt)
			
			const tabs = d.find(".nuT").removeClass("nuT")
			const pros = d.find(".nuP").removeClass("nuP")
			return {pros:pros,tabs:tabs,o:o}
		},
		
		clear:function(){
			
		},
		
		getTabs: function(arr,before,after){
			var txt =''
			
			for(var x = 0; x < arr.length; x++){
				txt += this.getTxt(arr[x],icons.getCode("1em",arr[x].type),before,"","nuT")
			}
			return txt
		},
		
		getProjects: function(arr,before,after){
			var txt =''
			
			for(var x = 0; x < arr.length; x++){
				txt += this.getTxt(arr[x],icons.getProject("1em"),before,"","nuP")
			}
			return txt
		},
		
		getTxt: function(o,icon,before,after,cl){
			if(!before) before = ""
			if(!after) after =""
			if(!cl) cl =""
			return "<div class='flex alignMe cursor hlBlue pad0p2em "+cl+" '>"
				+"<div class='before'>"+before+"</div>"
				+"<div class='flex alignMe'>"
					+"<div class='flexMe'>"+icon+"</div>"
					+"<div class='name'>"+o.name+"</div>"
				+"</div>"
				+"<div class='after'>"+after+"</div>"
			+"</div>"
		},
		
		createPopup:function(){
			
		}
		
	}
	this.previewB = pBoss
}