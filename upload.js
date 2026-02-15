boss.setupUpload = function(icon){
	
	
	var up ={d:"",overwrite:true,
		setup:function(){
			var d = $(".hMenuD")
			var s = "1em"
			var o = boss.menuB.createM(d,icons.getUpload(s),"Upload", s)
			this.d = o.d
			d = o.d
			this.hide()
			helper.setupTogShowHide(icon,up,o.exit)
			helper.setPosToP(o.d,icon,0,50)
			this.setupFileUpload(o.main)
			//resetMenu.addM(d,d.width(),d.height(),{left:d.css("left"),top:d.css("top")})
		},
		
		show:function(){
			this.d.removeClass("none")
			boss.setTopD(this.d)
			icon.addClass("togBlu")
		},
		
		hide:function(){
			this.d.addClass("none")
			icon.removeClass("togBlu")
		},
		
		
		
		setupFileUpload:function(d){
			d.append("<div class='pad1em colWhite'><input class='picker' type='file'  name='fileLis' ></div>")
			var picker = d.find(".picker")[0]
			picker.addEventListener('change', e => {
				up.getFiles(e.target.files)
			});
			this.picker = picker
			
			d.append("<div class='upChoices colWhite flex column pad0p4em'>"
				+"<div class='flex alignMe'>"
					+"<input class='overW' type='checkbox' checked>"
					+"Overwrite current data"
				+"</div>"
				+"<div class='flex alignMe'>"
					+"<input class='' type='checkbox' >"
					+"Make backup of current data"
				+"</div>"
				
			+"</div>")
			
			d.find(".overW").change(function() {
				up.setDelFiles(this.checked)
			})
			
			d.append("<div class='filesC'>"
				+"<div class='h10em colWhite delFilesC'></div>"
				+"<div class='h10em colWhite upFilesC'></div>"
			+"</div>")
			
			this.delFilesD  = this.createFilesC(d.find(".delFilesC"),icons.getTrash("1.4em"), "Will Delete")
			
			this.upFilesD  = this.createFilesC(d.find(".upFilesC"),icons.getUpload("1.4em"), "Will Upload")
			
		
			
			var upB = boss.bBoss.create(d,"Upload","colBlack hlIcon mar1em")
			upB.on('click',function(){
				up.upload()
			})
			
		},
		
		upload:async function(){
			var saves=""
			if(this.delEvts){
				saves = this.delEvts.getSaves()
			}
			
			await boss.dbBoss.uploadFromTxt(this.txtData[0],this.overwrite,saves)
			
		},
		
		clear:function(res){
			console.log("cleaning time!")
			//this.d.empty()
			this.txtData.length = 0
			console.log(this.picker)
			this.picker.value = ''
			this.delFilesD.files.empty()
			
		},
		
		createFilesC:function(d,icon,title){
			d.append("<div class='bor borCol31 mar1em flex column cont h100p nu'>"
				+"<div class='flex alignMe pad0p4em'>"
					+"<div class='flexMe'>"+icon+"</div>"
					+"<div class=''>"+title+"</div>"
				+"</div>"
				+"<div class='files flex1 scrollY'></div>"
			+"</div>")
			const c = d
			d = d.find(".nu").removeClass("nu")
			return {d:d, c:c,files:d.find(".files"),
				hide:function(){
					c.addClass('none')
				},
				
				show:function(){
					c.removeClass('none')
				}
			}
		},
		
		setDelFiles: function(val){
			this.overwrite = val
			if(val){
				this.delFilesD.show()
			}else{
				this.delFilesD.hide()
			}
		},
		
		
		showFiles : function(obj){
			
		},
		
		showUpFiles : async function(obj){
			var fileDs = await boss.previewB.create(this.upFilesD.files, obj)
				
		},
		
		showDelFiles : async function(){
			
			var d = this.delFilesD.d
			
			if(this.overwrite){
				d.removeClass("none")
				this.delFilesD.files.empty()
				var fileDs = await boss.previewB.create(this.delFilesD.files, await boss.dbBoss.getAll())
				this.setupDelFileEvents(fileDs)
			}else{
				d.addClass("none")
			}
		},
		
		
		//
		setupDelFileEvents: function(obj){
			console.log(obj)
			
			var data =[]
			
			var evts = {
				setupProjects:function(ds,arr){
					for(var x =0; x < ds.length; x++){
						this.setupChkbox($(ds[x]),arr[x])
						data.push(arr[x])
					}
				},
				
				setupTabs:function(ds,arr){
					for(var x =0; x < ds.length; x++){
						this.setupChkbox($(ds[x]),arr[x])
						data.push(arr[x])
					}
				},
				
				setupChkbox:function(d,obj){
					var box = d.find(".chkbox")
					console.log(d)
					console.log(box)
					box.prop('checked',true)
					box.change(function() {
						obj.del = false
						if(this.checked) {
							obj.del = true
						}
					})
				},
				
				getSaves:function(){
					return data.filter((ele) => ele.del === false)
				}
				
			}
			
			evts.setupProjects(obj.pros,obj.o.projects)
			evts.setupProjects(obj.tabs,obj.o.tabs)
			this.delEvts = evts
		},
		
		getOverwrite : function(){
			return this.overwrite
		},
		
		
		
		
		
		
		
		
		setAllCheckedProjects:function(val){
			var pros = this.mainC.find(".pro")
			var boxes = pros.find(".checkbox")
			boxes.each(function(){
				$(this).prop("checked", val);
			})
			this.getCheckedProjects()
		},
		
		
		setProjectN:function(n){
			this.n.text(n)
		},
		
		getFiles: async function(files){
			var o = this.sortFiles(files)
			this.txtData = await this.sortTxtFiles(o.txt)
			console.log(this.txtData)
			await this.showDelFiles()
			await this.showUpFiles(this.txtData[0].data)
		},
		
		parseData:function(data){
			
			data = JSON.parse(data)
			console.log(data)
			
			var nu = this.getTabData(data.projects,data.tabs)
			boss.pBoss.projectPreview(this.mainC,nu)
			this.setProjectN(data.projects.length)
			this.files = nu
		},
		
		getTabData:function(pros,tabs){
			for(var x =0; x <pros.length; x++){
				pros[x].rawTabs = this.findTabs(pros[x].tabs,tabs)
			}
			return pros
		},
		
		findTabs:function(ids,arr){
			var nu = []
			for(var x =0; x < ids.length; x++ ){
				nu.push(this.getTab(ids[x],arr))
			}
			console.log(nu)
			return nu
		},
		
		getTab:function(id,arr){
			for(var x =0; x < arr.length; x++){
				if(id === arr[x].id){
					return arr[x]
				}
			}
		},
		
		
		parseProjects:function(){
			
		},
		
		
		
		
		uploadFolders: async function(){
			 files = this.sortFiles(files)
			 var o ={css:await this.sortTxtFiles(files.css),js:await this.sortTxtFiles(files.js),html:await this.sortTxtFiles(files.html),txt:await this.sortTxtFiles(files.txt)}
			console.log(o)
			boss.dbBoss.createUploadProject( {html:this.getIndexHtml(o.html),css:this.getCss(o.css),js:o.js})
	
		},
		
		getCss:function(arr){
			var txt =""
			for(var x =0; x < arr.length; x++){
				txt += arr[x].data
				+="\n"
			}
			return txt
		},
		
		getIndexHtml:function(arr){
			for(var x = 0; x < arr.length; x++){
				if(arr[x].name.includes("index")) return arr[x]
			}
			return arr[0].data
		},
		
		sortFiles:function(arr){
			var o ={js:[],html:[],css:[],txt:[]}
			for(var x =0; x < arr.length; x++){
				if(arr[x].type.includes("javascript") ){
					o.js.push(arr[x])
				}else if (arr[x].type.includes("html") ){
					o.html.push(arr[x])
				}else if (arr[x].type.includes("css") ){
					o.css.push(arr[x])
				}else{
					o.txt.push(arr[x])
				}
			}
			console.log(o)
			return o
		},
		
		sortTxtFiles: async function(arr){
			var stuff =[]
			for(var x = 0; x < arr.length; x++){
				stuff.push({name:arr[x].name,data:JSON.parse(await this.getFileTxt(arr[x]))})
			}
			return stuff
		},
		
		getFileTxt : async function(file){
			return new Promise((res,rej)=>{
				
				let reader = new FileReader();
				reader.onload = function(){
				  res(reader.result)
				};
				reader.readAsText(file);
			});
		},
		
		
		
		
		
		
	}
	
	//undo ....
	//o.createMainD()
	up.setup()
	this.upBoss = up
}

