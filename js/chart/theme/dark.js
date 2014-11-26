jui.define("chart.theme.dark", [], function() {

    var themeColors = [
        "#12f2e8",
        "#26f67c",
        "#e9f819",
        "#b78bf9",
        "#f94590",
        "#8bccf9",
        "#9228e4",
        "#06d9b6",
        "#fc6d65",
        "#f199ff",
        "#c8f21d",
        "#16a6e5",
        "#00ba60",
        "#91f2a1",
        "#fc9765",
        "#f21d4f"
    ];

    return {
        // common styles
    	backgroundColor : "#222222",
    	fontSize : "12px",
    	fontColor : "#c5c5c5",
		fontFamily : "arial,Tahoma,verdana",
        colors : themeColors,

        // grid styles
    	gridFontColor : "#868686",
    	gridActiveFontColor : "#ff762d",
        gridBorderColor : "#464646",
        gridBorderWidth : 1,
        gridBorderDashArray : "none",
		gridAxisBorderColor : "#464646",
		gridAxisBorderWidth : 1,
    	gridActiveBorderColor : "#ff7800",
    	gridActiveBorderWidth: 1,

        // brush styles
        barBorderColor : "none",
        barBorderWidth : 0,
        barBorderOpacity : 0,
        columnBorderColor : "none",
        columnBorderWidth : 0,
        columnBorderOpacity : 0,
    	gaugeBackgroundColor : "#3e3e3e",
        gaugeArrowColor : "#a6a6a6",
        gaugeFontColor : "#c5c5c5",
    	pieBorderColor : "#232323",
        pieBorderWidth : 1,
        donutBorderColor : "#232323",
        donutBorderWidth : 1,
    	areaOpacity : 0.5,
        areaSplitBackgroundColor : "#ebebeb",
        bubbleOpacity : 0.5,
        bubbleBorderWidth : 1,
        candlestickBorderColor : "#14be9d",
        candlestickBackgroundColor : "#14be9d",
        candlestickInvertBorderColor : "#ff4848",
        candlestickInvertBackgroundColor : "#ff4848",
        ohlcBorderColor : "#14be9d",
        ohlcInvertBorderColor : "#ff4848",
        ohlcBorderRadius : 5,
        lineBorderWidth : 2,
        lineSplitBorderColor : null,
        lineSplitBorderOpacity : 0.5,
        pathOpacity : 0.2,
        pathBorderWidth : 1,
        scatterBorderColor : "none",
        scatterBorderWidth : 1,
        scatterHoverColor : "#222222",
        waterfallBackgroundColor : "#26f67c", //
        waterfallInvertBackgroundColor : "#f94590", // 3
        waterfallEdgeBackgroundColor : "#8bccf9", // 1
        waterfallLineColor : "#a9a9a9",
        waterfallLineDashArray : "0.9",

        // widget styles
        titleFontColor : "#ffffff",
        titleFontSize : "14px",
        legendFontColor : "#ffffff",
        legendFontSize : "11px",
        tooltipFontColor : "#333333",
        tooltipFontSize : "12px",
        tooltipBackgroundColor : "white",
        tooltipBorderColor : "white",
        tooltipOpacity : 1,
        scrollBackgroundColor : "#3e3e3e",
        scrollThumbBackgroundColor : "#666666",
        scrollThumbBorderColor : "#686868",
        zoomBackgroundColor : "red",
        zoomFocusColor : "gray",
        crossBorderColor : "#a9a9a9",
        crossBorderWidth : 1,
        crossBorderOpacity : 0.8,
        crossBalloonFontSize : "11px",
        crossBalloonFontColor : "#333",
        crossBalloonBackgroundColor : "white",
        crossBalloonOpacity : 1
    }	
});