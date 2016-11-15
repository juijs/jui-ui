jui.defineUI("ui.select", ['jquery', 'util.base'], function ($, _) {
    var SelectView = function () {
        var self, $root, $selectView;
        var $title, $items;
        var items = [];

        var renderer = {
            'divider' : function (it, index) {
                return $("<hr class='item divider' />");
            },
            
            'item' : function (it, index) {
                var $item = $('<div class="item option " />');

                $item.attr('data-index', index);
                $item.attr('value', it.value);

                var itemContentType = (it.text) ? 'text' : 'html';

                if (typeof it[itemContentType] == 'function') {
                    $item[itemContentType].call($item, it[itemContentType].call(it, this));
                } else {
                    $item.text(it.text);
                    $item[itemContentType].call($item, it[itemContentType]);
                }

                if (it.selected)
                {
                    $item.addClass('selected');
                }

                return $item;

            }
        }
        
        this.init = function () {
            self = this;
            $root = $(this.root);
            items = _.clone(this.options.items);

            if (!$root.hasClass('select')) {
                $root.addClass('select');
            }

            this.initSelect();
            this.initEvent();

            this.update(items);

        }

        this.initEvent = function () {
            // title 클릭 
            $root.on('click', '.title', function () {
                $root.toggleClass('open');
            });

            // item 클릭 
            $root.on('click', '.item.option', function () {
                self.setValue($(this).attr('value'));
            });

            $('body').on('click', function (e) {
                var $list = $(e.target).closest($root);

                if (!$list.length)
                {
                    $root.removeClass('open');
                }


            });
        }

        this.initSelect = function () {
            $title = $("<div class='title' />");
            $items = $("<div class='items' />");


            $title.append($("<span />").addClass('title-content'));
            $title.append($("<i class='icon-arrow2' ></i>"));

            $root.addClass('select-' + this.options.align);
            $root.addClass('select-' + this.options.valign);

            if (this.options.multi) {
                $root.addClass('multi');
            }


            $root.append($title).append($items);
        }

        this.render = function () {
            $title.find(".title-content").empty();
            $items.empty();

            for(var i = 0, len = items.length; i < len; i++) {
                var it = items[i];

                var type = it.type || 'item';
                var $item = renderer[type].call(null, it, i);

                $items.append($item);

            }
        }

        this.setValue = function (value) {
            
            var i = 0;

            if (this.options.multi) {

                if (!(value instanceof Array)) {
                    value = [ value ];
                }
                for(var i = 0, len = value.length; i < len; i++) {
                    $items.find("[value='"+value[i]+"']").toggleClass('selected');
                }

            } else {
                var $prev = $items.find('.selected');
                var prevValue = $prev.attr('value');

                $prev.removeClass('selected');
                $items.find("[value='"+value+"']").addClass('selected');

            }

            this.setTitle();

            this.emit("change", [ this.getValue(), prevValue ] );


        }

        this.getValue = function () {

            var valueList = $items.find(".selected").map(function() {
                return  $(this).attr('value');
            }).toArray();

            if (this.options.multi) {
                return valueList;
            } else {
                return valueList[0];
            }
        }

        this.setSelectedIndex = function (index) {

            if (!items[index]) return;

            this.setValue(items[index].value);

        }

        this.getSelectedIndex = function () {
            var index = +$items.find(".selected").data('index');

            return index || -1;
        }


        this.setTitle = function () {

            var contentList = $items.find(".selected").map(function() {
                return  $("<span class='item-view'>" + $(this).html() + "</span>")[0];
            }).toArray();


            if (contentList.length == 0) {
                var html = this.options.placeholder;
            } else {
                var html = $(contentList);
            }

            $title.find(".title-content").html(html);
        }

        this.update = function (data) {
            items = _.clone(data);

            var selectedIndex = 0;

            for(var i = 0, len = items.length; i < len; i++) {
                var it = items[i];

                if (typeof it == 'string') {
                    items[i] = { text : it , value : it }
                }

                if (it.selected) {
                    selectedIndex = i;
                }
            }

            this.render();
            this.setTitle();
        }
    }

    SelectView.setup = function () {
        return {
            items : [],
            placeholder : 'Select a item',
            align: 'left',
            valign: 'top',
            multi : false,
            modal : false
        }
    }

    return SelectView;
});
