#!/usr/bin/env node
/**
 * validate-lian-dan-lu.mjs 鈥?鐐间腹鐐?HTML PPT 鑷姩鏍￠獙鑴氭湰
 *
 * 鐢ㄩ€旓細鍦?Phase 4 浜や粯鍓嶈嚜鍔ㄦ牎楠?P0 娓呭崟锛岄伩鍏嶄汉宸ラ€愭潯妫€鏌ラ仐婕忋€? * 鐢ㄦ硶锛歯ode scripts/validate-lian-dan-lu.mjs <path/to/ppt.html>
 * 杈撳嚭锛氱粓绔僵鑹叉姤鍛?+ 杩涚▼閫€鍑虹爜锛?=鍏ㄩ儴閫氳繃锛?=鏈夊け璐ラ」锛? *
 * 妫€鏌ラ」鐩紙P0 绾у埆锛夛細
 *  1. 闆跺閮ㄤ緷璧栵紙鏃?CDN / Google Fonts / 澶栭儴 CSS/JS锛? *  2. 绯荤粺瀛椾綋鏍堬紙PingFang SC / Microsoft YaHei锛? *  3. 鍥哄畾鐢诲竷灏哄锛?60脳540 + 娣辫壊鑳屾櫙锛? *  4. 缈婚〉 JS 寮曟搸瀛樺湪
 *  5. 搴曢儴瀵艰埅鏍忓瓨鍦? *  6. 寰俊閫傞厤鏍峰紡锛坱ap-highlight / text-size-adjust / safe-area锛? *  7. 瀛楀彿浣跨敤 clamp()
 *  8. @media print 鎵撳嵃 CSS
 *  9. 浜や簰缁勪欢 CSS 绫诲悕瀹屾暣锛坒lip-card / reveal-box / step-reveal / poll-box锛? * 10. 鍔ㄧ敾 keyframes 瀹屾暣锛? 涓?+ stagger 瑙勫垯锛? */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// 鈹€鈹€鈹€ 棰滆壊杈撳嚭 鈹€鈹€鈹€
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
    console.log(`  ${GREEN}鉁?{RESET} ${name}`);
  } else {
    failCount++;
    failures.push({ name, detail });
    console.log(`  ${RED}鉁?{RESET} ${name}${detail ? ' 鈥?' + detail : ''}`);
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

// 鈹€鈹€鈹€ 涓婚€昏緫 鈹€鈹€鈹€
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error(`${RED}鐢ㄦ硶: node validate-lian-dan-lu.mjs <path/to/ppt.html>${RESET}`);
    process.exit(2);
  }

  const filePath = resolve(args[0]);
  console.log(`\n${BOLD}馃攳 鐐间腹鐐?PPT 鏍￠獙 鈥?${filePath}${RESET}\n`);

  let content;
  try {
    content = readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error(`${RED}鉁?鏃犳硶璇诲彇鏂囦欢: ${err.message}${RESET}`);
    process.exit(2);
  }

  // 鎻愬彇鎵€鏈?<style> 鍧楀唴瀹?  const styleBlocks = [];
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let sm;
  while ((sm = styleRegex.exec(content)) !== null) {
    styleBlocks.push(sm[1]);
  }
  const allCSS = styleBlocks.join('\n');

  // 鎻愬彇鎵€鏈?<script> 鍧楀唴瀹?  const scriptBlocks = [];
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let scm;
  while ((scm = scriptRegex.exec(content)) !== null) {
    scriptBlocks.push(scm[1]);
  }
  const allJS = scriptBlocks.join('\n');

  console.log(`${CYAN}鈺愨晲鈺?绗?1 缁勶細闆跺閮ㄤ緷璧栨鏌?鈺愨晲鈺?{RESET}`);

  const CDN_PATTERNS = [
    'cdn.jsdelivr.net',
    'unpkg.com',
    'cdnjs.cloudflare.com',
    'cdn.bootcdn.net',
    'cdn.bootcss.com',
    'cdn.staticfile.org',
  ];
  const hasCDN = CDN_PATTERNS.some(p => content.includes(p));
  check('鏃?CDN 璧勬簮寮曠敤锛坖sdelivr / unpkg / cdnjs / bootcdn锛?, !hasCDN,
    hasCDN ? `妫€娴嬪埌 CDN: ${CDN_PATTERNS.filter(p => content.includes(p)).join(', ')}` : '');

  const GOOGLE_PATTERNS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'Google Font'];
  const hasGoogle = GOOGLE_PATTERNS.some(p => content.includes(p));
  check('鏃?Google Fonts 寮曠敤', !hasGoogle,
    hasGoogle ? '妫€娴嬪埌 Google Fonts 渚濊禆锛屼腑鍥藉鍐呮棤娉曞姞杞? : '');

  const EXT_CSS_JS = /<(?:link[^>]*href|script[^>]*src)=["']https?:\/\//i;
  check('鏃犲閮?CSS/JS 寮曠敤锛堟墍鏈夋牱寮忓唴鑱旓級', !EXT_CSS_JS.test(content),
    '妫€娴嬪埌澶栭儴 CSS/JS 寮曠敤');

  console.log(`\n${CYAN}鈺愨晲鈺?绗?2 缁勶細瀛椾綋涓庢牱寮忔鏌?鈺愨晲鈺?{RESET}`);

  check('绯荤粺瀛椾綋鏍堬紙PingFang SC锛?, content.includes('PingFang SC'),
    '缂哄皯 PingFang SC');
  check('绯荤粺瀛椾綋鏍堬紙Microsoft YaHei锛?, content.includes('Microsoft YaHei'),
    '缂哄皯 Microsoft YaHei 澶囬€夊瓧浣?);

  console.log(`\n${CYAN}鈺愨晲鈺?绗?3 缁勶細甯冨眬涓庣敾甯冩鏌?鈺愨晲鈺?{RESET}`);

  check('鍥哄畾鐢诲竷瀹藉害锛坢in(96vw, 960px) 鎴栫瓑鏁堬級',
    allCSS.includes('min(96vw, 960px)') || allCSS.includes('min(96vw,960px)'),
    '缂哄皯鍥哄畾鐢诲竷瀹藉害');
  check('鍥哄畾鐢诲竷楂樺害锛坢in(90vh, 540px) 鎴栫瓑鏁堬級',
    allCSS.includes('min(90vh, 540px)') || allCSS.includes('min(90vh,540px)'),
    '缂哄皯鍥哄畾鐢诲竷楂樺害');
  check('娣辫壊鑳屾櫙濉厖锛坰lides-wrap / background锛?,
    allCSS.includes('.slides-wrap') || content.includes('slides-wrap'),
    '缂哄皯 .slides-wrap 瀹瑰櫒鎴栨繁鑹茶儗鏅?);

  check('瀛楀彿浣跨敤 clamp()', allCSS.includes('clamp('),
    '娌℃湁浣跨敤 clamp() 鍝嶅簲寮忓瓧鍙?);

  console.log(`\n${CYAN}鈺愨晲鈺?绗?4 缁勶細鍔熻兘绯荤粺妫€鏌?鈺愨晲鈺?{RESET}`);

  check('鑷啓缈婚〉 JS 寮曟搸瀛樺湪', allJS.includes('goTo') || allJS.includes('current'),
    '缈婚〉寮曟搸鏈壘鍒帮紝妫€鏌?JS 涓槸鍚︽湁 goTo/current 鍑芥暟');
  check('搴曢儴瀵艰埅鏍忓瓨鍦紙nav-bar锛?, content.includes('nav-bar') || content.includes('navBtn'),
    '缂哄皯搴曢儴瀵艰埅鏍?HTML');
  check('椤电爜鏄剧ず瀛樺湪锛坧ageInfo锛?, content.includes('pageInfo') || content.includes('page-info'),
    '缂哄皯椤电爜鏄剧ず鍏冪礌');
  check('閿洏缈婚〉鏀寔锛圓rrowRight / ArrowLeft锛?, allJS.includes('ArrowRight') && allJS.includes('ArrowLeft'),
    '缂哄皯閿洏鏂瑰悜閿炕椤?);

  console.log(`\n${CYAN}鈺愨晲鈺?绗?5 缁勶細寰俊閫傞厤妫€鏌?鈺愨晲鈺?{RESET}`);

  check('瑙︽懜楂樹寒绂佺敤锛?webkit-tap-highlight-color锛?, allCSS.includes('-webkit-tap-highlight-color'),
    '缂哄皯 -webkit-tap-highlight-color');
  check('绂佹瀛楀彿璋冩暣锛?webkit-text-size-adjust锛?, allCSS.includes('-webkit-text-size-adjust'),
    '缂哄皯 -webkit-text-size-adjust');
  check('瀹夊叏鍖洪€傞厤锛坰afe-area-inset-bottom锛?, allCSS.includes('safe-area-inset-bottom'),
    '缂哄皯 iPhone X 搴曢儴瀹夊叏鍖洪€傞厤');

  console.log(`\n${CYAN}鈺愨晲鈺?绗?6 缁勶細鎵撳嵃瀵煎嚭妫€鏌?鈺愨晲鈺?{RESET}`);

  check('@media print CSS 鍧?, allCSS.includes('@media print'),
    '缂哄皯 @media print 鎵撳嵃鏍峰紡');
  check('鎵撳嵃鏃跺睍寮€闅愯棌鍐呭', allCSS.includes('page-break-after'),
    '鎵撳嵃 CSS 涓己灏?page-break-after');

  console.log(`\n${CYAN}鈺愨晲鈺?绗?7 缁勶細浜や簰缁勪欢妫€鏌?鈺愨晲鈺?{RESET}`);

  const hasFlipCard = hasCSSClass(content, 'flip-card');
  const hasRevealBox = hasCSSClass(content, 'reveal-box');
  const hasStepReveal = hasCSSClass(content, 'step-reveal');
  const hasPollBox = hasCSSClass(content, 'poll-box');

  // Only check CSS completeness for components actually used
  if (hasFlipCard) {
    check('缈昏浆鍗?CSS 瀹屾暣锛坒lip-card-back overflow-y锛?,
      allCSS.includes('flip-card-back') && (allCSS.includes('overflow-y: auto') || allCSS.includes('overflow-y:auto')),
      'flip-card 宸蹭娇鐢ㄤ絾缂哄皯 overflow-y: auto 婊氬姩瀹归敊');
  } else {
    console.log(`  ${YELLOW}鈼?{RESET} 缈昏浆鍗★紙鏈娇鐢紝璺宠繃妫€鏌ワ級`);
  }

  if (hasRevealBox) {
    check('鐐瑰嚮鎻ず CSS 瀹屾暣锛坮eveal-back / shimmer锛?,
      allCSS.includes('reveal-back') && allCSS.includes('shimmer'),
      'reveal-box 宸蹭娇鐢ㄤ絾缂哄皯 reveal-back 鎴?shimmer 鍔ㄧ敾');
  } else {
    console.log(`  ${YELLOW}鈼?{RESET} 鐐瑰嚮鎻ず锛堟湭浣跨敤锛岃烦杩囨鏌ワ級`);
  }

  if (hasStepReveal) {
    check('閫愭潯鎻ず CSS 瀹屾暣锛坰tep-reveal-item / visible锛?,
      allCSS.includes('step-reveal-item') && allCSS.includes('.visible'),
      'step-reveal 宸蹭娇鐢ㄤ絾缂哄皯 step-reveal-item 鎴?.visible');
  } else {
    console.log(`  ${YELLOW}鈼?{RESET} 閫愭潯鎻ず锛堟湭浣跨敤锛岃烦杩囨鏌ワ級`);
  }

  if (hasPollBox) {
    check('鎶曠エ缁勪欢 CSS 瀹屾暣锛坧oll / poll-result锛?,
      allCSS.includes('.poll') && allCSS.includes('poll-result'),
      'poll-box 宸蹭娇鐢ㄤ絾缂哄皯 poll 鎴?poll-result 鏍峰紡');
  } else {
    console.log(`  ${YELLOW}鈼?{RESET} 鎶曠エ缁勪欢锛堟湭浣跨敤锛岃烦杩囨鏌ワ級`);
  }

  // 浜や簰瑙ｈ€︽鏌?  const hasStopPropagation = allJS.includes('stopPropagation') || content.includes('stopPropagation');
  if (hasFlipCard || hasRevealBox || hasPollBox) {
    check('浜や簰缁勪欢涓庣炕椤佃В鑰︼紙event.stopPropagation锛?, hasStopPropagation,
      '浜や簰缁勪欢宸蹭娇鐢ㄤ絾缂哄皯 event.stopPropagation() 瑙ｈ€?);
  }

  console.log(`\n${CYAN}鈺愨晲鈺?绗?8 缁勶細鍔ㄧ敾绯荤粺妫€鏌?鈺愨晲鈺?{RESET}`);

  const KEYFRAMES = ['floatBubble', 'pulseGlow', 'pulse', 'shimmer', 'fadeInStagger', 'countUp', 'closingFadeIn'];
  const missingKF = KEYFRAMES.filter(kf => !allCSS.includes(`@keyframes ${kf}`) && !allCSS.includes(`@keyframes${kf}`));
  check(`鍔ㄧ敾 keyframes 瀹屾暣锛?{KEYFRAMES.length} 涓級`, missingKF.length === 0,
    missingKF.length > 0 ? `缂哄皯: ${missingKF.join(', ')}` : '');

  const STAGGER_RULES = ['.card', '.trend-card', '.reason-card'];
  const missingStagger = STAGGER_RULES.filter(s => !allCSS.includes(`${s}:nth-child`));
  // Stagger is recommended but not required if those components aren't used
  if (missingStagger.length === STAGGER_RULES.length) {
    console.log(`  ${YELLOW}鈼?{RESET} stagger 浜ら敊鍏ュ満瑙勫垯锛堟湭妫€娴嬪埌鍗＄墖缁勪欢锛岃烦杩囨鏌ワ級`);
  } else if (missingStagger.length > 0) {
    check(`stagger 瑙勫垯瀹屾暣锛?{STAGGER_RULES.length} 缁勶級`, false,
      `缂哄皯: ${missingStagger.join(', ')} 鐨?stagger 瑙勫垯`);
  } else {
    check(`stagger 浜ら敊鍏ュ満瑙勫垯瀹屾暣锛?{STAGGER_RULES.length} 缁勶級`, true);
  }

  // 鈹€鈹€鈹€ 姹囨€?鈹€鈹€鈹€
  const total = passCount + failCount;
  console.log(`\n${BOLD}鈺愨晲鈺?鏍￠獙缁撴灉 鈺愨晲鈺?{RESET}`);
  console.log(`  ${GREEN}閫氳繃: ${passCount}${RESET}`);
  console.log(`  ${RED}澶辫触: ${failCount}${RESET}`);
  console.log(`  鎬昏: ${total}\n`);

  if (failCount > 0) {
    console.log(`${RED}${BOLD}鉂?鏍￠獙鏈€氳繃 鈥?浠ヤ笅椤圭洰闇€瑕佷慨澶嶏細${RESET}\n`);
    failures.forEach((f, i) => {
      console.log(`  ${RED}${i + 1}.${RESET} ${f.name}`);
      if (f.detail) console.log(`     ${YELLOW}鈫?${f.detail}${RESET}`);
    });
    console.log('');
    process.exit(1);
  } else {
    console.log(`${GREEN}${BOLD}鉁?鍏ㄩ儴閫氳繃锛佸彲浠ヤ氦浠樸€?{RESET}\n`);
    process.exit(0);
  }
}

main().catch(err => {
  console.error(`${RED}鏍￠獙鑴氭湰寮傚父: ${err.message}${RESET}`);
  process.exit(2);
});
