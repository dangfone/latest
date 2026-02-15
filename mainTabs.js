boss.setupMainTabs = function(){
	var mainTabs ={n:0,
		setup:function(){
			//createTabs
			var d = $(".headerC")
			var tabs = boss.tabBoss.createMain(d,"2em","2em")
			this.setupTabs(tabs)
			boss.tabBoss.setupEvents(tabs)
			
		},
		
		setupTabs:function(tabs){
			this.tabs = tabs
			
			tabs.add.addClass("pad1em")
			
			tabs.addNu = function(){
				this.createNu()
			},
			
			tabs.createNu = async function(){
				this.tabs.append(this.addD())
				this.addNuDs()
				console.log("nu ppp!!")
				console.log(boss.edis)
				boss.clearEdis()
				
			}
			
			tabs.addD = function(){
				return mainTabs.getTabTxt("html")
			}
			
			tabs.addNuDs = async function(){
				var arr = this.tabs.find(".nu")
				
				for(var x = 0; x < arr.length; x++){
					console.log(arr[x])
					await mainTabs.createNuProject($(arr[x]))
				}
				
			}
			
			
			
			
			
			tabs.selectPro = function(d){
				this.tabs.find(".mainTab").each(function(){
					tabs.dAddRmClass($(this),"colGrey","colWhite")
					var inp = $(this).find(".inp")
					tabs.dAddRmClass(inp,"colGrey","colWhite")
				})
				
				tabs.dAddRmClass(d,"colWhite","colGrey")
				tabs.dAddRmClass(d.find(".inp"),"colWhite","colGrey")
				
			}
			
			tabs.getNu = function(){
				return this.tabs.find(".nu")
			}
			
		},
		
		createTab:function(){
			
		},
		
		addNu:function(){
			
		},
		
		
		selectPro: async function(pro){
			console.log(pro)
			var o = this.tabs.findTabById(pro.id)
			this.tabs.selectPro(o.d)
			this.tabs.moveToTab(o)
			//
		},
		
		setEdiTabs:async function(pro){
			console.log(pro)
			pro = await boss.dbBoss.getProject(pro.id)
			
			//get tabs
			var tabs = await boss.dbBoss.getProTabs(pro.id)
			//get js tabs!
			console.log(tabs)
			
			//get last tabs!!
			
			var last = await boss.dbBoss.getLastTabsObj(pro.lastTabs)
			console.log(last)
			
			var lastArr = this.findLastTabs(last,tabs)
			var edis = boss.getEdis()
			console.log(edis)
			var jsEdi
			for(var x=0; x < edis.length; x++){
				var type = edis[x].type
				if(type === "javascript") jsEdi = edis[x]
				var tab = lastArr[type]
				var edi = edis[x].edi
				edi.setTab(tab.id)
				edi.load(tab.data)
			}
			
			//load js tabs
			
			var jsTabs = tabs.filter((ele) => ele.type === "javascript")
			boss.jsTabs.loadArr(jsTabs,jsEdi,last)
			await boss.srcChecker.check(pro.id)
			
		},
		
		findLastTabs:function(last,tabs){
			var obj ={javascript:this.srhArr(tabs,'id',last.javascript),css:this.srhArr(tabs,'id',last.css),html:this.srhArr(tabs,'id',last.html)}
			return obj
		},
		
		srhArr:function(arr,attr,val){
			for(var x =0; x < arr.length; x++){
				if(arr[x][attr] === val){
					return arr[x]
				}
			}
		},
		
		openProject2 : async function(id){
			//check if project alrdy open..
			console.log(id)
			var tab = this.tabs.findTabById(id)
			console.log(tab)
			var pro = await boss.dbBoss.getProject(id)
			if(!tab){
				await this.openProjects([pro])
				await boss.dbBoss.openProject(id)
			}
			this.click(pro)
				
					
			
		},
		
		
		openProjects: async function(arr){
			console.log(arr)
			this.tabs.massAdd(arr)
			this.tabs.getNu().each(function(i){
				mainTabs.setupProjectEvents($(this),arr[i])
				mainTabs.tabs.addTabData($(this),arr[i])
			})
		},
		
		closeProject: async function(pro){
			console.log("closing projects...!")
			var nxt = this.tabs.getNext(this.tabs.removeObj(pro))
			if(await boss.dbBoss.getLastProjectID() === pro.id){
				this.click(nxt.obj)
			}
			await boss.dbBoss.closeProject(pro.id)
		},
		
		
		
		setupProjectEvents:function(d,pro){
			d.removeClass("nu")
			var inp = d.find(".inp")
			inp.val(pro.name)
			helper.autoWidthInp(inp)
			d.on('click',function(){
				if(!exitOver){
					mainTabs.click(pro)
				}
			})
			
			d.find(".inp").on('keyup',function(){
				boss.dbBoss.setProjectName($(this).val())
			})
			
			var exitD = d.find(".exit")
			var exitOver = false
			
			exitD.on('click',function(){
				console.log("exit!!")
				mainTabs.closeProject(pro)
			}).on('mouseenter',function(){
				exitOver = true
			}).on('mouseleave',function(){
				exitOver = false
			})
			
			
		},
		
		click:async function(pro){
			
			
			var last = await boss.dbBoss.getProject(pro.id)
				 this.selectPro(last)
				
				this.setEdiTabs(last)
				await boss.dbBoss.setLastProject(pro.id)
					
		},
		
		createNuProject: async function(d){
			var pro = await boss.dbBoss.createProject()
			console.log(pro)
			await boss.dbBoss.setLastProject(pro.id)
			this.setupProjectEvents(d,pro)
			this.tabs.selectPro(d)
			this.tabs.addNuTabData(d,pro)
			this.tabs.addTabData(d,pro)
			await boss.dbBoss.setupProjectTabs(pro.id)
			await boss.srcChecker.check(pro.id)
		},
		
		
		getTabTxt:function(name){
			return "<div class='wFit  flex alignMe colWhite bor ulBor noBorCol pad0p2em padL1em hlBor mainTab nu'>"
				+"<div class='nameC wFit pad0p2em maxW20em scrollX'>"
					+"<input class='inp noBor colWhite  hFit fs1p5em bgTran minW3em w3em ' type='text' value='"+name+"'>"
				+"</div>"
				+"<div class='exit flexMe hlIcon'>"+icons.getX("1em")+"</div>"
			+"</div>"
		},
		
		clear:function(){
			this.tabs.clear()
		}
		
		
	}
	mainTabs.setup()
	this.mainTabs = mainTabs
}