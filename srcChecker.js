boss.setupSrcChecker = function(){
	var chk = {
		check: async function(id){
			//get html code plus list of script names
			var o = await boss.dbBoss.getCode(id)
			console.log(o)
			var html = o.tabs.filter((ele) => ele.type ==="html")
			var js = o.tabs.filter((ele) => ele.type ==="javascript")
			if(!this.htmlHasSrc(html[0].data,js)){
				this.addScripts(html[0].data,js)
			}
		},
		
		htmlHasSrc: function(html,jsArr){
			for(var x = 0; x < jsArr.length; x++){
				if(html.indexOf(jsArr[x].name) ===-1 ){
					return false
				}
			}
			return true
		},
		
		addScripts:function(html,jsArr){
			console.log(html.length)
			var i = this.findHead(html)
			console.log(i)
			var htmlEdi = boss.findEdi("html")
			console.log(htmlEdi)
			//var htmlCode = htmlEdi.getValue()
			var txt 
			if(i ===-1){
				if(html.length ===0){
					txt = this.addBasicHtml(this.makeScriptText(jsArr))
					console.log(txt)
					htmlEdi.edi.load(txt)
				}else{
					this.addMissingScripts(html,jsArr,htmlEdi)
				}
			}else{
				this.addMissingScripts(html,jsArr,htmlEdi)
			}
		},
		
		addMissingScripts:function(html,jsArr,edi){
			
			var missing = this.hasScripts(html,jsArr)
			console.log(missing)
			var txt = this.makeScriptText(missing)
			var x =0
			var y =0
			if(missing.length !== jsArr.length){
				x = this.findLastLine(html,"</script>")
			}
			
			
			var edi = boss.findEdi("html").edi
			
			this.addTxtAt(x,y,edi,txt)
			
			
		},
		
		findLastLine:function(html,txt){
			const index = html.lastIndexOf(txt);
			if (index === -1) return -1; // Not found
			 const lines = html.substring(0, index).split('\n');
			  return lines.length+1; // Line numbers start at 1
		},
		
		findLine:function(html,txt){
			const index = html.indexOf(txt);
			 if (index === -1) return -1; // Not found
			 const lines = html.substring(0, index).split('\n');
			  return lines.length+1; // Line numbers start at 1
		},
		
		addTxtAt:function(x,y,edi,txt){
			console.log(edi)
			const position = { lineNumber: x, column: y };

			// Create a range from the position to itself (insertion point)
			const range = new monaco.Range(
				position.lineNumber,
				position.column,
				position.lineNumber,
				position.column
			);

			// Define the edit operation
			const editOperation = {
				range: range,
				text: txt,
				forceMoveMarkers: true // Optional: ensures cursor markers move correctly
			};

			// Execute the edit
			edi.executeEdits("my-source", [editOperation]);
		},
		
		addBasicHtml:function(scripts){
			return "<!DOCTYPE html> \n"
				+"<html>\n"
				+"<head>\n"
				+scripts
				+"\n"
				+"</head>\n"
				+"<body>\n"
				+"</body>\n"
				+"</html>"
		},
		
		makeScriptText:function(arr){
			console.log(arr)
			var txt =''
			for(var x =0; x < arr.length; x++){
				txt+='<script src="'+arr[x].name+'"></script>\n'
			}
			return txt
		},
		
		findTag: function(html,tag){
			return html.indexOf(tag)
		},
		
		findHead:function(html){
			return html.indexOf("</head>")
		},
		
		hasScripts: function(html,arr){
			var res =[]
			for(var x=0; x< arr.length; x++){
				if(html.indexOf(arr[x].name) === -1){
					res.push(arr[x])
				}
			}
			return res
		},
		
		getJsOrder: async function(id){
			var o = await boss.dbBoss.getCode(id)
			var html = o.tabs.filter((ele) => ele.type === "html")[0]
			var arr = o.tabs.filter((ele) => ele.type === "javascript")
			var res =[]
			for(var x =0; x < arr.length; x++){
				 
				if(x ===0){
					res.push(arr[x])
				}else{
					for(var y =0; y < res.length; y++){
						if(html.data.indexOf(res[y].name) > html.data.indexOf(arr[x].name)){
							res.splice(y,0,arr[x])
							break
						}else{
							if(y === res.length-1){
								res.push(arr[x])
								break
							}
						}
					}
				}
			}
			
			return res
		}
	}
	this.srcChecker = chk
}