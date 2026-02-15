boss.setupMainSrh = function(icon){
	var d = $(".hMenuD")
	
	var srh = {d:"",
	
		setup:function(){
			var d = $(".hMenuD")
			var s = "1em"
			var o = boss.menuB.createM(d,icons.getSrh(s),"Search", s)
			o.d.addClass("w24em h20em")
			this.d = o.d
			this.hide()
			helper.setupTogShowHide(icon,srh,o.exit)
			helper.setPosToP(o.d,icon,0,50)
			var s = boss.menuB.createSrhD(o.main,icons.getX(s),"Clear" ,icons.getSrh(s),"Search..")
			d = o.d
			//resetMenu.addM(d,d.width(),d.height(),{left:d.css("left"),top:d.css("top")})
			this.resD = this.setupRes(o.main)
			this.inp = s.inp
			this.setupSrhObj(s.inp)
			
		},
		
						
		show:function(){
			icon.addClass("togBlu")
			this.d.removeClass("none")
			this.inp.focus()
			boss.setTopD(this.d)
		},
		
		hide:function(){
			this.d.addClass("none")
			icon.removeClass("togBlu")
		},
		
		
		
		setupRes:function(d){
			
			d.append("<div class='flex1 flex column resC pad1em overflow'></div>")
			d = d.find(".resC")
			
			return {pro:this.createResC(d,"Projects",icons.getProject("1.4em")) ,mid:d.append("<div class='h1em'></div>"), tabs:this.createResC(d,"Files",icons.getFile("1.4em"))}
		},
		
		createResC:function(d,name,icon){
			d.append("<div class='flex column flex1 w100p colDb bor borCol31 pad0p2em overflow nu '>"
				+"<div class='flex alignMe ' >"
					+"<div class='flexMe pad0p2em'>"+icon+"</div>"
					+"<div class=' '>"+name+"</div>"
				+"</div>"
				+"<div class='flex1 c scrollY '>"
					+"<div class='res h100p w100p scrollY  '></div>"
				+"</div>"
			+"</div>")
			d = d.find(".nu").removeClass("nu")
			return {d:d,resD:d.find(".res")}
		},
		
		
		setupSrhObj:function(inp){
			
			var o ={
				srh: async function(x){
					 this.makeRes( await boss.dbBoss.srhAll(x))
									
				},
				makeRes:function(obj){
					var proD = srh.resD.pro.resD
					proD.empty()
					proD.append(this.makeTxt(obj.pro,icons.getProject('1em')))
					this.makeProEvents(proD,obj.pro)
					
					var tabsD = srh.resD.tabs.resD
					tabsD.empty()
					tabsD.append(this.makeTxtType(obj.tabs,icons.getCode,'1em'))    
					
				},
				
				makeProEvents:function(d,arr){
					var ds = d.find(".nu")
					for(x =0; x < ds.length; x++){
						this.makeProEvt($(ds[x]),arr[x])
					}
				},
				
				
				makeProEvt:function(d,pro){
					d.on('click',function(){
						boss.mainTabs.openProject(pro.id)
					})
				},
				
				makeTxtType:function(arr,icon,s){
					var txt =''
					for(var x =0; x < arr.length; x++){
						txt += this.getDivTxt(icon(s,arr[x].type),arr[x].name)
					}
					return txt
				},
				
				
				makeTxt:function(arr,icon){
					var txt =''
					for(var x =0; x < arr.length; x++){
						txt += this.getDivTxt(icon,arr[x].name)
					}
					return txt
				},
				
				getDivTxt:function(icon,name){
					return "<div class='flex alignMe pad0p2em hlBlue cursor nu'>"
						+"<div class='flexMe'>"+icon+"</div>"
						+"<div class='marL0p1em'>"+name+"</div>"
					+"</div>"
				},
				
				
				
			}
			
			inp.on('keyup',function(){
				o.srh($(this).val())
			})
		},
		
		
		
		
		makeResDTxt:function(n){
			return "<div class='flex alignMe'>"
				+"<div class='name'>"+n+"</div>"
			+"</div>"
		},
		
		
		
		
		
	}
	
	//srh.createD()
	
	srh.setup()
	this.srhM = srh
}

//title
//search bar
//results



