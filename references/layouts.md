# 甯冨眬楠ㄦ灦搴?
> AI 鐢熸垚 PPT 鏃讹紝浠庤繖閲岄€夋ā鏉匡紝濉┖鍗冲彲銆備笉瑕佷粠闆舵墜鍐?HTML銆?
姣忕楠ㄦ灦鍖呭惈锛氱敤閫旇鏄庛€佸畬鏁?HTML銆佸繀闇€ CSS 绫诲悕娓呭崟銆侫I 鍦?Phase 3.1 蹇呴』鍏堢敤绫诲悕棰勬纭鎵€鏈?CSS 绫诲凡瀹氫箟锛屽啀濉叆鍐呭銆?
---

> **v0.5.0 璧峰凡鍗囩骇涓鸿嚜鍐?JS 绂荤嚎缈婚〉绯荤粺銆備互涓嬪叏閮ㄦā鏉垮熀浜?`.slide` div + 鍐呰仈 CSS/JS锛岄浂澶栭儴渚濊禆锛屽井淇＄洿鎺ュ彲鐢ㄣ€?*

---

## 绂荤嚎鐗?HTML 杈撳嚭妯℃澘锛坴0.5.0+锛?
鐐间腹鐐?v0.5.0 璧凤紝榛樿杈撳嚭**闆跺閮ㄤ緷璧栫殑绂荤嚎鐗?HTML**锛屾棤闇€ CDN锛屾棤闇€ Google Fonts锛屽井淇＄洿鎺ユ墦寮€鍗崇敤銆?
### 瀹屾暣 HTML 楠ㄦ灦

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<title>{{TITLE}}</title>
<style>
/* ===== 鍏ㄥ眬閲嶇疆 + 绯荤粺瀛椾綋 ===== */
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

/* ===== 骞荤伅鐗囧鍣?===== */
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

/* ===== 娣辫壊骞曞皝椤碉紙绔犺妭杩囨浮锛?===== */
.slide.section-header{
  background:linear-gradient(135deg,var(--color-accent) 0%,#E65100 100%);
  color:#fff;
}
.slide.section-header *{color:#fff!important}
.slide.section-header .section-num{
  font-size:3.5em;font-weight:700;opacity:.12;
  position:absolute;right:3.5vw;top:1vh;line-height:1;
}

/* ===== 灏侀潰椤?===== */
.slide.cover{
  background:linear-gradient(135deg,var(--color-accent) 0%,#E65100 100%);
  color:#fff;justify-content:center;align-items:flex-start;padding-top:12vh;
}
.slide.cover *{color:#fff!important}

/* ===== 缁撳熬鑷磋阿 ===== */
.slide.closing{
  display:flex;flex-direction:column;justify-content:center;align-items:center;
  text-align:center;
  background:linear-gradient(135deg,var(--color-accent) 0%,var(--color-accent-light) 50%,#FFB088 100%);
  color:#fff;
}
.slide.closing *{color:#fff!important}

/* ===== 鍝嶅簲寮忓瓧鍙?===== */
.slide h1{font-size:clamp(1.8em,4.5vw,2.6em);font-weight:700;line-height:1.15;margin-bottom:.25em}
.slide h2{font-size:clamp(1.35em,3vw,1.9em);font-weight:700;line-height:1.3;margin-bottom:.3em}
.slide h3{font-size:clamp(1em,2.2vw,1.25em);font-weight:500;color:var(--grey);margin-bottom:.4em}
.slide p{font-size:clamp(.88em,1.85vw,.98em);line-height:1.65}
.slide li{font-size:clamp(.82em,1.7vw,.92em);line-height:1.65}
.slide ul{list-style:none;padding:0}

/* ===== 瀹炵敤缁勪欢 ===== */
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

/* ===== 鍗＄墖 ===== */
.card{background:var(--color-card);border:1px solid var(--color-border);border-radius:8px;padding:12px 16px;margin:8px 0}
.card-accent{border-left:4px solid var(--color-accent)}
.card-teal{border-left:4px solid var(--teal)}
.card-green{border-left:4px solid var(--green)}
.card-red{border-left:4px solid var(--red)}
.card-purple{border-left:4px solid var(--purple)}

/* ===== 寮曠敤鍧?===== */
.quote-box{background:#FFF3E0;border-left:4px solid var(--color-accent);border-radius:0 8px 8px 0;padding:12px 16px;margin:12px 0;font-style:italic;font-size:clamp(.8em,2vw,.9em);line-height:1.6}

/* ===== 缃戞牸 ===== */
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:10px}
.three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:10px}
.four-col{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;margin-top:10px}

/* ===== 琛ㄦ牸 ===== */
table{width:100%;border-collapse:collapse;font-size:clamp(.7em,1.6vw,.78em);margin:10px 0}
th{background:var(--color-accent);color:#fff;padding:8px 10px;text-align:left;font-weight:500}
td{padding:8px 10px;border-bottom:1px solid var(--color-border)}
tr:nth-child(even) td{background:var(--color-card)}

/* ===== 搴曢儴瀵艰埅鏍?===== */
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

/* ===== 鎵撳嵃鏍峰紡 ===== */
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
<!-- 浠ヤ笅鎻掑叆楠ㄦ灦/缁勪欢/浜や簰/鍔ㄧ敾鐨勫畬鏁?CSS锛堜粠鏈枃浠跺搴旂珷鑺傚鍒讹級 -->
</head>
<body>
<div class="slides-wrap">

<!-- ====== 骞荤伅鐗囧唴瀹瑰尯锛堥€愰〉濉厖锛?====== -->
<!-- 姣忛〉鐢?<div class="slide [棰濆绫籡"> 鍖呰９ -->

</div><!-- .slides-wrap -->

<!-- 搴曢儴瀵艰埅鏍?-->
<div class="nav-bar">
  <button class="nav-btn" id="prevBtn" disabled>鈼€</button>
  <span class="page-info" id="pageInfo"></span>
  <button class="nav-btn" id="nextBtn">鈻?/button>
</div>

<script>
/* ===== 鑷啓骞荤伅鐗囧紩鎿庯紙~50琛岋紝闆朵緷璧栵級 ===== */
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

  /* 閿洏 */
  document.addEventListener('keydown',function(e){
    if(e.key==='ArrowRight'||e.key==='ArrowDown'||e.key===' '){
      e.preventDefault();goTo(current+1,1);
    }else if(e.key==='ArrowLeft'||e.key==='ArrowUp'){
      e.preventDefault();goTo(current-1,-1);
    }
  });

  /* 瑙︽懜婊戝姩 */
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

  /* 榧犳爣婊氳疆 */
  var wheelTimer=null;
  document.addEventListener('wheel',function(e){
    e.preventDefault();
    if(wheelTimer)return;
    wheelTimer=setTimeout(function(){wheelTimer=null},400);
    if(e.deltaY>0)goTo(current+1,1);
    else if(e.deltaY<0)goTo(current-1,-1);
  },{passive:false});

  /* 鍒濆鍖栵細鏄剧ず绗竴椤?*/
  if(total>0)goTo(0,0);
})();
</script>
</body>
</html>
```

### 鍏抽敭瑙勮寖

1. **闆跺閮ㄤ緷璧?*锛氭墍鏈?CSS/JS 鍐呰仈锛屼笉浣跨敤浠讳綍 CDN 鎴栧閮ㄥ瓧浣?2. **鍥哄畾鐢诲竷**锛?60脳540锛?6:9锛夛紝娣辫壊鑳屾櫙濉厖绌虹櫧锛屾ā鎷?PPT 鏀炬槧鏁堟灉
3. **绯荤粺瀛椾綋**锛歚PingFang SC / Microsoft YaHei / Helvetica Neue / sans-serif`
4. **鍝嶅簲寮忓瓧鍙?*锛氬叏閮ㄤ娇鐢?`clamp()` 涓夋。缂╂斁
5. **涓夐€氶亾瀵艰埅**锛氶敭鐩樻柟鍚戦敭 + 瑙︽懜婊戝姩 + 榧犳爣婊氳疆锛?00ms闃叉姈锛?6. **寰俊鍙敤**锛氱鐢ㄨЕ鎽搁珮浜€佺姝㈠瓧鍙疯皟鏁淬€佸畨鍏ㄥ尯閫傞厤
7. **鍙墦鍗?*锛歚@media print` 灏嗗够鐏墖灞曞紑涓哄叏椤垫樉绀?
### 椤甸潰缁撴瀯绾﹀畾

```html
<!-- 灏侀潰椤?-->
<div class="slide cover active">...</div>

<!-- 绔犺妭骞曞皝 -->
<div class="slide section-header">
  <div class="section-num">01</div>
  ...
</div>

<!-- 鏅€氬唴瀹归〉 -->
<div class="slide">
  <h2>鏍囬</h2>
  <div class="divider"></div>
  ...
  <div class="slide-tag">椤电爜 / 鎬婚〉鏁?/div>
</div>

<!-- 缁撳熬鑷磋阿 -->
<div class="slide closing">...</div>
```

### 宓屽叆浜や簰缁勪欢鐨勬敞鎰忎簨椤?
浜や簰缁勪欢锛坒lip-card銆乺eveal-box銆乻tep-reveal锛夌殑鐐瑰嚮浜嬩欢涓庣炕椤电郴缁?*瀹屽叏瑙ｈ€?*鈥斺€旂偣鍑诲崱鐗囧唴閮ㄤ笉浼氳Е鍙戠炕椤点€傚彧闇€鍦ㄧ粍浠剁殑 onclick 涓皟鐢?`event.stopPropagation()` 鍗冲彲銆?
```html
<div class="flip-card" onclick="event.stopPropagation();this.classList.toggle('flipped')">
```
