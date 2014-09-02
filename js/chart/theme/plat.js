jui.define("chart.theme.plat", [], function() {
    var themeColors = [
        "#3A738A",
        "#EBD9A7",
        "#89AD78",
        "#FF766D",
        "#C76160",
        "#3D7799",
        "#90B8CC",
        "#A7FFC6",
        "#FF7A62",
        "#CC6462"
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
        pathOpacity : 0.2,
        pathBorderWidth : 1,
        scatterBorderColor : "white",
        scatterBorderWidth : 1
    }
});