boss.setupMenuB = function(){
	var menuB = {
		createM:function(d,icon,title,s){
			d.append("<div class='w0 h0'>"
				+"<div class='minH10em minW14em bor flex column borCol31 posRel bgDark  nu'>"
					+"<div class='flex alignMe w100p bg31 colDb  h2em'>"
						+"<div class='flexMe pad0p4em'>"+icon+"</div> " 
						+title
						+"<div class='marLAuto flexMe pad0p4em exit hlIcon'>"+icons.getX(s)+"</div>"
					+"</div>"
					
					+"<div class='main flex1 flex column overflow'></div>"
				+"</div>"
			+"</div>")
			
			d = d.find(".nu").removeClass("nu")
			d.resizable()
			d.draggable()
			return {d:d, exit:d.find(".exit"),main:d.find(".main")}
		},
		
		createSrhD:function(d,clear,clearTxt,icon,txt){
			if(!txt) txt =""
			d.append("<div class='flex alignMe w100p colDb borB borCol31 h2em'>"
				+"<div class='clear flexMe pad0p4em col48 hlIcon' title='"+clearTxt+"'>"+clear+"</div>"
				+"<div class='flex1 flex alignMe'>"
					+"<div class='flexMe pad0p2em'>"+icon+"</div>"
					+"<div class='flex flex1 h1p8em '>"
						+"<input type='text' class='noBorSel bgTran inp w100p fs1p4em colWhite' placeholder='"+txt+"' >"
					+"</div>"
				+"</div>"
			+"</div>")
			return {clear:d.find(".clear"),inp:d.find(".inp")}
		},
		
	}
	this.menuB = menuB
}