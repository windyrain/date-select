"use strict";

(function () {
  // 模拟React
  var React = {
    createElement: function createElement(tag, attrs, children) {
      var element = document.createElement(tag);

      for (var name in attrs) {
        if (name && attrs.hasOwnProperty(name)) {
          var value = attrs[name];

          if (value === true) {
            element.setAttribute(name, name);
          } else if (name === 'style') {
            for (var styleAttr in value) {
              element.style[styleAttr] = value[styleAttr];
            }
          } else if (value !== false && value != null) {
            element.setAttribute(name, value.toString());
          }
        }
      }

      var appendChild = function appendChild(child) {
        if (!child) return;
        element.appendChild(child.nodeType == null ? document.createTextNode(child.toString()) : child);
      };

      for (var i = 2; i < arguments.length; i++) {
        var child = arguments[i];

        if (child && child instanceof Array) {
          for (var j = 0; j < child.length; j++) {
            appendChild(child[j]);
          }
        } else {
          appendChild(child);
        }
      }

      return element;
    }
  }; // bind polyfill 兼容bind

  if (!Function.prototype.bind) {
    /*eslint no-extend-native: ["error", { "exceptions": ["Function"] }]*/
    Function.prototype.bind = function (oThis) {
      if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5
        // internal IsCallable function
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
      }

      var aArgs = Array.prototype.slice.call(arguments, 1),
          fToBind = this,
          fNOP = function fNOP() {},
          fBound = function fBound() {
        return fToBind.apply(this instanceof fNOP ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
      };

      if (this.prototype) {
        // Function.prototype doesn't have a prototype property
        fNOP.prototype = this.prototype;
      }

      fBound.prototype = new fNOP();
      return fBound;
    };
  }

  var scope = "fy"; // 找到加载自身的 script 标签并获取 src

  var scripts = document.getElementsByTagName("script");
  var src = scripts[scripts.length - 1].src; // 解析参数，获得scope

  var arg = src.indexOf("?") !== -1 ? src.split("?").pop() : "";
  arg.replace(/(\w+)(?:=([^&]*))?/g, function (a, key, value) {
    if (key === "scope") scope = value;
  }); // 日期选择图标 base64

  var dateIconBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC1klEQVRYR+2XT0gUURzHv7/3GiGKNQvSLJh13hw7BGUYQQSeoiKIICg6BeWlc9SpSxBE5+iSFHUJhCiorh6i8FA3IZzfjCuom6BWrojuzvziyRq7627uboZJvtPM+/3e7/eZ35/33hA2eNAG+8fmAWDmfgBZY8ytWlETERWG4VMAgTHmTj3RrSsCzNwK4BuAWWPM7lqGoyjqSJJkUkTGfd8/sG4AURTtSpJk1kIYY9pqGR4dHd0Xx/GEiEz4vr+/KQBm7gZwXUQ8AMoaIaJtAI6LSAHA+98YbiGiYyKyBODDih4RLYrIgDGmn4jypevLUsDMp0XkZdFhPR/QkI6IfHYcp9d1XRvN5VEGEARBQERGRF4AeKS1TqxSkiQ7AbwWkZzW+mwtr0mS2PoYEJFprfWFUr04jvuI6CKAx8aYq6sAstnsjvn5+RyABc/zWktDNTIyklJKfQcwY4zZUwsgCIK9RPS1WhGOjY115vP5cQAZY0x6FcBKBQOYNMZ0VjppoA2fAODKNqxVyL9SsBZAQ8muotwUADMfUUrZ/NuxkE6nh4hI7IbDzD1a65Zil/xIp9Of7LOIOFEU9RCRtu9KqSnXdYcbBgjD8ISIDJa1DNE5z/NeMfMlAM9LZVrrwxaCmW8CuFcis8AdWuulantJzRQw8xlb+RUAVzzPe8bMfQAelsqUUie7uroGgyC4S0S3S2WO4/hxHE9vLoAgCA4S0RCA7cXcLmqt7Vd+ZOZeEXlLRE5RNuc4ziHXdUNmvgzAHkjLuyiAqVQq5edyOd1QBP606ivXN1yE/wTAVhtuteH/1YaZTKatUCjMrHXmN9ueYRi2i0jWbkzGmPZV9wE7wcwRgLSI3Ndav2nWWbV1cRyfJ6IbIvLO9/1TtQD+9p1wTinV7Xnel6oAdjIMw6Mick1ETOWdsdmIEFFBRIaVUg88z8uUnbDNGl2vdXX9Ga2Xs2p2NhzgJwjYij/jUqzjAAAAAElFTkSuQmCC";
  var dateIconElement = React.createElement("img", {
    src: dateIconBase64,
    alt: "\u65E5\u671F\u9009\u62E9\u56FE\u6807",
    style: {
      margin: "0 5px",
      display: "inline-block",
      width: "16px",
      height: "16px",
      verticalAlign: "middle",
      userSelect: "none"
    }
  }); // 日期回显区域

  var dateDefaultValue = "请选择日期";
  var dateValueElement = React.createElement("span", {
    class: "".concat(scope, "-date-value"),
    style: {
      display: "inline-block",
      height: "30px",
      lineHeight: "30px",
      verticalAlign: "middle",
      userSelect: "none"
    }
  }, dateDefaultValue); // 计算日历该如何展示

  var today = new Date();
  var currentYear = today.getFullYear();
  var currentMonth = today.getMonth();
  var currentDate = today.getDate(); // 日期选择表单

  var DateSelectForm = function DateSelectForm(parentNode) {
    var year = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : currentYear;
    var month = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : currentMonth;
    var date = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : currentDate;
    var hour = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 9;
    var minutes = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '00';
    this.parentNode = parentNode;
    this.year = year;
    this.month = month;
    this.date = date;
    this.hour = hour;
    this.minutes = minutes;
  };

  DateSelectForm.prototype = {
    // 选项卡被选中样式
    selectedTabStyle: {
      height: 23,
      borderBottom: '1px solid #666'
    },
    // 日期被选中的样式
    selectedDateStyle: {
      display: 'inline-block',
      width: '20px',
      height: '20px',
      lineHeight: '20px',
      borderRadius: '3px',
      background: '#666',
      color: '#fff'
    },
    bindEvent: function bindEvent() {
      var self = this;

      this.title.querySelector(".".concat(scope, "-date-submit")).onclick = function () {
        self.parentNode.querySelector(".".concat(scope, "-date-value")).style.color = '#333';
        self.parentNode.querySelector(".".concat(scope, "-date-value")).innerHTML = "".concat(self.year, "/").concat(self.month + 1, "/").concat(self.date, " ").concat(self.hour, ":").concat(self.minutes);
        toggleSelectForm.call(self.parentNode);
      }; // 事件代理


      this.element.onclick = function (event) {
        var evt = event || window.event;
        evt.stopPropagation();
        evt.preventDefault();
        var target = evt.target || evt.srcElement; // 选择日期

        if (target && target.tagName.toLowerCase() === 'td' && target.textContent) {
          self.date = target.textContent;
          self.updateDateTitle();
          self.updateCalendar(target);
        } else if (target && target.className.indexOf('title') > -1) {
          // 选择选项卡
          self.updateTitleTab(target);
        }
      };

      this.hourElement.querySelectorAll('li').forEach(function (item) {
        item.onclick = function () {
          self.updateTimeTitle(this.innerHTML, self.minutes);
          self.updateHour(this);
        };
      });
      this.minutesElement.querySelectorAll('li').forEach(function (item) {
        item.onclick = function () {
          self.updateTimeTitle(self.hour, this.innerHTML);
          self.updateMinutes(this);
        };
      });
    },
    updateHour: function updateHour(el) {
      this.element.querySelector(".".concat(scope, "-selected-hour")).style.color = '';
      this.element.querySelector(".".concat(scope, "-selected-hour")).className = '';
      el.style.color = '#666';
      el.className = "".concat(scope, "-selected-hour");
      this.scrollToCurrentHour();
    },
    updateMinutes: function updateMinutes(el) {
      this.element.querySelector(".".concat(scope, "-selected-minutes")).style.color = '';
      this.element.querySelector(".".concat(scope, "-selected-minutes")).className = '';
      el.style.color = '#666';
      el.className = "".concat(scope, "-selected-minutes");
    },
    updateCalendar: function updateCalendar(el) {
      if (!this.currentSelectedDateEl) {
        this.currentSelectedDateEl = this.element.querySelector(".".concat(scope, "-selected-date"));
      } // 将当前选中项的样式清空


      this.currentSelectedDateEl.parentNode.innerHTML = this.currentSelectedDateEl.innerHTML; // 把新的选中项，填充在td中

      this.currentSelectedDateEl = React.createElement("span", {
        class: "".concat(scope, "-selected-date"),
        style: this.selectedDateStyle
      }, this.date);
      el.innerHTML = '';
      el.appendChild(this.currentSelectedDateEl);
    },
    getCalendar: function getCalendar(year, month, date) {
      var firstDay = new Date(year, month).getDay();
      var daysInMonth = 32 - new Date(year, month, 32).getDate();
      var calendarElement = [];
      var showDate = 1;

      for (var i = 0; i < 6; i++) {
        calendarElement[i] = [];

        for (var j = 0; j < 7; j++) {
          if (i === 0 && j < firstDay) {
            calendarElement[i].push(React.createElement("td", null));
          } else if (showDate > daysInMonth) {
            break;
          } else {
            var renderDate = showDate;

            if (date === showDate) {
              renderDate = React.createElement("span", {
                class: "".concat(scope, "-selected-date"),
                style: this.selectedDateStyle
              }, showDate);
            }

            calendarElement[i].push(React.createElement("td", {
              align: "center",
              style: {
                color: '#999'
              }
            }, renderDate));
            showDate++;
          }
        }
      }

      this.calendarElement = React.createElement("table", {
        style: {
          width: '100%',
          tableLayout: 'fixed',
          fontSize: '12px'
        }
      }, React.createElement("tr", {
        style: {
          height: '30px'
        }
      }, ['日', '一', '二', '三', '四', '五', '六'].map(function (item) {
        return React.createElement("th", {
          align: "center",
          style: {
            color: '#999'
          }
        }, item);
      })), calendarElement.map(function (child) {
        return child.length > 0 ? React.createElement("tr", {
          style: {
            height: 30
          }
        }, child) : null;
      }));
      return this.calendarElement;
    },
    getTitle: function getTitle(year, month, date, hour, minutes) {
      var baseStyle = {
        display: 'inline-block',
        textAlign: 'center'
      };
      this.title = React.createElement("div", {
        style: {
          height: '24px',
          lineHeight: '24px',
          color: '#999',
          background: '#f5f5f5'
        }
      }, React.createElement("span", {
        class: "".concat(scope, "-selected-tab ").concat(scope, "-date-title"),
        style: Object.assign({
          width: '95px'
        }, baseStyle, this.selectedTabStyle)
      }, "".concat(year, "\u5E74").concat(month + 1, "\u6708").concat(date, "\u65E5")), React.createElement("span", {
        class: "".concat(scope, "-time-title"),
        style: Object.assign({
          width: '35px'
        }, baseStyle)
      }, "".concat(hour, ":").concat(minutes)), React.createElement("span", {
        class: "".concat(scope, "-date-submit"),
        style: {
          float: 'right',
          color: '#09a9f5',
          display: 'inline-block',
          marginRight: '6px'
        }
      }, "\u786E\u5B9A"));
      return this.title;
    },
    updateTitleTab: function updateTitleTab(el) {
      if (!this.currentSelectedTabEl) {
        this.currentSelectedTabEl = this.element.querySelector(".".concat(scope, "-selected-tab"));
      }

      this.currentSelectedTabEl.style.height = '';
      this.currentSelectedTabEl.style.borderBottom = '';
      this.currentSelectedTabEl.className = this.currentSelectedTabEl.className.replace(".".concat(scope, "-selected-tab "), '');
      el.className = "".concat(scope, "-selected-tab ").concat(el.className);
      el.style.height = this.selectedTabStyle.height;
      el.style.borderBottom = this.selectedTabStyle.borderBottom;
      this.currentSelectedTabEl = el;

      if (el.className.indexOf('date-title') > -1) {
        this.calendarElement.style.display = '';
        this.timeElement.style.display = 'none';
      } else {
        this.calendarElement.style.display = 'none';
        this.timeElement.style.display = 'block';
        this.scrollToCurrentHour();
      }
    },
    updateDateTitle: function updateDateTitle() {
      var year = this.year,
          month = this.month,
          date = this.date;
      this.element.querySelector(".".concat(scope, "-date-title")).innerHTML = "".concat(year, "\u5E74").concat(month + 1, "\u6708").concat(date, "\u65E5");
    },
    updateTimeTitle: function updateTimeTitle(hour, minutes) {
      this.hour = hour;
      this.minutes = minutes;
      this.element.querySelector(".".concat(scope, "-time-title")).innerHTML = "".concat(hour, ":").concat(minutes);
    },
    getTime: function getTime(hour, minutes) {
      var liStyle = {
        listStyle: 'none'
      };
      this.hourElement = React.createElement("ul", {
        class: "".concat(scope, "-time-hour-select"),
        style: {
          margin: 0,
          padding: '12px 30px',
          display: 'inline-block',
          height: '176px',
          overflow: 'scroll',
          overflowX: 'hidden',
          verticalAlign: 'middle'
        }
      }, ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'].map(function (item) {
        if ('0' + hour === item || hour + '' === item) {
          return React.createElement("li", {
            class: "".concat(scope, "-selected-hour"),
            style: Object.assign({
              color: '#666'
            }, liStyle)
          }, item);
        }

        return React.createElement("li", {
          style: liStyle
        }, item);
      }));
      this.minutesElement = React.createElement("ul", {
        style: {
          position: 'relative',
          top: '20px',
          margin: 0,
          padding: '0px 30px',
          display: 'inline-block',
          overflow: 'hidden'
        }
      }, React.createElement("li", {
        class: "".concat(scope, "-selected-minutes"),
        style: Object.assign({
          color: '#666'
        }, liStyle)
      }, "00"), React.createElement("li", {
        style: liStyle
      }, "30"));
      this.timeElement = React.createElement("div", {
        style: {
          display: 'none',
          textAlign: 'center'
        }
      }, this.hourElement, this.minutesElement);
      return this.timeElement;
    },
    scrollToCurrentHour: function scrollToCurrentHour() {
      this.hourElement.scrollTo(0, (this.hour - 2) * 28, true);
    },
    render: function render() {
      var year = this.year,
          month = this.month,
          date = this.date,
          hour = this.hour,
          minutes = this.minutes;
      this.element = React.createElement("div", {
        class: "".concat(scope, "-date-select-form"),
        style: {
          position: "absolute",
          display: "none",
          top: "30px",
          left: "-1px",
          width: this.parentNode.clientWidth + "px",
          background: "#fff",
          border: '1px solid #f5f5f5',
          zIndex: 1
        }
      }, this.getTitle(year, month, date, hour, minutes), this.getCalendar(year, month, date), this.getTime(hour, minutes));
      this.bindEvent();
      return this.element;
    } // 获取页面中所有的日期选择框

  };
  var dateSelectElements = document.querySelectorAll(".".concat(scope, "-date-select"));

  var toggleSelectForm = function toggleSelectForm() {
    var selectForm = this.querySelector(".".concat(scope, "-date-select-form"));

    if (selectForm.style.display === 'none') {
      selectForm.style.display = 'block';
    } else {
      selectForm.style.display = 'none';
    }
  };

  for (var i = 0, l = dateSelectElements.length; i < l; i++) {
    var el = dateSelectElements[i]; // 添加默认样式

    el.style.position = "relative";
    el.style.border = "1px solid #ddd";
    el.style.borderRadius = "5px";
    el.style.color = "#ccc";
    el.style.height = "28px";
    el.style.lineHeight = "28px";
    el.style.cursor = "pointer";
    el.style.fontSize = "12px"; // 添加Icon、回显区域、日期选择表单

    var dateSelectForm = new DateSelectForm(el);
    el.appendChild(dateIconElement.cloneNode(true));
    el.appendChild(dateValueElement.cloneNode(true));
    el.appendChild(dateSelectForm.render());
    el.onclick = toggleSelectForm.bind(el);
  }
})();
