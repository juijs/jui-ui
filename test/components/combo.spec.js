import jui from '../../src/main.js'
import ComboMod from '../../src/components/combo.js'

jui.use(ComboMod);

describe('/components/combo.js', () => {
    const comboCreator = jui.include("ui.combo");

    test('Check include module', () => {
        expect(comboCreator).toBeDefined();
    });

    test('Check options', () => {
        const options = ComboMod.component().setup();
        expect(options.height).toBe(100);
    });
});