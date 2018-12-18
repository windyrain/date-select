(function() {
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

      var appendChild = function(child) {
        if (!child) return;
        element.appendChild(
          child.nodeType == null
            ? document.createTextNode(child.toString())
            : child
        );
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
  };

  // bind polyfill 兼容bind
  if (!Function.prototype.bind) {
    /*eslint no-extend-native: ["error", { "exceptions": ["Function"] }]*/
    Function.prototype.bind = function(oThis) {
      if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5
        // internal IsCallable function
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
      }
  
      var aArgs   = Array.prototype.slice.call(arguments, 1),
          fToBind = this,
          fNOP    = function() {},
          fBound  = function() {
            return fToBind.apply(this instanceof fNOP
                   ? this
                   : oThis,
                   aArgs.concat(Array.prototype.slice.call(arguments)));
          };
  
      if (this.prototype) {
        // Function.prototype doesn't have a prototype property
        fNOP.prototype = this.prototype; 
      }
      fBound.prototype = new fNOP();
  
      return fBound;
    };
  }

  var scope = "fy";

  // 找到加载自身的 script 标签并获取 src
  var scripts = document.getElementsByTagName("script");
  var src = scripts[scripts.length - 1].src;

  // 解析参数，获得scope
  var arg = src.indexOf("?") !== -1 ? src.split("?").pop() : "";
  arg.replace(/(\w+)(?:=([^&]*))?/g, function(a, key, value) {
    if (key === "scope") scope = value;
  });

  // 日期选择图标 base64
  var dateIconBase64 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC1klEQVRYR+2XT0gUURzHv7/3GiGKNQvSLJh13hw7BGUYQQSeoiKIICg6BeWlc9SpSxBE5+iSFHUJhCiorh6i8FA3IZzfjCuom6BWrojuzvziyRq7627uboZJvtPM+/3e7/eZ35/33hA2eNAG+8fmAWDmfgBZY8ytWlETERWG4VMAgTHmTj3RrSsCzNwK4BuAWWPM7lqGoyjqSJJkUkTGfd8/sG4AURTtSpJk1kIYY9pqGR4dHd0Xx/GEiEz4vr+/KQBm7gZwXUQ8AMoaIaJtAI6LSAHA+98YbiGiYyKyBODDih4RLYrIgDGmn4jypevLUsDMp0XkZdFhPR/QkI6IfHYcp9d1XRvN5VEGEARBQERGRF4AeKS1TqxSkiQ7AbwWkZzW+mwtr0mS2PoYEJFprfWFUr04jvuI6CKAx8aYq6sAstnsjvn5+RyABc/zWktDNTIyklJKfQcwY4zZUwsgCIK9RPS1WhGOjY115vP5cQAZY0x6FcBKBQOYNMZ0VjppoA2fAODKNqxVyL9SsBZAQ8muotwUADMfUUrZ/NuxkE6nh4hI7IbDzD1a65Zil/xIp9Of7LOIOFEU9RCRtu9KqSnXdYcbBgjD8ISIDJa1DNE5z/NeMfMlAM9LZVrrwxaCmW8CuFcis8AdWuulantJzRQw8xlb+RUAVzzPe8bMfQAelsqUUie7uroGgyC4S0S3S2WO4/hxHE9vLoAgCA4S0RCA7cXcLmqt7Vd+ZOZeEXlLRE5RNuc4ziHXdUNmvgzAHkjLuyiAqVQq5edyOd1QBP606ivXN1yE/wTAVhtuteH/1YaZTKatUCjMrHXmN9ueYRi2i0jWbkzGmPZV9wE7wcwRgLSI3Ndav2nWWbV1cRyfJ6IbIvLO9/1TtQD+9p1wTinV7Xnel6oAdjIMw6Mick1ETOWdsdmIEFFBRIaVUg88z8uUnbDNGl2vdXX9Ga2Xs2p2NhzgJwjYij/jUqzjAAAAAElFTkSuQmCC";
  var dateIconElement = (
    <img src={dateIconBase64} alt="日期选择图标" style={{
      margin: "0 5px",
      display: "inline-block",
      width: "16px",
      height: "16px",
      verticalAlign: "middle",
      userSelect: "none"
    }} />
  );

  const prev = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABAUlEQVQ4T5WTz2qEMBDGZ6IX3WKhr1Na2qV76oN48CYEhL14FAQPguc+Ra/7Bx9noSBEqSU4i2Ag9c+uyTHk+80330wQVp48z722bc8AkHPOv5QM1+iVGBGFEGIXx/HvaoBWufU8b+v7fqMXvelAF7uu+xEEgRg7XgRotslxnNc5cQ+bBehiKeV7FEXVUlYTgCa2pJQvt8QTB0VRPDRNUyKixRh7C8Pw596U/jlI03SDiCUAOIyxZ2NAXy1Jkkfbto8AYBu3oOxqEDAOcQ5iPMYxhIj+5rZwcQ/05Id2+mCr8T9YBegfZVn21HXdiYgudV1/Gn0m5WaAHIhozzn/VvdX4zaUEWVRn9QAAAAASUVORK5CYII=';
  const prevYear = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAnklEQVQ4T52T2w2DMAxFY3mBjsQodAMiWdkiChuVDUo36QCxgvxRVCAPnHz7HDm612Aaz3s/MvPqnFt/oyGEBzMHRLRQ4wVOKU2IOFhrvzIrcIzxBQAfIhqLgjuwCLOCu3BWoIEvAi18EPTAu6AXbgqYeTHGvInoWYp7T6G0RUtyiLFHcumBVqIqUu476iqfJV3H9C+pCiS6yjnPiDhtaVX7i1g3XiwAAAAASUVORK5CYII=';
  const next = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA/ElEQVQ4T63TsUrEQBAG4H9UlnA7YGNxWNjYWdnYyN1VPk/KFKmmTx7APICFgbM4TkQEHybVgdgkXYqMBHKS6OY2glstDHzszD9L6J0kSe4A3KvqIoqiXb82dqd+Ic/z46IongBcNU2znIIMgBYTkRNmXk9FfgE9ZAvg0vcSJ9Ahxlr7QkQXxpjbMAw/XHMYBToksNY+E9G5MWblQg4Ce4SZ3wCcuRAv0CJZls3KsnwnotO6rhdxHH/u25kMVFX1CmD+cx5eQESCroW5KxHfEL+TGIvzYIzMvPHtwv8v0l//w+AFInLEzI8Arn0r7IwxTdMbVX1Q1dWUn9giX8l9gxHqCAJNAAAAAElFTkSuQmCC';
  const nextYear = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAm0lEQVQ4T6XT0QkDIQwG4NwGHamjXCdowehz+x7xRriROpD8Fg8qldO25nwRA/+HETMREYnIAmB1zj3zOa8QwgnA1RjzeNda+5SL3vsZwJJSOn8iIrISUWLmSw/ZgCNIAbRIBWiQHTCKNIERpAv8ixwBiJlnbQtbON9S84gl3AR+/MoqvANGwxWgCRdAGy5Ab5xjjDdr7f3bOL8AM5H3EfFdbfsAAAAASUVORK5CYII=';

  // 日期回显区域
  var dateDefaultValue = "开始时间 ～ 结束时间";
  var dateValueElement = (
    <span
      class={`${scope}-date-value`}
      style={{
        display: "inline-block",
        height: "30px",
        lineHeight: "30px",
        verticalAlign: "middle",
        userSelect: "none"
      }}>
      {dateDefaultValue}
    </span>
  );

  // 计算日历该如何展示
  var today = new Date();
  var currentYear = today.getFullYear();
  var currentMonth = today.getMonth();
  var currentDate = today.getDate();

  // 日期选择表单
  var DateSelectForm = function(parentNode, year = currentYear, month = currentMonth, date = currentDate, hour = 9, minutes = '00') {
    this.parentNode = parentNode;

    const formatDate = new Date(year, month, date);

    this.year = formatDate.getFullYear();
    this.month = formatDate.getMonth();
    this.date = formatDate.getDate();
    this.hour = hour;
    this.minutes = minutes;
  }

  DateSelectForm.prototype = {

    // 选项卡被选中样式
    selectedTabStyle: {
      // height: 23,
      // borderBottom: '1px solid #666'
    },

    // 日期被选中的样式
    selectedDateStyle: {
      display: 'inline-block', 
      width: '20px', 
      height: '20px',
      lineHeight: '20px', 
      borderRadius: '3px', 
      background: '#09a9f5', 
      color: '#fff'
    },

    formatDate: function() {
      const formatDate = new Date(this.year, this.month, this.date);

      this.year = formatDate.getFullYear();
      this.month = formatDate.getMonth();
      this.date = formatDate.getDate();
    },

    bindEvent: function() {
      var self = this;

      // this.title.querySelector(`.${scope}-date-submit`).onclick = function() {
      //   self.parentNode.querySelector(`.${scope}-date-value`).style.color = '#333';
      //   self.parentNode.querySelector(`.${scope}-date-value`).innerHTML = `${self.year}/${self.month+1}/${self.date} ${self.hour}:${self.minutes}`;
      //   toggleSelectForm.call(self.parentNode);
      // }

      // 事件代理
      this.element.onclick = function(event) {
        var evt = event || window.event;
        var target = evt.target || evt.srcElement;

        // 选择日期
        if (target && target.tagName.toLowerCase() === 'td' && target.textContent) {
          self.date = target.textContent;
          self.updateDateTitle();
          self.updateCalendar(target);
        } else if (target && target.className.indexOf('title') > -1) {
          // 选择选项卡
          self.updateTitleTab(target);
        }

        if (target && target.className === `${scope}-prev-month`) {
          self.month -= 1;
          self.formatDate();
          self.getTitle(self.year, self.month, self.date, self.hour, self.minutes, true);
          self.getCalendar(self.year, self.month, self.date, true);
        }

        if (target && target.className === `${scope}-prev-year`) {
          self.year -= 1;
          self.formatDate();
          self.getTitle(self.year, self.month, self.date, self.hour, self.minutes, true);
          self.getCalendar(self.year, self.month, self.date, true);
        }

        if (target && target.className === `${scope}-next-month`) {
          self.month += 1;
          self.formatDate();
          self.getTitle(self.year, self.month, self.date, self.hour, self.minutes, true);
          self.getCalendar(self.year, self.month, self.date, true);
        }

        if (target && target.className === `${scope}-next-year`) {
          self.year += 1;
          self.formatDate();
          self.getTitle(self.year, self.month, self.date, self.hour, self.minutes, true);
          self.getCalendar(self.year, self.month, self.date, true);
        }
      }

      this.hourElement.querySelectorAll('li').forEach((item) => {
        item.onclick = function() {
          self.updateTimeTitle(this.innerHTML, self.minutes);
          self.updateHour(this);
        }
      });

      this.minutesElement.querySelectorAll('li').forEach((item) => {
        item.onclick = function() {
          self.updateTimeTitle(self.hour, this.innerHTML);
          self.updateMinutes(this);
        }
      });
    },

    updateHour: function(el) {
      this.element.querySelector(`.${scope}-selected-hour`).style.color = '';
      this.element.querySelector(`.${scope}-selected-hour`).className = '';

      el.style.color = '#666';
      el.className = `${scope}-selected-hour`;

      this.scrollToCurrentHour();
    },

    updateMinutes: function(el) {
      this.element.querySelector(`.${scope}-selected-minutes`).style.color = '';
      this.element.querySelector(`.${scope}-selected-minutes`).className = '';

      el.style.color = '#666';
      el.className = `${scope}-selected-minutes`;
    },

    updateCalendar: function(el) {
      if (!this.currentSelectedDateEl) {
        this.currentSelectedDateEl = this.element.querySelector(`.${scope}-selected-date`);
      }

      if (!this.currentSelectedDateEl) {
        this.currentSelectedDateEl = (<span class={`${scope}-selected-date`} style={this.selectedDateStyle}>{this.date}</span>);
      } else {
        // 将当前选中项的样式清空
        this.currentSelectedDateEl.parentNode.innerHTML = this.currentSelectedDateEl.innerHTML;
      }
      
      // 把新的选中项，填充在td中
      this.currentSelectedDateEl = (<span class={`${scope}-selected-date`} style={this.selectedDateStyle}>{this.date}</span>);
      el.innerHTML = '';
      el.appendChild(this.currentSelectedDateEl);
    },

    getCalendar: function(year, month, date, update = false) {
      var firstDay = (new Date(year, month)).getDay();
      var daysInMonth = 32 - new Date(year, month, 32).getDate();
  
      var calendarElement = [];
  
      var showDate = 1;
  
      for (var i = 0; i < 6; i++) {
        calendarElement[i] = [];
        for (var j = 0; j < 7; j++) {
          if (i === 0 && j < firstDay) {
            calendarElement[i].push(<td/>);
          } else if (showDate > daysInMonth) {
            break;
          } else {
            var renderDate = showDate;
  
            if (date === showDate && year === currentYear && month === currentMonth) {
              renderDate = (<span class={`${scope}-selected-date`} style={this.selectedDateStyle}>{showDate}</span>)
            }
  
            calendarElement[i].push(<td align="center" style={{color: '#999'}}>{renderDate}</td>);
            showDate++;
          }
        }
      }
      
      var el = (
        <table class="calendar-container" style={{width: '100%', tableLayout: 'fixed', fontSize: '12px'}}>
          <tr style={{height: '30px'}}>
            {
              ['日', '一', '二', '三', '四', '五', '六'].map(item => <th align="center" style={{color: '#999'}}>{item}</th>)
            }
          </tr>
          {calendarElement.map(child => child.length > 0 ? <tr style={{height: 30}}>{child}</tr> : null)}
        </table>
      );

      if (update) {  
        this.element.removeChild(this.calendarElement);
        this.element.appendChild(el);
        this.calendarElement = el;
      } else {
        this.calendarElement = el
        return this.calendarElement;
      }
    },

    getTitle: function(year, month, date, hour, minutes, update = false) {
      var baseStyle = {
        display: 'inline-block',
        textAlign: 'center'
      };

      var iconStyle = {width: '8px', height: '8px', padding: '0 4px'};

      var el = (
        <div style={{textAlign: 'center', height: '24px', lineHeight: '24px', color:'#999', background: '#f5f5f5'}}>
          <img class={`${scope}-prev-year`} style={iconStyle} src={prevYear} alt="上一年" />
          <img class={`${scope}-prev-month`} style={iconStyle} src={prev} alt="上个月" />
          <span class={`${scope}-selected-tab ${scope}-date-title`} style={Object.assign({width: '95px'}, baseStyle, this.selectedTabStyle)}>{`${year}年${month+1}月${date}日`}</span>
          {/* <span class={`${scope}-time-title`} style={Object.assign({width: '35px'}, baseStyle)}>{`${hour}:${minutes}`}</span> */}
          <img class={`${scope}-next-month`} style={iconStyle} src={next} alt="下个月" />
          <img class={`${scope}-next-year`} style={iconStyle} src={nextYear} alt="下一年" />
        </div>
      );

      if (update) {  
        this.element.removeChild(this.title);
        this.element.appendChild(el);
        this.title = el;
      } else {
        this.title = el
        return this.title;
      }
    },

    updateTitleTab: function(el) {
      if (!this.currentSelectedTabEl) {
        this.currentSelectedTabEl = this.element.querySelector(`.${scope}-selected-tab`);
      }

      this.currentSelectedTabEl.style.height = '';
      this.currentSelectedTabEl.style.borderBottom = '';
      this.currentSelectedTabEl.className = this.currentSelectedTabEl.className.replace(`.${scope}-selected-tab `, '');

      el.className = `${scope}-selected-tab ${el.className}`;
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

    updateDateTitle: function() {
      const {
        year, month, date
      } = this;

      this.element.querySelector(`.${scope}-date-title`).innerHTML = `${year}年${month+1}月${date}日`;
    },

    updateTimeTitle: function(hour, minutes) {
      this.hour = hour;
      this.minutes = minutes;
      this.element.querySelector(`.${scope}-time-title`).innerHTML = `${hour}:${minutes}`;
    },

    getTime: function(hour, minutes) {
      var liStyle = {
        listStyle: 'none'
      };

      this.hourElement = (
        <ul class={`${scope}-time-hour-select`} style={{margin: 0, padding: '12px 30px', display: 'inline-block', height: '176px', overflow: 'scroll', overflowX: 'hidden', verticalAlign: 'middle'}}>
          {
            ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'].map(item => {
              if ('0' + hour === item || hour + '' === item) {
                return <li class={`${scope}-selected-hour`} style={Object.assign({color: '#666'}, liStyle)}>{item}</li>;
              }
              return <li style={liStyle}>{item}</li>;
            })
          }
        </ul>
      );

      this.minutesElement = (
        <ul style={{position: 'relative', top: '20px', margin: 0, padding: '0px 30px', display: 'inline-block', overflow: 'hidden'}}>
          <li class={`${scope}-selected-minutes`} style={Object.assign({color: '#666'}, liStyle)}>00</li>
          <li style={liStyle}>30</li>
        </ul>
      )

      this.timeElement = (
        <div style={{display: 'none', textAlign: 'center'}}>
          {this.hourElement}
          {this.minutesElement}
        </div>
      );

      return this.timeElement;
    },

    scrollToCurrentHour() {
      this.hourElement.scrollTo(0, (this.hour - 2) * 28, true);
    },

    getYMD() {
      return `${this.year}/${this.month+1}/${this.date}`;
    },

    render: function(props = {}) {
      const {
        year, month, date, hour, minutes
      } = this;

      this.element = (
        <div
          class={`${scope}-date-select-form`} 
          style={{
            position: "absolute",
            display: "none",
            top: "30px",
            left: props.left || "-1px",
            width: props.width || (this.parentNode.clientWidth + "px"),
            background: "#fff",
            border: '1px solid #f5f5f5',
            zIndex: 1
          }}>
          {this.getTitle(year, month, date, hour, minutes)}
          {this.getCalendar(year, month, date)}
          {this.getTime(hour, minutes)}
        </div>
      );

      this.bindEvent();

      return this.element;
    }
  }

  var RangePicker = function(parentNode, width) {
    this.parentNode = parentNode;
    this.width = width;
    this.startDateSelectForm = new DateSelectForm(parentNode, currentYear, currentMonth, currentDate, 0, '00');
    this.endDateSelectForm = new DateSelectForm(parentNode, currentYear, currentMonth + 1, currentDate, 24, '00');
  }

  RangePicker.prototype = {
    render: function() {
      const { width } = this;

      this.element = (
        <div class={`${scope}-range-date-select-wrapper`}>
          {this.startDateSelectForm.render({width})}
          {this.endDateSelectForm.render({width, left: width})}
        </div>
      );

      this.bindEvent();

      return this.element;
    },

    bindEvent: function() {
      var self = this;

      this.element.onclick = function(event) {
        var evt = event || window.event;
        evt.stopPropagation();
        evt.preventDefault();
        var target = evt.target || evt.srcElement;

        // 选择日期
        if (target && target.tagName.toLowerCase() === 'td' && target.textContent) {
          var dates = self.parentNode.querySelectorAll(`.${scope}-selected-date`);

          if (dates.length === 2) {
            toggleSelectForm.call(self.parentNode);
            self.parentNode.querySelector(`.${scope}-date-value`).style.color = '#666';
            self.parentNode.querySelector(`.${scope}-date-value`).innerHTML = `${self.startDateSelectForm.getYMD()} ~ ${self.endDateSelectForm.getYMD()}`;
          }
        } 

      }
    }
  }

  // 获取页面中所有的日期选择框
  var dateSelectElements = document.querySelectorAll(`.${scope}-date-select`);
  var toggleSelectForm = function() {
    var selectForms = this.querySelectorAll(`.${scope}-date-select-form`);

    for (var i = 0, l = selectForms.length; i < l; i++) {
      var selectForm = selectForms[i];
      if (selectForm.style.display === 'none') {
        selectForm.style.display = 'block';
      } else {
        selectForm.style.display = 'none';
      }
    }
  }

  for (var i = 0, l = dateSelectElements.length; i < l; i++) {
    var el = dateSelectElements[i];
    var width = el.clientWidth + 'px';
  
    if (el.getAttribute('data-type') !== 'range') return;
    if (el.getAttribute('data-width')) {
      width = parseInt(el.getAttribute('data-width'), 10) + 'px';
    }

    // 添加默认样式
    el.style.position = "relative";
    el.style.border = "1px solid #ddd";
    el.style.borderRadius = "5px";
    el.style.color = "#ccc";
    el.style.height = "28px";
    el.style.lineHeight = "28px";
    el.style.cursor = "pointer";
    el.style.fontSize = "12px";

    // 添加Icon、回显区域、日期选择表单
    var rangePicker = new RangePicker(el, width);
    el.appendChild(dateIconElement.cloneNode(true));
    el.appendChild(dateValueElement.cloneNode(true));
    el.appendChild(rangePicker.render());
    el.onclick = toggleSelectForm.bind(el);
  }
})();
