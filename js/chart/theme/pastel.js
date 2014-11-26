jui.define("chart.theme.pastel", [], function() {
	var themeColors = [
		"#73e9d2",
		"#fef92c",
		"#ff9248",
		"#b7eef6",
		"#08c4e0",
		"#ffb9ce",
		"#ffd4ba",
		"#14be9d",
		"#ebebeb",
		"#666666",
		"#cdbfe3",
		"#bee982",
		"#c22269"
	];

	return {
		// common styles
		backgroundColor : "white",
		fontSize : "11px",
		fontColor : "#333333",
		fontFamily : "Caslon540BT-Regular,Times,New Roman,serif",
		colors : themeColors,

		// grid styles
		gridFontColor : "#333333",
		gridActiveFontColor : "#ff7800",
		gridBorderColor : "#bfbfbf",
		gridBorderWidth : 1,
		gridBorderDashArray : "1, 3",
		gridAxisBorderColor : "#bfbfbf",
		gridAxisBorderWidth : 1,
		gridActiveBorderColor : "#ff7800",
		gridActiveBorderWidth : 1,

		// brush styles
		barBorderColor : "none",
		barBorderWidth : 0,
		barBorderOpacity : 0,
		columnBorderColor : "none",
		columnBorderWidth : 0,
		columnBorderOpacity : 0,
		gaugeBackgroundColor : "#f5f5f5",
        gaugeArrowColor : "gray",
		gaugeFontColor : "#666666",
		pieBorderColor : "white",
		pieBorderWidth : 1,
		donutBorderColor : "white",
		donutBorderWidth : 3,
		areaOpacity : 0.4,
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
		pathOpacity : 0.5,
		pathBorderWidth : 1,
		scatterBorderColor : "white",
		scatterBorderWidth : 1,
		scatterHoverColor : "white",
		waterfallBackgroundColor : "#73e9d2", // 4
		waterfallInvertBackgroundColor : "#ffb9ce", // 3
		waterfallEdgeBackgroundColor : "#08c4e0", // 1
		waterfallLineColor : "#a9a9a9",
		waterfallLineDashArray : "0.9",

        // widget styles
        titleFontColor : "#333",
        titleFontSize : "18px",
        legendFontColor : "#333",
        legendFontSize : "11px",
        tooltipFontColor : "#fff",
        tooltipFontSize : "12px",
        tooltipBackgroundColor : "black",
        tooltipBorderColor : "black",
        tooltipOpacity : 0.7,
		scrollBackgroundColor :	"#f5f5f5",
		scrollThumbBackgroundColor : "#b2b2b2",
		scrollThumbBorderColor : "#9f9fa4",
		zoomBackgroundColor : "red",
		zoomFocusColor : "gray",
		crossBorderColor : "#a9a9a9",
		crossBorderWidth : 1,
		crossBorderOpacity : 0.8,
		crossBalloonFontSize : "11px",
		crossBalloonFontColor :	"white",
		crossBalloonBackgroundColor : "black",
		crossBalloonOpacity : 0.7
	}
}); 