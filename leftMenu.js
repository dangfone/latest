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