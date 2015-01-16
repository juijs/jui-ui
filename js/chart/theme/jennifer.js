/**
 * @class chart.theme.jennifer
 * Jennifer Theme
 * @singleton
 */
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
        /** Chart Background Color */
    	backgroundColor : "white",
        /** Base Font Size */
    	fontSize : "11px",
        /** Base Font Color  */
    	fontColor : "#333333",
        /** Base Font Family */
		fontFamily : "arial,Tahoma,verdana",
        /** Color List  */
        colors : themeColors,

        // grid styles
        /** Grid Font Color */
    	gridFontColor : "#333333",
        /** Grid Active Font color */
    	gridActiveFontColor : "#ff7800",
        /** Grid Border Color */
        gridBorderColor : "#ebebeb",
        /** Grid Border Width */
    	gridBorderWidth : 1,
        /** Grid Border Dash Array */
        gridBorderDashArray : "none",
        /** */
		gridAxisBorderColor : "#ebebeb",
        /** */
		gridAxisBorderWidth : 1,
        /** */
    	gridActiveBorderColor : "#ff7800",
        /** */
    	gridActiveBorderWidth: 1,

        // brush styles
        /** */
        tooltipPointRadius : 5, // common
        /** */
        tooltipPointBorderWidth : 1, // common
        /** */        
        tooltipPointFontWeight : "bold", // common
        /** */
        barBorderColor : "none",
        /** */        
        barBorderWidth : 0,
        /** */
        barBorderOpacity : 0,
        /** */
        barBorderRadius : 3,
        /** */        
        barCircleBorderColor : "white",
        /** */
        barDisableBackgroundOpacity : 0.4,
        /** */        
    	gaugeBackgroundColor : "#ececec",
        /** */        
        gaugeArrowColor : "#666666",
        /** */        
        gaugeFontColor : "#666666",
        /** */        
    	pieBorderColor : "white",
        /** */        
        pieBorderWidth : 1,
        /** */
        donutBorderColor : "white",
        /** */
        donutBorderWidth : 1,
        /** */
    	areaBackgroundOpacity : 0.5,
        /** */
        areaSplitBackgroundColor : "#929292",
        /** */
        bubbleBackgroundOpacity : 0.5,
        /** */
        bubbleBorderWidth : 1,
        /** */
        candlestickBorderColor : "black",
        /** */
        candlestickBackgroundColor : "white",
        /** */
        candlestickInvertBorderColor : "red",
        /** */
        candlestickInvertBackgroundColor : "red",
        /** */
        ohlcBorderColor : "black",
        /** */
        ohlcInvertBorderColor : "red",
        /** */
        ohlcBorderRadius : 5,
        /** */
        lineBorderWidth : 2,
        /** */
        lineDisableBorderOpacity : 0.3,
        /** */
        lineCircleBorderColor : "white",
        /** */
        lineSplitBorderColor : null,
        /** */
        lineSplitBorderOpacity : 0.5,
        /** */
        pathBackgroundOpacity : 0.5,
        /** */
        pathBorderWidth : 1,
        /** */
        scatterBorderColor : "white",
        /** */
        scatterBorderWidth : 1,
        /** */
        scatterHoverColor : "white",
        /** */
        waterfallBackgroundColor : "#87BB66",
        /** */
        waterfallInvertBackgroundColor : "#FF7800",
        /** */
        waterfallEdgeBackgroundColor : "#7BBAE7",
        /** */
        waterfallLineColor : "#a9a9a9",
        /** */
        waterfallLineDashArray : "0.9",
        /** */
        focusBorderColor : "#FF7800",
        /** */
        focusBorderWidth : 1,
        /** */
        focusBackgroundColor : "#FF7800",
        /** */
        focusBackgroundOpacity : 0.1,
        /** */
        pinFontColor : "#FF7800",
        /** */
        pinFontSize : "10px",
        /** */
        pinBorderColor : "#FF7800",
        /** */
        pinBorderWidth : 0.7,
        /** */
        // widget styles

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