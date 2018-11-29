import $ from "jquery"
import jui from "../main.js"

export default {
    name: "ui.property",
    extend: "event",
    component: function () {
        var _ = jui.include("util.base");

        var PropertyView = function () {

            var $root, $propertyContainer;
            var items = [];
            var self;

            var renderer = {};

            function removeJuiComponent (ui) {
                var list = jui.getAll();

                var i = 0;
                for(len = list.length; i < len; i++) {
                    if (list[i][0] == ui) {
                        break;
                    }
                }

                jui.remove(i);
            }

            function each(callback) {
                for(var i = 0, len = items.length; i < len; i++) {
                    callback.call(self, items[i], i);
                }
            }

            // refer to underscore.js
            function debounce(func, wait, context) {
                var timeout;
                return function() {
                    var args = arguments;
                    var later = function() {
                        timeout = null;
                        func.apply(context, args);
                    };
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
            };


            this.init = function () {
                self = this;
                $root = $(this.root);

                $propertyContainer = $("<div class='property-table' />").css({
                    'position' : 'relative'
                });

                $root.append($propertyContainer);

                this.loadItems(this.options.items);
            }

            this.loadItems = function (newItems) {
                items = _.clone(newItems);

                this.initProperty();

                this.emit("load.items");
            }

            this.initProperty = function () {

                // 정렬 방식에 따라 그리는 방법이 다르다.
                $propertyContainer.empty();

                each(function (item, index) {
                    $propertyContainer.append(this.renderItem(item, index));
                });
            }

            this.addItem = function (item) {


                if (!_.typeCheck('array', item)) {
                    item = [item];
                }
                items = items.concat(item);

                // 정렬에 따라 렌더링이 달라짐
                // add 하면 전체를 새로 그려야겠다.

                this.initProperty();
            }

            // remove item by key or title
            this.removeItem = function (item) {
                var result = [];
                for(var i = 0, len = items.length; i < len; i++) {
                    var it = items[i];

                    if (it.key == item.key || it.title == item.title ) {
                        result.push(it);
                    }
                }

                items = result;
            }

            /**
             * @method getGroupList
             *
             * get a list of  group's title.
             */
            this.getGroupList = function () {
                var result = [];
                $propertyContainer.find(".property-header-item").each(function() {
                    var it = $(this).data('item');
                    result.push({
                        name : 	it.title,
                        id : $(this).attr('id')
                    });
                });

                return result ;
            }

            /**
             * @method collapsed
             *
             * collapse group's children
             *
             * @param {String} id
             */
            this.collapsed = function (id) {
                var $dom  = $root.find('#' + id);
                $dom.addClass('collapsed').removeClass('expanded');

                $dom.find('.expand-btn i').removeClass('icon-minus').addClass('icon-plus');

                var $next = $dom.next();

                while($next.length && !$next.hasClass('property-header-item')) {
                    $next.hide();
                    $next = $next.next();
                }
            }

            /**
             * @method expanded
             *
             * expand group's children
             *
             * @param {String} id
             */
            this.expanded = function (id) {
                // 접기
                var $dom  = $root.find('#' + id);
                $dom.removeClass('collapsed').addClass('expanded');

                $dom.find('.expand-btn i').removeClass('icon-plus').addClass('icon-minus');

                var $next = $dom.next();

                while($next.length && !$next.hasClass('property-header-item')) {
                    $next.show();
                    $next = $next.next();
                }
            }

            this.renderItem = function (item, index) {

                var $dom = $("<div class='property-item' />").attr('data-index', index);

                if (item.type == 'group') {
                    $dom.addClass('property-header-item expanded');
                    $dom.attr('id', 'property-header-item-' + index);
                    $dom.data('item', item);
                    var $name = $("<div class='property-header' />").html(item.title);

                    if (item.description) {
                        $name.append("<small class='description'>"+item.description+"</small>");
                    }

                    $name.append("<a class='expand-btn'><i class='icon-minus' ></i></a>");

                    $dom.on('click', function (e) {
                        if ($(this).hasClass('collapsed')) {
                            self.expanded($dom.attr('id'));
                        } else {
                            self.collapsed($dom.attr('id'));
                            $}
                    });

                    $dom.append($name);

                } else {

                    if (_.typeCheck("array", item.value) || item.vertical)
                    {
                        $dom.addClass('vertical');
                    }

                    $dom.attr('data-key', item.key);//.hide();

                    var $name = $("<div class='property-title'  />").html(item.title);
                    var $input = $("<div class='property-render'  />");

                    var $renderedInput =   this.render($dom, item) ;
                    $input.append( $("<div class='item' />").html($renderedInput) );


                    if (item.description)
                    {
                        $input.append("<div class='description' >"+item.description+"</div>");
                    }

                    $dom.append($name);
                    $dom.append($input);
                }

                return $dom;
            }

            this.render = function ($dom, item) {

                var type = item.type || 'text';
                var render = item.render || renderer[type] || renderer.defaultRenderer;

                return render($dom, item);
            }

            /**
             * @method getValue
             *
             * get a list of property's value
             *
             * @param {String} [key=null]  if key is null, value is all properties.
             */
            this.getValue = function (key) {
                if (key) {
                    return this.getItem(key).value;
                } else {
                    return this.getAllValue();
                }
            }

            this.getDefaultValue = function () {
                var result = {};
                for(var i = 0, len = this.options.items; i < len; i++) {
                    var it = this.options.items[i];

                    if (typeof it.value != 'undefined') {
                        result[it.key] = it.value;
                    }
                }

                return result;
            }

            this.initValue = function (obj) {
                each(function (item, index) {
                    item.value = '';
                });

                this.initProperty();

                if (obj) {
                    this.setValue(obj);
                }
            }

            /**
             * @method getValue
             *
             * set a list of property's value
             *
             * @param {Object} obj
             */
            this.setValue = function (obj) {
                obj = obj || {};
                if (Object.keys(obj).length) {
                    for(var key in obj) {
                        this.updateValue(key, obj[key]);
                    }
                }
            }

            this.findRender = function (key) {
                return this.findItem(key).find(".property-render .item");
            }
            this.findItem = function (key) {
                return $propertyContainer.find("[data-key='"+key+"']");
            }
            this.getItem = function ($item) {
                var item;

                if (_.typeCheck("number", $item)) {
                    item = items[$item];
                } else if (_.typeCheck('string', $item)) {
                    item = items[parseInt(this.findItem($item).attr('data-index'))];
                } else {
                    item = items[parseInt($item.attr('data-index'))];
                }

                return item;
            }

            this.updateValue = function (key, value) {
                var $item = this.findItem(key);
                var it = this.getItem(key);

                if (!it) return;

                it.value = value;

                var $render = this.findRender(key);

                $render.empty();
                $render.html(this.render($item, it));
            }

            this.getAllValue = function (key) {
                var results = {};
                each(function (item, index) {
                    if (item.type !== 'group') {
                        results[item.key] = item.value;
                    }
                });

                return results;
            }

            this.refreshValue = function ($dom, newValue) {
                var item = this.getItem($dom);

                var oldValue = item.value;
                item.value = newValue;

                this.emit("change", [ item, newValue, oldValue ] );
            }

            /* Implements Item Renderer */
            renderer.str2array = function (value, splitter) {
                splitter = splitter || ",";
                if (typeof value == 'string')  {
                    return value.split(splitter);
                }

                return value;
            }

            renderer.defaultRenderer = function ($dom, item) {
                return renderer.text($dom, item);
            }

            renderer.select = function ($dom, item) {
                var $input = $("<select />").css({
                    'max-width': '100%'
                });

                var list = item.items || [];

                for(var i = 0, len = list.length; i < len; i++) {
                    var it = list[i];

                    if (typeof it == 'string') {
                        it = { text : it, value : it }
                    }

                    $input.append($("<option >").val(it.value).text(it.text));
                }

                $input.val(item.value);

                $input.on('change', debounce(function () {
                    var value = $(this).val();
                    value = (_.typeCheck('array', item.value)) ? renderer.str2array(value) : value;

                    self.refreshValue($(this).closest('.property-item'), value);
                }, 250, $input));

                return $input;
            }

            renderer.text = function ($dom, item) {
                var $text = $("<input type='text' />").css({
                    width: '100%'
                }).attr({
                    placeholder : 'Type here'
                });

                if (item.readonly) {
                    $input.attr('readonly', true);
                }
                $text.val(item.value);

                $text.on('input', debounce(function () {
                    var value = $(this).val();
                    value = (_.typeCheck('array', item.value)) ? renderer.str2array(value) : value;

                    self.refreshValue($dom, value);
                }, 250, $text));

                return $([$text[0]]);
            }

            renderer.textarea = function ($dom, item) {
                var $input = $("<textarea />").css({
                    width: '100%',
                    height: item.height || 100
                }).attr({
                    placeholder : 'Type here'
                });

                if (item.readonly) {
                    $input.attr('readonly', true);
                }

                $input.val(item.value);

                $input.on('input', debounce(function () {
                    var value = $(this).val();
                    value = (_.typeCheck('array', item.value)) ? renderer.str2array(value) : value;

                    self.refreshValue($(this).closest('.property-item'), value);
                }, 250, $input));

                return $input;
            }

            renderer.html = function ($dom, item) {
                var $input = $("<div class='html' contenteditable=true />").css({
                    width: '100%',
                    height: item.height || 100
                });

                if (item.readonly) {
                    $input.attr('contenteditable', false);
                }

                $input.html(item.value);

                $input.on('input', debounce(function () {
                    var value = $(this).html();

                    self.refreshValue($(this).closest('.property-item'), value);
                }, 250, $input));

                return $input;
            }

            renderer.number = function ($dom, item) {
                var $input = $("<input type='number' />").css({
                    'text-align' : 'center'
                });

                $input.attr('max', item.max || 100);
                $input.attr('min', item.min || 0);
                $input.attr('step', item.step || 1);
                $input.val(item.value);

                $input.on('input', debounce(function () {
                    self.refreshValue($(this).closest('.property-item'), +$(this)[0].value);
                }, 250, $input));

                return $input;
            }

            renderer.range = function ($dom, item) {

                var $group = $("<div />").css({
                    position: 'relative'
                });

                var $input = $("<input type='range' />").css({
                    width: '100px',
                    'z-index' : 1
                });

                var value = item.value;

                var postfix = item.postfix || "";

                if (item.postfix)
                {
                    value = value.replace(postfix, "");
                }

                $input.attr('max', item.max || 100);
                $input.attr('min', item.min || 0);
                $input.attr('step', item.step || 1);
                $input.val(+value);

                if (item.readonly) {
                    $input.attr('readonly', true);
                }

                var $progress = $("<div class='range-progress' />");
                $progress.width((value / (+$input.attr('max') - +$input.attr('min'))) * $input.width());

                var $inputText = $("<span />");
                $inputText.text(value +postfix);

                $input.on('input', function () {
                    var $el = $(this);
                    var value = +$el[0].value;
                    var width = (value / (+$el.attr('max') - +$el.attr('min'))) * $(this).width();
                    $progress.width(width);
                    $inputText.text(value + postfix);
                });

                $input.on('input', debounce(function () {
                    var $el = $(this);
                    var value = +$el[0].value;
                    self.refreshValue($el.closest('.property-item'), value + postfix);

                }, 250, $input));

                $group.append([ $input, $progress, $inputText ]);

                return $group;
            }

            renderer.checkbox = function ($dom, item) {
                var $input = $("<input type='checkbox' /><i ></i>");

                $($input[0]).hide();
                $input[0].checked = (item.value == 'true' || item.value === true) ? true : false ;

                if ($input[0].checked)  {
                    $($input[1]).addClass('icon-checkbox');
                } else {
                    $($input[1]).addClass('icon-checkbox2');
                }


                $input.on('click', debounce(function () {
                    var is_checked = $(this).hasClass('icon-checkbox');

                    if (is_checked) {
                        $(this).addClass('icon-checkbox2').removeClass('icon-checkbox');
                    } else {

                        $(this).addClass('icon-checkbox').removeClass('icon-checkbox2');

                    }

                    is_checked = !is_checked;


                    self.refreshValue($dom, is_checked);
                }, 100, $input));

                return $input;
            }

            renderer.switch = function ($dom, item) {
                var $input = $("<div class='switch inner small' />");

                var is_checked = (item.value == 'true' || item.value === true) ? true : false;

                jui.create('ui.switch',$input, {
                    checked : is_checked,
                    event: {
                        change: function(is_on) {
                            self.refreshValue($dom, is_on);
                        }
                    }
                });

                return $input;
            }

            renderer.property = function ($dom, item) {
                var $input = $("<div class='property inner' />");

                var propertyObj = jui.create('ui.property', $input, {
                    items : item.items,
                    event : {
                        change : function () {
                            self.refreshValue($dom, this.getValue());
                        }
                    }
                });

                propertyObj.setValue(item.value);

                return $input;
            }

            renderer.date = function ($dom, item) {
                var $container = $propertyContainer;
                var $input = $("<div class='datepicker-input' />");

                var $valueText = $("<span class='datepicker-value-text'></span>").css({
                    cursor: 'pointer'
                });

                $input.on('click', function () {
                    var offset = $input.offset();
                    var containerOffset = $container.offset()
                    var maxWidth = $container.outerWidth();
                    var maxHeight = $container.outerHeight();

                    var left = offset.left - containerOffset.left;

                    if (left + $input.outerWidth() >= maxWidth)
                    {
                        left = maxWidth - $input.outerWidth() - 20;
                    }

                    var top = offset.top -  containerOffset.top + 80;

                    if (top + $input.outerHeight() >= maxHeight)
                    {
                        top = maxHeight - $input.outerHeight() - 20;
                    }


                    $datepicker.css({
                        position: 'absolute',
                        'z-index' : 100000,
                        left: left,
                        top: top
                    });
                    $datepicker.show();
                });

                var $icon = $("<i class='icon-calendar' />");

                $input.html($icon);
                $input.append($valueText);

                var $datepicker = $("<div class='datepicker' />").css({
                    position: 'absolute',
                    top: '0px',
                    display: 'none'
                });

                var $datepicker_head = $("<div class='head' />");
                var $datepicker_body = $("<table class='body' />");

                $datepicker_head.html('<div class="prev"><i class="icon-chevron-left"></i></div><div class="title"></div><div class="next"><i class="icon-chevron-right"></i></div>');
                $datepicker_body.html('<tr><th>SU</th><th>MO</th><th>TU</th><th>WE</th><th>TH</th><th>FR</th><th>SA</th></tr>');

                $datepicker.append($datepicker_head);
                $datepicker.append($datepicker_body);

                $container.after($datepicker);

                var datepicker = jui.create('ui.datepicker', $datepicker, {
                    date : item.value || (+new Date),
                    titleFormat: item.titleFormat || "yyyy. MM",
                    format: item.format || "yyyy/MM/dd",
                    tpl : {
                        date : item.tpl_date || "<td><!= date !></td>"
                    },
                    event : {
                        select: function(date, e) {
                            $valueText.html(date);
                            self.refreshValue($dom, date);
                        }
                    }
                });

                $('body').on('click', function (e) {
                    var $c = $(e.target).closest('.datepicker');
                    var $c2 = $(e.target).closest($input);
                    if (!$c.length && !$c2.length) {
                        $datepicker.hide();
                    }
                });

                $valueText.html(datepicker.getDate());

                return $input;
            }

            renderer.colors = function ($dom, item) {

                var colors = item.value;

                var arr = [];
                for(var i = 0, len = colors.length; i < len; i++) {
                    var $input = renderer.color($dom, item, i);

                    arr.push($input[0]);
                }

                return $(arr);
            }

            renderer.color = function ($dom, item, index) {
                index = typeof index == 'undefined' ? -1 : index;
                var $input = $("<a  class='color-input' />");

                var $container = $propertyContainer;
                var colorValue = index == -1 ? item.value : item.value[index];
                var $colorPanel = $("<span />").css({
                    'background-color': colorValue,
                }).html('&nbsp;');

                var $colorCode = $("<span />").html(colorValue || '');
                var $noneButton = $("<span class='none-color' title='Delete a color'/>").html("<i class='icon-more'></i>");

                $input.append($colorPanel);
                $input.append($colorCode);
                $input.append($noneButton);

                $input.on('click', function(e) {

                    if ($(e.target).closest('.none-color').length) {
                        e.preventDefault();

                        $colorPanel.css('background-color', '');
                        $colorCode.text('');
                        self.refreshValue($input.closest('.property-item'), '');

                        return;
                    }
                    var offset = $(this).offset();

                    var $colorPicker = $container.next('.colorpicker');

                    if (!$colorPicker.length) {
                        $colorPicker = $('<div class="colorpicker" />');

                        $container.after($colorPicker);

                        var colorpicker = jui.create('ui.colorpicker', $colorPicker, {
                            color: colorValue,
                            event: {
                                change: debounce(function() {
                                    var color = colorpicker.getColor('hex');

                                    if (color.indexOf('NAN') > -1)
                                    {
                                        return;
                                    }

                                    $colorPanel.css('background-color', color);
                                    $colorCode.html(color);

                                    if (index == -1) {
                                        self.refreshValue($input.closest('.property-item'), color);
                                    }  else {
                                        var colors = item.value;
                                        colors[index] = color;
                                        self.refreshValue($input.closest('.property-item'), colors);
                                    }


                                }, 100, colorpicker)
                            }
                        });


                        $('body').on('click', function (e) {
                            var $c = $(e.target).closest('.colorpicker');
                            var $c2 = $(e.target).closest($input);
                            if (!$c.length && !$c2.length) {

                                removeJuiComponent(colorpicker);
                                $colorPicker.remove();
                            }
                        });
                    } else {
                        $colorPicker[0].jui.setColor(colorValue || "");
                    }

                    var containerOffset = $container.offset()
                    var maxWidth = $container.outerWidth();
                    var maxHeight = $container.outerHeight();

                    var left = offset.left - containerOffset.left;

                    if (left + $colorPicker.outerWidth() >= maxWidth)
                    {
                        left = maxWidth - $colorPicker.outerWidth() - 20;
                    }

                    var top = offset.top -  containerOffset.top + 50;

                    if (top + $colorPicker.outerHeight() >= maxHeight)
                    {
                        top = maxHeight - $colorPicker.outerHeight() - 20;
                    }


                    $colorPicker.css({
                        position: 'absolute',
                        'z-index' : 100000,
                        left: left,
                        top: top
                    });
                    $colorPicker.show();

                });

                return $input;
            }
        }

        PropertyView.setup = function () {
            return {
                sort : 'group', // name, group, type
                viewport : 'default',
                items : []
            }
        }

        /**
         * @event change
         * Event that occurs when property view is changed
         */

        return PropertyView;
    }
}