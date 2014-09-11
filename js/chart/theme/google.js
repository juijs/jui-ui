jui.define("chart.theme.google", [], function() {
    var themeColors = [
		'#e2431e',
        '#e7711b',
        '#f1ca3a',
        '#6f9654',
        '#1c91c0',
        '#43459d'
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