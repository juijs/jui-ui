import jui from '../src/main.js'
import AccordionComp from '../src/components/accordion.js'
import DropdownComp from '../src/components/dropdown.js'
import AutocompleteComp from '../src/components/autocomplete.js'
import ButtonComp from '../src/components/button.js'
import ColorpickerComp from '../src/components/colorpicker.js'
import ComboComp from '../src/components/combo.js'
import DatepickerComp from '../src/components/datepicker.js'
import LayoutComp from '../src/components/layout.js'
import ModalComp from '../src/components/modal.js'
import NotifyComp from '../src/components/notify.js'
import NumbercheckerComp from '../src/components/numberchecker.js'
import PagingComp from '../src/components/paging.js'
import ProgressComp from '../src/components/progress.js'
import PropertyComp from '../src/components/property.js'
import SelectComp from '../src/components/select.js'
import SliderComp from '../src/components/slider.js'
import SplitterComp from '../src/components/splitter.js'
import StringcheckerComp from '../src/components/stringchecker.js'
import SwitchComp from '../src/components/switch.js'
import TabComp from '../src/components/tab.js'
import TimepickerComp from '../src/components/timepicker.js'
import TooltipComp from '../src/components/tooltip.js'
import TreeComp from '../src/components/tree.js'
import WindowComp from '../src/components/window.js'

jui.use([
    AccordionComp, DropdownComp, AutocompleteComp, ButtonComp, ColorpickerComp, ComboComp, DatepickerComp, LayoutComp, ModalComp, NotifyComp,
    NumbercheckerComp, PagingComp, ProgressComp, PropertyComp, SelectComp, SliderComp, SplitterComp, StringcheckerComp, SwitchComp, TabComp,
    TimepickerComp, TooltipComp, TreeComp, WindowComp
]);

if(typeof(window) == "object") {
    window.jui = window.JUI = jui;
}