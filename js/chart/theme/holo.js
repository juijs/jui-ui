jui.define("chart.theme.holo", [], function() {
    var themeColors = [

        "#f39c12",
        "#16a085",
        "#d35400",
        "#27ae60",
        "#c0392b" ,
        "#2980b9" ,
        "#bdc3c7",
        "#8e44ad",
        "#7f8c8d",
        "#2c3e50",
        

        
        "#f1c40f" ,
        "#e67e22",
        "#e74c3c" ,
        "#ecf0f1" ,
        "#95a5a6",
            
        "#1abc9c",
        "#2ecc71" ,
        "#3498db",
        "#9b59b6",
        "#34495e" ,
        
        
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