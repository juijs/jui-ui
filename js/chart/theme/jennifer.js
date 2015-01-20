jui.define("chart.theme.jennifer", [], function() {

    /**
     * @class chart.theme.jennifer
     * Jennifer Theme
     * @singleton
     */
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
        /** @cfg @cfg Chart Background Color */
    	backgroundColor : "white",
        /** @cfg Base Font Size */
    	fontSize : "11px",
        /** @cfg Base Font Color  */
    	fontColor : "#333333",
        /** @cfg Base Font Family */
		fontFamily : "arial,Tahoma,verdana",
        /** @cfg Color List  */
        colors : themeColors,

        // grid styles
        /** @cfg Grid Font Color */
    	gridFontColor : "#333333",
        /** @cfg Grid Active Font color */
    	gridActiveFontColor : "#ff7800",
        /** @cfg Grid Border Color */
        gridBorderColor : "#ebebeb",
        /** @cfg Grid Border Width */
    	gridBorderWidth : 1,
        /** @cfg Grid Border Dash Array */
        gridBorderDashArray : "none",
        /** @cfg */
		gridAxisBorderColor : "#ebebeb",
        /** @cfg */
		gridAxisBorderWidth : 1,
        /** @cfg */
    	gridActiveBorderColor : "#ff7800",
        /** @cfg */
    	gridActiveBorderWidth: 1,

        // brush-item styles
        /** @cfg */
        tooltipPointRadius : 5, // common
        /** @cfg */
        tooltipPointBorderWidth : 1, // common
        /** @cfg */        
        tooltipPointFontWeight : "bold", // common

        /** @cfg */
        barBorderColor : "none",
        /** @cfg */        
        barBorderWidth : 0,
        /** @cfg */
        barBorderOpacity : 0,
        /** @cfg */
        barBorderRadius : 3,
        /** @cfg */        
        barCircleBorderColor : "white",
        /** @cfg */
        barDisableBackgroundOpacity : 0.4,
        /** @cfg */        
    	gaugeBackgroundColor : "#ececec",
        /** @cfg */        
        gaugeArrowColor : "#666666",
        /** @cfg */        
        gaugeFontColor : "#666666",
        /** @cfg */        
    	pieBorderColor : "white",
        /** @cfg */        
        pieBorderWidth : 1,
        /** @cfg */
        donutBorderColor : "white",
        /** @cfg */
        donutBorderWidth : 1,
        /** @cfg */
    	areaBackgroundOpacity : 0.5,
        /** @cfg */
        areaSplitBackgroundColor : "#929292",
        /** @cfg */
        bubbleBackgroundOpacity : 0.5,
        /** @cfg */
        bubbleBorderWidth : 1,
        /** @cfg */
        candlestickBorderColor : "black",
        /** @cfg */
        candlestickBackgroundColor : "white",
        /** @cfg */
        candlestickInvertBorderColor : "red",
        /** @cfg */
        candlestickInvertBackgroundColor : "red",
        /** @cfg */
        ohlcBorderColor : "black",
        /** @cfg */
        ohlcInvertBorderColor : "red",
        /** @cfg */
        ohlcBorderRadius : 5,
        /** @cfg */
        lineBorderWidth : 2,
        /** @cfg */
        lineDisableBorderOpacity : 0.3,
        /** @cfg */
        lineCircleBorderColor : "white",
        /** @cfg */
        lineSplitBorderColor : null,
        /** @cfg */
        lineSplitBorderOpacity : 0.5,
        /** @cfg */
        pathBackgroundOpacity : 0.5,
        /** @cfg */
        pathBorderWidth : 1,
        /** @cfg */
        scatterBorderColor : "white",
        /** @cfg */
        scatterBorderWidth : 1,
        /** @cfg */
        scatterHoverColor : "white",
        /** @cfg */
        waterfallBackgroundColor : "#87BB66",
        /** @cfg */
        waterfallInvertBackgroundColor : "#FF7800",
        /** @cfg */
        waterfallEdgeBackgroundColor : "#7BBAE7",
        /** @cfg */
        waterfallLineColor : "#a9a9a9",
        /** @cfg */
        waterfallLineDashArray : "0.9",
        /** @cfg */
        focusBorderColor : "#FF7800",
        /** @cfg */
        focusBorderWidth : 1,
        /** @cfg */
        focusBackgroundColor : "#FF7800",
        /** @cfg */
        focusBackgroundOpacity : 0.1,
        /** @cfg */
        pinFontColor : "#FF7800",
        /** @cfg */
        pinFontSize : "10px",
        /** @cfg */
        pinBorderColor : "#FF7800",
        /** @cfg */
        pinBorderWidth : 0.7,
        /** @cfg */
        titleFontColor : "#333",
        titleFontSize : "13px",
        titleFontWeight : "normal",
        legendFontColor : "#333",
        legendFontSize : "12px",
        tooltipFontColor : "#333",
        tooltipFontSize : "12px",
        tooltipBackgroundColor : "white",
        tooltipBorderColor : "#aaaaaa",
        tooltipBackgroundOpacity : 0.7,
        scrollBackgroundColor : "#dcdcdc",
        scrollThumbBackgroundColor : "#b2b2b2",
        scrollThumbBorderColor : "#9f9fa4",
        zoomBackgroundColor : "red",
        zoomFocusColor : "gray",
        crossBorderColor : "#a9a9a9",
        crossBorderWidth : 1,
        crossBorderOpacity : 0.8,
        crossBalloonFontSize : "11px",
        crossBalloonFontColor : "white",
        crossBalloonBackgroundColor : "black",
        crossBalloonBackgroundOpacity : 0.5
    }
});