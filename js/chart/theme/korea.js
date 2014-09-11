jui.define("chart.theme.korea", [], function() {
    var themeColors = [
        "#2b2dc2",
        "#e90026",
        "#FFd200",
        "#00a358",
        "#00b5f1",
        "#fe5dcb",
        "#ff9600",
        "#80144c",
        "#0a2c76",
        "#7d45ad",
        "#fdd0cd",
        "#bfc1c3"
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