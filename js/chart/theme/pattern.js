jui.define("chart.theme.pattern", [], function() {

    /**
     * @class chart.theme.pattern
     * Pattern Theme
     * @singleton
     */
    var themeColors = [
        "pattern-jennifer-01",
        "pattern-jennifer-02",
        "pattern-jennifer-03",
        "pattern-jennifer-04",
        "pattern-jennifer-05",
        "pattern-jennifer-06",
        "pattern-jennifer-07",
        "pattern-jennifer-08",
        "pattern-jennifer-09",
        "pattern-jennifer-10",
        "pattern-jennifer-11",
        "pattern-jennifer-12"
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

        /** @cfg Grid Border Dash Array */
        gridBorderDashArray : "none",


        /** @cfg Grid Rect Color */
        gridRectColor : "#ababab",

        /** */
        gridAxisBorderColor : "#ebebeb",
        /** */
        gridAxisBorderWidth : 2,

        /** */
        gridActiveBorderColor : "#ff7800",

        /** Grid Border Color */
        gridBorderColor : "#ebebeb",

        /** Grid Border Width */
        gridBorderWidth : 1,

        /** @cfg  Grid Bar Size */
        gridTickSize : 3,

        gridTickPadding : 5,

        gridTickBorderWidth : 1.5,

        // brush styles
        /** */
        tooltipPointRadius : 5, // common
        /** */
        tooltipPointBorderWidth : 1, // common
        /** */
        tooltipPointFontWeight : "bold", // common
        /** */
        barBorderColor : "black",
        /** */
        barBorderWidth : 1,
        /** */
        barBorderOpacity : 1,
        /** */
        barBorderRadius : 5,
        /** */
        barActiveBackgroundColor : "#06d9b6",
        /** */
        barPointBorderColor : "white",
        /** */
        barDisableBackgroundOpacity : 0.4,
        /** */
        gaugeBackgroundColor : "#ececec",
        /** */
        gaugeArrowColor : "#666666",
        /** */
        gaugeFontColor : "#666666",
        /** */
        gaugeFontSize : "20px",
        /** */
        gaugeFontWeight : "bold",
        /** */
        gaugeTitleFontSize : "12px",
        /** */
        gaugeTitleFontWeight : "normal",
        /** */
        gaugeTitleFontColor : "#333",
        /** */
        pieBorderColor : "white",
        /** */
        bargaugeBackgroundColor : "#ececec",
        /** */
        bargaugeFontSize : "11px",
        /** */
        bargaugeFontColor : "#333333",
        /** */
        pieBorderWidth : 1,
        /** */
        pieOuterFontSize : "11px",
        /** */
        pieOuterLineColor : "#a9a9a9",
        /** */
        pieOuterLineSize : 8,
        /** */
        pieOuterLineRate : 1.3,
        /** */
        pieActiveDistance : 5,
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
        lineBorderDashArray : "none",
        /** */
        lineDisableBorderOpacity : 0.3,
        /** */
        linePointBorderColor : "white",
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

        topologyNodeRadius : 12.5,
        topologyNodeFontSize : "14px",
        topologyNodeFontColor : "white",
        topologyNodeTitleFontSize : "11px",
        topologyNodeTitleFontColor : "#333",
        topologyEdgeColor : "#b2b2b2",
        topologyActiveEdgeColor : "#905ed1",
        topologyEdgeFontSize : "10px",
        topologyEdgeFontColor : "#666",
        topologyEdgePointRadius : 3,
        topologyTooltipBackgroundColor : "white",
        topologyTooltipBorderColor : "#ccc",
        topologyTooltipFontSize : "11px",
        topologyTooltipFontColor : "#333",

        // widget styles

        titleFontColor : "#333",
        titleFontSize : "13px",
        titleFontWeight : "normal",
        legendFontColor : "#333",
        legendFontSize : "12px",
        legendIconRadius : 6,
        tooltipFontColor : "#333",
        tooltipFontSize : "12px",
        tooltipBackgroundColor : "white",
        tooltipBorderColor : "#aaaaaa",
        tooltipBackgroundOpacity : 0.7,
        scrollBackgroundSize : 7,
        scrollBackgroundColor : "#dcdcdc",
        scrollThumbBackgroundColor : "#b2b2b2",
        scrollThumbBorderColor : "#9f9fa4",
        zoomBackgroundColor : "red",
        zoomFocusColor : "gray",
        zoomScrollBackgroundSize : 50,
        zoomScrollBackgroundColor : "#000",
        zoomScrollFocusColor : "#fff",
        zoomScrollBrushColor : "#000",
        crossBorderColor : "#a9a9a9",
        crossBorderWidth : 1,
        crossBorderOpacity : 0.8,
        crossBalloonFontSize : "11px",
        crossBalloonFontColor : "white",
        crossBalloonBackgroundColor : "black",
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