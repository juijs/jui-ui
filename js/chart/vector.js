jui.define("chart.vector", [], function() {
    var Vector = function(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;

        this.add = function(numberOrVector) {
            if(numberOrVector instanceof Vector) {
                return new Vector(this.x + numberOrVector.x, this.y + numberOrVector.y, this.z + numberOrVector.z);
            }

            return new Vector(this.x + numberOrVector, this.y + numberOrVector, this.z + numberOrVector);
        }

        this.subtract = function(numberOrVector) {
            if(numberOrVector instanceof Vector) {
                return new Vector(this.x - numberOrVector.x, this.y - numberOrVector.y, this.z - numberOrVector.z);
            }

            return new Vector(this.x - numberOrVector, this.y - numberOrVector, this.z - numberOrVector);
        }

        this.multiply = function(numberOrVector) {
            if(numberOrVector instanceof Vector) {
                return new Vector(this.x * numberOrVector.x, this.y * numberOrVector.y, this.z * numberOrVector.z);
            }

            return new Vector(this.x * numberOrVector, this.y * numberOrVector, this.z * numberOrVector);
        }

        this.dotProduct = function(vector) {
            var value = this.x * vector.x + this.y * vector.y + this.z * vector.z;
            return Math.acos(value / (this.getMagnitude() * vector.getMagnitude()))
        }

        this.crossProduct = function(vector) {
            return new Vector(
                this.y * vector.z - this.z * vector.y,
                this.z * vector.x - this.x * vector.z,
                this.x * vector.y - this.y * vector.x
            );
        }

        this.normalize = function() {
            var mag = this.getMagnitude();

            this.x /= mag;
            this.y /= mag;
            this.z /= mag;
        }

        this.getMagnitude = function() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        }
    }

    return Vector;
});