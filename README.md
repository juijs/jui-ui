## Installation

### NPM
```bash
npm install --save juijs-ui
```

### Browser

```html
<link rel="stylesheet" href="../dist/jui-ui.classic.css" />
<script src="../dist/vendors.js"></script>
<script src="../dist/jui-ui.js"></script>
```

### ES Modules

The difference with the existing method is that you need to add the module directly using the 'use' function.

```js
import jui from 'juijs'
import TimepickerComp from 'juijs-ui/src/components/timepicker.js'
import Styles from './index.less'

jui.use(TimepickerComp);
```

Below is the index.less file. You can only use the style you want to bundle.

```less
.jui {
  @import "../node_modules/juijs-ui/src/styles/base/mixins.less";
  @import "../node_modules/juijs-ui/src/styles/common.less";
  @import "../node_modules/juijs-ui/src/styles/common.theme.less";
  @import "../node_modules/juijs-ui/src/styles/icon.less";
  @import "../node_modules/juijs-ui/src/styles/icon.theme.less";
  @import "../node_modules/juijs-ui/src/styles/timepicker.less";
  @import "../node_modules/juijs-ui/src/styles/timepicker.theme.less";
  @import "../node_modules/juijs-ui/src/styles/theme/classic.less";
}
```

## Usage

```html
<body class="jui">
    <div id="timepicker_date" class="timepicker calendar small" style="margin-right: 3px;">
        <input type="input" class="year" maxlength="4" />-<input type="input" class="month" maxlength="2" />-<input type="input" class="date" maxlength="2" />
        <i class="icon-calendar"></i>
    </div>
    
    <div id="timepicker_time" class="timepicker small">
        <input type="input" class="hours" maxlength="2" value="00" /> :
        <input type="input" class="minutes" maxlength="2" value="00" />
        <i class="icon-arrow7"></i>
    </div>
</body>
```

```js
jui.ready([ "ui.timepicker" ], function(timepicker) {
    timepicker("#timepicker_date");
    timepicker("#timepicker_time");
});
```
