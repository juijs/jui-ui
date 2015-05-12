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
        /** @cfg  */
    	backgroundColor : "white",
        /** @cfg  */
    	fontSize : "11px",
        /** @cfg   */
    	fontColor : "#333333",
        /** @cfg  */
		fontFamily : "arial,Tahoma,verdana",
        /** @cfg   */
        colors : themeColors,

        /** @cfg Grid Font Color */
    	gridFontColor : "#333333",
        /** @cfg Grid Active Font color */
    	gridActiveFontColor : "#ff7800",

        /** @cfg Grid Rect Color */
        gridRectColor : "#ababab",

        /** @cfg Grid Border Color */
        gridBorderColor : "#ebebeb",
        /** @cfg Grid Border Width */
    	gridBorderWidth : 1,

        /** @cfg */
        gridActiveBorderColor : "#ff7800",

        /** @cfg */
        gridAxisBorderColor : "#bfbfbf",
        /** @cfg */
        gridAxisBorderWidth : 2,

        /** @cfg  Grid Bar Size */
        gridTickSize : 3,
        gridTickBorderWidth : 1.5,
        gridTickPadding : 5,

        /** @cfg Grid Border Dash Array */
        gridBorderDashArray : "none",

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
        barPointBorderColor : "white",
        /** @cfg */
        barDisableBackgroundOpacity : 0.4,
        /** @cfg */        
    	gaugeBackgroundColor : "#ececec",
        /** @cfg */        
        gaugeArrowColor : "#666666",
        /** @cfg */        
        gaugeFontColor : "#666666",
        /** @cfg */
        gaugeFontSize : "20px",
        /** @cfg */
        gaugeFontWeight : "bold",
        /** @cfg */
        gaugeTitleFontSize : "12px",
        /** @cfg */
        gaugeTitleFontWeight : "normal",
        /** @cfg */
        gaugeTitleFontColor : "#333",
        /** @cfg */
        bargaugeBackgroundColor : "#ececec",
        /** @cfg */
        bargaugeFontSize : "11px",
        /** @cfg */
        bargaugeFontColor : "#333333",

        /** @cfg */
    	pieBorderColor : "#ececec",
        /** @cfg */        
        pieBorderWidth : 1,
        /** @cfg */
        pieOuterFontSize : "11px",
        /** @cfg */
        pieOuterLineColor : "#a9a9a9",
        /** @cfg */
        pieOuterLineSize : 8,
        /** @cfg */
        pieOuterLineRate : 1.3,
        /** @cfg */
        pieActiveDistance : 5,
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
        lineBorderDashArray : "none",
        /** @cfg */
        lineDisableBorderOpacity : 0.3,
        /** @cfg */
        linePointBorderColor : "white",
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
        topologyNodeRadius : 12.5,
        /** @cfg */
        topologyNodeFontSize : "14px",
        /** @cfg */
        topologyNodeFontColor : "white",
        /** @cfg */
        topologyNodeTitleFontSize : "11px",
        /** @cfg */
        topologyNodeTitleFontColor : "#333",
        /** @cfg */
        topologyEdgeColor : "#b2b2b2",
        /** @cfg */
        topologyActiveEdgeColor : "#905ed1",
        /** @cfg */
        topologyEdgeFontSize : "10px",
        /** @cfg */
        topologyEdgeFontColor : "#666",
        /** @cfg */
        topologyEdgePointRadius : 3,
        /** @cfg */
        topologyTooltipBackgroundColor : "white",
        /** @cfg */
        topologyTooltipBorderColor : "#ccc",
        /** @cfg */
        topologyTooltipFontSize : "11px",
        /** @cfg */
        topologyTooltipFontColor : "#333",

        /** @cfg */
        titleFontColor : "#333",
        /** @cfg */
        titleFontSize : "13px",
        /** @cfg */
        titleFontWeight : "normal",
        /** @cfg */
        legendFontColor : "#333",
        /** @cfg */
        legendFontSize : "12px",
        /** @cfg */
        legendIconRadius : 6,
        /** @cfg */
        tooltipFontColor : "#333",
        /** @cfg */
        tooltipFontSize : "12px",
        /** @cfg */
        tooltipBackgroundColor : "white",
        /** @cfg */
        tooltipBorderColor : "#aaaaaa",
        /** @cfg */
        tooltipBackgroundOpacity : 0.7,
        /** @cfg */
        scrollBackgroundSize : 7,
        /** @cfg */
        scrollBackgroundColor : "#dcdcdc",
        /** @cfg */
        scrollThumbBackgroundColor : "#b2b2b2",
        /** @cfg */
        scrollThumbBorderColor : "#9f9fa4",
        /** @cfg */
        zoomBackgroundColor : "red",
        /** @cfg */
        zoomFocusColor : "gray",
        /** @cfg */
        zoomScrollBackgroundSize : 50,
        /** @cfg */
        zoomScrollBackgroundColor : "#000",
        /** @cfg */
        zoomScrollFocusColor : "#fff",
        /** @cfg */
        zoomScrollBrushColor : "#000",
        /** @cfg */
        crossBorderColor : "#a9a9a9",
        /** @cfg */
        crossBorderWidth : 1,
        /** @cfg */
        crossBorderOpacity : 0.8,
        /** @cfg */
        crossBalloonFontSize : "11px",
        /** @cfg */
        crossBalloonFontColor : "white",
        /** @cfg */
        crossBalloonBackgroundColor : "black",
        /** @cfg */
        crossBalloonBackgroundOpacity : 0.5,

        // Map Common
        mapPathBackgroundColor : "#67B7DC",
        mapPathBackgroundOpacity : 1,
        mapPathBorderColor : "white",
        mapPathBorderWidth : 0,
        mapPathBorderOpacity : 0,
        // Map Brushes
        mapBubbleBackgroundOpacity : 0.5,
        mapBubbleBorderWidth : 1,
        mapSelectorColor : "#5a73db",
        mapSelectorActiveColor : "#CC0000",
        mapFlightRouteAirportSmallColor : "#CC0000",
        mapFlightRouteAirportLargeColor : "#000",
        mapFlightRouteAirportBorderWidth : 2,
        mapFlightRouteAirportRadius : 8,
        mapFlightRouteLineBorderColor : "red",
        mapFlightRouteLineBorderWidth : 1,
        // Map Widgets
        mapControlButtonColor : "#3994e2",
        mapControlScrollColor : "#000",
        mapControlScrollLineColor : "#fff"
    }
});