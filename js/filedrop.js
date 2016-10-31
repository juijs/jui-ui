jui.defineUI("ui.filedrop", ['jquery'], function ($) {
    var FileDrop = function () {
        var self, $root, _files;

        this.init = function () {
            self = this;
            $root = $(this.root);

            this.initEvent();
        }

        this.initEvent = function () {
            $root.on('drop', function (e) {
                e.preventDefault();

                self.setFiles(e);
                self.processFile();
            });
        }

        this.setFiles = function (e) {
            _files = e.originalEvent.dataTransfer.files;

        }

        this.getFiles = function () {
            return _files;
        }

        this.getFile = function (i) {
            return _files[i];
        }

        this.processFile = function (e) {
            var files = _files;

            if (this.options.url != '') {

                if (this.options.isMultiFileUpload) {

                    this.uploadFilesForSingleUpload(files);
                } else {

                    this.uploadFiles(files);
                }

            } else {
                // upload 안하고 바로 파일을 사용할 경우 
                this.emit("dropped.files");
            }
        }


        this.uploadOneFile = function (file, index, callback) {
            var formData = new FormData();

            for(var k in this.options.params) {
                var key = k;
                var value = this.options.params[k];

                if (typeof value == 'function') {
                    formData.append(key, value.call(this));
                } else {
                    formData.append(key, value);
                }
            }

            formData.append(this.options.name, file);

            $.ajax({
                url: this.options.file,
                type: 'post',
                data: formData,
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false,
                xhr: function() {
                    var xhr = new window.XMLHttpRequest();

                    // set upload progress event 
                    xhr.upload.addEventListener("progress", function(evt) {
                        if (evt.lengthComputable) {

                            var percentComplete = evt.loaded / evt.total;
                            percentComplete = parseInt(percentComplete * 100);
                            self.emit('file.progress.update', [index,  percentComplete, evt.loaded , evt.total] );

                            if (percentComplete === 100) {
                                self.emit('file.progress.complete', [ index ] );
                            }

                        }
                    }, false);

                    return xhr;
                },
                complete: function() {
                    self.emit("file.complete", [index]);
                },
                success: function(data) {
                    callback && callback (index, data);
                    self.emit("file.success", [index, data]);
                },
                error: function() {
                    self.emit("file.error", [index]);
                    // Log the error, show an alert, whatever works for you
                }
            });

        }


        this.uploadFilesForSingleUpload = function (files) {

            // TODO: 업로드 코드 
            var max = files.length;
            var count = 0;


            var totalFileSize  = 0;
            for(var i = 0, len = max; i < len; i++) {
                totalFileSize += files[i].size;
            }

            var uploadedFileSize = 0;
            for(var i = 0, len = max; i < len; i++) {

                this.uploadOneFile(files[i], i, max, function (index) {
                    count++;
                    uploadedFileSize += files[index].size;

                    var percentComplete = parseInt((uploadedFileSize/  totalFileSize) * 100);
                    self.emit('progress.update', [ , uploadedFileSize, totalFileSize] );


                    if (percentComplete == 100) {
                        self.emit("progress.complete");
                    }
                    if (count == max) {
                        self.emit("complete");
                    }
                });
            }
        }


        this.uploadFiles = function (files) {

            var formData = new FormData();

            for(var k in this.options.params) {
                var key = k;
                var value = this.options.params[k];

                if (typeof value == 'function') {
                    formData.append(key, value.call(this));
                } else {
                    formData.append(key, value);
                }
            }

            // TODO: 업로드 코드 
            for(var i = 0, len = files.length; i < len; i++) {
                var file = files[i];
                formData.append(this.options.name, file);
            }

            $.ajax({
                url: this.options.File,
                type: 'post',
                data: formData,
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false,
                xhr: function() {
                    var xhr = new window.XMLHttpRequest();

                    // set upload progress event 
                    xhr.upload.addEventListener("progress", function(evt) {
                        if (evt.lengthComputable) {

                            var percentComplete = evt.loaded / evt.total;
                            percentComplete = parseInt(percentComplete * 100);
                            self.emit('progress.update', [ percentComplete, evt.loaded , evt.total] );

                            if (percentComplete === 100) {
                                self.emit('progress.complete');
                            }

                        }
                    }, false);

                    return xhr;
                },
                complete: function() {
                    self.emit("complete");
                },
                success: function(data) {
                    self.emit("success", [data]);
                },
                error: function() {
                    self.emit("error", []);
                    // Log the error, show an alert, whatever works for you
                }
            });
        }

    };

    FileDrop.setup = function () {
        return {
            name : 'files[]',
            url : '/file/upload_file.php',
            params : {},
            isMultiFileUpload : true      // true 면 파일 업로드 개별로 함. 
        }
    }

    return FileDrop;
});