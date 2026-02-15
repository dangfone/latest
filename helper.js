

var helper ={
	
	setPosToP:function(d,p,topOff,leftOff){
			var pos = p.offset()
			d.css({position:'relative', top:pos.top+topOff,left:pos.left+leftOff})
		},
	
	
	setupTogShowHide:function(icon, obj,exitD){
		//
		var showing = false
		
		var tog = {
			show:function(){
				obj.show()
				showing = true
			},
			hide:function(){
				obj.hide()
				showing = false
			},
			
			toggle:function(){
				if(showing){
					this.hide()
				}else{
					this.show()
				}
				
			}
			
		}
		icon.on('click' ,function(){
			tog.toggle()
		})
		
		
		if(exitD){
			exitD.on('click',function(){
				tog.hide()
			})
		}
	
		return tog
	},
  
	  autoWidthInp:function(inp){
		var w
		
		var setW = function(){
			w = inp.val().length
			w+= "ch"
			inp.css("width", w)
		}
		
		inp.on('keyup', function(){
			setW()
		})
		setW()
	  },
	  
	setupNuD:function(c){
		var d = c.find(".nu").removeClass("nu")
		return d
	},
	  
	isNumber: function(value) {
		return typeof value === 'number' && !Number.isNaN(value);
	},
  
	setupChangeNameInp:function(inp,ele,func){
		inp.on('keyup',function(){
			var x = $(this).val()
			func(ele,x)
		})
	},
  
	removeObjFromArr:function(obj,arr){
		var i = arr.indexOf(obj)
		console.log(i)
		arr.splice(i,1)
		return i
	},
		
	//https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
	arrayMove:function(arr, fromIndex, toIndex) {
		var ele = arr[fromIndex];
		arr.splice(fromIndex, 1);
		arr.splice(toIndex, 0, ele);
	},
	
	diff:function(a,b){
		return Math.abs(a - b);
	},
	
	findClosestOpen:function(arr,ele){
		if(arr.length < 2) return false
		var arr = arr.filter((ele) => ele.open)
		console.log(arr)
		var i = arr.indexOf(ele)
		if(i === 0){
			i++
		}else{
			i--
		}
		return arr[i]
		
	},
	
	convertSecondsToHMS:function(sec){
		return new Date(sec * 1000).toISOString().substring(11,19)
	},

	//https://stackoverflow.com/questions/9640266/convert-hhmmss-string-to-seconds-only-in-javascript
	convertHMSTimeToSec:function(hms){
		console.log(hms)
		var a = hms.split(':'); // split it at the colons
		return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
	},
	
	setupOverExitD:function(d){
		var res = false
		
		d.on('mouseenter',function(){
			res = true
		}).on('mouseleave',function(){
			res = false
		})
		
		var obj ={
			getRes:function(){
				return res
			}
		}
		
		return obj
		
	},
	
	setupTogMenuEvents:function(tog,menu,menuC){
		menu.showing = false
		
		tog.on('click',function(){
			if(menu.showing){
				menuC.addClass("none")
			}else{
				menuC.removeClass("none")
			}
			menu.showing = !menu.showing
		})
		
		$([tog[0],menuC[0]]).on('mouseenter',function(){
			console.log("enter")
			menu.over = true
		}).on('mouseleave',function(){
			menu.over = false
		})
	},
	
	setupDelayInp:function(inp,obj,delay){
		if(!delay) delay = 200
		var timeout
		//obj.getInp()
		inp.on('keyup',function(){
			var val = $(this).val()
			timeout = setTimeout(obj.getInp,delay,val)
		}).on('keydown',function(){
			clearTimeout(timeout)
		})
		
	},
	//workin ere
	createTimer:function(ms,func){
		var o = {}
	},
	
	preventMainScroll:function(d,c){
		
		d.on('scroll',function(e){
			var top = d[0].scrollTop
			var totalScroll = d[0].scrollHeight;
            var currentScroll = top + d[0].offsetHeight;
			if(currentScroll === totalScroll) {
				d[0].scrollTop = top - 1;
           }
		})
	},
	
	addLoadingD:function(d,cl){
		if(!cl) cl ="flexMe w100p h2em"
		var cont = sandy.addDiv(d,cl)
		cont.append("<div class='txt'>Loading</div>"
		+"<div class='w2em icon flexMe'></div>")
		var icon = cont.find(".icon")
		getLoadingIcon(icon,"1em")
		var obj ={
			show:function(){
				cont.removeClass("none")
				icon.addClass("spin")
			},
			hide:function(){
				cont.addClass("none")
				icon.removeClass("spin")
			}
			
		}
		return obj
	},
	
	
	addLimitFunctions:function(obj){
		obj.limits =[]
		obj.limit =0;
		obj.limitDs =[]
		obj.i = 0
		
		obj.getObj = function(val){
			var arr = this.limitDs
			for(var x =0; x < arr.length; x++){
				if(arr[x].val === val){
					return arr[x]
				}
			}
		}
		
		obj.selectByVal = function(val){
			this.selectLimit(this.getObj(val))
		}
		
		obj.selectLimit = function(obj){
			console.log(obj)
			console.log(this)
			this.limit = obj.val
			this.fBoss.srhLimit = obj.val
			obj.d.addClass("colBlue")
			obj.d.removeClass("colGrey")
			var arr = this.limitDs
			for(var x =0; x < arr.length; x++){
				if(obj !== arr[x]){
					arr[x].d.addClass("colGray")
					arr[x].d.removeClass("colBlue")
				}
			}
		}
		obj.setupD = function(){
			var o = this.getObj(this.limit)
			if(o){
				this.selectLimit(o)
			}
		}
	},
	
	
	addOpenFileFunctions:function(obj){
		
		obj.showFiles = function(d,arr,boss,extras){
			console.log(this)
			this.showArrDivs(d,arr,boss,extras,this.limit)
			this.setupOpenEvents(d,"nuF",arr,0,boss)
		}
		
		obj.showArrDivs = function(d,arr,boss,extras,max){
			var txt =""
			d.empty()
			for(var x =0; x < arr.length; x++){
				if(x >= max){
					break;
				}
				txt+=boss.getFileSrhTxt("nuF",extras)
			}
			d.append(txt)
		}
		
		obj.setupOpenEvents = function(d,cl,arr,start,boss){
			var divs = d.find("."+cl)
			divs.each(function(index){
				$(this).removeClass(cl)
				obj.setupOpenEvent($(this),arr[index+start],boss)
			
			})
		}
		
		obj.setupOpenEvent = function(d,ele,boss){
			d.find(".name").text(ele.obj.name)
			var openD = d.find(".openD")
			getFolderOpenIcon(openD,"1em")
			d.on('click',function(){
				boss.openFile(ele)
			})
		}
		
		
	},
	
	
	
	setupLimitsBoss:function(){
		var obj ={
			limit:0,limits:[],limitDs:[],i:0,
			addLimit:function(txt,val){
				this.limits.push({txt:txt,val:val})
			},
			setLimit:function(x){
				this.limit = x
			},
			setI:function(x){
				this.i = x
			},
			getObj:function(val){
				var arr = this.limitDs
				for(var x =0; x < arr.length; x++){
					if(arr[x].val === val){
						return arr[x]
					}
				}
			},
			selectLimit:function(obj){
				this.limit = obj.val
				obj.d.addClass("colBlue")
				obj.d.removeClass("colGrey")
				var arr = this.limitDs
				for(var x =0; x < arr.length; x++){
					if(obj !== arr[x]){
						arr[x].d.addClass("colGray")
						arr[x].d.removeClass("colBlue")
					}
				}
			},
			setupD:function(){
				var o = this.getObj(this.limit)
				if(o){
					this.selectLimit(o)
				}
			}
		}
		return obj
	},
	
	addLimitObj:function(arr,txt,val){
		arr.push({txt:txt,val:val})
	},
	//srhBoss.setLimits([{txt:"5",val:5},{txt:"10",val:10},{txt:"30",val:30}])
	createLimitDs:function(d,boss){
		d = sandy.addDiv(d,"marLAuto wFit flex alignMe colGray cursor")
		d.append("Show : ")
		
		var arr = boss.limits
		
		boss.limitDs =[]
		for(var x =0; x < arr.length; x++){
			var o = arr[x]
			this.createLimitD(d,o.txt,o.val,boss)
		}
		boss.setupD()
	},
	
	createLimitD:function(d,txt,val,boss){
		d = sandy.addDiv(d,"hlIcon limit pad0p2em")
		d.append(txt)
		var obj ={d:d,val:val}
		boss.limitDs.push(obj)
		d.on('click',function(){
			boss.selectLimit(obj)
			boss.refresh()
		})
		return d
	},
	
	setInpW:function(inp,val){
		w = val.length
		var per = w/20
		w-= per
		w+= "ch"
		inp.css("width", w)
	},
	
	setupAutoWidth:function(inp,cl){
		var setW = function(){
			var w = inp.val().length
			var per = w/20
			w-= per
			w+= "ch"
			inp.css("width", w)
		}
		inp.addClass(cl)
		setW()
		inp.on('keyup',function(){
			setW()
		})
	},
	
	setupMainSrh:function(d,fBoss){
			
		var obj ={fBoss:fBoss,
			srh:function(val,d){
				console.log(this)
										
				if(this.mode ==='files'){
					this.fBoss.srhFiles(val,d)
				}
					
				if(this.mode === 'folders'){
					this.fBoss.srhFolders(val,d,this.fBoss)
				}
					
			}
		}
		this.addOpenFileFunctions(obj)
		return sandy.setupSrhD(d,obj)
	},
	
	
	createChervonDropObj:function(d){
		var iconDOver = false
		var obj ={
			data:[],showing:false,
						
			setup:function(arr){
				console.log(d)
				d.empty()
				d.removeClass("flexMe w2em")
				d.addClass("flex w4em h2em posRel")
				this.d = d
				//add zindex to sort cursor
				var iconD = sandy.addDiv(d,"flex column bgWhite w2em hFit shadow1")
				this.iconD = iconD
				
				for(var x =0; x < arr.length; x++){
					var nu = sandy.addDiv(iconD,"opt w100p h2em flexMe hlIcon")
					arr[x].icon(nu,"2em")
					arr[x].d = nu
					
					this.setupIconClick(nu,arr[x])
				}
				this.data = arr
				var togD = sandy.addDiv(d,"flexMe w2em hlIcon grayCol")
				getChevronDown(togD,"1.5em")
				
				togD.on('mousedown',function(){
					obj.togClick()
				})
								
				this.hideAll()
				
				togD.on('mouseleave',function(){
					iconDOver = false
				})
				
				iconD.on('mouseenter',function(){
					iconDOver = true
				}).on('mouseleave',function(){
					iconDOver = false
				})
				
			},
			
			setupIconClick:function(d,ele){
				d.on('click',function(){
					console.log(ele)
					obj.iconClicked(ele)
				})
			},
			
			iconClicked:function(ele){
				var arr = this.data
				for(var x =0; x < arr.length; x++){
					if(arr[x] !== ele){
						arr[x].hide()
					}else{
						ele.show()
					}
				}
			},
			
			start:function(){
				this.iconClicked(this.data[0])
			},
						
			mainCheck:function(){
				if(iconDOver) return
				this.hideAll()
			},
			
			togClick:function(){
				if(this.showing){
					this.hideAll()
				}else{
					iconDOver = true
					this.show()
				}
				
			},
			
			hideAll:function(){
				var arr = this.data
				console.log(arr)
				for(var x =1; x < arr.length; x++){
					arr[x].d.addClass("none")
				}
				this.iconD.removeClass("shadow1")
				this.showing = false
				sandy.mainCListen.rm(this)
				
			},
			
			show:function(){
				var arr = this.data 
				for(var x =0; x < arr.length; x++){
					arr[x].d.removeClass("none")
				}
				this.iconD.addClass("shadow1")
				this.showing = true
				sandy.mainCListen.add(this)
				
			},
			
			createCssProfile:function(n){
				var pro = {name:n,
					
				}
			},
			
		}
		
		
		
		return obj 
	},
	
	//https://stackoverflow.com/questions/3410464/how-to-find-indices-of-all-occurrences-of-one-string-in-another-in-javascript
	getIndicesOf:function(searchStr, str, caseSensitive) {
				var searchStrLen = searchStr.length;
				if (searchStrLen == 0) {
					return [];
				}
				var startIndex = 0, index, indices = [];
				if (!caseSensitive) {
					str = str.toLowerCase();
					searchStr = searchStr.toLowerCase();
				}
				while ((index = str.indexOf(searchStr, startIndex)) > -1) {
					indices.push(index);
					startIndex = index + searchStrLen;
				}
				return indices;
	},
	
	//https://stackoverflow.com/questions/32017166/get-the-line-number-of-a-string-from-body-of-text
	getLineN:function(str,index){
		var tempString = str.substring(0, index);
		return tempString.split('\n').length;
	},
	
	stopDragging:function(){
		
	},
	
	
	
	
	
	
	
	
}







var cssBoss={data:[],
	createProfile:function(n,str){
		
		var pro ={classes:[],name:n,
			addClasses:function(arr){
				for(var x =0; x< arr.length; x++){
					this.addClass(arr[x])
				}
			},
			
			addClass:function(cl){
				if(!this.getClass(cl)){
					this.classes.push(cl)
				}
			},
			
			addString:function(str){
				this.addClasses(str.split(/(\s+)/))
			},
			
			getClass:function(cl){
				var arr = this.classes
				
				for(var x =0; x < arr.length; x++){
					if(arr[x] === cl){
						return arr[x]
					}
						
				}
				return false
			},
			getClassString:function(){
				var arr = this.classes
				var str =" "
				for(var x =0; x < arr.length; x++){
					str +=arr[x] +' '						
				}
				return str
			}
			
		}
		
		
		
		return pro
	}
}
