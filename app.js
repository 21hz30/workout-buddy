const app = document.querySelector('#app');
const modalRoot = document.querySelector('#modal-root');
const toastRoot = document.querySelector('#toast-root');

const state = {
  screen: 'welcome',
  step: 0,
  route: 'today',
  circleTab: 'football',
  modal: null,
  addSportField: null,
  points: 180,
  checkedIn: false,
  joinedFootball: false,
  quizDone: false,
  quizAnswers: { warmup: '', firstGame: '', recovery: '' },
  claimed: [],
  recruitStage: '共创期',
  applyRole: '',
  questionnaireStep: 0,
  questionnaire: {
    nickname: '', grade: '', roles: [], motivation: [], problem: '', experience: '', time: '', collaboration: [], learning: '', firstContribution: '', contactOk: ''
  },
  profile: {
    name: '', grade: '高二', city: '', district: '', radius: '步行/骑行 30 分钟内', status: '偶尔运动',
    current: ['足球', '慢跑'], past: [], wish: ['网球'],
    currentFrequency: '每周 1 次', currentDuration: '30—60 分钟', currentIntensity: '中等', currentFeeling: '喜欢，想继续', training: '普通学生',
    pastReason: '时间变少', wishReason: '想认识新朋友', interest: '',
    preference: '团队运动', goal: '找同伴一起动', time: '每周 1—2 小时', social: '希望有人一起',
    activityWilling: '愿意参加活动', visibility: '仅 Buddy 可见'
  }
};

const sportIcons = { 足球: '⚽', 慢跑: '◒', 网球: '◉', 篮球: '◌', 攀岩: '△', 游泳: '≈', 飞盘: '◎', 滑雪: '⌁', 舞蹈: '✦', 瑜伽: '☼' };
const tones = ['mint', 'peach', 'blue', 'lilac'];
const routes = { today: '今天', circle: '足球社区', support: '支持', rewards: '成长积分' };
const cityAreas = { 上海: ['徐汇', '静安', '浦东', '杨浦', '虹口'], 北京: ['朝阳', '海淀', '东城', '西城'], 广州: ['天河', '越秀', '海珠', '番禺'], 深圳: ['南山', '福田', '罗湖', '宝安'], 杭州: ['西湖', '拱墅', '滨江', '上城'] };

function esc(value) { return String(value).replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;' }[char])); }
function icon(name) { return sportIcons[name] || '✦'; }
function toast(text) { const item = document.createElement('div'); item.className = 'toast'; item.textContent = text; toastRoot.append(item); setTimeout(() => item.remove(), 2800); }
function selection(field, value, multiple = false) { const current = state.profile[field]; if (multiple) state.profile[field] = current.includes(value) ? current.filter(item => item !== value) : [...current, value]; else state.profile[field] = value; }
function choice(field, values, multiple = false) {
  const allValues = multiple ? [...values, ...state.profile[field].filter(value => !values.includes(value))] : values;
  const options = allValues.map(value => `<button class="choice ${multiple ? (state.profile[field].includes(value) ? 'selected' : '') : (state.profile[field] === value ? 'selected' : '')}" data-action="select" data-field="${esc(field)}" data-value="${esc(value)}" data-multiple="${multiple}">${icon(value)}<span>${esc(value)}</span></button>`).join('');
  const add = multiple ? `<button class="choice add-choice" data-action="add-sport" data-field="${field}"><b>＋</b><span>添加运动</span></button>` : '';
  return `<div class="choice-set ${multiple ? 'multi' : ''}">${options}${add}</div>`;
}
function regionTable() {
  const cities = Object.keys(cityAreas);
  const areas = state.profile.city ? cityAreas[state.profile.city] || [] : [];
  return `<div class="region-table"><div class="region-group"><p class="question">我所在的城市</p><div class="region-grid">${cities.map(city => `<button class="region-option ${state.profile.city===city?'selected':''}" data-action="select" data-field="city" data-value="${esc(city)}"><span>${state.profile.city===city?'✓':'○'}</span>${esc(city)}</button>`).join('')}</div></div><div class="region-group"><p class="question">我通常活动的区域 <small>${state.profile.city ? '可选一个' : '先选择城市'}</small></p><div class="region-grid ${state.profile.city?'':'disabled'}">${areas.length ? areas.map(area => `<button class="region-option ${state.profile.district===area?'selected':''}" data-action="select" data-field="district" data-value="${esc(area)}" ${state.profile.city?'':'disabled'}><span>${state.profile.district===area?'✓':'○'}</span>${esc(area)}</button>`).join('') : '<span class="region-placeholder">选择城市后显示可活动区域</span>'}</div></div></div>`;
}

function brand() { return `<button class="brand" data-action="reset" aria-label="回到开始"><span class="brand-mark"><i></i><i></i></span><span>WORKOUT<br><em>BUDDY</em></span></button>`; }

function render() {
  if (state.screen === 'welcome') app.innerHTML = welcome();
  else if (state.screen === 'onboarding') app.innerHTML = onboarding();
  else if (state.screen === 'result') app.innerHTML = result();
  else if (state.screen === 'recruit') app.innerHTML = recruitment();
  else app.innerHTML = workspace();
  renderModal();
}

function welcome() {
  return `<section class="welcome-shell"><header class="simple-head">${brand()}<div class="welcome-head-actions"><span class="eyebrow">A SPACE TO MOVE · TOGETHER</span><button class="text-button" data-action="recruit">加入项目招募 <span>↗</span></button></div></header><div class="welcome-grid"><div class="welcome-copy"><p class="eyebrow lime">FOR TEENS, NOT FOR LEADERBOARDS</p><h1>先听见身体，<br>再找到<strong>一起动</strong>的人。</h1><p>Workout Buddy 不要求你立刻变得更强。先用几分钟讲讲你真实的生活，我们一起找一个你愿意重复的开始。</p><div class="welcome-actions"><button class="button primary" data-action="start">开始创建我的运动档案 <span>→</span></button><button class="text-button" data-action="preview">先看看里面有什么</button></div><div class="welcome-note"><span>⌁</span><p><b>没有公开排名，也没有断签惩罚。</b><br>运动、恢复和停下来，都是照顾自己的行动。</p></div></div><div class="welcome-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="orb o-football">⚽</div><div class="orb o-run">◒</div><div class="orb o-tennis">◉</div><div class="center-orb"><small>YOUR<br>PACE</small><b>∞</b></div><span class="art-caption top">FIND A BUDDY</span><span class="art-caption bottom">MAKE IT YOURS</span></div></div><footer class="welcome-footer"><span>01 / 认识现在的自己</span><span>02 / 找到第一步</span><span>03 / 在关系中坚持</span></footer></section>`;
}

const steps = [
  { label:'基础资料', hint:'只收集匹配活动需要的最小信息，公开范围由你决定。' },
  { label:'现在的运动', hint:'用频率、时长和训练基础，描述你最近真实的节奏。' },
  { label:'运动经历', hint:'暂停过不代表失败，它能帮助我们理解怎样的支持更合适。' },
  { label:'想尝试什么', hint:'想开始的运动和原因，会成为 Buddy 与活动推荐的线索。' },
  { label:'匹配与隐私', hint:'告诉我们你希望怎样被陪伴，以及哪些信息可以被看见。' }
];

function onboarding() {
  const content = [
    `<div class="form-hero"><span class="mini-index">01</span><h1>先认识一下你。</h1><p>这些信息只用于活动范围和 Buddy 推荐，公开范围由你决定。</p></div><label class="name-field"><span>我想被叫作</span><input id="name" data-profile="name" value="${esc(state.profile.name)}" placeholder="输入一个昵称" autocomplete="nickname"><i>↗</i></label>${regionTable()}<div class="grade-row"><span>我现在读</span>${['初三','高一','高二','高三'].map(grade => `<button class="pill ${state.profile.grade===grade?'active':''}" data-action="select" data-field="grade" data-value="${grade}">${grade}</button>`).join('')}</div><p class="question space-top">我通常能去多远？</p>${choice('radius',['步行/骑行 30 分钟内','公共交通 45 分钟内','地点都可以'])}`,
    `<div class="form-hero"><span class="mini-index">02</span><h1>你和运动，<br>最近是什么关系？</h1><p>不做能力评定，只记录你最近的投入，方便给出合适的第一步。</p></div><p class="question">最近四周更接近哪一种？</p>${choice('status',['已有规律','偶尔运动','刚想开始'])}<p class="question space-top">正在参与的运动 <small>可多选</small></p>${choice('current',['足球','慢跑','网球','篮球','攀岩','游泳'],true)}<p class="question space-top">大约每周几次</p>${choice('currentFrequency',['不到 1 次','每周 1 次','每周 2—3 次','每周 4 次以上'])}<p class="question space-top">每次大约多久</p>${choice('currentDuration',['30 分钟以内','30—60 分钟','60 分钟以上'])}<p class="question space-top">主观强度</p>${choice('currentIntensity',['轻松','中等','较高'])}<p class="question space-top">喜欢程度</p>${choice('currentFeeling',['喜欢，想继续','还在观察','暂时不太喜欢'])}<p class="question space-top">训练基础</p>${choice('training',['普通学生','有固定训练基础'])}`,
    `<div class="form-hero"><span class="mini-index">03</span><h1>一张只属于你的<br><em>运动地图。</em></h1><p>暂停过不代表失败，它能帮助我们避开不适合你的安排。</p></div><p class="question">以前做过、现在暂停的 <small>可跳过 · 可多选</small></p>${choice('past',['足球','篮球','网球','舞蹈','游泳','瑜伽'],true)}<p class="question space-top">如果暂停过，最接近的原因</p>${choice('pastReason',['时间变少','找不到一起的人','身体不舒服或太累','暂时没有兴趣'])}`,
    `<div class="form-hero"><span class="mini-index">04</span><h1>下一项，<br>你想试试什么？</h1><p>想尝试的项目和原因，会成为 Buddy 与活动推荐的线索。</p></div><p class="question">现在最想试试的 <small>可多选</small></p>${choice('wish',['网球','攀岩','飞盘','滑雪','篮球','慢跑'],true)}<p class="question space-top">为什么想开始它？</p>${choice('wishReason',['想认识新朋友','想改善精力','想挑战自己','朋友正在玩'])}`,
    `<div class="form-hero"><span class="mini-index">05</span><h1>最后，告诉我们<br><em>怎样陪你。</em></h1><p>你可以随时修改；敏感信息默认不对外展示。</p></div><p class="question">最想要的改变</p>${choice('goal',['精力更稳定','找同伴一起动','养成能坚持的习惯','提高专项能力','探索新运动'])}<p class="question space-top">每周可留出的时间</p>${choice('time',['30 分钟以内','每周 1—2 小时','每周 2 小时以上'])}<p class="question space-top">你更喜欢</p>${choice('preference',['团队运动','个人运动','两种都可以'])}<p class="question space-top">和别人一起时</p>${choice('social',['希望有人一起','一个人也自在','喜欢团队氛围'])}<p class="question space-top">社群参与</p>${choice('activityWilling',['愿意参加活动','想先看看','以后可能发起活动'])}<label class="name-field compact-field"><span>喜欢的球队、运动员或榜样 <small>可选</small></span><input data-profile="interest" value="${esc(state.profile.interest)}" placeholder="例如：女足、谷爱凌、Curry"></label><p class="question space-top">资料可见范围</p>${choice('visibility',['仅 Buddy 可见','参加同场活动的人可见','暂不被发现'])}`
  ][state.step];
  const final = state.step === steps.length - 1;
  return `<section class="onboard-shell"><header class="onboard-head">${brand()}<div class="progress-label"><span>创建运动档案</span><b>${String(state.step + 1).padStart(2,'0')} / ${String(steps.length).padStart(2,'0')}</b></div><button class="exit-button" data-action="reset">退出</button></header><div class="progress-track"><i style="width:${(state.step + 1) / steps.length * 100}%"></i></div><div class="onboard-layout"><aside class="step-list">${steps.map((step,index) => `<div class="step-line ${index===state.step?'current':index<state.step?'done':''}"><i>${index<state.step?'✓':String(index+1).padStart(2,'0')}</i><span>${step.label}</span></div>`).join('')}</aside><section class="onboard-card">${content}<div class="onboard-actions">${state.step ? '<button class="button ghost" data-action="back">← 返回</button>' : '<span></span>'}<button class="button primary" data-action="${final ? 'finish' : 'next'}">${final ? '生成我的运动星图' : '下一步'} <span>→</span></button></div></section><aside class="onboard-aside"><div class="aside-symbol">${['◎','⚽','✦','♧','◌'][state.step]}</div><p class="eyebrow">WHY THIS MATTERS</p><h2>${steps[state.step].label}</h2><p>${steps[state.step].hint}</p></aside></div></section>`;
}

function constellation() {
  const current = state.profile.current.slice(0,3);
  const past = state.profile.past.slice(0,2);
  const wish = state.profile.wish.slice(0,3);
  const nodes = [
    ...current.map((sport,index) => `<span class="star-node now s${index}"><i>${icon(sport)}</i><b>${esc(sport)}</b></span>`),
    ...past.map((sport,index) => `<span class="star-node past p${index}"><i>${icon(sport)}</i><b>${esc(sport)}</b></span>`),
    ...wish.map((sport,index) => `<span class="star-node wish w${index}"><i>${icon(sport)}</i><b>${esc(sport)}</b></span>`)
  ].join('');
  return `<div class="constellation"><span class="constellation-ring r1"></span><span class="constellation-ring r2"></span><div class="me-star"><small>${esc(state.profile.name || '你')}</small><b>✦</b></div>${nodes}<span class="constellation-line l1"></span><span class="constellation-line l2"></span></div>`;
}

function profileSummary() {
  const p = state.profile;
  const sports = p.current.length ? p.current.map(sport => `${icon(sport)} ${sport}`).join('、') : '还没有固定项目';
  const wish = p.wish.length ? p.wish.map(sport => `${icon(sport)} ${sport}`).join('、') : '暂时不设定';
  const region = [p.city, p.district].filter(Boolean).join(' · ') || '未选择活动区域';
  return `<section class="profile-summary"><div class="section-heading"><div><p class="section-caption">PROFILE SNAPSHOT · MATCHING INPUT</p><h2>这些信息会影响你的推荐。</h2></div><p>你可以随时调整，不会被固定成某一种人。</p></div><div class="profile-summary-grid"><article><span>基础范围</span><b>${esc(region)}</b><small>${esc(p.radius)}</small></article><article><span>当前投入</span><b>${sports}</b><small>${esc(p.currentFrequency)} · ${esc(p.currentDuration)} · ${esc(p.currentIntensity)} · ${esc(p.currentFeeling)} · ${esc(p.training)}</small></article><article><span>方向与意愿</span><b>${esc(p.goal)}</b><small>${wish} · ${esc(p.activityWilling)}</small></article><article><span>匹配与隐私</span><b>${esc(p.preference)} · ${esc(p.social)}</b><small>${esc(p.visibility)}${p.interest ? ` · 兴趣：${esc(p.interest)}` : ''}</small></article></div></section>`;
}

function curve() {
  const p = state.profile;
  const frequency = { '不到 1 次': .5, '每周 1 次': 1, '每周 2—3 次': 2.5, '每周 4 次以上': 4.5 }[p.currentFrequency] || 1;
  const duration = { '30 分钟以内': 20, '30—60 分钟': 45, '60 分钟以上': 75 }[p.currentDuration] || 45;
  const intensity = { 轻松: .75, 中等: 1, 较高: 1.25 }[p.currentIntensity] || 1;
  const score = Math.min(20, Math.round((p.current.length * frequency * duration * intensity / 15) * 10) / 10);
  const zone = score < 6 ? '启动区' : score <= 12 ? '适宜区' : '恢复区';
  const x = Math.round(40 + score / 20 * 250);
  const y = Math.round(160 - 75 * Math.sin(Math.min(1, score / 20) * Math.PI));
  const plan = p.current.length ? p.current.slice(0, 3).map(sport => `<span>${icon(sport)} ${esc(sport)} · ${esc(p.currentFrequency)} × ${esc(p.currentDuration)}</span>`).join('') : '<span>还没有固定项目 · 先从轻量体验开始</span>';
  return `<div class="curve-card"><div class="curve-copy"><p class="eyebrow lime">YOUR CURRENT REFERENCE</p><h2>适度，才有空间继续。</h2><p>你当前组合约为 <b>${score} / 20</b>，位于${zone}。这是研究参考，不是对个人能力或健康的诊断；保持稳定、留意睡眠和疲惫感。</p><div class="plan-list">${plan}</div></div><div class="curve-graphic"><svg viewBox="0 0 340 220" role="img" aria-label="运动剂量倒 U 型研究参考图，当前组合位于${zone}"><rect x="146" y="30" width="64" height="139" rx="12" fill="#dfff67" opacity=".75"/><path d="M26 169 H319" class="axis"/><path d="M29 162 C84 143 96 91 153 54 S247 54 311 161" class="u-curve"/><line x1="${x}" y1="${y}" x2="${x}" y2="169" class="current-line"/><circle cx="${x}" cy="${y}" r="9" class="current-dot"/><text x="25" y="190">低</text><text x="105" y="190">提升</text><text x="162" y="190">适宜</text><text x="258" y="190">恢复</text><text x="146" y="23">参考适宜区</text></svg><span class="curve-tag">现在 · ${zone}</span></div><p class="curve-foot">研究参考，不是医学处方、运动处方或学业预测。你的睡眠、疲惫和感受比一个数字更重要。</p></div>`;
}

function result() {
  return `<section class="result-shell"><header class="simple-head">${brand()}<span class="eyebrow">YOUR MOVEMENT MAP · READY</span></header><div class="result-intro"><p class="eyebrow lime">HELLO, ${esc(state.profile.name || 'BUDDY').toUpperCase()}</p><h1>你的运动，不止是<br><strong>“做了多少”。</strong></h1><p>它也可以是认识朋友、找回精力、在有点累的日子里给自己留一条路。</p></div><div class="result-grid"><article class="map-card"><div class="map-card-head"><div><p class="eyebrow">YOUR SPORTS CONSTELLATION</p><h2>你的运动星图</h2></div><span class="map-key"><i></i>正在做　<i></i>想尝试</span></div>${constellation()}<div class="map-legend"><div><span>正在做</span>${state.profile.current.map(sport => `<b>${icon(sport)} ${sport}</b>`).join('')}</div><div><span>想尝试</span>${state.profile.wish.map(sport => `<b>${icon(sport)} ${sport}</b>`).join('')}</div></div></article><article class="first-step"><p class="eyebrow">YOUR FIRST MOVE · THIS WEEK</p><span class="step-number">01</span><h2>和一位足球 Buddy<br>报名一场小场球。</h2><p>你说希望有人一起动，也已经在做足球。先用一场轻竞技活动，把“想坚持”变成一次真实出现。</p><div class="step-links"><span>♧ 3 位同场 Buddy</span><span>◫ 周五 19:00</span></div></article></div>${profileSummary()}${curve()}<div class="result-bottom"><p>这些建议可以随时调整，不会定义你。</p><button class="button primary" data-action="enter">进入我的空间 <span>→</span></button></div></section>`;
}

function recruitment() {
  const roles = [
    ['产品与用户研究', '2 人', '定义产品，也承担前期社群与市场验证。', ['访谈、用户旅程与需求优先级', '定义匹配、活动和安全边界', '招募试用同学、维护社群并回收反馈'], '能把模糊想法说清楚，愿意听不同意见。'],
    ['体验与视觉设计', '1 人', '让运动圈子变得友好、可信、愿意打开。', ['信息架构与关键流程', '移动端界面、原型与视觉规范', '参与可用性测试并快速迭代'], '关心细节，也愿意从纸笔或 Figma 开始。'],
    ['Vibe coding 开发', '2 人', '用低门槛工具把想法快速变成可试用版本。', ['用 AI / no-code / 前端完成页面', '维护数据结构与基础交互', '和产品、设计一起做每周发布'], '不要求刷题经历，重视动手、记录和复盘。']
  ];
  const stageDetails = {
    '共创期': ['现在—第 2 周', '确认问题是否真实存在', '完成 10—15 位学生访谈，画出第一版用户旅程，确定最小安全边界。'],
    'MVP 期': ['第 3—6 周', '把一个闭环跑起来', '上线“建档—找 Buddy—报名活动”最小流程，邀请一小批同学试用并记录反馈。'],
    '试点期': ['第 7—10 周', '在一个校园或社群验证', '完成 2—3 场低风险活动，观察参与、复访和安全问题，再决定下一轮迭代。']
  };
  const current = stageDetails[state.recruitStage];
  return `<section class="recruit-shell"><header class="recruit-head">${brand()}<div><span class="eyebrow">WORKOUT BUDDY · OPEN CALL</span><button class="text-button" data-action="back-to-welcome">返回产品首页</button></div></header><main class="recruit-main"><section class="recruit-hero"><div><p class="eyebrow lime">A STUDENT-BUILT MOVEMENT CIRCLE</p><h1>把“想运动”，<br>变成<strong>有人一起的日常。</strong></h1><p>我们正在做一个属于初高中生的运动搭子平台。它不把学生变成数据，也不要求每天打卡；它帮助同学找到合适的运动、同频的人和可以安全开始的第一步。</p><div class="recruit-hero-actions"><button class="button primary" data-action="apply">填写共创问卷 <span>↗</span></button><span>首批 5 位学生共创者 · 方案草案</span></div></div><div class="recruit-mark"><span>MOVE<br>WITH<br>CARE</span><b>∞</b></div></section><section class="why-section"><div class="section-heading"><div><p class="section-caption">WHY THIS, WHY NOW</p><h2>学生不是没有运动意愿，<br>只是很难把意愿接到生活里。</h2></div><p>我们先解决“开始和继续”的阻力，再谈更大的运动数据和社区规模。</p></div><div class="why-grid"><article><b>01</b><h3>精力被切碎</h3><p>学习、通勤和补课把时间切成小段，传统训练计划很难适配真实日程。</p></article><article><b>02</b><h3>合适的搭子难找</h3><p>同学可能喜欢同一个项目，却没有同样的时间、水平和轻松的邀约方式。</p></article><article><b>03</b><h3>选择越来越多</h3><p>从球类到攀岩、跑步和舞蹈，第一次尝试需要更低门槛、更有信息的入口。</p></article></div></section><section class="mission-section"><div><p class="eyebrow lime">WHAT WE ARE BUILDING</p><h2>一个由学生参与定义的<br>运动圈子。</h2></div><div class="mission-list"><div><span>⌁</span><p><b>真实匹配</b><br>按项目、节奏、时间和意愿找同伴，不做外貌或训练量排名。</p></div><div><span>◌</span><p><b>小步行动</b><br>从一场轻量活动、一节入门小课或一次恢复开始。</p></div><div><span>✦</span><p><b>安全边界</b><br>管理员审核活动，保护未成年人隐私，敏感信息默认不公开。</p></div></div></section><section class="stage-section"><div class="section-heading"><div><p class="section-caption">HOW WE WILL WORK</p><h2>先共创，再试点。</h2></div><p>每个阶段都有清楚的成果，不需要等到“全部准备好”才开始。</p></div><div class="stage-tabs">${Object.keys(stageDetails).map(stage => `<button class="${state.recruitStage===stage?'active':''}" data-action="recruit-stage" data-stage="${stage}"><span>${stageDetails[stage][0]}</span><b>${stage}</b></button>`).join('')}</div><div class="stage-detail"><span class="stage-number">${current[0]}</span><div><p class="eyebrow">CURRENT FOCUS</p><h3>${current[1]}</h3><p>${current[2]}</p></div></div></section><section class="roles-section"><div class="section-heading"><div><p class="section-caption">OPEN ROLES · STUDENT TEAM</p><h2>你可以从一件具体的事开始。</h2></div><p>2 位产品、1 位设计、2 位开发。前期社群与市场工作由产品共同承担。</p></div><div class="role-grid">${roles.map(([title,count,summary,outputs,profile], index) => `<article class="role-card"><div class="role-top"><span>0${index + 1}</span><b>${count}</b></div><h3>${title}</h3><p class="role-summary">${summary}</p><p class="role-label">你会做</p><ul>${outputs.map(output => `<li>${output}</li>`).join('')}</ul><p class="role-label">适合这样的你</p><p class="role-profile">${profile}</p><button class="text-button" data-action="apply" data-role="${title}">填写问卷并选择方向 <span>→</span></button></article>`).join('')}</div></section><section class="ways-section"><div><p class="eyebrow lime">WHAT YOU GET</p><h2>你会留下一个<br>真正被同学用过的作品。</h2></div><div class="ways-copy"><p>你会和其他学生一起完成访谈、原型、第一版产品和真实活动。我们会公开记录每周决策，让每个人都能看到自己的贡献如何变成下一步。</p><div class="ways-tags"><span>建议每周一次共创会</span><span>小组协作，不卷资历</span><span>可记录的项目贡献</span></div><p class="safety-copy"><b>给未成年参与者：</b>涉及线下活动、公开展示或个人信息时，会先取得学校 / 家长及本人同意；平台不鼓励私下交换联系方式。</p></div></section><footer class="recruit-footer"><p>准备好一起把第一步做出来了吗？</p><button class="button primary" data-action="apply">填写共创问卷 <span>↗</span></button></footer></main></section>`;
}

function topbar() { return `<header class="space-head">${brand()}<nav>${Object.entries(routes).map(([id,label]) => `<button class="${state.route===id?'active':''}" data-action="route" data-route="${id}">${label}</button>`).join('')}</nav><div class="head-user"><button class="point-badge" data-action="route" data-route="rewards">✺ <b>${state.points}</b></button><span>${esc(state.profile.name || '新朋友')[0]}</span></div></header>`; }

function bottomNav() { return `<nav class="h5-bottom-nav" aria-label="H5 主导航">${[['today','⌂','今天'],['circle','⚽','足球'],['support','✦','支持'],['rewards','✺','积分']].map(([id,symbol,label]) => `<button class="${state.route===id?'active':''}" data-action="route" data-route="${id}"><i>${symbol}</i><span>${label}</span></button>`).join('')}</nav>`; }

function workspace() { return `<section class="space-shell">${topbar()}<main class="space-main">${state.route==='today' ? today() : state.route==='circle' ? circle() : state.route==='support' ? support() : rewards()}</main>${bottomNav()}</section>`; }

function today() { const checked = state.checkedIn; return `<div class="today-grid"><section class="today-hero"><p class="eyebrow lime">TUESDAY · A GENTLE START</p><h1>今天，先让身体<br>有一点<strong>舒服的动静。</strong></h1><p>昨晚睡眠 6h 50m。比起高强度训练，今天更适合一段轻松活动，或为周五的小场球留一点精力。</p><div class="hero-bottom"><button class="button primary" data-action="checkin">${checked ? '今天已完成记录 ✓' : '完成今天的小打卡 +15'}</button><span>不连续也没关系</span></div><div class="day-orb"><small>ENERGY</small><b>78</b><span>今天</span></div></section><aside class="today-side"><article class="daily-card"><span class="tiny-icon">01</span><p class="eyebrow">TODAY'S OPTION</p><h3>15 分钟<br>轻松慢跑或散步</h3><p>如果不想出门，3 分钟拉伸也一样算一次完成。</p><button class="text-button" data-action="checkin">记录这个行动 →</button></article><article class="buddy-ping"><div><span>♧</span><p><b>Lucas 也想练基本功</b><br>他距离你 3.2km，喜欢足球和力量训练。</p></div><button data-action="route" data-route="circle">看看 →</button></article></aside></div><section class="week-strip"><div><p class="eyebrow">THIS WEEK · NO STREAK PRESSURE</p><h2>只记录你真实出现过的时刻。</h2></div><div class="week-dots"><span class="done">一</span><span class="done">二</span><span class="now">三</span><span>四</span><span>五</span><span>六</span><span>日</span></div><button class="text-button" data-action="route" data-route="rewards">我的成长积分 →</button></section><section class="insight-row"><article class="insight mint"><p>运动小课 · 2 分钟</p><h3>为什么恢复<br>也是训练？</h3><button class="text-button" data-action="read">读一读 →</button></article><article class="insight peach"><p>周五活动</p><h3>Football Buddy<br>夜场 · 5v5</h3><button class="text-button" data-action="route" data-route="circle">找同场的人 →</button></article><article class="insight blue"><p>来自你的星图</p><h3>网球是你想<br>尝试的运动。</h3><button class="text-button" data-action="route" data-route="circle">看入门活动 →</button></article></section>`; }

function circle() { const tab = state.circleTab; return `<div class="page-title"><div><p class="eyebrow">MOVE TOGETHER</p><h1>一起动，才更容易继续。</h1><p>先从同项目、同节奏，或一场管理员发布的活动开始。</p></div><div class="circle-tabs">${[['buddy','找 Buddy'],['football','足球板块'],['activities','活动中心']].map(([id,label])=>`<button class="${tab===id?'active':''}" data-action="circle-tab" data-tab="${id}">${label}</button>`).join('')}</div></div>${tab==='buddy'?buddies():tab==='football'?football():activities()}`; }

function buddies() { return `<div class="buddy-layout"><section><p class="section-caption">为你匹配 · 基于共同项目、节奏和意愿</p><div class="people-list">${[{name:'Lucas',school:'高二 · 3.2km',sports:['足球','力量训练'],copy:'想找人一起练基本功。',score:92,tone:'blue'},{name:'Maya',school:'高一 · 4.8km',sports:['网球','慢跑'],copy:'周末常在浦东打网球。',score:86,tone:'lilac'},{name:'Zoe',school:'高一 · 6.1km',sports:['攀岩','瑜伽'],copy:'愿意带人尝试第一次上墙。',score:79,tone:'peach'}].map(person=>`<article class="person-card"><div class="avatar ${person.tone}">${person.name[0]}</div><div><span>${person.school}</span><h3>${person.name}</h3><p>${person.copy}</p><div class="chip-row">${person.sports.map(sport=>`<i>${icon(sport)} ${sport}</i>`).join('')}</div></div><div class="match"><b>${person.score}%</b><span>同频</span><button data-action="buddy">发个邀请</button></div></article>`).join('')}</div></section><aside class="circle-side"><p class="eyebrow">A KIND BUDDY RULE</p><h2>一起开始，<br>不互相施压。</h2><p>Buddy 用于约活动、轻量鼓励和分享感受；不展示疲劳、情绪等敏感信息。</p><button class="text-button" data-action="rules">查看 Buddy 边界 →</button></aside></div>`; }

function football() {
  const posts = [
    ['训练','第一次参加 5v5，怎么不一直追着球跑？','先守住自己的区域，再看最近的出球线。周五活动会有 5 分钟分组讲解。','Luca · 8 条有帮助'],
    ['装备','人工草第一次踢，要准备什么？','舒适球鞋、水、薄外套就够了；不需要为了第一次体验买新装备。','活动管理员 · 12 条有帮助'],
    ['恢复','腿有点酸，还适合去周五夜场吗？','可以根据当天感受决定强度；不舒服就改为观看、热身或提前离开。','Lena Mentor · 9 条有帮助']
  ];
  return `<section class="club-hero"><div><p class="eyebrow lime">FOOTBALL · FIRST PILOT</p><h2>喜欢足球这件事，<br>可以<strong>一起变好。</strong></h2><p>不做队迷战场。这里有同场的人、真正能用的训练知识，以及需要时能找到的专项 Mentor。</p><div class="hero-bottom"><button class="button primary" data-action="join-football">${state.joinedFootball?'已报名周五活动 ✓':'报名周五 5v5 +40'}</button><button class="button translucent" data-action="quiz">${state.quizDone ? '已完成足球小测 ✓' : '足球知多少 +20'}</button></div></div><div class="score-slab"><span>本周社群行动</span><b>68</b><small>次参与 · 不是排名</small><div><i>12 活动</i><i>34 学习</i><i>22 分享</i></div></div></section><section class="football-forum"><div class="forum-heading"><div><p class="section-caption">FOOTBALL COMMUNITY · MODERATED</p><h2>足球讨论区</h2><p>围绕训练、活动和安全提问；不讨论队迷对立或八卦。</p></div><button class="button ghost" data-action="forum">进入讨论区 →</button></div><div class="forum-posts">${posts.map(([tag,title,copy,meta])=>`<article class="forum-post"><span>${tag}</span><h3>${title}</h3><p>${copy}</p><small>◌ ${meta}</small></article>`).join('')}</div></section><div class="club-grid"><article class="lesson-big"><span>01 · TRAINING</span><h3>上场前的 6 分钟<br>热身，不是走流程。</h3><p>让身体逐渐准备好加速、急停和变向，比拉到疼更有效。</p><button class="text-button" data-action="read">读 3 分钟 →</button></article><article class="lesson-big dark"><span>02 · QUIZ · ${state.quizDone ? 'DONE' : '+20'}</span><h3>足球知多少：<br>三题小测。</h3><p>题目只关于训练、活动和恢复；答对后获得一次学习积分。</p><button class="text-button" data-action="quiz">${state.quizDone ? '查看答题结果 →' : '开始答题 →'}</button></article><article class="mentor-spot"><p class="eyebrow">FOOTBALL MENTOR</p><span>A</span><h3>Aaron Zhang</h3><p>大学校队 · 足球专项训练<br>适合脚下技术与场上决策入门。</p><button data-action="mentor">查看支持 →</button></article></div>`;
}

function activities() { const events=[['◒','日常一起动','黄浦滨江晨跑','周日 · 08:00','#dcecdf'],['◉','入门体验','网球新手体验局','周一 · 17:30','#f0c6a8'],['△','专项训练','攀岩第一次上墙','周日 · 14:00','#c8c2e8']]; return `<section class="activity-heading"><p class="section-caption">所有活动均由管理员审核发布</p><h2>选一种，你现在愿意出现的方式。</h2><div class="activity-filters"><button class="active">全部</button><button>日常一起动</button><button>入门体验</button><button>社群活动</button><button>专项训练</button></div></section><div class="activity-grid">${events.map(([symbol,type,title,time,tint])=>`<article class="event-card" style="--event-tint:${tint}"><div class="event-top"><span>${symbol}</span><i>${type}</i></div><h3>${title}</h3><p>${time}<br>管理员活动 · 适合入门</p><button data-action="activity">查看活动 →</button></article>`).join('')}</div>`; }

function support() { return `<div class="page-title support-title"><div><p class="eyebrow">SUPPORT, WHEN YOU NEED IT</p><h1>专业支持，<br>不需要一上来就很重。</h1><p>先看清楚谁能帮你什么；一次沟通、一次入门、几次指导都可以。</p></div><span class="support-star">✦</span></div><div class="mentor-grid">${[['Lena Wu','青少年体能与恢复','#dcecdf','把训练做得更安全，也更容易长期做下去。'],['Aaron Zhang','足球专项训练','#b9d8e6','从脚下技术到场上决策，陪你建立专项基础。'],['Nina Li','跑步与习惯建立','#f0c6a8','找到可以一直跑下去的、属于自己的节奏。']].map(([name,role,tint,copy])=>`<article class="mentor-card" style="--mentor-tint:${tint}"><div class="mentor-face">${name[0]}</div><span>✓ 已审核资源</span><h3>${name}</h3><p>${role}</p><hr><small>${copy}</small><button data-action="mentor">了解是否适合我 →</button></article>`).join('')}</div><section class="support-bottom"><div><span>⌁</span><h2>累的时候，<br>恢复也可以是行动。</h2></div><p>Workout Buddy 不诊断、不替你开处方。持续不适、疼痛或难以正常生活时，请优先联系可信任的成年人或专业人员。</p></section>`; }

function rewards() { const rewards=[['football','⚽','足球专项体验','220','一节专项基础体验'],['bottle','◒','运动水壶','320','本月社群小礼物'],['stretch','⌁','恢复拉伸体验','420','体能 Mentor · 1 次']]; return `<div class="reward-head"><div><p class="eyebrow">GROWTH, NOT A RANKING</p><h1>${state.points}<span>成长积分</span></h1><p>奖励你真实完成、学习、参与和分享的时刻；中断不会扣分，也不需要补回。</p></div><div class="reward-ring"><span>NOT FOR<br>STREAKS</span><b>✺</b></div></div><section class="earn-row"><article><span>◎</span><p>完成今天的打卡</p><b>+15</b></article><article><span>◫</span><p>参加管理员活动</p><b>+40</b></article><article><span>✦</span><p>完成一节运动小课</p><b>+20</b></article></section><div class="section-heading"><div><p class="section-caption">FIRST-DRAFT REWARDS</p><h2>把一点点投入，换成继续动的理由。</h2></div><p>展示型兑换：真实库存、券码与发放将由管理员端后续接入。</p></div><div class="redeem-grid">${rewards.map(([id,symbol,title,cost,copy])=>{const claimed=state.claimed.includes(id);const enough=state.points>=Number(cost);return `<article class="redeem-card"><div>${symbol}</div><p>${copy}</p><h3>${title}</h3><b>${cost} 积分</b><button ${claimed||!enough?'disabled':''} data-action="redeem" data-id="${id}" data-cost="${cost}">${claimed?'已兑换':enough?'兑换权益':'还差 '+(Number(cost)-state.points)+' 分'}</button></article>`}).join('')}</div>`; }

function renderModal() { if (!state.modal) { modalRoot.innerHTML=''; return; } const content = state.modal === 'checkin' ? checkinModal() : state.modal === 'rules' ? rulesModal() : state.modal === 'read' ? readModal() : state.modal === 'add-sport' ? addSportModal() : state.modal === 'football-quiz' ? footballQuizModal() : state.modal === 'football-forum' ? footballForumModal() : state.modal === 'apply' ? applyModal() : infoModal(); modalRoot.innerHTML = `<div class="modal-scrim" data-action="close"></div><section class="modal" role="dialog" aria-modal="true"><button class="modal-close" data-action="close" aria-label="关闭">×</button>${content}</section>`; }
function questionnaireChoices(field, values, multiple=false) { const current=state.questionnaire[field]; return `<div class="questionnaire-choices">${values.map(value => { const selected=multiple ? current.includes(value) : current===value; return `<button class="questionnaire-choice ${selected?'selected':''}" data-action="questionnaire-select" data-field="${field}" data-value="${esc(value)}" data-multiple="${multiple}"><i>${selected?'✓':''}</i>${esc(value)}</button>`; }).join('')}</div>`; }
function questionnaireStepComplete() { const q=state.questionnaire; const step=state.questionnaireStep; if (step===0 && (!q.nickname.trim() || !q.grade || !q.roles.length)) { toast('先完成称呼、年级和参与方向'); return false; } if (step===1 && (!q.motivation.length || !q.problem.trim())) { toast('先选择加入原因，并写下一次真实观察'); return false; } if (step===2 && (!q.time || !q.collaboration.length)) { toast('先选择时间投入和协作方式'); return false; } if (step===3 && (!q.firstContribution.trim() || !q.contactOk)) { toast('先写下你想做的第一件事，并确认后续沟通意愿'); return false; } return true; }
function questionnaireStep() {
  const q=state.questionnaire;
  const steps=[
    `<p class="eyebrow">01 · ABOUT YOU</p><h2>先认识你，<br>不看简历。</h2><p>我们只想知道你现在的状态和兴趣，不收集学校、成绩、家庭或联系方式。</p><label class="sport-input"><span>你希望我们怎么称呼你？</span><input data-questionnaire="nickname" maxlength="20" value="${esc(q.nickname)}" placeholder="例如：小林"></label><p class="questionnaire-label">你现在读几年级？</p>${questionnaireChoices('grade',['初一—初二','初三—高一','高二—高三'])}<p class="questionnaire-label">你想参与哪些方向？可多选</p>${questionnaireChoices('roles',['产品与用户研究','体验与视觉设计','Vibe coding 开发'],true)}`,
    `<p class="eyebrow">02 · YOUR WHY</p><h2>你为什么想<br>一起做这件事？</h2><p>没有标准答案，选择最接近你的原因即可。</p><p class="questionnaire-label">我想加入，是因为……可多选</p>${questionnaireChoices('motivation',['我自己也遇到过运动难开始的问题','我想让同学更容易找到运动搭子','我想学习如何做一个真实产品','我想和不同方向的同学一起协作','我对 AI / Vibe coding 很好奇'],true)}<p class="questionnaire-label">你最近观察到学生运动中的一个问题是？</p><textarea data-questionnaire="problem" maxlength="260" placeholder="例如：大家放学后都想打球，但很难找到时间和水平差不多的人。">${esc(q.problem)}</textarea>`,
    `<p class="eyebrow">03 · HOW YOU WORK</p><h2>怎样的投入，<br>对你是可持续的？</h2><p>我们希望节奏真实，不希望你为了加入而承诺过多。</p><p class="questionnaire-label">每周你大约能投入？</p>${questionnaireChoices('time',['每周约 1 小时','每周约 2—4 小时','时间不固定，但会提前说明'])}<p class="questionnaire-label">你更喜欢怎样协作？可多选</p>${questionnaireChoices('collaboration',['先自己想一版，再和大家讨论','和别人一起边聊边做','通过文字异步沟通','愿意做访谈或联系同学','愿意展示半成品并接受反馈'],true)}<p class="questionnaire-label">你想在项目中学到什么？可选填</p><textarea data-questionnaire="learning" maxlength="180" placeholder="例如：学会把访谈变成产品需求，或学会把 AI 生成的代码改成能用的页面。">${esc(q.learning)}</textarea>`,
    `<p class="eyebrow">04 · YOUR FIRST MOVE</p><h2>如果加入，<br>你想先做什么？</h2><p>我们更在意你愿意从哪一步开始，而不是你过去拿过什么奖。</p><p class="questionnaire-label">加入后的前两周，你最想完成什么？</p><textarea data-questionnaire="firstContribution" maxlength="260" placeholder="例如：访谈 3 位同学，整理他们找运动搭子的困难。">${esc(q.firstContribution)}</textarea><p class="questionnaire-label">如果进入下一轮，你是否愿意通过项目组后续提供的正式渠道继续沟通？</p>${questionnaireChoices('contactOk',['愿意，等正式报名方式确定','我想先了解更多再决定'])}<p class="questionnaire-note">这是页面演示，填写内容不会保存或发送，也不会直接完成报名。</p>`
  ];
  const final=state.questionnaireStep===3;
  return `<div class="questionnaire-progress"><span>学生共创问卷</span><b>${String(state.questionnaireStep+1).padStart(2,'0')} / 04</b></div>${steps[state.questionnaireStep]}<div class="questionnaire-actions">${state.questionnaireStep ? '<button class="button ghost" data-action="questionnaire-back">← 上一步</button>' : '<span></span>'}<button class="button primary" data-action="${final?'submit-questionnaire':'questionnaire-next'}">${final?'完成问卷演示':'继续'} <span>→</span></button></div>`;
}
function applyModal() { return questionnaireStep(); }
function checkinModal() { return `<p class="eyebrow">TODAY'S CHECK-IN</p><h2>${state.checkedIn?'今天已经留下一次记录。':'今天真实完成了什么？'}</h2><p>${state.checkedIn?'不需要连续，也不需要补打。明天再根据身体状态决定下一步。':'运动、恢复，或一句身体感受都算。选择后获得 15 成长积分。'}</p>${state.checkedIn?'':`<div class="check-options"><button class="check-choice active">◒ 轻量运动</button><button class="check-choice">⌁ 恢复与拉伸</button><button class="check-choice">✦ 记录感受</button></div><textarea placeholder="例如：和朋友踢了半小时，出汗后放松了一点。"></textarea>`}<button class="button primary modal-action" data-action="${state.checkedIn?'close':'confirm-checkin'}">${state.checkedIn?'知道了':'完成记录 +15'}</button>`; }
function rulesModal() { return `<p class="eyebrow">BUDDY BOUNDARIES</p><h2>一起动，不等于互相打分。</h2><ul><li>可以：约管理员发布的活动、轻量鼓励、分享运动感受。</li><li>不可以：索要私人联系方式、评价身体、比较训练量。</li><li>敏感状态默认只属于你自己。</li></ul><button class="button primary modal-action" data-action="close">明白了</button>`; }
function readModal() { return `<p class="eyebrow">SPORT LITERACY · 3 MINUTES</p><h2>恢复不是偷懒，<br>是让下一次还能继续。</h2><p>运动后的身体感受、睡眠和第二天的精力，都是比“完成多少”更有价值的线索。持续疲惫时，先缩短、放轻，必要时寻求专业支持。</p><button class="button primary modal-action" data-action="close">收下这条提醒</button>`; }
function footballQuizModal() {
  if (state.quizDone) return `<p class="eyebrow">FOOTBALL QUIZ · COMPLETE</p><h2>这节小测<br>已经完成。</h2><p>你已获得一次 20 成长积分。正确答案的意义不是比谁更懂球，而是让下一次训练和上场更安全。</p><button class="button primary modal-action" data-action="close">知道了</button>`;
  const question = (id, prompt, answers) => `<div class="quiz-question"><b>${prompt}</b>${answers.map(([value,label]) => `<button class="quiz-option ${state.quizAnswers[id]===value?'selected':''}" data-action="quiz-answer" data-question="${id}" data-value="${value}"><i>${state.quizAnswers[id]===value?'✓':' '}</i>${label}</button>`).join('')}</div>`;
  return `<p class="eyebrow">FOOTBALL QUIZ · +20</p><h2>足球知多少</h2><p>三题都答对即可获得一次学习积分。</p><div class="quiz-list">${question('warmup','01 · 热身更主要的作用是？',[['wrong','让自己立刻很累'],['right','逐步准备好加速、急停和变向']])}${question('firstGame','02 · 第一次参加小场球，更合适的目标是？',[['right','出现、了解规则，安全完成一场'],['wrong','每一次都必须进球']])}${question('recovery','03 · 训练后持续疲惫时，应先？',[['wrong','立刻加量练回来'],['right','降低下一次量，观察恢复或求助']])}</div><button class="button primary modal-action" data-action="submit-football-quiz">提交答案 +20</button>`;
}
function footballForumModal() { return `<p class="eyebrow">FOOTBALL FORUM · MODERATED</p><h2>来问一个<br>能让下次更好的问题。</h2><p>讨论区只服务于活动、训练、恢复与安全；管理员会维护友好和有用的交流边界。</p><label class="sport-input"><span>我想讨论</span><input id="forum-topic" maxlength="42" placeholder="例如：第一次 5v5 怎么和队友沟通？"></label><button class="button primary modal-action" data-action="forum-post">发布到讨论区 <span>→</span></button>`; }
function addSportModal() { const label = { current:'正在参与', past:'以前参与过', wish:'想尝试' }[state.addSportField] || '运动档案'; return `<p class="eyebrow">ADD YOUR SPORT</p><h2>把你的运动<br>加进来。</h2><p>它会被标记为「${label}」，用于你的运动星图与后续推荐。</p><label class="sport-input"><span>运动名称</span><input id="custom-sport" maxlength="16" placeholder="例如：击剑、排球、冲浪"></label><button class="button primary modal-action" data-action="save-sport">添加到档案 <span>→</span></button>`; }
function infoModal() { return `<p class="eyebrow">WORKOUT BUDDY</p><h2>先从一个小行动开始。</h2><p>这是一版交互原型，活动、Mentor 与兑换均为展示内容。</p><button class="button primary modal-action" data-action="close">知道了</button>`; }

// Rendered screens replace their DOM every time state changes. Delegating from the
// document keeps every current and future action button interactive, including modals.
document.addEventListener('click', event => {
  const control = event.target.closest('[data-action]');
  if (!control) return;
  event.preventDefault();
  handle({ ...control.dataset });
});
document.addEventListener('input', event => {
  const field = event.target.dataset.profile;
  if (field && Object.prototype.hasOwnProperty.call(state.profile, field)) state.profile[field] = event.target.value;
  const questionnaireField = event.target.dataset.questionnaire;
  if (questionnaireField && Object.prototype.hasOwnProperty.call(state.questionnaire, questionnaireField)) state.questionnaire[questionnaireField] = event.target.value;
});

function handle(data) {
  const action = data.action;
  if (action==='start') { state.screen='onboarding'; state.step=0; }
  if (action==='recruit') state.screen='recruit';
  if (action==='back-to-welcome') state.screen='welcome';
  if (action==='recruit-stage') state.recruitStage=data.stage;
  if (action==='apply') { state.applyRole=data.role || ''; state.questionnaireStep=0; if (data.role && !state.questionnaire.roles.includes(data.role)) state.questionnaire.roles=[data.role]; state.modal='apply'; }
  if (action==='preview') state.modal='info';
  if (action==='reset') { state.screen='welcome'; state.step=0; state.modal=null; }
  if (action==='next') { if (state.step===0 && (!state.profile.name.trim() || !state.profile.city || !state.profile.district)) { toast('先选择城市和活动区域'); return; } state.step=Math.min(steps.length - 1,state.step+1); }
  if (action==='back') state.step=Math.max(0,state.step-1);
  if (action==='select') { selection(data.field,data.value,data.multiple==='true'); if (data.field==='city') state.profile.district=''; }
  if (action==='add-sport') { state.addSportField=data.field; state.modal='add-sport'; }
  if (action==='save-sport') { const input=document.querySelector('#custom-sport'); const name=input?.value.trim(); if (!name) { toast('请输入运动名称'); return; } const field=state.addSportField; if (!state.profile[field].includes(name)) state.profile[field].push(name); state.modal=null; state.addSportField=null; }
  if (action==='finish') state.screen='result';
  if (action==='enter') { state.screen='space'; state.route='today'; }
  if (action==='route') { state.route=data.route; if (data.route==='circle') state.circleTab='football'; }
  if (action==='circle-tab') state.circleTab=data.tab;
  if (action==='checkin') state.modal='checkin';
  if (action==='confirm-checkin') { state.checkedIn=true; state.points+=15; state.modal=null; toast('记录好了：+15 成长积分'); }
  if (action==='join-football') { if (!state.joinedFootball) { state.joinedFootball=true; state.points+=40; toast('已报名周五活动：+40 成长积分'); } }
  if (action==='quiz') state.modal='football-quiz';
  if (action==='quiz-answer') state.quizAnswers[data.question]=data.value;
  if (action==='submit-football-quiz') { const answers=state.quizAnswers; if (!answers.warmup || !answers.firstGame || !answers.recovery) { toast('先完成三道题'); return; } if (answers.warmup==='right' && answers.firstGame==='right' && answers.recovery==='right') { state.quizDone=true; state.points+=20; state.modal=null; toast('三题全对：+20 成长积分'); } else toast('有一题还可以再想想，看看训练与恢复提示。'); }
  if (action==='forum') state.modal='football-forum';
  if (action==='forum-post') { const topic=document.querySelector('#forum-topic')?.value.trim(); if (!topic) { toast('先写下你想讨论的问题'); return; } state.modal=null; toast('已提交讨论主题，等待管理员审核后展示。'); }
  if (action==='submit-apply') { const name=document.querySelector('#apply-name')?.value.trim(); const role=document.querySelector('#apply-role')?.value.trim(); if (!name || !role) { toast('请先填写称呼和想参与的方向'); return; } state.modal=null; toast('演示检查完成；信息未保存或发送，尚未报名。'); }
  if (action==='questionnaire-select') { const field=data.field; const value=data.value; if (data.multiple==='true') { const current=state.questionnaire[field] || []; state.questionnaire[field]=current.includes(value) ? current.filter(item=>item!==value) : [...current,value]; } else state.questionnaire[field]=value; }
  if (action==='questionnaire-next') { if (!questionnaireStepComplete()) return; state.questionnaireStep=Math.min(3,state.questionnaireStep+1); }
  if (action==='questionnaire-back') state.questionnaireStep=Math.max(0,state.questionnaireStep-1);
  if (action==='submit-questionnaire') { if (!questionnaireStepComplete()) return; state.modal=null; toast('问卷演示完成；信息未保存或发送，尚未报名。'); }
  if (action==='redeem') { const cost=Number(data.cost); if (state.points>=cost && !state.claimed.includes(data.id)) { state.points-=cost; state.claimed.push(data.id); toast('兑换成功，后续由管理员安排发放'); } }
  if (action==='buddy') toast('邀请已发出。保持轻松，等对方决定要不要一起。');
  if (action==='mentor'||action==='activity') state.modal='info';
  if (action==='rules') state.modal='rules';
  if (action==='read') state.modal='read';
  if (action==='close') state.modal=null;
  render();
}

render();
