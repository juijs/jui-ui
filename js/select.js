jui.defineUI("ui.select", ['jquery', 'util.base'], function ($, _) {
    var SelectView = function () {
        var self, $root, $selectView;
        var $title, $items;
        var items = [];

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

            if (this.options.selectedIndex > -1)  {
                this.setSelectedIndex(this.options.selectedIndex);
            }

        }

        this.initEvent = function () {
            // title 클릭 
            $root.on('click', '.title', function () {
                $root.toggleClass('open');
            });

            // item 클릭 
            $root.on('click', '.item.option', function () {
                self.setSelectedIndex(+$(this).data('index'));
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
            $title.append($("<img />").attr('src', '/v2/images/main/arrow1.svg').css({
                position: 'absolute',
                right: '10px',
                width: '8px',
                height: '8px',
                top: "50%",
                'margin-top': '-4px'
            }));

            $root.addClass(this.options.align);

            $root.append($title).append($items);
        }

        this.render = function () {
            $title.find(".title-content").empty();
            $items.empty();

            for(var i = 0, len = items.length; i < len; i++) {
                var it = items[i];

                var $item = $('<div class="item option " />');

                $item.attr('data-index', i);
                $item.attr('value', it.value);
                $item.text(it.text);

                if (it.selected)
                {
                    $item.addClass('selected');
                }

                $items.append($item);
            }
        }

        this.setValue = function (value) {
            var i = 0;
            for(len = items.length; i < len; i++) {
                var it = items[i];

                if (it.value == value)
                {
                    break;
                }
            }

            this.setSelectedIndex(i);
        }

        this.getValue = function () {
            return this.getSelectedItem().value;
        }

        this.setSelectedIndex = function (index) {
            var prevItem = $items.find(".selected");

            if (+prevItem.data('index') == +index)
            {
                return;
            }

            if (!items[index]) return;
            $root.removeClass('open');
            var $item = $items.find("[data-index=" + index + "]");

            $items.find(".selected").removeClass('selected');
            $item.addClass('selected');

            this.setTitle();

            this.emit("change", [ items[index].value, index, +prevItem.data('index') ] );

        }

        this.getSelectedIndex = function () {
            var index = +$items.find(".selected").data('index');

            return index;
        }

        this.getSelectedItem = function () {
            var index = this.getSelectedIndex();

            if (items[index])
            {
                var it = items[index];
                return it;
            }

            return items[0] || { text : '', value : '' } ;
        }


        this.setTitle = function () {
            $title.find(".title-content").text(this.getSelectedItem().text);
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
            selectedIndex : -1,
            align: 'left'
        }
    }

    return SelectView;
});
