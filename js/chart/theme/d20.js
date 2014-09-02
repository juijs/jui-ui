jui.define("chart.theme.d20", [], function() {
	var themeColors = [
		"#1f77b4",
		"#aec7e8",
		"#ff7f0e",
		"#ffbb78",
		"#2ca02c",
		"#98df8a",
		"#d62728",
		"#ff9896",
		"#9467bd",
		"#c5b0d5",
		"#8c564b",
		"#c49c94",
		"#e377c2",
		"#f7b6d2",
		"#7f7f7f",
		"#c7c7c7",
		"#bcbd22",
		"#dbdb8d",
		"#17becf",
		"#9edae5"
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
		gridActiveBorderWidth : 1,

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