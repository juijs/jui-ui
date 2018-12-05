import jui from '../src/main.js'
import TimePickerComp from '../src/components/timepicker.js'
import Styles from './index.less'

jui.use(TimePickerComp);

jui.ready([ "ui.timepicker" ], function(timepicker) {
    window.ui_date = timepicker("#timepicker", {
        event: {
            change: function(data) {
                console.log(data);
            }
        }
    });
});