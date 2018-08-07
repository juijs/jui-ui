import $ from 'jquery'
import jui from 'juijs'
import Event from './base/event.js'

jui.redefine('jquery', [], function() { return $; });
jui.use(Event);

export default jui;