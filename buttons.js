boss.setupButtons = function(){
	
	var bBoss ={
		create:function(d,title,cl){
			if(!cl) cl=""
			d.append("<div class='"+cl+" nu shadowHover cursor bor pad0p2em bgF2 wFit borColD9 br0p2em padR0p4em padL0p4em'>"+title+"</div>")
			return d.find(".nu").removeClass("nu")
		},
	}
	
	
	this.bBoss = bBoss
}

