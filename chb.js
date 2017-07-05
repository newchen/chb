/*
class.js
    init(Class,$this,args)

extend.js
    deepCopy: function deepCopy(childObj, parentObj)

base.js
    $$()
    $Id(id)
    $Tag(id,tag)
    getByClass(className,obj) 
    getByTag(Tag,obj)
    getElementsByClass(classname,Tag)

node.js
    getFirstChild(pNode)
    getLastChild(pNode)
    getNextSibling(node)
    getPreviousSibling(node)
    insertAfter(newobj,obj,parentobj)
    filterSpaceNode(nodes)
    textContent: function textContent(obj, value)

css.js
    addClass(obj,classname)
    getRealStyle(obj,attr) 
    hasClass(obj,className) 
    removeClass(obj,classname)

event.js
    addEvent(element, type, handler)
    removeEvent(element, type, handler)

anim.js
    animate(obj,start,alter,dur,fn)
    Tween: Object
    opacity: function opacity(obj, opa)

ajax.js
    ajax(args)

xml.js
    getXML: function (xmlNode) 
    getXMLDOM: function () 
    loadXMLFile: function (xmlDom,url,callback) 
    loadXMLString: function (xmlDom,xmlStr) 

本地存储.js
    getStorage: function (key)
    removeStorage: function (key) 
    setStorage: function (key, val)
    clearStorage: function ()

tools.js
    IgnoreHTML(content)
    formatDate(s,t)
    
other.js
    isArray: function (o) 
    isBoolean: function (o) 
    isFunction: function (o) 
    isNull: function (o)
    isNumber: function (o)
    isObject: function (o) 
    isString: function (o) 
    isUndefined: function (o) 
*/
(function() {
    if (!window.CHB) {
        window['CHB'] = {};
    }

    //class.js
    /**
     * 类初始化参数
     * @param  {class} Class 类的名称，不过不是string类型
     * @param  {this} $this  当前对象，一般就是this
     * @param  {object} args 参数对象
     * 
     * 使用方式：
     * function AjaxPager(args){
     *      init(AjaxPager,this,args);
     *      this.setPage(1);//一开始就加载第一页的内容
     *  }
     *
     *  AjaxPager.defaultArgs = {//设置默认值
     *      pageSize:5,
     *      cols:"*",
     *      order:"id",
     *      dir:"asc"
     *  };
     */
    function init(Class, $this, args) {
        $this.originalArgs = args; //使用originalArgs保留原始传入的args参数
        for (var i in args) {
            $this[i] = args[i]; //一个一个设置
        }
        if (Class.defaultArgs) { //如果设置了默认值对象
            for (i in Class.defaultArgs) {
                if (args[i] === undefined) //且该默认值为undefined
                    $this[i] = Class.defaultArgs[i].valueOf($this);
            }
        }
    }
    window['CHB']['init'] = init;


    //extend.js
    /**
     * 非构造函数的继承，深拷贝
     * @param  {object} childObj  子对象，子对象继承父对象
     * @param  {object} parentObj 父对象
     * @return {object} 子对象
     * 使用：
        var parent = {//父对象
            p1: function() {
                console.log('p1')
            },
            p2: function() {
                console.log('p2')
            }
        },
        child = {//子对象
            c1: function() {
                console.log('c1')
            },
            c2: function() {
                console.log('c2')
            }
        };
  
        deepCopy(child, parent);
        child.p1();//p1
        child.c2();//c2
        child.p2();//p2
     */
    function deepCopy(childObj, parentObj) {
        childObj = childObj || {};
        for (var i in parentObj) {
            if (typeof parentObj[i] === 'object') {
                childObj[i] = (parentObj[i].constructor === Array) ? [] : {};
                deepCopy(childObj[i], parentObj[i]);
            } else {
                childObj[i] = parentObj[i];
            }
        }
        return childObj;
    }
    window['CHB']['deepCopy'] = deepCopy;

    //base.js 基本操作，作用：获取DOM元素

    /**
     * 通过id获取DOM对象
     * @param  {string} id 元素的id名称      
     * @return {object} 单个DOM对象
     * 使用方式：$Id('one')
     */
    function $Id(id) {
        return document.getElementById(id);
    }
    window['CHB']['$Id'] = $Id;

    /**
     * 该函数包装document.getElementById并且功能更为强大
     * @param  {string}       一个或多个字符串  必需参数
     * @return {object|array} 单个DOM对象或DOM对象数组
     * 使用方式：$$("one")或$$("one", "two", "three")
     */
    function $$() {
        var elements = [];
        for (var i = 0; i < arguments.length; i++) {
            var element = arguments[i];
            if (typeof(element) == "string") {
                element = document.getElementById(element);
            }
            if (arguments.length == 1) {
                return element;
            }
            elements.push(element);
        }
        return elements;
    }
    window['CHB']['$$'] = $$;

    /**
     * 获取DOM对象数组：先通过元素的id确定范围，再通过该范围内的元素名称，获取DOM对象数组
     * @param  {string} id  元素的id名称
     * @param  {string} tag id范围下的元素标签名称
     * @return {array}  DOM对象数组
     */
    function $Tag(id, tag) {
        return document.getElementById(id).getElementsByTagName(tag);
    }
    window['CHB']['$Tag'] = $Tag;

    /**
     * 通过元素的class名获取DOM对象数组
     * @param  {string} classname 元素的class名称
     * @param  {string} Tag       元素标签名称(且该元素的class名称为classname) 可选参数
     * @return {array}  DOM对象数组
     */
    function getElementsByClass(classname, Tag) {
        var elements = [];
        Tag = Tag || "*";
        var allTags = document.getElementsByTagName(Tag);
        classname = classname.replace(/\-/g, "\\-");
        var reg = new RegExp("(^|\\s)" + classname + "(\\s|$)");
        var element;
        for (var i = 0; i < allTags.length; i++) {
            element = allTags[i];
            if (reg.test(element.className)) {
                elements.push(element);
            }
        }
        return elements;
    }
    window['CHB']['getElementsByClass'] = getElementsByClass;

    /**
     * 和上面的函数getElementsByClass功能差不多，获取obj对象下名为className的DOM对象数组
     * @param  {string} className 元素的class名称
     * @param  {object} obj       DOM对象  可选参数
     * @return {array}  DOM对象数组
     */
    function getByClass(className, obj) {
        obj = obj || document;
        if (obj.getElementsByClassName) {
            return obj.getElementsByClassName(className);
        }
        var nodes = obj.getElementsByTagName('*'),
            ret = [];
        for (var i = 0; i < nodes.length; i++) {
            if (hasClass(nodes[i], className)) ret.push(nodes[i]); //使用了后面的hasClass函数
        }
        return ret;
    }
    window['CHB']['getByClass'] = getByClass;

    /**
     * 包装函数document/obj.getElementsByTagName
     * @param  {string} Tag 元素标签名称
     * @param  {object} obj DOM对象 可选参数
     * @return {array}  DOM对象数组
     */
    function getByTag(Tag, obj) {
        if (obj && (typeof obj == "object")) { //如果传入了obj参数且是一个对象
            return obj.getElementsByTagName(Tag);
        }
        return document.getElementsByTagName(Tag);
    }
    window['CHB']['getByTag'] = getByTag;

    //css.js    样式类的操作，作用：添加、移除、判断是否存在某个类等

    /**
     * 判断某个DOM对象是否有某个class样式类
     * @param  {object}  obj       DOM对象
     * @param  {string}  className class样式类
     * @return {Boolean} 有某个className，返回true，没有则返回false
     */
    function hasClass(obj, className) {
        var names = obj.className.split(/\s+/); //把一个字符串分割成字符串数组
        for (var i = 0; i < names.length; i++) {
            if (names[i] == className) return true;
        }
        return false;
    }
    window['CHB']['hasClass'] = hasClass;

    /**
     * 给某个DOM对象添加某个class样式类
     * @param {object} obj       DOM对象
     * @param {string} classname 要添加的class样式类
     */
    function addClass(obj, classname) {
        if (hasClass(obj, classname)) {
            return obj.className += " " + classname;
        }
    }
    window['CHB']['addClass'] = addClass;

    /**
     * 删除某个DOM对象的某个class样式类
     * @param  {object} obj       DOM对象
     * @param  {string} classname 要删除的class样式类
     */
    function removeClass(obj, classname) {
        var s = obj.className.split(/\s+/);
        for (var i = 0; i < s.length; i++) {
            if (s[i] == classname) delete s[i];
        }
        return obj.className = s.join(" ");
    }
    window['CHB']['removeClass'] = removeClass;

    /**
     * 获取某个DOM对象的某个属性实际样式
     * @param  {object} obj  DOM对象
     * @param  {string} attr 属性，如"width"
     * @return {string} 属性实际样式
     */
    function getRealStyle(obj, attr) {
        if (window.getComputedStyle) { //W3C DOM
            return window.getComputedStyle(obj, null)[attr];
        } else if (obj.currentStyle) { //IE
            return obj.currentStyle[attr];
        }
        return "";
    }
    window['CHB']['getRealStyle'] = getRealStyle;

    //node.js 节点的相关操作

    /**Firefox，Chrome以及其他一些浏览器，把空的空白或换行当作文本节点，而 IE 不会这么做
    为了避免定位到空的文本节点（元素节点之间的空格和换行符号），需用到下面的函数*/

    /**
     * 得到下一个兄弟节点对象
     * @param  {object} node DOM对象
     * @return {object} 下一个兄弟节点(DOM)对象或当前节点(DOM)对象
     */
    function getNextSibling(node) {
        var n = node.nextSibling;
        if (n == null) return node; //对于IE来说，如果当前节点没有下一个节点(为null)，返回当前节点
        while (n.nodeType != 1) { //对于FF和Chrome来说，如果下一节点不是元素节点(是空白节点)
            n = n.nextSibling;
            if (n == null) return node; //对于FF和Chrome来说，如果后面只有空白节点，没有元素节点了(为null)，返回当前节点
        }
        return n;
    }
    window['CHB']['getNextSibling'] = getNextSibling;

    /**
     * 得到上一个兄弟节点对象
     * @param  {object} node DOM对象
     * @return {object} 上一个兄弟节点(DOM)对象或当前节点(DOM)对象
     */
    function getPreviousSibling(node) {
        var n = node.previousSibling;
        if (n == null) return node;
        while (n.nodeType != 1) {
            n = n.previousSibling;
            if (n == null) return node;
        }
        return n;
    }
    window['CHB']['getPreviousSibling'] = getPreviousSibling;

    /**
     * 得到第一个子节点对象
     * @param  {object} pNode 父节点(DOM)对象
     * @return {object} 第一个子节点(DOM)对象或当前父节点(DOM)对象
     */
    function getFirstChild(pNode) {
        var n = pNode.firstChild;
        if (n == null) return pNode;
        while (n.nodeType != 1) {
            n = n.nextSibling;
            if (n == null) return pNode;
        }
        return n;
    }
    window['CHB']['getFirstChild'] = getFirstChild;

    /**
     * 得到最后一个子节点对象
     * @param  {object} pNode 父节点(DOM)对象
     * @return {object} 最后一个子节点(DOM)对象或当前父节点(DOM)对象
     */
    function getLastChild(pNode) {
        var n = pNode.lastChild;
        if (n == null) return pNode;
        while (n.nodeType != 1) {
            n = n.previousSibling;
            if (n == null) return pNode;
        }
        return n;
    }
    window['CHB']['getLastChild'] = getLastChild;

    /**
     * 过滤空白文本节点
     * @param  {NodeList} nodes 节点(DOM)对象列表，比如 var nodes = document.body.childNodes;
     * @return {array}  节点(DOM)对象数组
     */
    function filterSpaceNode(nodes) {
        var arr = [];
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].nodeType == 3 && /^\s+$/.test(nodes[i].nodeValue)) { //如果是文本节点且内容为空白或换行
                continue;
            }
            arr.push(nodes[i]);
        }
        return arr;
    }
    window['CHB']['filterSpaceNode'] = filterSpaceNode;

    /**
     * 在节点操作中只有insertBefore(插入到某个节点之前)方法，却没有insertAfter(插入到某个节点之后)方法
     * @param  {object} newobj    要插入的节点(DOM)对象
     * @param  {object} obj       新节点(DOM)插入到该节点(DOM)之后
     * @param  {object} parentobj 父节点(DOM)对象
     */
    function insertAfter(newobj, obj, parentobj) {
        if (obj.nextSibling.nodeType == 1) { //如果obj的下一个兄弟节点的类型是元素
            parentobj.insertBefore(newobj, obj.nextSibling);
        } else {
            parentobj.appendChild(newobj);
        }
    }
    window['CHB']['insertAfter'] = insertAfter;

    /**
     * 设置或获取节点(DOM)对象的内容，因为IE和FF操作对象内容方法不兼容，IE:innerText, FF:textContent
     * @param  {object} obj   节点(DOM)对象
     * @param  {string} value 要设置的内容，依据是否传入了该参数决定该函数是设置还是获取内容，传入:设置内容，没传入:获取内容
     * @return {string} 节点(DOM)对象的内容
     */
    function textContent(obj, value) {
        if (document.all) { //判断是IE还是Firefox浏览器，因为：document.all为IE专有属性，FF中未定义，所以判断得出是IE
            if (typeof value == "undefined") { //通过value值是否为undefined判断是否传入了value值，传入:设置内容，没传入:获取内容
                return obj.innerText; //获取内容
            } else {
                obj.innerText = value; //设置内容
            }
        } else { //FF浏览器
            if (typeof value == "undefined") {
                return obj.textContent; //获取内容
            } else {
                obj.textContent = value; //设置内容
            }
        }
    }
    window['CHB']['textContent'] = textContent;

    //event.js  事件操作  作用：绑定、移除事件监听，标准化事件对象
    /*下面的addEvent()方法达到了以下要求：
    　　 a、支持同一元素的同一事件句柄可以绑定多个监听函数；
    　　 b、如果在同一元素的同一事件句柄上多次注册同一函数，那么第一次注册后的所有注册都被忽略；
    　　 c、函数体内的this指向的应当是正在处理事件的节点（如当前正在运行事件句柄的节点）；
    　　 d、监听函数的执行顺序应当是按照绑定的顺序执行；
    　　 e、在函数体内不用使用 event = event || window.event; 来标准化Event对象；
    */

    /**
     * 绑定事件
     * @param {object}   element DOM对象
     * @param {string}   type    事件名，不带on前缀，如"click",  "mouseover"，"blur"
     * @param {function} handler 回调函数，并且可接收一个参数，该参数是标准化了的Event对象
           Event对象标准化了以下属性和方法：
                target， relatedTarget ，pageX，pageY，layerX，layerY，preventDefault()，stopPropagation()
     */
    function addEvent(element, type, handler) {
        //为每一个事件处理函数分派一个唯一的ID
        if (!handler.$$guid) handler.$$guid = addEvent.guid++;
        //为元素的事件类型创建一个哈希表
        if (!element.events) element.events = {};
        //为每一个"元素/事件"对创建一个事件处理程序的哈希表
        var handlers = element.events[type];
        if (!handlers) {
            handlers = element.events[type] = {};
            //存储存在的事件处理函数(如果有)
            if (element["on" + type]) {
                handlers[0] = element["on" + type];
            }
        }
        //将事件处理函数存入哈希表
        handlers[handler.$$guid] = handler;
        //指派一个全局的事件处理函数来做所有的工作
        element["on" + type] = handleEvent;
    };
    window['CHB']['addEvent'] = addEvent;

    //用来创建唯一的ID的计数器
    addEvent.guid = 1;

    /**
     * 移除事件
     * @param {object} element DOM对象
     * @param {string} type    事件名，不带on前缀，如"click",  "mouseover"，"blur"
     * @param {function} handler 回调函数
     */
    function removeEvent(element, type, handler) {
        //从哈希表中删除事件处理函数
        if (element.events && element.events[type]) {
            delete element.events[type][handler.$$guid];
        }
    };
    window['CHB']['removeEvent'] = removeEvent;

    function handleEvent(event) {
        var returnValue = true;
        //抓获事件对象(IE使用全局事件对象)
        event = event || fixEvent(window.event);
        //取得事件处理函数的哈希表的引用
        var handlers = this.events[event.type];
        //执行每一个处理函数
        for (var i in handlers) {
            this.$$handleEvent = handlers[i];
            if (this.$$handleEvent(event) === false) {
                returnValue = false;
            }
        }
        return returnValue;
    };

    //为IE的事件对象标准化一些属性、添加一些“缺失的”函数
    function fixEvent(event) {
        //标准化属性
        event.target = event.srcElement;
        if (event.type == "mouseover") {
            event.relatedTarget = event.fromElement;
        } else if (event.type == "mouseout") {
            event.relatedTarget = event.toElement;
        }
        event.pageX = event.clientX + document.documentElement.scrollLeft;
        event.pageY = event.clientY + document.documentElement.scrollTop;
        event.layerX = event.offsetX;
        event.layerY = event.offsetY;
        //添加标准的W3C方法
        event.preventDefault = fixEvent.preventDefault;
        event.stopPropagation = fixEvent.stopPropagation;
        return event;
    };
    fixEvent.preventDefault = function() {
        this.returnValue = false; //这里的this指向了某个事件对象，而不是fixEvent
    };
    fixEvent.stopPropagation = function() {
        this.cancelBubble = true;
    };


    //animate.js  动画

    /**
     * 动画函数
     * @param  {object}   obj   DOM对象，要产生动画的对象
     * @param  {object}   start 初始值的集合，例如：{height:20,width:130,......}，高度初始为20px，宽度初始130px
     * @param  {object}   alter 变化量的集合，例如：{height:40,width:-30,......}，高度增加40px，宽度减少30px
     * @param  {number}   dur   动画持续多长时间，毫秒
     * @param  {function} fn    回调函数，动画是怎么变化的：匀速、二次加速，或其他
     * @return {function} 一个清除定时器的方法  
     * 使用：
     *      var d = document.getElementById("div");
            animate(d,{
                width:100,
                height:120,
                left:150,
                top:100
            },{
                width:200,
                height:160,
                left:250,
                top:150
                },4000,Tween.Linear);
     */
    function animate(obj, start, alter, dur, fn) {
        var curTime = 0;
        var interval = setInterval(function() {
            if (curTime >= dur) clearInterval(interval);
            for (var i in start) {
                //start[i]和alter[i]必须是数字，防止传入的参数错误，例如obj.style.height是字符串且带有单位px
                if (isNaN(start[i])) start[i] = parseInt(start[i]);
                if (isNaN(alter[i])) alter[i] = parseInt(alter[i]);
                if (!isNaN(start[i]) && !isNaN(alter[i])) {
                    if (i == "opacity") {
                        opacity(obj, fn(start[i], alter[i], curTime, dur));
                    } else {
                        obj.style[i] = fn(start[i], alter[i], curTime, dur) + "px";
                    }
                } else {
                    console.log("请查看animate api传入的参数");
                }
            }
            curTime += 50;
        }, 50);
        return function() { //返回一个清除定时器的方法
            clearInterval(interval);
        };
    }
    window['CHB']['animate'] = animate;

    /**
     * 设置或返回透明度
     * @param  {object} obj DOM对象
     * @param  {number} opa 透明度，范围：0~100，依据是否传入了该参数决定该函数是设置还是返回透明度，传入：设置透明度；未传入：返回透明度
     * @return {number} 透明度的值
     */
    function opacity(obj, opa) {
        if (opa && typeof opa === 'number') { //如果传入了opa参数且该参数为number类型
            typeof obj.style.opacity === "string" ?
                obj.style.opacity = opa / 100 + '' : //FF，设置透明度
                obj.style.filter = "alpha(opacity=" + opa + ")"; //IE，设置透明度            
        }
        return (obj.style.opacity) * 100 || (((obj.style.filter).match(/\d+/))[0]) * 1; //返回透明度
    }
    window['CHB']['opacity'] = opacity;

    //动画是怎么变化的：匀速、二次加速，或其他
    var Tween = {
        Linear: function(start, alter, curTime, dur) {
            return start + curTime / dur * alter; }, //最简单的线性变化,即匀速运动
        Quad: { //二次方缓动
            easeIn: function(start, alter, curTime, dur) {
                return start + Math.pow(curTime / dur, 2) * alter;
            },
            easeOut: function(start, alter, curTime, dur) {
                var progress = curTime / dur;
                return start - (Math.pow(progress, 2) - 2 * progress) * alter;
            },
            easeInOut: function(start, alter, curTime, dur) {
                var progress = curTime / dur * 2;
                return (progress < 1 ? Math.pow(progress, 2) : -((--progress) * (progress - 2) - 1)) * alter / 2 + start;
            }
        },
        Cubic: { //三次方缓动
            easeIn: function(start, alter, curTime, dur) {
                return start + Math.pow(curTime / dur, 3) * alter;
            },
            easeOut: function(start, alter, curTime, dur) {
                var progress = curTime / dur;
                return start - (Math.pow(progress, 3) - Math.pow(progress, 2) + 1) * alter;
            },
            easeInOut: function(start, alter, curTime, dur) {
                var progress = curTime / dur * 2;
                return (progress < 1 ? Math.pow(progress, 3) : ((progress -= 2) * Math.pow(progress, 2) + 2)) * alter / 2 + start;
            }
        },
        Quart: { //四次方缓动
            easeIn: function(start, alter, curTime, dur) {
                return start + Math.pow(curTime / dur, 4) * alter;
            },
            easeOut: function(start, alter, curTime, dur) {
                var progress = curTime / dur;
                return start - (Math.pow(progress, 4) - Math.pow(progress, 3) - 1) * alter;
            },
            easeInOut: function(start, alter, curTime, dur) {
                var progress = curTime / dur * 2;
                return (progress < 1 ? Math.pow(progress, 4) : -((progress -= 2) * Math.pow(progress, 3) - 2)) * alter / 2 + start;
            }
        },
        Quint: { //五次方缓动
            easeIn: function(start, alter, curTime, dur) {
                return start + Math.pow(curTime / dur, 5) * alter;
            },
            easeOut: function(start, alter, curTime, dur) {
                var progress = curTime / dur;
                return start - (Math.pow(progress, 5) - Math.pow(progress, 4) + 1) * alter;
            },
            easeInOut: function(start, alter, curTime, dur) {
                var progress = curTime / dur * 2;
                return (progress < 1 ? Math.pow(progress, 5) : ((progress -= 2) * Math.pow(progress, 4) + 2)) * alter / 2 + start;
            }
        },
        Sine: { //正弦曲线缓动
            easeIn: function(start, alter, curTime, dur) {
                return start - (Math.cos(curTime / dur * Math.PI / 2) - 1) * alter;
            },
            easeOut: function(start, alter, curTime, dur) {
                return start + Math.sin(curTime / dur * Math.PI / 2) * alter;
            },
            easeInOut: function(start, alter, curTime, dur) {
                return start - (Math.cos(curTime / dur * Math.PI / 2) - 1) * alter / 2;
            }
        },
        Expo: { //指数曲线缓动
            easeIn: function(start, alter, curTime, dur) {
                return curTime ? (start + alter * Math.pow(2, 10 * (curTime / dur - 1))) : start;
            },
            easeOut: function(start, alter, curTime, dur) {
                return (curTime == dur) ? (start + alter) : (start - (Math.pow(2, -10 * curTime / dur) + 1) * alter);
            },
            easeInOut: function(start, alter, curTime, dur) {
                if (!curTime) {
                    return start; }
                if (curTime == dur) {
                    return start + alter; }
                var progress = curTime / dur * 2;
                if (progress < 1) {
                    return alter / 2 * Math.pow(2, 10 * (progress - 1)) + start;
                } else {
                    return alter / 2 * (-Math.pow(2, -10 * --progress) + 2) + start;
                }
            }
        },
        Circ: { //圆形曲线缓动
            easeIn: function(start, alter, curTime, dur) {
                return start - alter * Math.sqrt(-Math.pow(curTime / dur, 2));
            },
            easeOut: function(start, alter, curTime, dur) {
                return start + alter * Math.sqrt(1 - Math.pow(curTime / dur - 1));
            },
            easeInOut: function(start, alter, curTime, dur) {
                var progress = curTime / dur * 2;
                return (progress < 1 ? 1 - Math.sqrt(1 - Math.pow(progress, 2)) : (Math.sqrt(1 - Math.pow(progress - 2, 2)) + 1)) * alter / 2 + start;
            }
        },
        Elastic: { //指数衰减的正弦曲线缓动
            easeIn: function(start, alter, curTime, dur, extent, cycle) {
                if (!curTime) {
                    return start; }
                if ((curTime == dur) == 1) {
                    return start + alter; }
                if (!cycle) { cycle = dur * 0.3; }
                var s;
                if (!extent || extent < Math.abs(alter)) {
                    extent = alter;
                    s = cycle / 4;
                } else { s = cycle / (Math.PI * 2) * Math.asin(alter / extent); }
                return start - extent * Math.pow(2, 10 * (curTime / dur - 1)) * Math.sin((curTime - dur - s) * (2 * Math.PI) / cycle);
            },
            easeOut: function(start, alter, curTime, dur, extent, cycle) {
                if (!curTime) {
                    return start; }
                if (curTime == dur) {
                    return start + alter; }
                if (!cycle) { cycle = dur * 0.3; }
                var s;
                if (!extent || extent < Math.abs(alter)) {
                    extent = alter;
                    s = cycle / 4;
                } else { s = cycle / (Math.PI * 2) * Math.asin(alter / extent); }
                return start + alter + extent * Math.pow(2, -curTime / dur * 10) * Math.sin((curTime - s) * (2 * Math.PI) / cycle);
            },
            easeInOut: function(start, alter, curTime, dur, extent, cycle) {
                if (!curTime) {
                    return start; }
                if (curTime == dur) {
                    return start + alter; }
                if (!cycle) { cycle = dur * 0.45; }
                var s;
                if (!extent || extent < Math.abs(alter)) {
                    extent = alter;
                    s = cycle / 4;
                } else { s = cycle / (Math.PI * 2) * Math.asin(alter / extent); }
                var progress = curTime / dur * 2;
                if (progress < 1) {
                    return start - 0.5 * extent * Math.pow(2, 10 * (progress -= 1)) * Math.sin((progress * dur - s) * (2 * Math.PI) / cycle);
                } else {
                    return start + alter + 0.5 * extent * Math.pow(2, -10 * (progress -= 1)) * Math.sin((progress * dur - s) * (2 * Math.PI) / cycle);
                }
            }
        },
        Back: {
            easeIn: function(start, alter, curTime, dur, s) {
                if (typeof s == "undefined") { s = 1.70158; }
                return start + alter * (curTime /= dur) * curTime * ((s + 1) * curTime - s);
            },
            easeOut: function(start, alter, curTime, dur, s) {
                if (typeof s == "undefined") { s = 1.70158; }
                return start + alter * ((curTime = curTime / dur - 1) * curTime * ((s + 1) * curTime + s) + 1);
            },
            easeInOut: function(start, alter, curTime, dur, s) {
                if (typeof s == "undefined") { s = 1.70158; }
                if ((curTime /= dur / 2) < 1) {
                    return start + alter / 2 * (Math.pow(curTime, 2) * (((s *= (1.525)) + 1) * curTime - s));
                }
                return start + alter / 2 * ((curTime -= 2) * curTime * (((s *= (1.525)) + 1) * curTime + s) + 2);
            }
        },
        Bounce: {
            easeIn: function(start, alter, curTime, dur) {
                return start + alter - Tween.Bounce.easeOut(0, alter, dur - curTime, dur);
            },
            easeOut: function(start, alter, curTime, dur) {
                if ((curTime /= dur) < (1 / 2.75)) {
                    return alter * (7.5625 * Math.pow(curTime, 2)) + start;
                } else if (curTime < (2 / 2.75)) {
                    return alter * (7.5625 * (curTime -= (1.5 / 2.75)) * curTime + .75) + start;
                } else if (curTime < (2.5 / 2.75)) {
                    return alter * (7.5625 * (curTime -= (2.25 / 2.75)) * curTime + .9375) + start;
                } else {
                    return alter * (7.5625 * (curTime -= (2.625 / 2.75)) * curTime + .984375) + start;
                }
            },
            easeInOut: function(start, alter, curTime, dur) {
                if (curTime < dur / 2) {
                    return Tween.Bounce.easeIn(0, alter, curTime * 2, dur) * 0.5 + start;
                } else {
                    return Tween.Bounce.easeOut(0, alter, curTime * 2 - dur, dur) * 0.5 + alter * 0.5 + start;
                }
            }
        }
    };
    window['CHB']['Tween'] = Tween;


    //ajax.js  ajax接口

    /**
     * ajax接口
     * @param  {object} args 配置对象，其属性如下：
     * @options:
     *         {string} method 提交方式，可用值："post"/"get"，默认get方式，可选
     *         {string} url    提交给哪个文件处理
     *         {string} dataType 预期服务器返回的数据类型，如果不指定，将自动根据 HTTP 包 MIME 信息返回 responseXML 或 responseText，
     *                           并作为回调函数参数传递，可用值："xml"：返回 XML 文档； "json"：返回 JSON 数据；"text"：返回纯文本字符串
     *         {boolean} async 是否异步，可用值：true/false，true异步，默认异步，可选
     *         {function} success 成功获取数据后的回调函数，有2个参数：服务器返回的数据，数据格式(xml/json/text)
     *         {object} data   提交的数据，格式：{key:value}
     *         {boolean} cache 是否缓存，可用值：true/false，true表示缓存，默认不缓存，可选
     * 使用：
     *      ajax({  
                method:"get",
                dataType:"text",
                url:"url",
                data:{key:"values"},
                success:function (text,type) {
                    alert(text+" "+type);
                },
                cache:false
            }); 
     *       
     */
    function ajax(args) {
        var xhr = createXHR(),
            data = params(args.data);
        args.method = args.method || "get";
        args.async = args.async || true;

        if (/get/i.test(args.method)) { //如果是get提交方式，通过open()方法的第2个参数："文件名?key=value&key=value"方式提交数据
            args.url += "?" + data;
        }
        if (!args.cache) {
            if (args.url.indexOf("?") < 0) args.url += "?";
            args.url += "&" + (+new Date()); //防止缓存
        }
        xhr.open(args.method, args.url, args.async);
        xhr.onreadystatechange = function() { //必须在调用send方法前分配此事件处理函数，因为调用send方法之后如果服务器或网速足够快，可能立即就返回了，再注册事件监听函数就不会有任何反应
            if (xhr.readyState === 4 && xhr.status === 200) {
                var http = xhr.getResponseHeader("Content-Type") || ""; //服务器返回的文档类型，注意：要该值不为空，服务器端必须设置返回头信息Content-Type，如JSP：resp.setContentType("text/html"); 重要！      
                if (args.dataType) { //如果传入了dataType参数
                    switch (args.dataType) {
                        case "xml":
                            if (http.match("xml")) {
                                args.success(xhr.responseXML, args.dataType);
                            } else {
                                console.log("It's not returned xml data");
                            }
                            break;
                        case "json":
                            var jsonObj = null;
                            try {
                                jsonObj = eval("(" + xhr.responseText + ")"); //将字符串转化为JSON格式
                            } catch (e) {
                                console.log("json data error");
                            }
                            args.success(jsonObj, args.dataType);
                            break;
                        case "text":
                            if (http.match("html")) {
                                args.success(xhr.responseText, args.dataType);
                            } else {
                                console.log("It's not returned text data or Server must set the return header Content-Type");
                            }
                            break;
                        default:
                            console.log("dataType error");
                            break;
                    }
                } else { // 未传入dataType参数            
                    if (http.match("html")) {
                        args.success(xhr.responseText, "text");
                    } else if (http.match("xml")) {
                        args.success(xhr.responseXML, "xml");
                    } else {
                        console.log("getResponseHeader error or Server must set the return header Content-Type");
                    }
                }
            }
        };
        if (/post/i.test(args.method)) {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(data); //如果是post提交方式，通过send("key=value&key=value")提交并发送数据       
        } else {
            xhr.send();
        }
    };
    window['CHB']['ajax'] = ajax;

    /**
     * 创建并返回兼容的XMLHttpRequest对象
     * @return {XMLHttpRequest}
     */
    function createXHR() {
        return window.XMLHttpRequest ?
            new XMLHttpRequest() : //w3c
            new ActiveXObject("Microsoft.XMLHTTP"); //IE6
    }

    /**
     * 将"data {key:value,key:value}"形式转换为"key=value&key=value"形式
     * @param  {Object} data 需要提交的数据
     * @return {String}
     */
    function params(data) {
        var a = [];
        for (var i in data) {
            a.push(encodeURIComponent(i) + "=" + encodeURIComponent(data[i])); //encodeURIComponent()是为了key和value都符合url
        }
        return a.join("&");
    }


    //xml.js  xml操作
    deepCopy(window.CHB, (function() {
        var api = {};
        if (document.implementation && document.implementation.createDocument && !window.ActiveXObject) { //W3C  
            /**
             * 获取一个XML DOM对象
             * @return {XML DOM}  XML DOM对象
             */
            api.getXMLDOM = function() {
                return document.implementation.createDocument("", "", null);
            };

            /**
             * 从服务器上载入XML文件
             * @param  {XML DOM}   xmlDom   XML DOM对象
             * @param  {string}    url      要载入的xml文件地址
             * @param  {function}  callback 回调函数，xml文件加载成功后的操作
             * @return {XML DOM}   XML DOM对象
             */
            api.loadXMLFile = function(xmlDom, url, callback) {
                if (this.getXMLDOM().load) { //FF
                    return (function(xmlDom, url, callback) {
                        if (xmlDom.async == true) { //异步
                            xmlDom.onload = function() {
                                if (xmlDom.documentElement.nodeName == "parsererror") {
                                    throw new Error("XML Error");
                                } else {
                                    callback.call(xmlDom);
                                }
                            };
                        }
                        xmlDom.load(url);
                        return xmlDom;
                    })(xmlDom, url, callback);
                } else { //chrome的XML DOM对象没有load方法，只能通过XMLHttpRequest对象的responseXML属性获取从服务器端返回的XML
                    return (function(xmlDom, url, callback) {
                        var xhr = new XMLHttpRequest();
                        xhr.open("get", url, true);
                        xhr.onreadystatechange = function() {
                            if (xhr.readyState == 4 && xhr.status == 200) {
                                callback.call(xhr.responseXML);
                            }
                        };
                        xhr.send();
                        return xmlDom;
                    })(xmlDom, url, callback);
                }
            };

            /**
             * 向XML DOM输入XML字符串，载入XML字符串
             * @param  {XML DOM} xmlDom  XML DOM对象
             * @param  {string}  xmlStr  输入的XML字符串
             * @return {XML DOM} XML DOM对象
             */
            api.loadXMLString = function(xmlDom, xmlStr) {
                return (function(xmlDom, xmlStr) {
                    var xmlParser = new DOMParser();
                    var newDom = xmlParser.parseFromString(xmlStr, "text/xml");
                    if (newDom.documentElement.nodeName == "parsererror" || newDom.documentElement.firstChild.nodeName == "parsererror") {
                        throw new Error("XML Error");
                    }
                    while (xmlDom.firstChild) { //清除所有的xmlDom节点
                        xmlDom.removeChild(xmlDom.firstChild);
                    }
                    for (var i = 0, n; i < newDom.childNodes.length; i++) { //将newDom的节点加入到xmlDom中
                        n = xmlDom.importNode(newDom.childNodes[i], true); //importNode用于把其它文档中的节点导入到当前文档中，true参数同时导入子节点
                        xmlDom.appendChild(n);
                    }
                    return xmlDom;
                })(xmlDom, xmlStr);
            };

            /**
             * 获取xmlNode节点的xml内容，与outerHTML类似
             * @param  {XML DOM} xmlNode  XML DOM节点对象
             * @return {string}  xmlNode节点的xml内容 
             */
            api.getXML = function(xmlNode) {
                var serializer = new XMLSerializer();
                return serializer.serializeToString(xmlNode, "text/xml");
            };
        } else if (window.ActiveXObject) { //IE
            api.getXMLDOM = function() {
                return new ActiveXObject("Microsoft.XmlDom");
            };

            api.loadXMLFile = function(xmlDom, url, callback) {
                xmlDom.onreadystatechange = function() {
                    if (xmlDom.readyState === 4) {
                        if (xmlDom.parseError.errorCode === 0) {
                            callback.call(xmlDom);
                        } else {
                            throw new Error("XML Error:" + xmlDom.parseError.reason);
                        }
                    }
                };
                xmlDom.load(url);
                return xmlDom;
            };

            api.loadXMLString = function(xmlDom, xmlStr) {
                xmlDom.loadXML(xmlStr);
                if (xmlDom.parseError.errorCode !== 0) {
                    throw new Error("XML Error:" + xmlDom.parseError.reason);
                }
                return xmlDom;
            };

            api.getXML = function(xmlNode) {
                return xmlNode.xml;
            };
        }

        return api;
    })());


    //store.js  本地存储和Cookie操作
    deepCopy(window.CHB, (function() { //本地存储: localStorage--->globalStorage--->userData--->cookie
        var api = {},
            win = window,
            doc = win.document,
            localStorageName = 'localStorage',
            globalStorageName = 'globalStorage',
            storage;

        /**
         * 设置本地存储/Cookie
         * @param {string}     key   本地存储/Cookie名
         * @param {string|any} value 本地存储/Cookie值
         */
        api.setStorage = function(key, value) {};
        /**
         * 获取指定的本地存储/Cookie
         * @param  {string} key 本地存储/Cookie名
         * @return {string|any} 本地存储/Cookie值
         */
        api.getStorage = function(key) {};
        /**
         * 移除指定的本地存储/Cookie
         * @param  {string} key 本地存储/Cookie名
         */
        api.removeStorage = function(key) {};
        /**
         * 清除所有的本地存储/Cookie
         */
        api.clearStorage = function() {};

        if (localStorageName in win && win[localStorageName]) { //DOM localStorage IE下需通过服务器访问
            storage = win[localStorageName];
            api.setStorage = function(key, val) { storage.setItem(key, val); };
            api.getStorage = function(key) {
                return storage.getItem(key); };
            api.removeStorage = function(key) { storage.removeItem(key); };
            api.clearStorage = function() { storage.clear(); };

        } else if (globalStorageName in win && win[globalStorageName]) { //DOM globalStorage
            storage = win[globalStorageName][win.location.hostname];
            api.setStorage = function(key, val) { storage[key] = val; };
            api.getStorage = function(key) {
                return storage[key] && storage[key].value; };
            api.removeStorage = function(key) { delete storage[key]; };
            api.clearStorage = function() {
                for (var key in storage) {
                    delete storage[key];
                }
            };

        } else if (doc.documentElement.addBehavior) { //IE的userData
            function getStore() {
                if (storage) {
                    return storage }
                storage = doc.body.appendChild(doc.createElement('div'));
                storage.style.display = 'none';
                storage.addBehavior('#default#userData');
                storage.load(localStorageName);
                return storage;
            }
            api.setStorage = function(key, val) {
                var storage = getStore();
                storage.setAttribute(key, val);
                storage.save(localStorageName);
            };
            api.getStorage = function(key) {
                var storage = getStore();
                return storage.getAttribute(key);
            };
            api.removeStorage = function(key) {
                var storage = getStore();
                storage.removeAttribute(key);
                storage.save(localStorageName);
            }
            api.clearStorage = function() { //IE9下该方法好像不起作用
                var storage = getStore();
                var attributes = storage.XMLDocument.documentElement.attributes;
                storage.load(localStorageName);
                for (var i = 0, attr; attr = attributes[i]; i++) {
                    storage.removeAttribute(attr.name);
                }
                storage.save(localStorageName);
            }
        } else { //cookie
            /**
             * 设置Cookie
             * @param {string} key Cookie名
             * @param {string} val Cookie值
             * @param {number} expires 隐含参数，表示过期时间，单位为秒
             */
            api.setStorage = function(key, val) {
                var expires = new Date();
                if (!arguments[2]) { expires.setTime(expires.getTime() + 1000 * 60 * 60); } //默认1小时过期
                else { expires.setTime(expires.getTime() + arguments[2] * 1000); }
                document.cookie = key + "=" + encodeURIComponent(val) + "; path=/" + "; expires=" + expires.toGMTString();
            };
            /**
             * 取得Cookie名对应的Cookie值
             * @param {string} key Cookie名
             * @return {string}
             */
            api.getStorage = function(key) {
                var cookies = document.cookie.split("; "); //一个分号加一个空格
                if (!cookies.length) {
                    return ""; }
                for (var i = 0, c; i < cookies.length; i++) {
                    c = cookies[i].split("="); //以赋值号分隔,第一位是Cookie名,第二位是Cookie值
                    if (c[0] == key) {
                        return decodeURIComponent(c[1]);
                    }
                }
                return "";
            };
            /**
             * 取得所有的Cookie
             * @return {string}
             */
            api.getAllStorage = function() {
                return document.cookie || "";
            };
            /**
             * 移除Cookie名对应的Cookie
             * @param {string} key Cookie名
             */
            api.removeStorage = function(key) {
                var expires = new Date();
                expires.setTime(expires.getTime() - 1); //将expires设为一个过去的日期，浏览器会自动删除它
                api.set(key, "", expires);
            };
            /**
             * 移除所有的Cookie
             */
            api.clearStorage = function() {
                var expires = new Date();
                expires.setTime(expires.getTime() - 1); //过去的日期
                var cookies = document.cookie.split("; "); //一个分号加一个空格
                if (!cookies.length) return;
                for (var i = 0, c; i < cookies.length; i++) {
                    c = cookies[i].split("=");
                    api.set(c[0], "", expires);
                }
            };
        }
        return api;
    })());


    //tools.js  工具方法

    /*格式化时间函数，取得想要的时间格式
        参数说明：
        s：必需，字符串，通过"Y m d H i s"几个字符的匹配，获取需要的格式
        t：可选，new Date()对象   
        @return：字符串，格式化后的时间
    */
    function formatDate(s, t) {
        t = t || new Date();
        var re = /Y|m|d|H|i|s/g; //提取出需要的字符
        return s.replace(re, function($1, $2, $3) { //replace第二个参数可以是替换文本或生成替换文本的函数
            //alert($1+"\n"+$2+"\n"+$3+"\n");//我们只需要$1
            switch ($1) {
                case "Y":
                    return t.getFullYear();
                case "m":
                    return t.getMonth() + 1; //月份要+1
                case "d":
                    return t.getDate();
                case "H":
                    return t.getHours();
                case "i":
                    return t.getMinutes();
                case "s":
                    return t.getSeconds();
            }
            return $1;
        })
    }
    window['CHB']['formatDate'] = formatDate;
    //测试
    //alert(formatDate("Y年m月d日 H:i:s"));

    /*html标签格式化函数
        在设置某个对象的innerHTML属性时，可能设置的内容中包含了一些html标签，但是我们不想让这些标签起作用，
        只想让它们作为普通的字符串显示，下面的函数就是起这个作用
        参数说明：
            content：String   传入的内容
            @return： String  格式化后的内容
    */
    function IgnoreHTML(content) {
        var div = document.createElement("div"); //创建"div"标签
        var t = document.createTextNode(""); //创建文本节点
        div.appendChild(t); //文本节点加入到"div"标签中
        return (function() {
            t.nodeValue = content; //将传入的内容设置为文本节点的值
            return div.innerHTML; //返回"div"标签的innerHTML
        })();
    }
    window['CHB']['IgnoreHTML'] = IgnoreHTML;

    deepCopy(window.CHB, {
        isNull: function(o) {
            return o === null;
        },
        isUndefined: function(o) {
            return typeof o === 'undefined';
        },
        isNumber: function(o) { //console.log(typeof 12 === 'number');//true
            //是number类型 && 是有限数字（或可转换为有限数字:不是NaN（非数字）、正/负无穷大的数），那么返回 true。否则返回 false。
            return typeof o === 'number' && isFinite(o);
        },
        isArray: function(o) {
            return o instanceof Array;
        },
        isBoolean: function(o) { //console.log(typeof false === 'boolean');//true
            return typeof o === 'boolean';
        },
        //console.log(typeof fun/Function/Array/Date === 'function');//true，(fun为函数，Function/Array/Date为JS内置函数)
        isFunction: function(o) {
            return typeof o === 'function';
        },
        isObject: function(o) { //使用typeof为object的有：null，数组，对象
            return typeof o === 'object' && !isNull(o) && !(o instanceof Array);
        },
        isString: function(o) {
            return typeof o === 'string'; //console.log(typeof 'sds' === 'string'); //true
        }
    });

    //number.js
    var Num = {
        /*
        检测某个数num是否在数a，b之间
        测试:
            alert(Num.between(5,4,6));//true     
            alert(Num.between(3,4,6));//false
        */
        between: function(num, a, b) {
            var max = Math.max(a, b); //取得a，b间较大的数
            var min = Math.min(a, b); //取得a，b间较小的数
            //num等于a || num等于b || (num比较大的数小 && num比较小的数大)
            return num == a || num == b || (Math.min(max, num) == num && Math.max(min, num) == num);
        }
    };
    deepCopy(window.CHB, Num);

})();
