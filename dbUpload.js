boss.setupDbUpload  = function(dbB,db){
	
	dbB.uploadFromTxt = async function(o,overwrite,saves){
			console.log(o)
			console.log(o.data)
			if(overwrite){
				var res = await this.deleteAll()
			}
			console.log(saves)
			this.loadAll(o.data,overwrite)
					
	}
	
	dbB.loadAll = async function(obj,overwrite){
			console.log(obj)
			const old = obj
			var tabs = await this.loadTabs(obj.tabs)
			console.log(tabs)
			
			//check for duplicate names
			for(var x =0; x < obj.projects.length; x++){
				var pro = obj.projects[x]
				//this.checkDuplicate(db.projects,'name',pro.name)
				this.getProjectLastTabs(pro,obj.lastTabs)
				this.updateProjectTabs(pro,tabs)
				this.updateLastTabs(pro.lastTabArr,tabs)
				await this.createLast(pro)
			}
						
			var lastPIndex = this.getInfoLastPIndex(obj.projects, obj.info[0].last)
			
			var nuPs = await this.loadProjects(obj.projects)
			if(overwrite){
				await this.makeInfoLast(nuPs[lastPIndex])
			}
			
			await this.loaded()
			console.log("fin")
			boss.upBoss.clear()
	}
		
		dbB.checkDuplicate = async function(tbl,attr,n){
			var arr = tbl.where(attr).equalsIgnoreCase(n).toArray();
			console.log(arr)
		}
		
		dbB.getInfoLastPIndex = function(arr,lastID){
			for(var x =0; x < arr.length; x++){
				console.log(arr[x])
				if(arr[x].id == lastID){
					return x
				}
			}
			
		}
		
		dbB.makeInfoLast = async function(id){
			console.log(id)
			
			await db.info.add({last:id,proN:0})
		}
		
		dbB.createLast =async function(pro){
			console.log(pro)
			var last = pro.lastTabArr
			pro.lastTabs = await db.lastTabs.add({html:last.html, css:last.css, javascript:last.javascript})
			delete pro.lastTabArr
		}
		
		dbB.getProjectLastTabs= function(pro,arr){
			//var id = pro.lastTabs
			var id = pro.lastTabs
			console.log(pro)
			for(var x=0; x < arr.length; x++){
				if(id === arr[x].id){
					pro.lastTabArr= arr[x]
					break
				}
			}
			console.log(pro)
		}
		
		dbB.updateLastTabs=function(last,tabs){
			console.log(last)
			var o ={
				update:function(n,tabs){
					for(var x = 0; x < tabs.length; x++){
						if(n === tabs[x].oldID){
							return tabs[x].nuID
						}
					}
				}
			}
			
			last.html = o.update(last.html,tabs)
			last.javascript = o.update(last.javascript,tabs)
			last.css = o.update(last.css,tabs)
			console.log(last)
			
		}
		
		dbB.updateProjectTabs = function(pro,tabs){
			var arr = pro.tabs
			pro.tabs = this.checkOldProject(arr,tabs,'oldID','nuID')
		}
		
		dbB.checkOldProject = function(arr,chkArr,old,nu){
			var nuA =[]
			for(var x =0; x < arr.length; x++){
				var n = arr[x]
				for(var y =0; y < chkArr.length; y++){
					if(n === chkArr[y][old]){
						nuA.push(chkArr[y][nu])
						break
					}
				}
			}
			return nuA
		}
		
		
		
		dbB.loadProjects=async function(arr){
			var pro = arr.map(({ id, ...rest }) => rest);
			return await db.projects.bulkAdd(pro,{ allKeys: true })
		}
		
		
		dbB.loadTabs=async function(arr){
			var old =[]
			for(var x=0; x < arr.length; x++){
				old.push(arr[x].id)
				delete arr[x].id
			}
			
			return db.tabs.bulkAdd(arr, { allKeys: true }).then(ids => {
				for(var x =0; x < arr.length; x++){
					arr[x].nuID = ids[x]
					arr[x].oldID = old[x]
				}
				return arr
			});
		}
		
		
		
		
		
		
		
	
}