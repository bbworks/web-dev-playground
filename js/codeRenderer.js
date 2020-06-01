(function() {
  const codeRendererStyleSheet = document.styleSheets[4];
  const rendererClassName = "code-renderer";
  const codeRenderer = document.getElementById(rendererClassName);
  const formatterHTML = document.getElementById("code-formatter-html");
  const formatterCSS = document.getElementById("code-formatter-css");
  const textareaHTML = document.getElementById("code-formatter-textarea-html");
  const textareaCSS = document.getElementById("code-formatter-textarea-css");

  const updateRenderer = function() {
    //Use DOMPurify (npm) to sanitize our input
    const sanitizedCode = DOMPurify.sanitize(textareaHTML.value);
    codeRenderer.innerHTML = sanitizedCode;
  };

  const parseCSS = function() {
    const regEx = /([\w\[\]_]+)\s*{((\r|\n|[^}])*)}/;
    const regExGlobal = new RegExp(regEx,"g");
    const matches = textareaCSS.value.match(regExGlobal);

    if (matches) {
      let returnObject = [];
      for (let i in matches) {
        const matchGroups = matches[i].match(regEx);
        returnObject.push({
          selector: matchGroups[1],
          cssText: matchGroups[0],
        });
      }
      return returnObject;
    }
    return false;
  };

  const removeCSSRules = function (selectorText) {
    const regEx = new RegExp('#'+rendererClassName+' \\w');
    for (let i = 0; i < codeRendererStyleSheet.rules.length; i++) {
      const item = codeRendererStyleSheet.rules[i];
      if (item.selectorText.match(regEx)) {
        codeRendererStyleSheet.deleteRule(i);
      }
    }
  };

  const applyCSS = function() {
    removeCSSRules();
    const cssRules = parseCSS();
    for(let i in cssRules) {
      const cssRule = cssRules[i];
      codeRendererStyleSheet.insertRule("#"+rendererClassName+" "+cssRule.cssText, codeRendererStyleSheet.rules.length-1);
    }
  };

  const updateFormatter = function(event, language) {
    switch (language) {
      case "HTML": {
        formatterHTML.innerHTML = this.value.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/ /g,"&nbsp;").replace(/(\r\n|\r|\n)/g,"<br />").replace(/(<br\s*\/?>\s*)(?=(\1|$))/gi, "$1&nbsp;").replace(/("[^"]*("|))/gi, "<span class=\"code-formatter-span-class-text\">$1</span>").replace(/(&lt;(\/|))(&nbsp;|)+(\w+)((&nbsp;|)+[\w-]+|)/gi, "$1<span class=\"code-formatter-span-class-tag\">$4</span><span class=\"code-formatter-span-class-attribute\">$5</span>").replace(/(&lt;\s*\w+)\s+(\w+)/gi, "$1<span style=\"color:orange\">$2</span>").replace(/(&lt;!((?!&gt;).)*&gt;)/gi, "<span class=\"code-formatter-span-class-doctype\">$1</span>");
        break;
      }
      case "CSS": {
        formatterCSS.innerHTML = this.value.replace(/ /g,"&nbsp;").replace(/("[^"]*("|))/gi, "<span class=\"code-formatter-span-class-text\">$1</span>").replace(/\b(a|abbr|acronym|address|area|article|aside|audio|b|bdi|bdo|big|blink|blockquote|body|br|button|canvas|caption|center|cite|code|col|colgroup|content|data|datalist|dd|decorator|del|details|dfn|dir|div|dl|dt|element|em|fieldset|figcaption|figure|font|footer|form|h1|h2|h3|h4|h5|h6|head|header|hgroup|hr|html|i|img|input|ins|kbd|label|legend|li|main|map|mark|marquee|menu|menuitem|meter|nav|nobr|ol|optgroup|option|output|p|picture|pre|progress|q|rp|rt|ruby|s|samp|section|select|shadow|small|source|spacer|span|strike|strong|style|sub|summary|sup|table|tbody|td|template|textarea|tfoot|th|thead|time|tr|track|tt|u|ul|var|video|wbr)\b(.*\{)/gi, "<span class=\"code-formatter-span-class-tag\">$1</span>$2").replace(/(\r\n|\r|\n)/g,"<br />").replace(/(\.[\w-]+)/gi, "<span class=\"code-formatter-span-class-class\">$1</span>").replace(/(#[\w-]+)/gi, "<span class=\"code-formatter-span-class-id\">$1</span>").replace(/(:(&nbsp;|))(\d+[\d\w-%\.&;]+);/gi, "$1<span class=\"code-formatter-span-class-numbers\">$3</span>;");
        break;
      }
    }
  };

  const scrollFormatter = function(event, formatter) {
    formatter.scrollTop = this.scrollTop;
    formatter.scrollLeft = this.scrollLeft;
  };

  textareaHTML.addEventListener("input", updateRenderer);
  textareaCSS.addEventListener("input", applyCSS);
  textareaHTML.addEventListener("input", function(event) {updateFormatter.call(this, event, "HTML")});
  textareaCSS.addEventListener("input", function(event) {updateFormatter.call(this, event, "CSS")});
  textareaHTML.addEventListener("scroll", function(event) {scrollFormatter.call(this, event, formatterHTML)});
  textareaCSS.addEventListener("scroll", function(event) {scrollFormatter.call(this, event, formatterCSS)});

}());
