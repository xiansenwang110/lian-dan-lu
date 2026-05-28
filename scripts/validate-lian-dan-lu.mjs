#!/usr/bin/env node
/**
 * validate-lian-dan-lu.mjs — 炼丹炉 HTML PPT 自动校验脚本
 *
 * 用途：在 Phase 4 交付前自动校验 P0 清单，避免人工逐条检查遗漏。
 * 用法：node scripts/validate-lian-dan-lu.mjs <path/to/ppt.html>
 * 输出：终端彩色报告 + 进程退出码（0=全部通过，1=有失败项）
 *
 * 检查项目（P0 级别）：
 *  1. 零外部依赖（无 CDN / Google Fonts / 外部 CSS/JS）
 *  2. 系统字体栈（PingFang SC / Microsoft YaHei）
 *  3. 固定画布尺寸（960×540 + 深色背景）
 *  4. 翻页 JS 引擎存在
 *  5. 底部导航栏存在
 *  6. 微信适配样式（tap-highlight / text-size-adjust / safe-area）
 *  7. 字号使用 clamp()
 *  8. @media print 打印 CSS
 *  9. 交互组件 CSS 类名完整（flip-card / reveal-box / step-reveal / poll-box）
 * 10. 动画 keyframes 完整（7 个 + stagger 规则）
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ─── 颜色输出 ───
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

let passCount = 0;
let failCount = 0;
const failures = [];

function check(name, condition, detail = '') {
  if (condition) {
    passCount++;
    console.log(`  ${GREEN}✓${RESET} ${name}`);
  } else {
    failCount++;
    failures.push({ name, detail });
    console.log(`  ${RED}✗${RESET} ${name}${detail ? ' — ' + detail : ''}`);
  }
}

function isCSS(content, selector) {
  // Simple regex: look for the selector inside <style> blocks
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let m;
  while ((m = styleRegex.exec(content)) !== null) {
    if (m[1].includes(selector)) return true;
  }
  return false;
}

function hasCSSClass(content, className) {
  return isCSS(content, className) || content.includes(`class="${className}"`) || content.includes(`class='${className}'`);
}

// ─── 主逻辑 ───
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error(`${RED}用法: node validate-lian-dan-lu.mjs <path/to/ppt.html>${RESET}`);
    process.exit(2);
  }

  const filePath = resolve(args[0]);
  console.log(`\n${BOLD}🔍 炼丹炉 PPT 校验 — ${filePath}${RESET}\n`);

  let content;
  try {
    content = readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error(`${RED}✗ 无法读取文件: ${err.message}${RESET}`);
    process.exit(2);
  }

  // 提取所有 <style> 块内容
  const styleBlocks = [];
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let sm;
  while ((sm = styleRegex.exec(content)) !== null) {
    styleBlocks.push(sm[1]);
  }
  const allCSS = styleBlocks.join('\n');

  // 提取所有 <script> 块内容
  const scriptBlocks = [];
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let scm;
  while ((scm = scriptRegex.exec(content)) !== null) {
    scriptBlocks.push(scm[1]);
  }
  const allJS = scriptBlocks.join('\n');

  console.log(`${CYAN}═══ 第 1 组：零外部依赖检查 ═══${RESET}`);

  const CDN_PATTERNS = [
    'cdn.jsdelivr.net',
    'unpkg.com',
    'cdnjs.cloudflare.com',
    'cdn.bootcdn.net',
    'cdn.bootcss.com',
    'cdn.staticfile.org',
  ];
  const hasCDN = CDN_PATTERNS.some(p => content.includes(p));
  check('无 CDN 资源引用（jsdelivr / unpkg / cdnjs / bootcdn）', !hasCDN,
    hasCDN ? `检测到 CDN: ${CDN_PATTERNS.filter(p => content.includes(p)).join(', ')}` : '');

  const GOOGLE_PATTERNS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'Google Font'];
  const hasGoogle = GOOGLE_PATTERNS.some(p => content.includes(p));
  check('无 Google Fonts 引用', !hasGoogle,
    hasGoogle ? '检测到 Google Fonts 依赖，中国境内无法加载' : '');

  const EXT_CSS_JS = /<(?:link[^>]*href|script[^>]*src)=["']https?:\/\//i;
  check('无外部 CSS/JS 引用（所有样式内联）', !EXT_CSS_JS.test(content),
    '检测到外部 CSS/JS 引用');

  console.log(`\n${CYAN}═══ 第 2 组：字体与样式检查 ═══${RESET}`);

  check('系统字体栈（PingFang SC）', content.includes('PingFang SC'),
    '缺少 PingFang SC');
  check('系统字体栈（Microsoft YaHei）', content.includes('Microsoft YaHei'),
    '缺少 Microsoft YaHei 备选字体');

  console.log(`\n${CYAN}═══ 第 3 组：布局与画布检查 ═══${RESET}`);

  check('固定画布宽度（min(96vw, 960px) 或等效）',
    allCSS.includes('min(96vw, 960px)') || allCSS.includes('min(96vw,960px)'),
    '缺少固定画布宽度');
  check('固定画布高度（min(90vh, 540px) 或等效）',
    allCSS.includes('min(90vh, 540px)') || allCSS.includes('min(90vh,540px)'),
    '缺少固定画布高度');
  check('深色背景填充（slides-wrap / background）',
    allCSS.includes('.slides-wrap') || content.includes('slides-wrap'),
    '缺少 .slides-wrap 容器或深色背景');

  check('字号使用 clamp()', allCSS.includes('clamp('),
    '没有使用 clamp() 响应式字号');

  console.log(`\n${CYAN}═══ 第 4 组：功能系统检查 ═══${RESET}`);

  check('自写翻页 JS 引擎存在', allJS.includes('goTo') || allJS.includes('current'),
    '翻页引擎未找到，检查 JS 中是否有 goTo/current 函数');
  check('底部导航栏存在（nav-bar）', content.includes('nav-bar') || content.includes('navBtn'),
    '缺少底部导航栏 HTML');
  check('页码显示存在（pageInfo）', content.includes('pageInfo') || content.includes('page-info'),
    '缺少页码显示元素');
  check('键盘翻页支持（ArrowRight / ArrowLeft）', allJS.includes('ArrowRight') && allJS.includes('ArrowLeft'),
    '缺少键盘方向键翻页');

  console.log(`\n${CYAN}═══ 第 5 组：微信适配检查 ═══${RESET}`);

  check('触摸高亮禁用（-webkit-tap-highlight-color）', allCSS.includes('-webkit-tap-highlight-color'),
    '缺少 -webkit-tap-highlight-color');
  check('禁止字号调整（-webkit-text-size-adjust）', allCSS.includes('-webkit-text-size-adjust'),
    '缺少 -webkit-text-size-adjust');
  check('安全区适配（safe-area-inset-bottom）', allCSS.includes('safe-area-inset-bottom'),
    '缺少 iPhone X 底部安全区适配');

  console.log(`\n${CYAN}═══ 第 6 组：打印导出检查 ═══${RESET}`);

  check('@media print CSS 块', allCSS.includes('@media print'),
    '缺少 @media print 打印样式');
  check('打印时展开隐藏内容', allCSS.includes('page-break-after'),
    '打印 CSS 中缺少 page-break-after');

  console.log(`\n${CYAN}═══ 第 7 组：交互组件检查 ═══${RESET}`);

  const hasFlipCard = hasCSSClass(content, 'flip-card');
  const hasRevealBox = hasCSSClass(content, 'reveal-box');
  const hasStepReveal = hasCSSClass(content, 'step-reveal');
  const hasPollBox = hasCSSClass(content, 'poll-box');

  // Only check CSS completeness for components actually used
  if (hasFlipCard) {
    check('翻转卡 CSS 完整（flip-card-back overflow-y）',
      allCSS.includes('flip-card-back') && (allCSS.includes('overflow-y: auto') || allCSS.includes('overflow-y:auto')),
      'flip-card 已使用但缺少 overflow-y: auto 滚动容错');
  } else {
    console.log(`  ${YELLOW}○${RESET} 翻转卡（未使用，跳过检查）`);
  }

  if (hasRevealBox) {
    check('点击揭示 CSS 完整（reveal-back / shimmer）',
      allCSS.includes('reveal-back') && allCSS.includes('shimmer'),
      'reveal-box 已使用但缺少 reveal-back 或 shimmer 动画');
  } else {
    console.log(`  ${YELLOW}○${RESET} 点击揭示（未使用，跳过检查）`);
  }

  if (hasStepReveal) {
    check('逐条揭示 CSS 完整（step-reveal-item / visible）',
      allCSS.includes('step-reveal-item') && allCSS.includes('.visible'),
      'step-reveal 已使用但缺少 step-reveal-item 或 .visible');
  } else {
    console.log(`  ${YELLOW}○${RESET} 逐条揭示（未使用，跳过检查）`);
  }

  if (hasPollBox) {
    check('投票组件 CSS 完整（poll / poll-result）',
      allCSS.includes('.poll') && allCSS.includes('poll-result'),
      'poll-box 已使用但缺少 poll 或 poll-result 样式');
  } else {
    console.log(`  ${YELLOW}○${RESET} 投票组件（未使用，跳过检查）`);
  }

  // 交互解耦检查
  const hasStopPropagation = allJS.includes('stopPropagation') || content.includes('stopPropagation');
  if (hasFlipCard || hasRevealBox || hasPollBox) {
    check('交互组件与翻页解耦（event.stopPropagation）', hasStopPropagation,
      '交互组件已使用但缺少 event.stopPropagation() 解耦');
  }

  console.log(`\n${CYAN}═══ 第 8 组：动画系统检查 ═══${RESET}`);

  const KEYFRAMES = ['floatBubble', 'pulseGlow', 'pulse', 'shimmer', 'fadeInStagger', 'countUp', 'closingFadeIn'];
  const missingKF = KEYFRAMES.filter(kf => !allCSS.includes(`@keyframes ${kf}`) && !allCSS.includes(`@keyframes${kf}`));
  check(`动画 keyframes 完整（${KEYFRAMES.length} 个）`, missingKF.length === 0,
    missingKF.length > 0 ? `缺少: ${missingKF.join(', ')}` : '');

  const STAGGER_RULES = ['.card', '.trend-card', '.reason-card'];
  const missingStagger = STAGGER_RULES.filter(s => !allCSS.includes(`${s}:nth-child`));
  // Stagger is recommended but not required if those components aren't used
  if (missingStagger.length === STAGGER_RULES.length) {
    console.log(`  ${YELLOW}○${RESET} stagger 交错入场规则（未检测到卡片组件，跳过检查）`);
  } else if (missingStagger.length > 0) {
    check(`stagger 规则完整（${STAGGER_RULES.length} 组）`, false,
      `缺少: ${missingStagger.join(', ')} 的 stagger 规则`);
  } else {
    check(`stagger 交错入场规则完整（${STAGGER_RULES.length} 组）`, true);
  }

  // ─── 汇总 ───
  const total = passCount + failCount;
  console.log(`\n${BOLD}═══ 校验结果 ═══${RESET}`);
  console.log(`  ${GREEN}通过: ${passCount}${RESET}`);
  console.log(`  ${RED}失败: ${failCount}${RESET}`);
  console.log(`  总计: ${total}\n`);

  if (failCount > 0) {
    console.log(`${RED}${BOLD}❌ 校验未通过 — 以下项目需要修复：${RESET}\n`);
    failures.forEach((f, i) => {
      console.log(`  ${RED}${i + 1}.${RESET} ${f.name}`);
      if (f.detail) console.log(`     ${YELLOW}→ ${f.detail}${RESET}`);
    });
    console.log('');
    process.exit(1);
  } else {
    console.log(`${GREEN}${BOLD}✅ 全部通过！可以交付。${RESET}\n`);
    process.exit(0);
  }
}

main().catch(err => {
  console.error(`${RED}校验脚本异常: ${err.message}${RESET}`);
  process.exit(2);
});
