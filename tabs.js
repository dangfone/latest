boss.setupTabs = function(){
	
	
	
	var tBoss = {
		
		createMain:function(d,addS,arrowS){
			d.append("<div class='w100p h100p tCont flex alignMe colWhite '>"
				+"<div class='add hlIcon flexMe'>"+icons.getAdd(addS)+"</div>"
				
				+"<div class='bk hlIcon none arrow h100p flexMe '>"+icons.getChevronLeft(arrowS)+"</div>"
				
				+"<div class='flex1 inlineGrid len hFit'>"
					+"<div class='w100p flex alignMe overflow track'>"
						+"<div class='mainTabs flex alignMe posRel l0'></div>"
					+"</div>"
				+"</div>"
				+"<div class='ff hlIcon none arrow h100p flexMe'>"+icons.getChevronRight(arrowS)+"</div>"
			+"</div>")
			
			return {c:d.find(".tCont"), add:d.find(".add"), bk:d.find(".bk"),ff:d.find(".ff"),data:[],i:0,pos:0,
			len:d.find(".len"),tabs:d.find(".mainTabs"), arrows:d.find(".arrow"),track:d.find(".track"),
			
				addNuTabData:function(d){
					
					this.checkW()
					this.moveToTab(d)
				},
				
				clear:function(){
					this.tabs.empty()
					this.data.length = 0
					this.tabs.css("left","0px")
					this.i =0
					this.pos = 0
					
				},
				
				addTabData:function(d,obj){
					this.data.push({d:d,obj:obj})
				},
				
				
				findTabById:function(id){
					var arr = this.data
					console.log(arr)
					console.log(id)
					for(var x =0; x < arr.length; x++){
						if(arr[x].obj.id === id ){
							return arr[x]
						}
					}
				},
				
				findTabByObj:function(obj){
					var arr = this.data
					console.log(obj)
					console.log(arr)
					for(var x =0; x < arr.length; x++){
						if(arr[x].obj === obj ){
							return arr[x]
						}
					}
				},
				
				removeObj:function(obj){
					var tab = this.findTabByObj(obj)
					var i = this.data.indexOf(tab)
					this.data.splice(i,1)
					tab.d.remove()
					return i
				},
				
				getNext: function(i){
					if(i <0){
						i++
					}
					
					if(i >= this.data.length){
						i =0
					}
					
					return this.data[i]
				},
				
				
				massAdd:function(arr){
					var txt =''
					
					for(var x =0; x < arr.length; x++){
						txt += this.addD()
					}
					this.tabs.append(txt)
					this.checkW()
				},
				
				dAddRmClass:function(d,add,rm){
					d.addClass(add)
					d.removeClass(rm)
				},
				
				checkW:function(){
					console.log("check W")
					if(this.tabs.width() > this.len.width()){
						this.arrows.removeClass("none")
					}else{
						this.arrows.addClass("none")
					}
				},
				
				move:function(dir){
					//get w of tab
					
					console.log(this.i)
					if(this.i === -1) this.i = 0
					var w = this.data[this.i].d.outerWidth()
					
					if(dir === "ff"){
						this.i++
						var last = this.data.length-1
						if(this.i >= last){
							this.i = last
							this.pos = this.getDist(last)*-1
							
						}else{
							this.pos -= w
						}
						
					}else{
						this.i--
						if(this.i <=0){
							this.i =0
							this.pos =0
						}else{
							this.pos += w
						}
					}
					
					this.tabs.css("left",this.pos)
					return w
				},
				
				getDist:function(i){
					var arr = this.data
					var dist = 0;
					for(var x = 0; x < i; x++){
						dist += arr[x].d.outerWidth()
					}
					return dist
				},
				
				isTabViewable:function(dist){
					var viewW = this.track.width()
					var posL = this.pos - viewW
					console.log(posL)
					if(posL < dist ){
						return true
					}
				},
				
				//t= tab obj in this.data
				moveToTab:function(t){
					var d = t.d
					
					var i = this.data.indexOf(t)
					
					var dist = this.getDist(i)*-1
					console.log(dist)
					var res = this.isTabViewable(dist)
										
					if(!res){
						console.log("move?")
						this.tabs.css("left",dist)
						this.pos = dist
						
					}
					this.i = i
				},
				
				goToTab:function(t){
					var d = t.d
					var i = this.data.indexOf(t)
					var dist = this.getDist(i)*-1
					this.tabs.css("left",dist)
					this.pos = dist
					this.i = i
				}
				
				
				
					
					  
			}
			},
		
		setupEvents:function(obj){
			
			obj.add.on('click',function(){
				console.log(obj)
				obj.addNu()
				
			})
			
			obj.bk.on('click',function(){
				obj.move("bk")
			})
			
			obj.ff.on('click',function(){
				obj.move("ff")
				
			})
			
			
		},
		
		
		
		
		
	
	
	}
	
	this.tabBoss = tBoss
}