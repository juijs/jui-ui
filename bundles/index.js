import jui from '../src/main.js'
import ModalComp from '../src/components/modal.js'
import Styles from './index.less'

jui.use(ModalComp);

jui.ready([ "ui.modal" ], function(modal) {
    // 모달 (글로벌)
    window.modal_1 = modal("#modal_1", {
        color: "black",
        parent: "#global"
    });

    // 모달 (이너)
    window.modal_2 = modal("#modal_2_msg", {
        target: "#modal_2",
        opacity: 0.5,
        color: 'white'
    });

    // 모달 (클론)
    window.modal_3 = modal("#modal_3", {
        opacity: 0.8,
        clone: true
    });
});