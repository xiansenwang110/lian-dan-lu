# 布局骨架库

> AI 生成 PPT 时，从这里选模板，填空即可。不要从零手写 HTML。

每种骨架包含：用途说明、完整 HTML、必需 CSS 类名清单。AI 在 Phase 3.1 必须先用类名预检确认所有 CSS 类已定义，再填入内容。

---

> **v0.5.0 起已升级为自写 JS 离线翻页系统。以下全部模板基于 `.slide` div + 内联 CSS/JS，零外部依赖，微信直接可用。**

---

## 离线版 HTML 输出模板（v0.5.0+）

炼丹炉 v0.5.0 起，默认输出**零外部依赖的离线版 HTML**，无需 CDN，无需 Google Fonts，微信直接打开即用。

### 完整 HTML 骨架

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<title>{{TITLE}}</title>
<style>
/* ===== 全局重置 + 系统字体 ===== */
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --color-accent: #FF6D00;
  --color-accent-light: #FF8F3C;
  --color-text: #1A1A2E;
  --color-text-soft: #555;
  --color-bg: #1a1a2e;
  --color-card: #F8F9FA;
  --color-border: #DADCE0;
  --teal: #0EA5E9;
  --purple: #8B5CF6;
  --green: #10B981;
  --red: #EF4444;
}
html,body{
  height:100%;width:100%;overflow:hidden;
  font-family:'PingFang SC','Microsoft YaHei','Helvetica Neue',sans-serif;
  background:var(--color-bg);color:var(--color-text);
  -webkit-tap-highlight-color:transparent;
  -webkit-text-size-adjust:100%;
  -webkit-font-smoothing:antialiased;
}

/* ===== 幻灯片容器 ===== */
.slides-wrap{
  width:100%;height:100%;position:relative;overflow:hidden;
  background:var(--color-bg);
}
.slide{
  position:absolute;
  top:50%;left:50%;
  transform:translate(-50%,-50%) translateX(100%);
  width:min(96vw,960px);
  height:min(90vh,540px);
  max-height:calc(100vh - 60px);
  background:#fff;
  border-radius:6px;
  box-shadow:0 8px 40px rgba(0,0,0,.35);
  padding:4vh 4.5vw;
  overflow-y:auto;
  -webkit-overflow-scrolling:touch;
  opacity:0;
  transition:transform .35s ease,opacity .35s ease;
  pointer-events:none;
  display:flex;flex-direction:column;
}
.slide.active{
  opacity:1;
  transform:translate(-50%,-50%) translateX(0);
  pointer-events:auto;
  z-index:1;
}

/* ===== 深色幕封页（章节过渡） ===== */
.slide.section-header{
  background:linear-gradient(135deg,var(--color-accent) 0%,#E65100 100%);
  color:#fff;
}
.slide.section-header *{color:#fff!important}
.slide.section-header .section-num{
  font-size:3.5em;font-weight:700;opacity:.12;
  position:absolute;right:3.5vw;top:1vh;line-height:1;
}

/* ===== 封面页 ===== */
.slide.cover{
  background:linear-gradient(135deg,var(--color-accent) 0%,#E65100 100%);
  color:#fff;justify-content:center;align-items:flex-start;padding-top:12vh;
}
.slide.cover *{color:#fff!important}

/* ===== 结尾致谢 ===== */
.slide.closing{
  display:flex;flex-direction:column;justify-content:center;align-items:center;
  text-align:center;
  background:linear-gradient(135deg,var(--color-accent) 0%,var(--color-accent-light) 50%,#FFB088 100%);
  color:#fff;
}
.slide.closing *{color:#fff!important}

/* ===== 响应式字号 ===== */
.slide h1{font-size:clamp(1.8em,4.5vw,2.6em);font-weight:700;line-height:1.15;margin-bottom:.25em}
.slide h2{font-size:clamp(1.35em,3vw,1.9em);font-weight:700;line-height:1.3;margin-bottom:.3em}
.slide h3{font-size:clamp(1em,2.2vw,1.25em);font-weight:500;color:var(--grey);margin-bottom:.4em}
.slide p{font-size:clamp(.88em,1.85vw,.98em);line-height:1.65}
.slide li{font-size:clamp(.82em,1.7vw,.92em);line-height:1.65}
.slide ul{list-style:none;padding:0}

/* ===== 实用组件 ===== */
.divider{height:2px;background:linear-gradient(90deg,var(--color-accent),transparent);margin:12px 0;border:none}
.chip{display:inline-block;padding:4px 14px;border-radius:16px;font-size:.75em;font-weight:500;margin:3px 4px 3px 0}
.chip-accent{background:#FFF3E0;color:var(--color-accent)}
.chip-teal{background:#E0F2FE;color:var(--teal)}
.chip-green{background:#E6F4EA;color:var(--green)}
.chip-red{background:#FCE8E6;color:var(--red)}
.chip-purple{background:#F3E8FF;color:var(--purple)}
.accent-line{width:4px;background:var(--color-accent);display:inline-block;height:1.2em;margin-right:10px;vertical-align:middle;border-radius:2px}
.slide-tag{position:absolute;bottom:60px;right:4vw;font-size:.6em;color:var(--color-border)}
.big-number{font-size:clamp(2em,6vw,2.8em);font-weight:700;color:var(--color-accent);line-height:1}

/* ===== 卡片 ===== */
.card{background:var(--color-card);border:1px solid var(--color-border);border-radius:8px;padding:12px 16px;margin:8px 0}
.card-accent{border-left:4px solid var(--color-accent)}
.card-teal{border-left:4px solid var(--teal)}
.card-green{border-left:4px solid var(--green)}
.card-red{border-left:4px solid var(--red)}
.card-purple{border-left:4px solid var(--purple)}

/* ===== 引用块 ===== */
.quote-box{background:#FFF3E0;border-left:4px solid var(--color-accent);border-radius:0 8px 8px 0;padding:12px 16px;margin:12px 0;font-style:italic;font-size:clamp(.8em,2vw,.9em);line-height:1.6}

/* ===== 网格 ===== */
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:10px}
.three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:10px}
.four-col{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;margin-top:10px}

/* ===== 表格 ===== */
table{width:100%;border-collapse:collapse;font-size:clamp(.7em,1.6vw,.78em);margin:10px 0}
th{background:var(--color-accent);color:#fff;padding:8px 10px;text-align:left;font-weight:500}
td{padding:8px 10px;border-bottom:1px solid var(--color-border)}
tr:nth-child(even) td{background:var(--color-card)}

/* ===== 底部导航栏 ===== */
.nav-bar{
  position:fixed;bottom:0;left:0;right:0;
  display:flex;justify-content:space-between;align-items:center;
  padding:8px 16px;
  padding-bottom:max(8px,env(safe-area-inset-bottom));
  background:rgba(255,255,255,.92);
  backdrop-filter:blur(8px);
  -webkit-backdrop-filter:blur(8px);
  border-top:1px solid var(--color-border);
  z-index:100;
}
.nav-btn{
  width:44px;height:44px;border:none;border-radius:50%;
  background:var(--color-card);color:var(--color-text);
  font-size:20px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  touch-action:manipulation;
}
.nav-btn:active{background:var(--color-border)}
.nav-btn:disabled{opacity:.3;cursor:default}
.page-info{font-size:14px;color:#888;min-width:60px;text-align:center}

/* ===== 打印样式 ===== */
@media print{
  html,body{background:#fff;overflow:visible}
  .slides-wrap{overflow:visible;background:#fff}
  .slide{position:relative!important;top:auto!important;left:auto!important;
    transform:none!important;opacity:1!important;pointer-events:auto!important;
    width:100%!important;height:auto!important;min-height:100vh;
    max-height:none!important;box-shadow:none!important;border-radius:0!important;
    page-break-after:always;margin:0!important}
  .nav-bar{display:none!important}
  .slide-tag{display:none!important}
}
</style>
<!-- 以下插入骨架/组件/交互/动画的完整 CSS（从本文件对应章节复制） -->
</head>
<body>
<div class="slides-wrap">

<!-- ====== 幻灯片内容区（逐页填充） ====== -->
<!-- 每页用 <div class="slide [额外类]"> 包裹 -->

</div><!-- .slides-wrap -->

<!-- 底部导航栏 -->
<div class="nav-bar">
  <button class="nav-btn" id="prevBtn" disabled>◀</button>
  <span class="page-info" id="pageInfo"></span>
  <button class="nav-btn" id="nextBtn">▶</button>
</div>

<script>
/* ===== 自写幻灯片引擎（~50行，零依赖） ===== */
(function(){
  var slides=document.querySelectorAll('.slide');
  var total=slides.length;
  var current=-1;
  var prevBtn=document.getElementById('prevBtn');
  var nextBtn=document.getElementById('nextBtn');
  var pageInfo=document.getElementById('pageInfo');
  var touchStartX=0,touchStartY=0,touching=false;

  function goTo(idx,dir){
    if(idx<0||idx>=total)return;
    if(current>=0){
      var old=slides[current];
      if(dir===undefined)dir=idx>current?1:-1;
      old.classList.remove('active');
      old.style.transform=dir>0
        ?'translate(-50%,-50%) translateX(-100%)'
        :'translate(-50%,-50%) translateX(100%)';
      old.style.opacity='0';
    }
    var next=slides[idx];
    if(dir===undefined)dir=1;
    next.style.transform='translate(-50%,-50%) translateX('+(dir>0?'100%':'-100%')+')';
    next.style.opacity='0';
    next.classList.add('active');
    void next.offsetWidth;
    next.style.transform='translate(-50%,-50%) translateX(0)';
    next.style.opacity='1';
    current=idx;
    next.scrollTop=0;
    update();
  }

  function update(){
    prevBtn.disabled=current===0;
    nextBtn.disabled=current===total-1;
    pageInfo.textContent=(current+1)+' / '+total;
  }

  prevBtn.onclick=function(){goTo(current-1,-1)};
  nextBtn.onclick=function(){goTo(current+1,1)};

  /* 键盘 */
  document.addEventListener('keydown',function(e){
    if(e.key==='ArrowRight'||e.key==='ArrowDown'||e.key===' '){
      e.preventDefault();goTo(current+1,1);
    }else if(e.key==='ArrowLeft'||e.key==='ArrowUp'){
      e.preventDefault();goTo(current-1,-1);
    }
  });

  /* 触摸滑动 */
  document.addEventListener('touchstart',function(e){
    if(e.touches.length===1){
      touchStartX=e.touches[0].clientX;
      touchStartY=e.touches[0].clientY;
      touching=true;
    }
  },{passive:true});
  document.addEventListener('touchend',function(e){
    if(!touching)return;touching=false;
    var dx=e.changedTouches[0].clientX-touchStartX;
    var dy=e.changedTouches[0].clientY-touchStartY;
    if(Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>40){
      if(dx<0)goTo(current+1,1);
      else goTo(current-1,-1);
    }
  },{passive:true});

  /* 鼠标滚轮 */
  var wheelTimer=null;
  document.addEventListener('wheel',function(e){
    e.preventDefault();
    if(wheelTimer)return;
    wheelTimer=setTimeout(function(){wheelTimer=null},400);
    if(e.deltaY>0)goTo(current+1,1);
    else if(e.deltaY<0)goTo(current-1,-1);
  },{passive:false});

  /* 初始化：显示第一页 */
  if(total>0)goTo(0,0);
})();
</script>
</body>
</html>
```

### 关键规范

1. **零外部依赖**：所有 CSS/JS 内联，不使用任何 CDN 或外部字体
2. **固定画布**：960×540（16:9），深色背景填充空白，模拟 PPT 放映效果
3. **系统字体**：`PingFang SC / Microsoft YaHei / Helvetica Neue / sans-serif`
4. **响应式字号**：全部使用 `clamp()` 三档缩放
5. **三通道导航**：键盘方向键 + 触摸滑动 + 鼠标滚轮（400ms防抖）
6. **微信可用**：禁用触摸高亮、禁止字号调整、安全区适配
7. **可打印**：`@media print` 将幻灯片展开为全页显示

### 页面结构约定

```html
<!-- 封面页 -->
<div class="slide cover active">...</div>

<!-- 章节幕封 -->
<div class="slide section-header">
  <div class="section-num">01</div>
  ...
</div>

<!-- 普通内容页 -->
<div class="slide">
  <h2>标题</h2>
  <div class="divider"></div>
  ...
  <div class="slide-tag">页码 / 总页数</div>
</div>

<!-- 结尾致谢 -->
<div class="slide closing">...</div>
```

### 嵌入交互组件的注意事项

交互组件（flip-card、reveal-box、step-reveal）的点击事件与翻页系统**完全解耦**——点击卡片内部不会触发翻页。只需在组件的 onclick 中调用 `event.stopPropagation()` 即可。

```html
<div class="flip-card" onclick="event.stopPropagation();this.classList.toggle('flipped')">
```
