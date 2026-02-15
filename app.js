require(["vs/editor/editor.main"], function () {

  var p = document.getElementsByClassName("edisC")[0];

  // -----------------------------
  // Define custom theme
  // -----------------------------
  monaco.editor.defineTheme('solidLine', {
    base: 'vs-dark', 
    inherit: true,
    rules: [],
    colors: {
      'editor.lineHighlightBackground': '#3c3c3c', // solid active line
    
    'editorGutter.modifiedBackground': '#00000000'
    }
  });
  
  
monaco.languages.html.htmlDefaults.setOptions({
   suggest: { html5: true }
});
  

  // -----------------------------
  // Function to create editor
  // -----------------------------
  function createEdi({ language, initialValue = "", parent, theme = "solidLine" }) {
		const editorDiv = document.createElement("div");
		editorDiv.style.width = "100%";
		editorDiv.style.height = "200px";
		editorDiv.style.border = "1px solid #444";

		// Append to parent
		parent.appendChild(editorDiv);

		// Create Monaco editor
		const editor = monaco.editor.create(editorDiv, {
		  value: initialValue,             // FIXED: use initialValue
		  language: language,
		  theme: theme,                    // use argument theme
		  automaticLayout: true,
		  minimap: { enabled: false },
		  renderLineHighlight: "line",
		  matchBrackets: "never",
			autoClosingBrackets: 'always', // Essential for < > pairs
			autoClosingQuotes: 'always',
			formatOnType: true,
		autoSurround: "languageDefined"	
		});

		return editor;
	  }

	  // -----------------------------
	  // Create HTML editor
	  // -----------------------------
	  const htmlEditor = createEdi({
		language: "html",
		initialValue: "<h1>Hello HTML</h1>",
		parent: p,
		theme: "solidLine"
	  });
	  
	  const jsEditor = createEdi({
		language: "javascript",
		initialValue: "",
		parent: p,
		theme: "solidLine"
	  });
	
	setupEdiEvents(htmlEditor)
	
	const VOID_TAGS = new Set([
		  "area","base","br","col","embed","hr","img","input",
		  "link","meta","param","source","track","wbr"
	]);
	
	
	function setupEdiEvents(editor){
		

		editor.onDidChangeModelContent((e) => {
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
		});

		
	}
	
	
  
  

});


