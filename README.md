## Minare


[![Build Status](https://app.travis-ci.com/zmapleshine/Minare.svg?branch=main)](https://app.travis-ci.com/zmapleshine/Minare)
![Language](https://img.shields.io/badge/language-JavaScript-orange.svg)
![Language](https://img.shields.io/badge/license-MIT-green.svg)


 Minare is a lightweight HTTP request tool primarily used in the browser environment.
 In theory, Minare can be used as long as the terminal contains an XMLHttpRequest object.
 Minare makes XMLHttpRequest (XHR) somewhat easier to use.
 
## Usage

### 0x00 Import package

- NodeJS
```shell script
npm -i minare
```
ES6:
```js
import minare from "minare"
```
  CommonJS:
```js
var minare = require('minare');
```

- HTML

```html
<script src="minare.min.js"></script>
```

- Layui

Users using layui can download a compressed version of Minare in 'dist' directory to the project's extension directory.
For example, if your layui extension directory is 'myplugin_directory', you can use it like this:
```js
layui.extend({
  minare: '/myplugin_directory/minare.min'
})
//...
layui.use("minare",function() {
  var minare = layui.minare;
})
```
For more information about layui's plugin extensions, please refer to the layui official documentation.


### 0x01 Configuration

```js

//Global Config 
minare.config(function(configure){
    configure
      .url("http://127.0.0.1:6633/api")
      .whenUploadProgress(function (e) {
        console.log(e.loaded / e.total * 100 + "%")
    }).whenComplete(function (resp, status) {
        alert(JSON.stringify(resp))
    }).when(405, function (response) {
        alert(405)
    }).when(500, function (response) {
        alert(JSON.stringify(response))
    }).whenTimeout(function (re) {
        alert("timeout!")
    })
        .timeout(1000)
        .addRequestHeader("authorization","minare")
        .addRequestHeader("x-b3-traceID",function() {
           return "testabcdef123456"
        })
})
```
### 0x02 Examples
- GET Request
```js
minare.newGet("/user").onSuccess(function(resp) {
  // do something
}).execute();
```
- POST Request
```js
minare
.newPost("/user",{"username":"Han Meimei","age":18})
.onError(function(resp,status) {
    //do logic when response error
 })

//or
var formData = new FormData()
formData.append("username","Han Meimei");
formData.append("age","18")

minare.newPost("/user",formData)
 .onError(function(resp,status) {
    //do logic when response error
  })
```
- File Upload

```html
<form action="javascript:doUpload()">
    <input name="uploadFile" type="file">
    <button type="submit">Upload</button>
</form>

<script>

function doUpload() {

  var inputFile = document.querySelector("[name=demo-form]").uploadFile;
  var formData = new FormData();
  formData.append("file", inputFile.files[0]);
  
   minare
      .newPost("/api/v1/oss/upload", formData)
      .onUploadProgress(function(e){
          console.log(e.loaded / e.total * 100 + "%")
       })
      .onComplete(function (response) {
          alert("request complete!")
      }).onError(function () {
      alert("Oops!")
  }).execute()
}
</script>
```


- Other Request:
```js
minare.newPut("/user",{...})
minare.newDelete("/user?id=1",{...})
```

- Clone a new minare instance:

```js
var devMinare = minare.newInstance()
devMinare.config(function(configure){
//...
})
```

### 0x03 API


- minare

| function | In-use params | return | remark |
|  ----  | ----  | ---- | ---- |
| newInstance |  - | minare | Return a new minare object,the global configuration will not be the same  |
| config | function (configurer) | A copy of the configuration | See minare.config() on follow  |
| newGet | url | minare request object | See follow |
| newPost/newPut/newDelete | url,body | minare request object | See follow |


- minare.config()

```js
minare.config(function(configurer) {
  //configurer.when...
})
```

| function | In-use params | return | remark |
|  ----  | ----  | ---- | ---- |
| when |  status, function (resp,status) | config | |
| whenTimeout | function (event) | config | |
| whenComplete | status, function (handler) | config | |
| whenUploadProgress | function (event) | config | |
| url | string or function() | config | param can be strings or the function return a string  |
| timeout | duration | config | default value is zero,Unit:millisecond
| addRequestHeader | key,value/function(method,url,body) | config |


- minare request object

| function | In-use params | return | remark |
|  ----  | ----  | ---- | ---- |
| onSuccess |  function (resp) | minare | Overrides the function in global configuration that sets the status code to 200 |
| onError | function (resp,status) | minare | Overrides the function in global configuration that sets the status code to 500,502 and 503  |
| onComplete | function (resp,status) | minare | Override the request completion callback function 'whenComplete' that in global configuration |
| onTimeout | function (event) | minare | Override the request timeout callback function 'whenTimeout' that in global configuration |
| onUploadProgress | function (event) | minare | Override the callback function 'whenUploadProgress' that in global configuration |
| setHeader | key,value | minare | Set the current request header,the same key will be overwritten |
| stringResponse | - | minare | Flag that the request returns non-JSON |
| $xhr | function(_xhr) | minare | Pass a callback function that contains the original 'xhr' object |
| execute | - | - | Start executing the request |

