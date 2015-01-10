jui.define("chartx.layout.core", ["util.base"], function(_) {
    
    var CoreLayout = function () {
        
        this.setBounds = function(obj, x, y, width, height) {
          obj.x = x;
          obj.y = y;
          obj.width = width;
          obj.height = height;
        }
        
        
        this.getSize  = function(max, size) {
            if (typeof size == 'string') {
                if (size.indexOf('%') > -1) {
                    return max * (parseInt(size.replace('%', ''))/100);
                } else if (size == '*') {
                    return max;
                } else {
                    return parseInt(value);
                }
                
            } else if (_.typeCheck("float", size)) {
                return max * size;
            } else  {
                return size; 
            }
            
        }
        
    }
    
    return CoreLayout;
    
})
