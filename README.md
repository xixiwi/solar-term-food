# AI节气美食合成器

## 项目简介

《AI节气美食合成器》是一款结合中国传统节气文化与人工智能技术的互动式Web应用。用户可以通过游戏化的方式，选择不同的节气，拖拽食材进行美食合成，并与智能AI助手互动，深入了解节气美食的历史渊源、烹饪技巧和文化习俗。本项目旨在通过科技创新，以沉浸式体验的方式传承和弘扬中华优秀传统文化。

## 功能特性

*   **节气选择**：提供清明、端午、立夏、白露、立冬、冬至等多个传统节气主题供用户选择。
*   **食材拖拽合成**：每个节气对应特定的食材，用户需将正确食材拖拽至烹饪锅具中，合成该节气的代表性美食。
*   **美食合成结果展示**：根据食材是否匹配，展示成功或失败的反馈，成功后展示美食图片、历史典故、详细做法和食用文化。
*   **AI美食文化助手**：集成DeepSeek AI模型，用户可以针对当前节气美食进行智能问答，获取更深入的文化解读。
*   **响应式设计**：适配不同屏幕尺寸，提供良好的用户体验。

## 技术栈

*   **前端**：HTML5, CSS3, JavaScript (ES6+)
*   **AI服务**：DeepSeek API (用于智能问答)
*   **动画**：Lottie (项目中已注释，但为可选集成技术)

## 如何运行

1.  **克隆仓库**：
    ```bash
    git clone https://github.com/your-username/solar-term-food.git
    ```
    （请将 `https://github.com/your-username/solar-term-food.git` 替换为你的实际仓库地址）

2.  **进入项目目录**：
    ```bash
    cd d:\workspace\solar-term-food
    ```

3.  **配置 DeepSeek API Key**：
    打开 `script.js` 文件，找到 `callDeepSeekAPI` 函数中的 `DEEPSEEK_API_KEY` 变量，将其替换为你自己的 DeepSeek API Key。
    ```javascript:d%3A%5Cworkspace%5Csolar-term-food%5Cscript.js
    // ...
    async function callDeepSeekAPI(question, season) {
      // ...
      const DEEPSEEK_API_KEY = 'your_own_api_key'; // <-- 将此处的 'your_own_api_key' 替换为你的实际 API Key
      // ...
    }
    // ...
    ```
    **注意**：请妥善保管你的 API Key，不要将其直接暴露在公共仓库中。在实际部署时，建议使用环境变量或后端代理来管理 API Key。

4.  **启动本地服务器**：
    由于项目涉及本地文件加载和API请求，直接打开 `index.html` 可能存在跨域问题。建议使用一个简单的本地HTTP服务器来运行项目。
    *   **推荐使用 VS Code 的 Live Server 插件**：在 VS Code 中安装 "Live Server" 插件，然后在 `index.html` 文件上右键选择 "Open with Live Server"。
    *   **使用 Python 启动简单服务器**（如果已安装 Python）：
        ```bash
        python -m http.server 8000
        ```
        然后访问 `http://localhost:8000`。
    *   **使用 Node.js 的 `http-server`**（如果已安装 Node.js）：
        ```bash
        npm install -g http-server
        http-server .
        ```
        然后访问 `http://localhost:8080`。

## 项目结构
solar-term-food/
├── assets/
│   ├── animations/         # Lottie动画文件 (cooking.json)
│   ├── images/             # 项目图片资源
│   │   ├── bailu/
│   │   ├── dishes/
│   │   ├── dongzhi/
│   │   ├── duanwu/
│   │   ├── lidong/
│   │   ├── lixia/
│   │   ├── qingming/
│   │   └── ...
│   └── bg-texture.png
├── index.html              # 项目主页面，包含所有UI结构
├── script.js               # 核心JavaScript逻辑，包括游戏交互和AI集成
├── style.css               # 项目样式文件
└── README.md               # 项目说明文件

## 未来展望

*   **丰富节气与美食内容**：增加更多节气和地方特色美食，拓展文化知识库。
*   **优化AI助手体验**：提升AI回复的准确性和丰富性，考虑加入语音输入/输出功能。
*   **动画效果增强**：重新启用并优化Lottie动画，或引入更多视觉效果，提升用户沉浸感。
*   **用户数据存储**：实现用户偏好、历史合成记录等数据的本地存储功能。
*   **部署上线**：将项目部署到云平台，使其可在线访问。

## 贡献

欢迎对本项目提出建议或贡献代码！

