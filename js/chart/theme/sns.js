jui.define("chart.theme.sns", [], function() {
    var themeColors = [
        "#3b5998", // facebook
        "#33ccff",  // twitter
        "#d34836",  // google plus 
        "#FE0000",  // youtube
        "#5989BA",  // digg
        "#1276FF",
        "#F7A42C",  // rss
        "#F5699A",
        "#85C441", // ever note 
        "#3C5A76", // tumblr
        "#5DC8FF", // vimeo
        "#F9F9FB", // instagram
        "#9CA3AB", // wordpress
    ];

    return {
        // common styles
    	backgroundColor : "white",
    	fontSize : "11px",
    	fontColor : "#333333",
		fontFamily : "arial,Tahoma,verdana",
        colors : themeColors,

        // grid styles
    	gridFontColor : "#333333",
    	gridActiveFontColor : "#ff7800",
    	gridBorderWidth : 1,
    	gridBorderColor : "#ececec",
		gridAxisBorderColor : "#aaaaaa",
		gridAxisBorderWidth : "2px",
    	gridActiveBorderColor : "#ff7800",
    	gridActiveBorderWidth: 1,

        // brush styles
    	gaugeBackgroundColor : "#ececec",
    	pieBorderColor : "white",
        pieBorderWidth : 1,
        donutBorderColor : "white",
        donutBorderWidth : 1,
    	areaOpacity : 0.5,
        bubbleOpacity : 0.5,
        bubbleBorderWidth : 1,
        candlestickBorderColor : "black",
        candlestickBackgroundColor : "white",
        candlestickInvertBorderColor : "red",
        candlestickInvertBackgroundColor : "red",
        lineBorderWidth : 2,
        pathOpacity : 0.5,
        pathBorderWidth : 1,
        scatterBorderColor : "white",
        scatterBorderWidth : 1
    }
});