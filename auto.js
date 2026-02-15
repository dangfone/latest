boss.setupAutoLoad = function(icon){
	var d = $(".hMenuD");
	var autoB = {on:true,
		setup:function(){
			d.append("<div class='reloadC nu h3em flex alignMe'>"
				+"<div class='reload bor borCol31 pad0p4em hlIcon borRad0p3em colWhite cursor'>Reload</div>"
			+"</div>")
			d = d.find(".nu").removeClass("nu")
			helper.setPosToP(d, icon, 0, "3em");
			this.d = d
			helper.setupTogShowHide(icon, autoB).hide()
			
			d.find('.reload').on('click',function(){
				autoB.runCode()
			})
			
			
		},
		
		show:function(){
			this.on = false
			this.d.removeClass("none")
			icon.removeClass("togBlu")
		},
		
		hide:function(){
			this.on = true
			this.d.addClass("none")
			icon.addClass("togBlu")
		},
		
		isOn:function(){
			return this.on
		},
		
		runCode:function(){
			this.on = true
			boss.iframeB.runCode() 
			this.on = false
		},
		
		addScriptTags:function(){
			var htmlEdi = boss.getEdi("html")
			var i = htmlEdi.getValue().indexOf("</head>")
			console.log(i)
		},
		
		checkScriptTags:function(){
			
		},
		
		getScriptTagOrder:function(){
			
		}
		
		
	}
	autoB.setup()
	this.autoB = autoB
}

boss.getEdi = function(type){
	console.log("get Edi!")
	var arr = this.edis
	for(var x =0; x <arr.length; x++){
		if(arr[x].type === type){
			return arr[x]
		}
	}
}