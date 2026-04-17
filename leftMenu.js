boss.setupLeftM = function(d){
	var d = $(".leftM")
	var s = "1.8em"
	var leftM = {
		setup:function(){
			boss.setupMainSrh(this.addD(d,icons.getSrh(s),"Search"))
			boss.setupSave(this.addD(d,icons.getSave(s),"Save"))
			boss.setupUpload(this.addD(d,icons.getUpload(s),"Upload"))
			boss.setupConsole(this.addD(d,icons.getConsole(s),"Console"))
			boss.setupAutoLoad(this.addD(d,icons.getReload(s),"Autoload code"))
			boss.setupDel(this.addD(d,icons.getTrash(s),"Delete"))
			boss.setupExportFiles(this.addD(d,icons.getExportFile(s),"Export Files"))
		},
		addD:function(d,icon,title){
			d.append("<div class='h3em w3em flexMe cursor hlIcon nu' title='"+title+"'>"
				+icon
			+"</div>")
			return d.find(".nu").removeClass("nu")
		},
		
		setupResetDs:function(icon){
			icon.on('click',function(){
				resetMenu.resetAll()
			})
		}
		
		
		
		
	}
	leftM.setup()
	boss.leftMBoss = leftM
}

//move

boss.setupExportFiles = function(d){
	d.on('click',function(){
		getCode()
	})

	getCode = async function(){
		console.log('get funky export!')
		var o = await boss.dbBoss.getCode()
		console.log(o)
		var arr = o.tabs
		var txt=''
		for(var x =0; x < arr.length; x++){
			txt +=makeTxt(arr[x])
		}
		console.log(txt)
		sendToClipboard(txt)
	}

	makeTxt = function(o){
		return +'\n'
			+'//'+o.name+'.'+o.type
			+'\n'
		+o.data
		+'\n'
	}

	sendToClipboard = asyn function(text){
		try {
		    await navigator.clipboard.writeText(text);
		    console.log('Text successfully copied to clipboard');
		  } catch (err) {
		    console.error('Failed to copy: ', err);
		}
	}

	
}
