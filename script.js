// 食材数据库
const ingredientsDB = {
  '清明': [
    { name: '艾草', img: 'assets/images/qingming/aiye.png', type: 'ingredient' },
    { name: '糯米粉', img: 'assets/images/qingming/flour.png', type: 'ingredient' }
  ],
  '立夏': [
    { name: '荔枝', img: 'assets/images/lixia/lychee.png', type: 'ingredient' },
    { name: '冰糖', img: 'assets/images/lixia/sugar.png', type: 'ingredient' }
  ],
  '立冬': [
    { name: '老鸭', img: 'assets/images/lidong/duck.png', type: 'ingredient' },
    { name: '老姜', img: 'assets/images/lidong/ginger.png', type: 'ingredient' }
  ],
  '端午': [
    { name: '糯米', img: 'assets/images/duanwu/rice.png', type: 'ingredient' },
    { name: '粽叶', img: 'assets/images/duanwu/leaves.png', type: 'ingredient' }
  ],
  '白露': [
    { name: '大闸蟹', img: 'assets/images/bailu/crab.png', type: 'ingredient' },
    { name: '姜丝', img: 'assets/images/bailu/ginger.png', type: 'ingredient' }
  ],
  '冬至': [
    { name: '羊肉', img: 'assets/images/dongzhi/lamb.png', type: 'ingredient' },
    { name: '面粉', img: 'assets/images/dongzhi/flour.png', type: 'ingredient' }
  ]
};

// 成品映射表
const dishesMap = {
  '清明': {
    name: '青团',
    img: './assets/images/dishes/qingtuan.png',
    required: ['艾草', '糯米粉']
  },
  '端午': {
    name: '粽子',
    img: './assets/images/dishes/zongzi.png',
    required: ['糯米', '粽叶']
  },
  '立夏': {
    name: '荔枝冰',
    img: './assets/images/dishes/lychee.png',
    required: ['荔枝', '冰糖']
  },
  '白露': {
    name: '清蒸螃蟹',
    img: './assets/images/dishes/crab.png',
    required: ['大闸蟹', '姜丝']
  },
  '立冬': {
    name: '姜母鸭',
    img: './assets/images/dishes/ginger_duck.png',
    required: ['老鸭', '老姜']
  },
  '冬至': {
    name: '饺子',
    img: './assets/images/dishes/jiaozi.png',
    required: ['羊肉', '面粉']
  }
};

// 全局变量存储当前节气
let currentSeason = '清明';

// Add this at the very top of the file
console.log("script.js loaded!");

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOMContentLoaded event fired!"); // Confirm DOM is ready

  // 1. 初始化加载第一个节气的食材
  loadIngredients(currentSeason);

  // 2. 节气选择逻辑
  const seasonButtons = document.querySelectorAll('.select-btn');
  seasonButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentSeason = btn.dataset.season;
      document.querySelector('#current-season span').textContent = currentSeason;
      document.getElementById('season-selector').style.display = 'none';
      document.getElementById('game-area').style.display = 'block';
      
      loadIngredients(currentSeason);
      console.log(`节气切换到: ${currentSeason}`); // Log season change
    });
  });

  // 显示初始界面
  document.getElementById('loader').style.display = 'none';
  document.getElementById('season-selector').style.display = 'block';
  
  // 3. 初始化拖拽事件
  bindDragEvents();

  // 4. 生成按钮事件
  document.getElementById('generate-btn').addEventListener('click', generateRecipe);

  // 5. 初始化AI聊天面板事件
  const askBtn = document.getElementById('ask-btn');
  if (askBtn) {
    askBtn.addEventListener('click', () => {
      showAIChatPanel(currentSeason);
      console.log('“问问我”按钮被点击，尝试显示AI聊天面板。'); // Log ask button click
    });
  } else {
    console.warn('警告: 未找到ID为 "ask-btn" 的元素。'); // Warn if button is missing
  }

  const closeChatBtn = document.getElementById('close-chat');
  if (closeChatBtn) {
    closeChatBtn.addEventListener('click', () => {
      const chatPanel = document.getElementById('ai-chat-panel');
      if (chatPanel) {
        chatPanel.style.display = 'none';
        console.log('AI聊天面板已关闭。'); // Log close action
      } else {
        console.error('错误: 未找到ID为 "ai-chat-panel" 的元素，无法关闭聊天面板。');
      }
    });
  } else {
    console.warn('警告: 未找到ID为 "close-chat" 的元素。'); // Warn if button is missing
  }
});

// ================= 核心功能函数 =================
function loadIngredients(season) {
  const container = document.getElementById('ingredients');
  container.innerHTML = '';

  ingredientsDB[season].forEach(item => {
    const img = document.createElement('img');
    img.src = item.img;
    img.alt = item.name;
    img.className = 'draggable';
    img.draggable = true;
    img.dataset.ingredient = item.name;
    container.appendChild(img);
  });

  bindDragEvents();
}

function bindDragEvents() {
  const draggables = document.querySelectorAll('.draggable');
  const dropzones = document.querySelectorAll('.dropzone');

  draggables.forEach(item => {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
  });

  dropzones.forEach(zone => {
    zone.addEventListener('dragover', handleDragOver);
    zone.addEventListener('dragleave', handleDragLeave);
    zone.addEventListener('drop', handleDrop);
  });
}

function generateRecipe() {
  const pot = document.getElementById('pot');
  const ingredients = Array.from(pot.children).map(item => item.dataset.ingredient);
  const expectedIngredients = dishesMap[currentSeason].required;
  const isValid = expectedIngredients.every(item => ingredients.includes(item));

  // 播放动画
  // 注释掉 Lottie 动画加载，因为 cooking.json 文件不存在
  // const animation = lottie.loadAnimation({
  //   container: document.getElementById('animation'),
  //   path: './assets/animations/cooking.json',  // 修改为相对路径
  //   renderer: 'svg',
  //   loop: false,  // 改为 false，动画只播放一次
  //   autoplay: true
  // });

  // 生成结果内容
  // 在 generateRecipe 函数中修改 resultHTML 的部分
  const resultHTML = isValid ? `
    <div class="result-container">
      <div class="result-header">
        <div class="dish-info">
          <img src="${dishesMap[currentSeason].img}" class="final-dish">
          <div class="result-title">
            <h2>🎉 ${dishesMap[currentSeason].name}制作成功！</h2>
            <button id="ask-btn" class="ask-button">🤖 想了解更多？问问我吧</button>
          </div>
        </div>
      </div>
      <div class="result-content">
        <div class="dish-card history">
          <div class="card-icon">📜</div>
          <h3>历史典故</h3>
          <p>${getDishHistory(currentSeason)}</p>
        </div>
        <div class="dish-card steps">
          <div class="card-icon">📝</div>
          <h3>详细做法</h3>
          ${generateSteps(currentSeason)}
        </div>
        <div class="dish-card culture">
          <div class="card-icon">🍽️</div>
          <h3>食用文化</h3>
          <p>${getDishCulture(currentSeason)}</p>
        </div>
      </div>
      <button id="restart-btn" onclick="location.reload()" class="restart-button">再来一次</button>
    </div>
  ` : `
    <div class="failed-container">
      <div class="failed-message">
        <h2>❌ 食材不匹配</h2>
        <p>需要：${expectedIngredients.join(' + ')}</p>
        <button onclick="location.reload()" class="restart-button">重新尝试</button>
      </div>
    </div>
  `;

  document.getElementById('recipe-text').innerHTML = resultHTML;
  document.getElementById('game-area').style.display = 'none';
  document.getElementById('result').style.display = 'block';
  
  // 重新绑定提问按钮事件
  document.getElementById('ask-btn')?.addEventListener('click', () => {
    showAIChatPanel(currentSeason);
  });
}

// ================= 拖拽事件处理 =================
function handleDragStart(e) {
  this.classList.add('dragging');
  e.dataTransfer.setData('text/plain', this.dataset.ingredient);
}

function handleDragEnd() {
  this.classList.remove('dragging');
}

function handleDragOver(e) {
  e.preventDefault();
  this.classList.add('hover');
}

function handleDragLeave() {
  this.classList.remove('hover');
}

function handleDrop(e) {
  e.preventDefault();
  this.classList.remove('hover');
  
  const ingredientName = e.dataTransfer.getData('text/plain');
  const draggedItem = document.querySelector(`.draggable[data-ingredient="${ingredientName}"]`);
  
  const clone = draggedItem.cloneNode(true);
  clone.classList.remove('dragging');
  this.appendChild(clone);
}

// ================= 内容生成函数 =================
function getDishHistory(season) {
  const histories = {
    '清明': '青团最早是南朝梁武帝为纪念忠臣介子推设立的寒食节食品，唐代成为清明祭品，宋代开始加入艾草汁。',
    '冬至': '东汉张仲景发明"娇耳汤"治疗冻伤，后演变成饺子，明清时期形成"冬至不端饺子碗，冻掉耳朵没人管"的谚语。',
    '立夏': '荔枝自古就是夏季的贡品，唐代杨贵妃尤其偏爱，专设"飞骑传荔"，不惜重金快马送荔枝入京。',
    '立冬': '姜母鸭源于福建，明清时期就有记载，立冬进补食用姜母鸭可以温补驱寒，是传统的养生美食。',
    '白露': '白露食蟹始于唐代，《本草纲目》记载："蟹，八月最佳"。明代《随园食单》更有"霜螯肥未足，争煮趁重阳"的描述。',
    '端午': '端午节吃粽子源于纪念屈原，相传为了防止鱼儿啄食屈原遗体，人们将米团投入江中，后来发展成用粽叶包裹糯米。'
  };
  return histories[season];
}

function generateSteps(season) {
  const steps = {
    '清明': [
      '艾草处理：鲜艾草焯水后榨汁，过滤取绿色汁液',
      '和面：糯米粉与艾草汁按3:1比例混合揉团',
      '包馅：豆沙馅搓球后包入，捏成青团形状',
      '蒸制：上汽后蒸10-15分钟，表面刷油防粘'
    ],
    '端午': [
      '准备：糯米提前浸泡4小时，粽叶焯水备用',
      '包制：将糯米装入叠好的粽叶中',
      '收口：用棉线扎紧粽子两端',
      '煮制：大火煮2小时，焖30分钟即可'
    ],
    '冬至': [
      '和面：面粉加冷水揉成光滑面团，醒发30分钟',
      '制馅：羊肉剁碎加花椒水搅拌，配大葱末调味',
      '包制：面团分剂擀皮，包入馅料捏褶',
      '煮制：水开下饺子，三点水法煮至浮起'
    ],
    '白露': [
      '选材：挑选活蟹，公蟹黄多，母蟹膏多',
      '清洗：用刷子刷洗蟹壳，去除泥沙',
      '摆盘：将螃蟹背朝上摆放，撒上姜丝',
      '蒸制：大火蒸8分钟即可出锅'
    ],
    '立夏': [
      '选料：挑选新鲜饱满的荔枝去壳去核',
      '调制：冰糖熬制成糖浆，冷却备用',
      '腌制：荔枝肉浸入糖浆中浸泡4小时',
      '冰镇：放入冰箱冷藏2小时以上即可'
    ],
    '立冬': [
      '准备：老鸭斩块，老姜切片，准备八角桂皮',
      '爆香：姜片爆香，下鸭肉煸炒上色',
      '炖煮：加入料酒香料，慢火炖煮1小时',
      '调味：加入适量盐调味，收汁即可'
    ]
  };
  return '<ol>' + steps[season].map(s => `<li>${s}</li>`).join('') + '</ol>';
}

function getDishCulture(season) {
  const cultures = {
    '清明': '江南地区有"清明吃青团，眼睛亮晶晶"的民谚，青团象征团圆和新生，常用于祭祖和踏青携带。',
    '冬至': '北方有"冬至大如年"的说法，饺子形似元宝，寓意招财进宝，蘸醋食用可驱寒暖胃。',
    '端午': '端午节食粽，是中华民族的传统习俗。南北方粽子各有特色，咸甜搭配，寓意辟邪驱灾、安康吉祥。',
    '白露': '白露食蟹是江南地区的传统，有"小暑吃鸭，白露吃蟹"的说法。此时的螃蟹最为肥美，有"金秋蟹黄"之美誉。',
    '立夏': '立夏食荔枝，有"一颗荔枝三把火"的说法，荔枝性温，适量食用可以养心安神。',
    '立冬': '立冬进补是传统习俗，有"立冬补冬，补嘴空"的说法，姜母鸭既能温补又可驱寒。'
  };
  return cultures[season];
}

// ================= AI聊天功能 =================
function showAIChatPanel(season) {
  console.log(`尝试显示AI聊天面板，当前节气: ${season}`); // Log when showAIChatPanel is called
  const panel = document.getElementById('ai-chat-panel');
  if (panel) {
    panel.style.display = 'block';
    // 清空旧消息
    const chatMessagesDiv = document.getElementById('chat-messages');
    if (chatMessagesDiv) {
      chatMessagesDiv.innerHTML = '';
      addChatMessage('assistant', `我是${dishesMap[season].name}文化小助手，可以问我：\n• 历史渊源\n• 烹饪技巧\n• 文化习俗等`);
      console.log('AI聊天面板已显示并初始化消息。'); // Log successful display
    } else {
      console.error('错误: 未找到ID为 "chat-messages" 的元素，无法清空或添加初始消息。');
    }
  } else {
    console.error('错误: 未找到ID为 "ai-chat-panel" 的元素，无法显示聊天面板。'); // Error if panel is missing
  }
}

function addChatMessage(role, content) {
  console.log(`添加消息: 角色=${role}, 内容=${content.substring(0, Math.min(content.length, 50))}...`); // Log message addition
  const messagesDiv = document.getElementById('chat-messages');
  if (messagesDiv) {
    const message = document.createElement('div');
    message.className = `message ${role}`;
    message.innerHTML = `<div class="bubble">${content}</div>`;
    messagesDiv.appendChild(message);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  } else {
    console.error('错误: 未找到ID为 "chat-messages" 的元素，无法添加消息。'); // Error if messages div is missing
  }
}

async function callDeepSeekAPI(question, season) {
  console.log(`调用DeepSeek API，问题: ${question.substring(0, Math.min(question.length, 50))}..., 节气: ${season}`); // Log API call
  // DeepSeek API 的实际端点 URL
  const API_URL = 'https://api.deepseek.com/chat/completions'; 
  // 你的 DeepSeek API Key
  const DEEPSEEK_API_KEY = 'your_own_api_key'; // 请替换为你的实际 API Key

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}` // 将 API Key 放入 Authorization 头
      },
      body: JSON.stringify({
        model: 'deepseek-chat', // 指定使用的模型，例如 'deepseek-chat' 或 'deepseek-coder'
        messages: [
          {
            role: 'system',
            content: `你是一位专业的中国传统美食文化专家，特别擅长${dishesMap[season].name}相关的知识。请用简洁专业的语言回答用户的问题。`
          },
          {
            role: 'user',
            content: `关于${dishesMap[season].name}的${question}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.95
      })
    });

    if (!response.ok) {
      // 尝试解析错误响应体，提供更详细的错误信息
      const errorData = await response.json();
      console.error('API 请求失败:', response.status, errorData); // Detailed API error log
      throw new Error(`API 请求失败: ${response.status} - ${errorData.message || JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('DeepSeek API 响应成功:', data); // Log successful API response
    return data;
  } catch (error) {
    console.error('API 调用错误:', error); // Log API call error
    return {
      choices: [{
        message: {
          content: `抱歉，我现在无法回答这个问题。请检查网络连接或API配置。错误信息：${error.message}`
        }
      }]
    };
  }
}

document.getElementById('send-btn').addEventListener('click', async () => {
  console.log('发送按钮被点击了！'); // Confirm event listener fires

  const input = document.getElementById('user-question');
  const sendBtn = document.getElementById('send-btn');
  const chatMessagesDiv = document.getElementById('chat-messages');

  // 检查所有必要的DOM元素是否存在
  if (!input || !sendBtn || !chatMessagesDiv) {
    console.error('错误：聊天界面所需的一个或多个DOM元素未找到！');
    // 如果元素不存在，则停止执行
    return;
  }

  const question = input.value.trim();
  if (!question) {
    console.log('用户输入为空，不发送消息。');
    return;
  }
  
  // 1. 立即显示用户发送的消息
  addChatMessage('user', question);
  input.value = ''; // 清空输入框
  
  // 2. 禁用输入框和发送按钮，防止重复提交
  input.disabled = true;
  sendBtn.disabled = true;
  sendBtn.textContent = '发送中...'; // 更改按钮文本以示加载状态

  // 3. 显示一个“思考中...”的提示消息
  const thinkingMessageElement = document.createElement('div');
  thinkingMessageElement.className = 'message assistant';
  thinkingMessageElement.innerHTML = '<div class="bubble">思考中...</div>';
  chatMessagesDiv.appendChild(thinkingMessageElement); // 使用获取到的容器
  // 确保滚动到底部，显示新消息
  chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
  console.log('已显示“思考中...”消息。'); // Log thinking message display

  try {
    // 4. 调用 DeepSeek API
    const response = await callDeepSeekAPI(question, currentSeason);
    
    // 5. 更新“思考中”消息为实际的 AI 响应
    // 确保安全地访问响应内容，防止 undefined 错误
    const aiContent = response?.choices?.[0]?.message?.content || '未能获取到AI的响应。';
    thinkingMessageElement.innerHTML = `<div class="bubble">${aiContent}</div>`;
    console.log('AI响应已更新到聊天面板。'); // Log AI response update
  } catch (error) {
    // 6. 如果 API 调用失败，显示错误信息
    thinkingMessageElement.innerHTML = `<div class="bubble">抱歉，获取信息失败。请检查网络连接或API配置。错误信息：${error.message || '未知错误'}</div>`;
    console.error("API 调用错误:", error);
  } finally {
    // 7. 无论成功或失败，重新启用输入框和发送按钮
    input.disabled = false;
    sendBtn.disabled = false;
    sendBtn.textContent = '发送'; // 恢复按钮文本
    // 确保最终滚动到底部
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
    console.log('输入框和发送按钮已恢复。'); // Log final state
  }
});