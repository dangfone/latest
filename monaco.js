require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/min/vs' }});
  
  require(["vs/editor/editor.main"], function () {

  
  
  //var p = document.getElementsByClassName("edisC")[0];
	var p = document.getElementsByClassName("hMenuD")[0]

  // -----------------------------
  // Define custom theme
  // -----------------------------
 monaco.editor.defineTheme('solidLine', {
	base: 'vs-dark', 
	inherit: true,
	rules: [],
	colors: {
		'editor.lineHighlightBackground': '#3c3c3c', // solid active line
	}
 });
  
monaco.editor.EditorOptions.stickyScroll = { enabled: false };
monaco.languages.html.htmlDefaults.setOptions({
   suggest: { html5: true }
});
  
var ids=0
  // -----------------------------
  // Function to create editor
  // -----------------------------
function createEdi({ language, initialValue = "", parent, theme = "solidLine" }) {

    var wrapC = document.createElement("div")
    wrapC.classList.add("w0","h0") 
    parent.appendChild(wrapC)
    
    var grabD = document.createElement("div")
    grabD.classList.add("pad1em","flexMe","grab","wFit","hFit","grab")
    wrapC.appendChild(grabD)
    
    var wrap = document.createElement("div")
    wrap.classList.add("w30em","h17em","minH10em", "minW14em", "flex", "column","bgDark","bor","borCol31")
    grabD.appendChild(wrap)
    
    var titleC = document.createElement("div")
    titleC.classList.add("h3em","w100p","flex","col8c")
    wrap.appendChild(titleC)
    
    var ediC = document.createElement("div")
    ediC.classList.add("flex1","overflow")
    wrap.appendChild(ediC)
    
    const editorDiv = document.createElement("div");
    editorDiv.classList.add("w100p","h100p");
    ediC.appendChild(editorDiv);

    const editor = monaco.editor.create(editorDiv, {
        value: initialValue,
        language: language,
        theme: theme,
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
		folding:false,
		stickyScroll: { enabled: false }
    });

	editor.setTab = function(id){
		this.tabID = id
	}

   

    return {
        edi: editor,
        c: ediC,
        d: editorDiv,
        wrap: wrap,
        titleC: titleC,
        grab: grabD,
        p: parent
    };
}

$(function() {
	
	var mainD = $(".main")
	  const htmlEditor = createEdi({
		language: "html",
		initialValue: "",
		parent: mainD.find(".htmlP")[0],
		theme: "solidLine"
	  });
	  
	  const cssEditor = createEdi({
		language: "css",
		initialValue: "",
		parent: mainD.find(".cssP")[0],
		theme: "solidLine"
	  });
	  
	  const jsEditor = createEdi({
		language: "javascript",
		initialValue: "",
		parent:  mainD.find(".jsP")[0],
		theme: "solidLine"
	  });
	
	
	
	
	
	setupEdiEvents(htmlEditor)
	setupEdiEvents(cssEditor)
	setupEdiEvents(jsEditor)
	
	loaded()
	//console.log(boss.edis)
	//boss.resetEdiPos()
})
	
	
	
	
	const VOID_TAGS = new Set([
		  "area","base","br","col","embed","hr","img","input",
		  "link","meta","param","source","track","wbr"
	]);
	
	async function loaded(){
		boss.iframeB.addD(document.getElementsByClassName("iframeP")[0])
		await boss.dbBoss.loaded()
		
	}
	
	
	function setupEdiEvents(obj){
		
		$(obj.d).css("border-color","transparent")
		
		setupEdiC(obj)
		
		var editor = obj.edi
		editor.updateOptions({renderLineHighlight: "none"});
		
		editor.onDidBlurEditorWidget(() => {
		  editor.updateOptions({
			renderLineHighlight: "none" // removes the line highlight
		  });
		});

		editor.onDidFocusEditorWidget(() => {
		  editor.updateOptions({
			renderLineHighlight: "line" // restore line highlight
		  });
		});
		
		editor.load = function(txt,line){
			console.log(line)
			editor.setValue(txt);
			editor.setLine(line)
		}

		editor.onKeyUp(function(e){
			console.log('key up!')
			const position = editor.getPosition();
    		const line = position.lineNumber;
			
			editor.saveLine(line)
		})

		editor.onMouseUp((e) => {
    		editor.saveLine(e.target.position.lineNumber);
		})

		editor.saveLine = async function(line){
			await boss.dbBoss.setTabLine(editor.tabID, line);
		}
		
		editor.setLine = function(line){
			editor.setPosition({ lineNumber: line, column: 1 });
            editor.revealLineInCenter(line);
		}

		editor.saveMyStuff = async function(txt){
			if(!this.tabID) return
        	await boss.dbBoss.setTabData(this.tabID,txt)
		}
		
		editor.onDidChangeModelContent((e) => {
			if (editor.isProgrammaticMove) return;
		  const model = editor.getModel();
		  const pos = editor.getPosition();

		  for (const change of e.changes) {
			// Only when user types ">"
			if (change.text !== ">" || change.rangeLength !== 0) continue;

			const line = model.getLineContent(pos.lineNumber);
			const beforeCursor = line.slice(0, pos.column - 1);

			// Ignore closing tags and comments
			if (beforeCursor.endsWith("-->")) return;
			if (/<\/[^>]*>$/.test(beforeCursor)) return;

			// Match opening tag
			const match = beforeCursor.match(/<([a-zA-Z][\w-]*)(\s[^>]*)?>$/);
			if (!match) return;

			const tagName = match[1].toLowerCase();

			// Skip void/self-closing tags
			if (VOID_TAGS.has(tagName)) return;
			if (beforeCursor.endsWith("/>")) return;

			const closing = `</${tagName}>`;

			editor.executeEdits("auto-close-tag", [{
			  range: {
				startLineNumber: pos.lineNumber,
				startColumn: pos.column,
				endLineNumber: pos.lineNumber,
				endColumn: pos.column,
			  },
			  text: closing,
			}]);

			editor.setPosition(pos);
		  }
		  
		  var txt = editor.getValue()
		  //console.log(txt)
		
		  editor.saveMyStuff(txt)
		  
		  
		});
		
		editor.onKeyUp((e) => {
		  //console.log('Key up:', e.browserEvent.key);
		  boss.iframeB.runCode(editor)
		});
		
		
			
	}
	
	function setupEdiC(obj){
		var c = $(obj.c)
		var wrap = $(obj.wrap)
		var grab = $(obj.grab)
		var titleC = $(obj.titleC)
		
		
		var lang = obj.edi.getModel().getLanguageId()
		var iconD = boss.leftMBoss.addD($(".leftM"),icons.getCode("1.8em",lang),"show/hide "+lang +" editor")
		
		var o ={
			show:function(){
				$(obj.p).removeClass("none")
				iconD.addClass("togBlu")
			},
			
			hide:function(){
				$(obj.p).addClass("none")
				iconD.removeClass("togBlu")
			}
			
		}
		
	
		
		var tog =helper.setupTogShowHide(iconD, o )
		tog.show()
		
		
		var dragged = false
		
		wrap.resizable({
			start:function(){
				boss.iframeB.overlayOn()
				boss.setTopD(wrap)
			},
			resize:function(){
				
				if(!dragged){
					$(obj.p).height($(this).height())
					$(obj.p).width($(this).width())
				}
			},
			stop:function(){
				boss.iframeB.overlayOff()
			}
		})
		grab.draggable({
			start:function(){
				boss.setTopD(wrap)
				boss.iframeB.overlayOn()
				dragged = true
			},
			stop:function(){
				boss.iframeB.overlayOff()
			}
			
			
		})
		
		
		
		
		var title = obj.edi.getModel().getLanguageId()
		
		
		
		
		titleC.prepend("<div class='w100p cursor flex bgDark'>"
			+"<div class='flex alignMe pad0p4em'>"
				+icons.getCode("2em",title)
				+"<div class='title'>"+title+"</div>"
			+"</div>"
			+"<div class='flex1 overflow'>"
				+"<div class='tabs h100p w100p'></div>"
			+"</div>"
		+"</div>")
		
		titleC.on('mouseenter',function(){
			grab.draggable('disable')
		}).on('mouseleave',function(){
			grab.draggable('enable')
		})
		
		c.on('mouseenter',function(){
			grab.draggable('disable')
		}).on('mouseleave',function(){
			grab.draggable('enable')
		})
		
		var tabs = titleC.find(".tabStuff")
		
		var tabM =''
		if(title === "javascript"){
			
			tabM = boss.jsTabs.addTabs(obj,titleC)
			
			console.log(tabM)
		}
		
		boss.addEdi(obj.edi,title,tabM,obj)
		
	}
});



boss.iframeB = {d:"",code:"",
	addD:function(d){
		
		$(d).append("<div class='w0 h0'><div class='pad1em grab wFit'><div class='w30em h17em minH10em minW14em flex column bgDark  bor cont borCol31'>"
			+"<div class='overlayD '></div>"
			+"<iframe  src='iframe.html' class='w100p h100p iframe noBor' ></iframe>"
		+"</div></div></div>")
		this.d = $(d).find(".iframe")
	
		var iframe = this.d[0]
		
		var cont = $(d).find(".cont")
		var drag = $(d)
		cont.resizable({
			start:function(){
				boss.setTopD($(d))
				boss.iframeB.overlayOn()
			},
			
			stop:function(){
				boss.iframeB.overlayOff()
			}
		})
		drag.draggable({
			start:function(){
				boss.setTopD($(d))
				boss.iframeB.overlayOn()
			},
			
			stop:function(){
				boss.iframeB.overlayOff()
			}
		})
		
		this.overlayD = $(d).find(".overlayD")
		
		
		window.addEventListener("message", e => {
			if (e.source !== iframe.contentWindow) return;

			const data = e.data;
			if (!data || typeof data !== "object") return;
				
			switch (data.type) {
				case "iframe-ready":
				  
				  boss.iframeB.sendCode();
				  break;

				case "log":
				  boss.consoleB.addD({
					type: "log",
					level: data.level,
					args: data.args,
					source: data.source,
					line: data.line
				  });
				  break;

				case "error":
				  boss.consoleB.addD({
					type: "error",
					message: data.message,
					source: data.source,
					line: data.line
				  });
				  break;

				default: break;
			  }
			 if(boss.iframeB.edi){
				
				//boss.iframeB.edi.setPosition({ lineNumber: 1, column: 1 });
				boss.iframeB.edi.focus() 
			 }
		  
		});

	},
	
	overlayOn: function(){
		this.overlayD.addClass("overlay")
	},
	
	overlayOff:function(){
		this.overlayD.removeClass("overlay")
	},
	
	findScript:function(txt){
	
		var arr = this.code.scripts
		
		for(var x =0; x < arr.length; x++){
			if(txt.indexOf(arr[x].name) !== -1){
				//console.log(arr[x].name)
			}
		}
	},
	
	sendCode:function(){
	   
	    this.d[0].contentWindow.postMessage({
	        type:"run",
	        html:this.code.html,
	        css:this.code.css,
	        scripts:this.code.scripts
	    }, "*");

	},
	
	runCode: async function(){

	   
	
	    if(!boss.autoB.isOn()) return
	
	    const o = await boss.dbBoss.getCode()
	
	    this.code = await this.filterCode(o.tabs)
		
	    const iframe = this.d[0]
	
	    iframe.src = iframe.src
	
	    iframe.onload = () => {
	
	        this.sendCode()
	
	    }
	},
	
	filterCode: async function(arr){

	    const order = await boss.srcChecker.getJsOrder()
	
	    const out = {
	        html:"",
	        css:"",
	        scripts:[]
	    }
	
	    for(let x=0; x<arr.length; x++){
	
	        const type = arr[x].type
	
	        if(type==="html") out.html = arr[x].data
	        if(type==="css")  out.css  = arr[x].data
	
	    }
	
	    // add javascript files in correct order
	    for(let x=0; x<order.length; x++){
	
	        const file = order[x]
	
	        out.scripts.push({
	            name:file.name || "js"+x,
	            data:file.data
	        })
	
	    }

    	return out

	}
	
	
}


boss.resetEdiPos = function(){
	
	var arr = this.edis
	for(var x =0; x < arr.length; x++){
		//arr[x].edi.posD
		var o = arr[x].obj
		this.setEdiPos(o.wrap,o.posD)
	}
	
}


boss.setEdiPos = function(ediD,d){
	
	
	var targetPos = d.position();
   $(ediD).css({
        position: "relative",
        top: targetPos.top,
        left: targetPos.left
    });
	
	
}














