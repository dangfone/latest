boss.setupSave = function(icon){
	this.setupDownload()
	var tOut
	var d = $(".hMenuD")
	var sBoss = {counter:false,secs:0,autosave:true,timeD:"",
		setup:function(){
			var s = "1em"
			var o = boss.menuB.createM(d,icons.getSave(s),"Save", s)
			this.d = o.d
			this.hide()
			helper.setupTogShowHide(icon,sBoss,o.exit)
			helper.setPosToP(o.d,icon,0,50)
			this.setupAutosave(o.main)
			this.setupDl(o.main)
		},
		
		setupAutosave:function(d){
			d.append("<div class='flex pad0p4em column autosaveC colWhite nu'>"
			
				+"<div class='flex alignMe'>"
					+"<input class='autoCheck' type='checkbox' >"
					+"Autosave "
					+"<div class='timeD marL1em'></div>"
				+"</div>"
				
				+"<div class='timer'>00:00:00</div>"
				
			+"</div>")
			d = d.find(".nu").removeClass("nu")
			this.timer = d.find(".timer")
			this.setupAutoCheck(d.find(".autoCheck"))
			this.createTimeD(d.find(".timeD"),this.timer)
			
		},
		
				
		
		
		setupDl:function(d){
			console.log(d)
			d = boss.bBoss.create(d,"Download")
			d.addClass("hlIcon marL0p4em")
			d.on('click',function(){
				sBoss.save()
			})
		},
		
		
		show:function(){
			icon.addClass("togBlu")
			this.d.removeClass("none")
			boss.setTopD(this.d)
		},
		
		hide:function(){
			icon.removeClass("togBlu")
			this.d.addClass("none")
		},
		
		
		checkAuto:function(){
			this.autoCheck.prop('checked', true);
		},
		
		unCheckAuto:function(){
			this.autoCheck.prop('checked', false);
		},
		
		setupAutoCheck:function(d){
			d.on('click',function(){
				sBoss.autosave = this.checked
				sBoss.timeD.setAuto(this.checked)
				
			})
			
			this.autoCheck = d
			
		},
		
		createTimeD:function(d,timer){
			
			var obj ={
				set:async function(){
					var hms = obj.getHms()
					var secs = helper.convertHMSTimeToSec(hms)
					
					if(secs === 0) {
						sBoss.unCheckAuto()
						obj.unset()
					}else{
						if(secs < 10 ) secs = 10
						sBoss.checkAuto()
						obj.counter = sBoss.createCountdownTimer(secs)
						await boss.dbBoss.setAutosave(secs)
					}
				},
				
				setAuto:function(val){
					if(val){
						console.log(this.checkTime())
						if(!this.checkTime()){
							mm.val(30)
						}
						this.set()
					}else{
						this.unset()
					}
				},
				
				setHms:function(secs){
					sBoss.autoCheck.prop('checked', true)
					var hms = helper.convertSecondsToHMS(secs)
					console.log(hms)
					var arr = hms.split(":")
					hh.val(arr[0])
					mm.val(arr[1])
					ss.val(arr[2])
					this.set()
				},
				
				unset:async function(){
					
					
					sBoss.autosave = false
					console.log(obj.counter)
					console.log(this.counter)
					timer.text("00:00:00")
					obj.counter.end()
					
					await boss.dbBoss.setAutosave(0)
					
				},
				
				checkTime:function(){
					if(hh.val() !=0) return true
					if(mm.val()!=0) return true
					if(ss.val() !=0) return true
				},
				
				getHms:function(){
					return hh.val()+":"+mm.val()+":"+ss.val()
				}
				
			}
			
			var hh = this.setupTimeEvts(this.createTimeInp(d,0,59,"Hours",0),obj.set)
			var mm = this.setupTimeEvts(this.createTimeInp(d,0,59,"Minutes",0),obj.set)
			var ss = this.setupTimeEvts(this.createTimeInp(d,0,59,"Seconds",0),obj.set)
			
			this.timeD = obj
		},
		
		setupTimeEvts:function(d,func){
			d.on("focusin",function(){
				$(this).removeClass("time")
			}).on('focusout',function(){
				$(this).addClass("time")
			}).on('input',function(){
				func()
			})
			
			return d
		},
		
		
		createTimeInp:function(d,min,max,title,val){
			d.append("<div class='flex alignMe'>"
				+"<input title='"+title+"' class='time nu mar0p2em' type='number' min='"+min+"' max='"+max+"' value='"+val+"'>"
				+title
			+"</div>")
			return d.find(".nu").removeClass("nu")
		},
		
		createCountdownTimer:function(secs){
			clearInterval(sBoss.interval)
			
			var obj ={fin:"",
				
				start:function(){
					this.fin = Date.now()/1000+secs,
					sBoss.interval = setInterval(obj.update,500)
				},
				
				update:function(){
					
					var now = Date.now()/1000
					
					if(now > obj.fin){
						obj.end()
					}
					
					var diff = helper.convertSecondsToHMS(helper.diff(obj.fin,now))
					sBoss.timer.text(diff)
				},
				
				end:function(){
					
					clearInterval(sBoss.interval)
					if(sBoss.autosave){
						sBoss.save()
						obj.start()
					}
				}
			}
			obj.start()
			return obj
		},
		
		
		createCountdown:function(secs){
			sBoss.counter = setInterval(sBoss.updateTimer,500)
			
		},
		
		updateTimer:function(){
			
		},
		
		
		
		
		
		setAutosave:function(val){
			
		},
		
		save: async function(){
			var txt = await this.getData()
			boss.dlBoss.createNu(txt)
		},
		//working ere
		getData: async function(){
			console.log("get data!")
			var allD = await boss.dbBoss.getAll()
			return JSON.stringify(allD)
		},
		
		
		
		set:function(time){
			tOut = setInterval(function() {
				sBoss.save()
			},time)
		}
		
	}
	
	sBoss.setup()
	//sBoss.set(1000000)
	this.saveBoss = sBoss
}

boss.setupDownload = function(){
	var dlBoss= {
		
		
		
		createFileName:function(n){
			if(!n) n = 'save'
			var date = new Date()
			var day = date.getDate()
			var mm = date.getMonth() +1
			var yy = date.getFullYear()
			return n+"-"+ day +"-"+ mm+"-" + yy +".txt"
		},
		
		createNu:function(txt,n){
			if(!n) n = this.createFileName()
			this.dl(n,txt)
		},
		
		dl:function(filename,text){
			var element = document.createElement('a');
			element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
			element.setAttribute('download', filename);
			element.style.display = 'none';
			element.click();
		}
	}
	
	this.dlBoss = dlBoss
}



