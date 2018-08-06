import jui from '../main.js'
import AccordionComp from '../components/accordion.js'
import DropdownComp from '../components/dropdown.js'
import AutocompleteComp from '../components/autocomplete.js'
import ButtonComp from '../components/button.js'
import ColorpickerComp from '../components/colorpicker.js'
import ComboComp from '../components/combo.js'
import DatepickerComp from '../components/datepicker.js'
import LayoutComp from '../components/layout.js'
import ModalComp from '../components/modal.js'
import NotifyComp from '../components/notify.js'
import NumbercheckerComp from '../components/numberchecker.js'
import PagingComp from '../components/paging.js'
import ProgressComp from '../components/progress.js'
import PropertyComp from '../components/property.js'
import SelectComp from '../components/select.js'
import SliderComp from '../components/slider.js'
import SplitterComp from '../components/splitter.js'
import StringcheckerComp from '../components/stringchecker.js'
import SwitchComp from '../components/switch.js'
import TabComp from '../components/tab.js'
import TimepickerComp from '../components/timepicker.js'
import TooltipComp from '../components/tooltip.js'
import TreeNodeMod from '../components/tree.node.js'
import TreeBaseMod from '../components/tree.base.js'
import TreeComp from '../components/tree.js'
import WindowComp from '../components/window.js'

jui.use([
    AccordionComp,
    DropdownComp, AutocompleteComp, ButtonComp, ColorpickerComp, ComboComp, DatepickerComp, LayoutComp, ModalComp, NotifyComp,
    NumbercheckerComp, PagingComp, ProgressComp, PropertyComp, SelectComp, SliderComp, SplitterComp, StringcheckerComp, SwitchComp, TabComp,
    TimepickerComp, TooltipComp, TreeNodeMod, TreeBaseMod, TreeComp, WindowComp
]);

window.jui = window.JUI = jui;