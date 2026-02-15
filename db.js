boss.setupDbBoss = function(){
	var db
	var mainF,info
	var dbBoss ={mainFolder:"",n:1,
		setup: async function(){
			db = new Dexie("myDB1111111111")
			
			db.version(0.2).stores({
				projects: "++id, name, tabs, pID,date,open,lastTabs,jsOrder,jsN",
				folders: "++id, name,pID",
				tabs: "++id,name,type,data,date,line,open",
				info:"++id,name,last,proN,order,autosave",
				lastTabs:"++id,name,html,css,javascript"
				
			})
			//db.folders.clear()
			//db.delete()
			boss.setupDbUpload(this,db)
		},
		
		loaded: async function(){
			info = await this.getInfo()	
			console.log(info)
			await this.openProjects(info)
			console.log("funky")
		},
		
		setProjectName: async function(n,id){
			if(!id) id = await this.getLastProjectID()
			await db.projects.update(id,{name:n})
		},
		
		openProjects: async function(info){
			console.log(info)
			var arr = await db.projects.toArray()
			console.log(arr)
			console.log(arr.length)
			if(arr){
				console.log("checks")
				if(arr.length > 0){
					await boss.mainTabs.openProjects(arr.filter((ele) => ele.open === true))
				}else{
					await boss.mainTabs.tabs.createNu()
				}
			}
						
			if(info.last){
				var last = await this.getProject(info.last)
				boss.mainTabs.selectPro(last)
				boss.mainTabs.setEdiTabs(last)
			}
			return "funk"
		},
		
		setupProjectTabs:async function(id){
			var edis = boss.getEdis()
			console.log(edis)
			var tabs ={}
			for(var x =0; x < edis.length; x++){
				if(edis[x].tabM){
					edis[x].tabM.clear()
					var js = await edis[x].tabM.addNu()
					tabs.js = js.id
				}else{
					tabs[edis[x].type] = await this.setupTab(edis[x].edi,edis[x].type)
				}
			}
			
			console.log(tabs)
			await this.createProjectLastTabs(id,tabs.html,tabs.css,tabs.js)
			
		},
		
				
		
		
		
		setupTab: async function(edi,type){
			//create tab... set to edi
			var name ="index"
			if(type ==="css"){
				name="styles"
			}
			var tab = await this.createTabToProject(name,type)
			console.log(tab)
			
			edi.setTab(tab.id)
			return tab.id
		},
		
		openProject : async function(id){
			await db.projects.update(id,{open:true})
		},
		
		closeProject: async function(id){
			await db.projects.update(id,{open:false})
		},	
		
		createProject : async function(n){
			var info = await this.getInfo()
			var proN = info.proN+1
			
			await db.info.update(info.id,{proN:proN})
			if(!n) n = "html" + proN
			
			return await this.getProject(await db.projects.add({name:n,open:true,tabs:[]}))
		},
		
		
		getCode: async function(proID){
			if(!proID) proID = await this.getLastProjectID()
			var pro = await this.getProject(proID)
			var tabs = await db.tabs.bulkGet(pro.tabs)
			return {pro:pro,tabs:tabs}
		},
		
		getProject: async function(id){
			return await db.projects.get(id)
		},
		
		getInfo:async function(){
			var arr = await db.info.toArray()
			if(arr.length === 0){
				return await db.info.get(await db.info.add({proN:0}))
			}else{
				return arr[0]
			}
		},
		
		setLastProject: async function(id){
			await db.info.update(1,{last:id})
		},
		
		getLastProjectID: async function(){
			var info =await db.info.get(1)
			return info.last
		},
		
		
		createTabToProject: async function(name,type,proID){
			if(!proID) proID = await this.getLastProjectID()
			var tabID = await this.createTab(name,type)
			return await this.addTabToProject(tabID,proID)
		},
		
		createTab : async function(name,type){
			return await db.tabs.add({name:name,type:type,data:"",open:true})
		},
		
		addTabToProject: async function(tabID,proID){
			if(!proID) proID = await this.getLastProjectID()
			var pro = await this.getProject(proID)
			pro.tabs.push(tabID)
			console.log(pro.tabs)
			await db.projects.update(proID,{tabs:pro.tabs})
			return await this.getTab(tabID)
		},
		
		createProjectLastTabs: async function(proID,html,css,js){
			//lastTabs:"++id,name,html,css,javascript"
			var lastID = await db.lastTabs.add({html:html, css:css, javascript:js})
			await db.projects.update(proID,{lastTabs:lastID})
		},
		
		getProjectLastTab: async function(proID){
			if(!proID) proID = await this.getLastProjectID()
			var pro = await this.getProject(proID)
			return await this.getLastTabsObj(pro.lastTabs)
		},
		
		setProjectLastTab: async function(tab, proID){
			if(!proID) proID = await this.getLastProjectID()
			var last = await this.getProjectLastTab(proID)
			console.log(last)
			console.log(tab)
			
			db.lastTabs.update(last.id,{[tab.type] : tab.id})
		},
		
		getLastTabsObj: async function(id){
			return await db.lastTabs.get(id)
		},
		
		getTab: async function(id){
			return await db.tabs.get(id)
		},
		
		getProTabs : async function(id){
			var pro = await this.getProject(id)
			return await db.tabs.bulkGet(pro.tabs)
		},
		
		getTabs: async function(id){
			var pro = await this.getProject(id)
			console.log(pro)
			return await db.tabs.bulkGet(pro.tabs)
		},
		
		setTabName: async function(id,n){
			await db.tabs.update(id,{name:n})
		},
		
		setTabData: async function(id,data){
			await db.tabs.update(id,{data:data})
		},
				
		getProjectJsN : async function(pID){
			if(!pID) pID = await this.getLastProjectID()
			var tabs = await this.getTabs(pID)
		console.log(tabs)
			if(!tabs) return 0
			if(tabs.length ===0) return 0
			console.log(tabs)
			var jsN = tabs.filter((ele) => ele.type === "javascript")
			return jsN.length
		},
		
		srhAll: async function(x){
			return {pro:await this.srhTbl(db.projects,'name',x), tabs: await this.srhTbl(db.tabs,'name',x)}
		},
		
		srhTbl : async function(tbl,attr,val){
			var arr = await tbl.toArray()
			console.log(arr)
			var res =[]
			for(var x =0; x < arr.length; x++){
				if(arr[x][attr].includes(val)){
					res.push(arr[x])
				}
			}
			console.log(res)
			return res
		},
		
		getAll: async function(){
			return {
				projects:await db.projects.toArray(),
				folders:await db.folders.toArray(),
				tabs:await db.tabs.toArray(),
				info:await db.info.toArray(),
				lastTabs: await db.lastTabs.toArray()
			}
		},
		
		setAutosave:async function(t){
			await db.info.update(1,{autosave:t})
		},
		
		
			
		
		
		deleteAll:async function(){
			boss.mainTabs.clear()
			
			return new Promise((resolve, reject) => {
				
				resolve(
					db.delete().then(function(){
						dbBoss.setup()
						return true
					})
				 );
			
			 });
		}
		
		
		
		
		
		
	}
	dbBoss.setup()
	this.dbBoss = dbBoss
}
















