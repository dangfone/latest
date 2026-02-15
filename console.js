boss.setupConsole = function(icon) {
  const conB = {data:[],
    setup: function() {
		const d = $(".hMenuD");
		const s = "1em";
		const o = boss.menuB.createM(d, icons.getConsole(s), "console", s);
		this.o = o;
		o.d.addClass("overflow h15em")
		
		helper.setupTogShowHide(icon, conB, o.exit).hide()
		
		helper.setPosToP(o.d, icon, 0, 50);
		o.main.append("<div class='filter '></div>")
		this.setupFilter(o.main.find(".filter"))
		this.mainD = $("<div class='h100p scrollY '></div>")
		o.main.append(this.mainD)
		
		
		o.main.on('mouseenter',function(){
			o.d.draggable({ disabled: true });
		}).on('mouseleave',function(){
			o.d.draggable({ disabled: false });
		})
		
    },
	
	show:function(){
		icon.addClass("togBlu")
		this.o.d.removeClass("none")
		boss.setTopD(this.o.d)
	},
	
	hide:function(){
		icon.removeClass("togBlu")
		this.o.d.addClass("none")
	},
	
	setupFilter:function(d){
		var s = "1em"
		var m = boss.menuB.createSrhD(d,icons.getTrash(s),"Clear" ,icons.getFilter(s),"Filter..")
		console.log(m)
		m.clear.on('click',function(){
			conB.mainD.empty()
		})
		
		m.inp.on('keyup',function(){
			conB.filter($(this).val())
		})
		
	},

    filter:function(txt){
		var arr = this.data
		console.log(x)
		console.log(arr)
		for(var x = 0; x < arr.length; x++){
			
			
			if(this.checkObj(arr[x],txt)){
				arr[x].d.removeClass("none")
			}else{
				arr[x].d.addClass("none")
			}
		} 
	},
	
	checkObj:function(obj,txt){
		console.log(obj)
		if(obj.raw.includes(txt)){
			return true
		}
		
		if(obj.info.line == txt){
			return true
		}
		
		return false
	},
	

    addD: function(data, $d) {
      if (!$d) $d = this.mainD; // jQuery container
		var raw = this.extractRawText(data)
	  console.log(raw)
      const $container = $("<div></div>"); // outer container for one log/error

      if (data.type === "log") {
        this.addLog(data.level, data.args, data.source, data.line, $container);
      } else if (data.type === "error") {
        this.addError(data.message, data.source, data.line, $container);
      }

      $d.append($container);
	console.log(data)
	console.log($container)
      this.data.push({d:$container,info:data,raw:raw})
    },
	
	extractRawText: function(data) {
  if (!data) return "";

  if (data.type === "error") {
    return `Error: ${data.message || ""}`;
  }

  if (data.type === "log" && Array.isArray(data.args)) {
    return data.args.map(arg => this.stringifyArg(arg)).join(" ");
  }

  return "";
},
	
	stringifyArg: function(arg) {
  if (!arg) return "null";

  switch (arg.__type) {
    case "primitive":
      return typeof arg.value === "string"
        ? `"${arg.value}"`
        : String(arg.value);

    case "function":
      return `ƒ ${arg.name || "anonymous"}()`;

    case "object": {
      const name = arg.className || "Object";
      const props = arg.props
        ? Object.entries(arg.props)
            .map(([k,v]) => `${k}: ${this.stringifyArg(v)}`)
            .join(", ")
        : "";
      return `${name} { ${props} }`;
    }

    default:
      return "[unknown]";
  }
},
	
	
	addLog: function(level, args, source, line, $container) {
    const $content = $('<div></div>')
        .addClass('log-content')
        .css({
            'font-family': 'monospace',
            'color': '#d4d4d4',
            'background': '#1e1e1e',
            'padding': '4px 8px',
            'border-radius': '4px',
            'margin-bottom': '6px',
            'position': 'relative'
        });

    const renderArg = (arg, depth = 0) => {
        if (!arg) return $('<span>null</span>').css('color','#9cdcfe');

        switch(arg.__type) {
            case 'primitive':
                const val = arg.value;
                let color = '#d4d4d4';
                if (typeof val === 'string') color = '#ce9178';
                else if (typeof val === 'number') color = '#b5cea8';
                else if (typeof val === 'boolean') color = '#569cd6';
                else if (val === null) color = '#569cd6';
                return $('<span></span>').text(typeof val === 'string' ? `"${val}"` : val).css('color', color);

            case 'function':
                const $fn = $('<span></span>')
                    .text(`ƒ ${arg.name}() {…}`)
                    .css({ cursor: 'pointer', color: '#dcdcaa' });

                $fn.on('click', () => {
                    if ($fn.next().hasClass('function-body')) $fn.next().toggle();
                    else {
                        const $body = $('<pre></pre>')
                            .addClass('function-body')
                            .text(arg.body)
                            .css({
                                'margin-left': '20px',
                                'background': '#252526',
                                'padding': '4px',
                                'border-radius': '3px',
                                'white-space': 'pre-wrap',
                                'color':'#dcdcaa'
                            });
                        $fn.after($body);
                    }
                });
                return $fn;

            case 'object':
                const isArray = Array.isArray(arg.props);
                let displayName = arg.className;
                if (isArray) displayName = `Array[${Object.keys(arg.props || {}).length}]`;

                const $wrapper = $('<span></span>'); // inline wrapper
                const $label = $('<span></span>')
                    .text(`${displayName} { `)
                    .css({ cursor: 'pointer', color: '#4ec9b0' });

                $wrapper.append($label);

                const $props = $('<span></span>'); // inline properties container

                const entries = arg.props && typeof arg.props === 'object'
                    ? Object.entries(arg.props)
                    : [];

                entries.forEach(([key, val], i) => {
                    const $key = $('<span></span>').text(`${key}: `).css('color','#9cdcfe');
                    const $val = renderArg(val, depth + 1);
                    $props.append($key).append($val);
                    if (i < entries.length - 1) $props.append(', '); // comma between properties
                });

                $wrapper.append($props);
                $wrapper.append(' }').css({ cursor: 'pointer', color: '#4ec9b0' });

                // click to toggle first-level object properties
                $label.on('click', () => {
                    $props.toggle();
                });

                return $wrapper;

            default:
                return $('<span></span>').text('[unknown]').css('color','#808080');
        }
    };

    args.forEach(arg => {
        $content.append(renderArg(arg)).append(' ');
    });

    // Script and line info below, aligned right
    const $sourceInfo = $('<div></div>')
        .text(`${source || 'unknown'}:${line || '?'}`)
        .css({
            'text-align': 'right',
            'color': '#3794ff',
            'cursor': 'pointer',
            'font-size': '0.8em',
            'margin-top': '2px',
            'text-decoration': 'underline'
        });

    $container.append($content).append($sourceInfo);
},









    

    addError: function(message, file, line, $container) {
      if (!$container) return;
      const $line = $("<pre></pre>")
        .css({ margin: 0, padding: "2px 4px", color: "red", fontWeight: "bold" })
        .text(`[ERROR] (${file || "unknown"}:${line || "?"}) ${message}`);

      $container.append($line);
    }
  
  }
  conB.setup();
  this.consoleB = conB;
};

/* =========================================================
   Serialization helpers
========================================================= */
function serialize(arg) {
  if (typeof arg === "object" && arg !== null) {
    try {
      return JSON.stringify(arg, getCircularReplacer(), 2);
    } catch {
      return "[Object]";
    }
  }
  return String(arg);
}

function getCircularReplacer() {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return "[Circular]";
      seen.add(value);
    }
    return value;
  };
}