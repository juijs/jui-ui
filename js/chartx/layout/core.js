jui.define("chartx.layout.core", ["util.base"], function(_) {
    
    return {
        getSize : function(max, size) {
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
    
})
