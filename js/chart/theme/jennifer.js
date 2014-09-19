jui.define("chart.theme.jennifer", [], function() {
    var themeColors = [
        "#7977C2",
        "#7BBAE7",
        "#FFC000",
        "#FF7800",
        "#87BB66",
        "#1DA8A0",
        "#929292",
        "#555D69",
        "#0298D5",
        "#FA5559",
        "#F5A397",
        "#06D9B6",
        "#C6A9D9",
        "#6E6AFC",
        "#E3E766",
        "#C57BC3",
        "#DF328B",
        "#96D7EB",
        "#839CB5",
        "#9228E4"
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
		gridAxisBorderColor : "#ebebeb",
		gridAxisBorderWidth : 1,
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
        scatterBorderWidth : 1,

        // widget styles
        tooltipFontColor : "#333",
        tooltipFontSize : "12px",
        tooltipBackgroundColor : "white",
        tooltipBorderColor : "#aaaaaa"
    }
});