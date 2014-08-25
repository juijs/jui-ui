jui.define("chart.theme.white", [], function() {
    var colors = [ "121,119,194", "123,186,231", "255,192,0", "255,120,0", "135,187,102", "29,168,160", "146,146,146", "85,93,105", "2,152,213", "250,85,89", "245,163,151", "6,217,182", "168,169,217", "110,106,252", "227,231,104", "197,123,195", "223,50,139", "150,215,235", "131,156,181", "146,40,228" ],
        colorIndex = 0;

    return {
        color: function(index) {
            return "rgb(" + colors[index] + ")";
        },
        nextColor: function() {
            if (colorIndex == colors.length - 1) {
                colorIndex = 0;
            }

            return "rgb(" + colors[colorIndex++] + ")";
        }
    }
});