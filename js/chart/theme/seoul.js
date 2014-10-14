jui.define("chart.theme.seoul", [], function() {
	var themeColors = [
		"#FBB13C",		// 은행노란색
		"#6E413C",		// 고궁갈색
		"#E0CDA2",		// 삼베연미색
		"#5884C5",		// 서울하늘색
		"#912F30",		// 단청빨간색
		"#E57F28",		// 꽃담황토색
		"#E5E5E5",		// 한강은백색
		"#A1A097",		// 돌담회색
		"#446256",		// 남산초록색
		"#494949"		// 기와진회색
		
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
		gridActiveBorderWidth : 1,

		// brush styles
		gaugeBackgroundColor : "#ececec",
        gaugeArrowColor : "black",
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
        ohlcBorderColor : "black",
        ohlcInvertBorderColor : "red",
        ohlcBorderRadius : 5,
		lineBorderWidth : 2,
		pathOpacity : 0.2,
		pathBorderWidth : 1,
		scatterBorderColor : "white",
		scatterBorderWidth : 1,

        // widget styles
        titleFontColor : "#333",
        titleFontSize : "13px",
        legendFontColor : "#333",
        legendFontSize : "12px",
        tooltipFontColor : "#333",
        tooltipFontSize : "12px",
        tooltipBackgroundColor : "white",
        tooltipBorderColor : "#aaaaaa",
        tooltipOpacity : 0.7,
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
        crossBalloonOpacity : 0.5
	}
}); 