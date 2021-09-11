'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;(function (name, __context_, definition) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = definition();
    } else if (typeof layui !== 'undefined') {
        layui.define(function (exports) {
            exports(name, definition());
        });
    } else {
        __context_ && (__context_[name] = definition());
    }
})("minare", (typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== "object" ? undefined : window, function () {
    var instance = function instance() {

        var config = function config() {
            return {
                url: "",
                handler: {
                    onComplete: null, onTimeout: null, onUploadProgress: null, statusHandlerMapping: {}
                },
                header: {},
                timeout: 0
            };
        };

        function wrapEmptyIfNotFunction(f) {
            return f && typeof f === "function" ? f : function () {};
        }

        var getFunction = function getFunction(f, nullable) {
            return f && typeof f === "function" ? f : nullable ? null : function () {};
        };
        var getStatusProperty = function getStatusProperty(status) {
            return "status_" + status;
        };

        var getHandlerFromConfig = function getHandlerFromConfig(config, status) {
            return config["handler"] ? config["handler"].statusHandlerMapping[getStatusProperty(status)] : null;
        };

        var globalConfig = new config();
        var configure = {
            when: function when(status, handler) {
                globalConfig.handler.statusHandlerMapping[getStatusProperty(status)] = wrapEmptyIfNotFunction(handler);
                return this;
            },
            whenTimeout: function whenTimeout(handler) {
                globalConfig.handler.onTimeout = wrapEmptyIfNotFunction(handler);
                return this;
            },
            whenComplete: function whenComplete(handler) {
                globalConfig.handler.onComplete = wrapEmptyIfNotFunction(handler);
                return this;
            },
            whenUploadProgress: function whenUploadProgress(handler) {
                globalConfig.handler.onUploadProgress = wrapEmptyIfNotFunction(handler);
                return this;
            },
            timeout: function timeout(_timeout) {
                globalConfig.timeout = typeof _timeout === "number" ? _timeout : 0;
                return this;
            },
            addRequestHeader: function addRequestHeader(key, value) {
                if (key && value) {
                    globalConfig.header[key] = value;
                }
                return this;
            }

        };
        var minare = function minare(method, url, body) {

            var xhr = new XMLHttpRequest();
            xhr.open(method, globalConfig.url + url);

            var isJsonResponse = true;
            var _config = new config();

            var getResponse = function getResponse(xhr) {
                if (isJsonResponse) {
                    try {
                        return JSON.parse(xhr.responseText);
                    } catch (e) {
                        console.warn("error convert to json data,return response text");
                        return xhr.responseText;
                    }
                }
                return xhr.responseText;
            };

            return {
                onSuccess: function onSuccess(f) {
                    _config.handler.statusHandlerMapping[getStatusProperty(200)] = getFunction(f, true);
                    return this;
                },
                onError: function onError(f) {
                    _config.handler.statusHandlerMapping[getStatusProperty(500)] = getFunction(f, true);
                    _config.handler.statusHandlerMapping[getStatusProperty(502)] = getFunction(f, true);
                    _config.handler.statusHandlerMapping[getStatusProperty(503)] = getFunction(f, true);
                    return this;
                },
                onComplete: function onComplete(f) {
                    _config.handler.onComplete = getFunction(f, true);
                    return this;
                },
                onTimeout: function onTimeout(f) {
                    _config.handler.onTimeout = getFunction(f, true);
                    return this;
                },
                onUploadProgress: function onUploadProgress(f) {
                    _config.handler.onUploadProgress = getFunction(f, true);
                },
                setHeader: function setHeader(key, value) {
                    xhr.setRequestHeader(key, value);
                    return this;
                },
                stringResponse: function stringResponse() {
                    isJsonResponse = false;
                    return this;
                },
                $xhr: function $xhr(f) {
                    f(xhr);
                    return this;
                },

                execute: function execute() {
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {

                            var status = xhr.status;
                            var handler = getHandlerFromConfig(_config, status);
                            var globalHandler = getHandlerFromConfig(globalConfig, status);

                            var resp = getResponse(xhr);

                            if (handler) {
                                handler(resp, status);
                            } else {
                                globalHandler && globalHandler(resp, status);
                            }

                            if (_config.handler.onComplete) {
                                _config.handler.onComplete(resp, status);
                            } else {
                                globalConfig.handler.onComplete && globalConfig.handler.onComplete(resp, status);
                            }
                        }
                    };

                    var headerProperty = Object.getOwnPropertyNames(globalConfig.header);
                    for (var i = 0; i < headerProperty.length; i++) {
                        var name = headerProperty[i];
                        var value = globalConfig.header[name];
                        xhr.setRequestHeader(name, typeof value === "function" ? value({ method: method, url: url, body: body }) : value);
                    }

                    xhr.timeout = globalConfig.timeout;
                    xhr.ontimeout = function (ev) {
                        if (_config.handler.onTimeout) {
                            _config.handler.onTimeout(ev);
                        } else {
                            globalConfig.handler.onTimeout && globalConfig.handler.onTimeout(ev);
                        }
                    };
                    xhr.upload.onprogress = function (ev) {
                        if (_config.handler.onUploadProgress) {
                            _config.handler.onUploadProgress(ev);
                        } else {
                            globalConfig.handler.onUploadProgress && globalConfig.handler.onUploadProgress(ev);
                        }
                    };

                    if (body === undefined) {
                        xhr.send(null);
                    } else if (body instanceof FormData || body instanceof File || body instanceof Blob || typeof body === "string") {
                        xhr.send(body);
                    } else {
                        var sendBody = body;
                        try {
                            sendBody = JSON.stringify(body);
                        } catch (e) {}
                        xhr.send(sendBody);
                    }
                }
            };
        };

        return {
            newInstance: function newInstance() {
                return instance();
            },
            config: function config(f) {
                if (typeof f === "function") {
                    f(configure);
                }
                return Object.assign({}, globalConfig);
            },
            newGet: function newGet(url) {
                return new minare("GET", url);
            },
            newPost: function newPost(url, body) {
                return new minare("POST", url, body);
            },

            newPut: function newPut(url, body) {
                return new minare("PUT", url, body);
            },
            newDelete: function newDelete(url, body) {
                return new minare("DELETE", url, body);
            }
        };
    };
    return instance();
});