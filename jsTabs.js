boss.setupJsTabs = function(){
	var js ={
		addTabs:function(obj,c){ 
			console.log(obj)
			c.find(".title").text("js")
			
			var d = c.find(".tabs")
			
			var tabs = boss.tabBoss.createMain(d,"1em","1em")
			this.setupTabs(tabs,obj)
			tabs.c = c
			tabs.d = d
			boss.tabBoss.setupEvents(tabs)
			d.find(".bg17").removeClass("bg17")
			return tabs
		},
		
		addScriptTags:function(tab){
			//find </head>
		},
		
		setupTabs:function(tabs,obj){
			console.log(obj)
			var edi = obj.edi
			edi.tabs = tabs
			
			tabs.addNu = async function(){
				this.tabs.append(js.getJsTabTxt("script"))
				var d = this.tabs.find(".nu")
				console.log(d)
				return await this.createNu(d)
				
			},
			
			tabs.createNu = async function(d){
				
				d.removeClass("nu")
				var jsN = await boss.dbBoss.getProjectJsN()+1
				var src = await boss.dbBoss.createTabToProject("script"+jsN,"javascript")
				console.log(src)
				tabs.selectJs(d)
				this.setupEvents(d,src)
				tabs.addNuTabData(d)
				edi.setTab(src.id)
				edi.load("")
				boss.srcChecker.check()
				return src
			}
			
			tabs.setupEvents = function(d,tab){
				d.removeClass("nu")
				var inp = d.find(".inp")
				inp.val(tab.name)
				helper.autoWidthInp(inp)
				inp.on('keyup',function(){
					boss.dbBoss.setTabName(tab.id,$(this).val())
				})
				
				//findCheck
				
				tabs.addTabData(d,tab)
				d.on('click',function(){
					console.log(tab)
					console.log(edi)
					tabs.selectJs(d)
					js.clickOnTab(tab,edi)
				})
			}
			
			tabs.addNuDs = async function(){
				var arr = this.tabs.find(".nu")
				for(var x =0; x < arr.length; x++){
					await js.createNu($(arr[x]))
				}
				
			}
			
			
			tabs.loadArr =  function(arr,edi){
				var txt = ""
				for(var x =0; x < arr.length; x++){
					txt+=js.getJsTabTxt(arr[x].name)
				}
				this.tabs.append(txt)
				this.checkW()
				var ds = this.tabs.find(".nu")
				for(var x =0 ; x< ds.length; x++){
					this.setupEvents($(ds[x]),arr[x],edi)
				}
				return true
			}
			
			
			tabs.selectJs = function(d){
				tabs.tabs.find(".jsTab").each(function(){
					tabs.dAddRmClass($(this),"colGrey","colWhite")
					var inp = $(this).find(".inp")
					tabs.dAddRmClass(inp,"colGrey","colWhite")
				})
				
				tabs.dAddRmClass(d,"colWhite","colGrey")
				tabs.dAddRmClass(d.find(".inp"),"colWhite","colGrey")
			}
			
		},
		
		loadArr: function(arr,edi,last){
			console.log(last)
			edi.tabM.clear()
			edi.tabM.loadArr(arr,edi)
			var tab = edi.tabM.findTabById(last.javascript)
			console.log(tab)
			edi.tabM.moveToTab(tab)
			edi.tabM.selectJs(tab.d)
		},
		
				
		clickOnTab:async function(tab,edi){
			
			edi.setTab(tab.id)
			var t = await boss.dbBoss.getTab(tab.id)
			edi.load(t.data)
			await boss.dbBoss.setProjectLastTab(tab)
			
		},
		
		getJsTabTxt:function(name){
			return "<div class='wFit  flex alignMe colWhite bor ulBor noBorCol pad0p2em padL1em hlBor jsTab nu'>"
				+"<div class='nameC wFit pad0p2em maxW20em scrollX'>"
					+"<input class='inp noBor colWhite  hFit fs1em bgTran minW3em w3em ' type='text' value='"+name+"'>"
				+"</div>"
				+"<div class='exit flexMe hlIcon'>"+icons.getX("1em")+"</div>"
			+"</div>"
		},
		
		
		
		
	}
	this.jsTabs = js
}