jui.define("chart.brush", [], function() {
    var Brush = function() {
        var colors = [
            "121,119,194",
            "123,186,231",
            "255,192,0",
            "255,120,0",
            "135,187,102",
            "29,168,160",
            "146,146,146",
            "85,93,105",
            "2,152,213",
            "250,85,89",
            "245,163,151",
            "6,217,182",
            "168,169,217",
            "110,106,252",
            "227,231,104",
            "197,123,195",
            "223,50,139",
            "150,215,235",
            "131,156,181",
            "146,40,228"
        ],
        colorIndex = 0;

        this.getColor = function(index) {
            return "rgb(" + colors[index] +")";
        }

        this.nextColor = function() {
            if(colorIndex == colors.length - 1) {
                colorIndex = 0;
            }

            return "rgb(" + colors[colorIndex++] +")";
        }

        this.curvePoints = function(K) {
            var p1 = [];
            var p2 = [];
            var n = K.length - 1;

            /*rhs vector*/
            var a = [];
            var b = [];
            var c = [];
            var r = [];

            /*left most segment*/
            a[0] = 0;
            b[0] = 2;
            c[0] = 1;
            r[0] = K[0] + 2 * K[1];

            /*internal segments*/
            for (i = 1; i < n - 1; i++)
            {
                a[i] = 1;
                b[i] = 4;
                c[i] = 1;
                r[i] = 4 * K[i] + 2 * K[i + 1];
            }

            /*right segment*/
            a[n-1] = 2;
            b[n-1] = 7;
            c[n-1] = 0;
            r[n-1] = 8 * K[n-1] + K[n];

            /*solves Ax=b with the Thomas algorithm (from Wikipedia)*/
            for (var i = 1; i < n; i++)
            {
                var m = a[i] / b[i - 1];
                b[i] = b[i] - m * c[i - 1];
                r[i] = r[i] - m * r[i - 1];
            }

            p1[n - 1] = r[n - 1] / b[n - 1];
            for (var i = n - 2; i >= 0; --i)
                p1[i] = (r[i] - c[i] * p1[i+1]) / b[i];

            /*we have p1, now compute p2*/
            for (var i = 0; i < n - 1; i++)
                p2[i] = 2 * K[i + 1] - p1[i + 1];

            p2[n - 1] = 0.5 * (K[n] + p1[n-1]);

            return { p1: p1, p2: p2 };
        }
    }

    return Brush;
}, "chart.draw");