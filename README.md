# 停车场管理系统 Parking Lot Management System
**Java 后端 + 纯前端网页｜前后端分离｜课程设计 / 练手项目**

---

## 📖 项目介绍
本项目是一个**前后端分离架构**的停车场管理系统，分为 **Java 后端核心程序** 和 **网页版前端界面**。
后端负责业务逻辑，前端负责可视化交互，适合 Java 初学者、前后端分离入门、课程设计 / 毕业设计使用。

---

## 📁 项目目录结构
parking-system/
├── backend/ # 后端 Java + Maven 工程
│ ├── pom.xml # Maven 依赖 / 打包配置
│ └── src/ # Java 源代码（停车场核心逻辑）
├── frontend/ # 前端纯静态页面
│ ├── index.html # 页面结构
│ ├── app.js # 前端交互逻辑
│ └── style.css # 页面样式
├── .gitignore # Git 忽略规则
└── README.md # 项目说明

## 🔧 本地运行说明
### 后端运行（Java + Maven）
1. 进入backend目录：`cd backend`
2. 编译代码：`mvn clean compile`
3. 打包成可执行JAR：`mvn clean package`
4. 运行JAR：`java -jar target/xxx.jar`（xxx替换为实际JAR文件名）

### 前端运行
直接打开frontend/index.html，浏览器中即可测试入场/离场/查询功能。

---

## 🛠️ 技术栈
### 后端 / 核心程序
- **语言**：Java 17
- **构建工具**：Maven
- **主类**：`com.example.parking.ParkingLotApp`
- **打包**：可执行 JAR
- **插件**：
  - maven-compiler-plugin (JDK 17)
  - maven-jar-plugin

### 前端（网页版界面）
- **结构**：HTML5
- **样式**：CSS3
- **交互**：原生 JavaScript (ES6+)
- **特性**：
  - 类（Car / ParkingSpot / ParkingLot）
  - DOM 操作
  - 实时车位状态
  - 停车记录表格渲染
  - 入场、离场、查询、结算

---

## ✨ 功能列表
✅ 初始化停车场（设置总车位）
✅ 车辆入场
✅ 车辆离场 + 自动计费
✅ 按车牌查询停车记录
✅ 实时车位状态展示
✅ 停车记录表格
✅ 系统消息提示
✅ 前端可视化操作界面
✅ 后端 Java 核心逻辑独立运行

---

## 🚀 启动方式

### 后端启动（Java + Maven）
1. 进入 `backend` 目录
2. 执行编译打包：
   mvn clean package
3. 运行主类：
   com.example.parking.ParkingLotApp
4. 后端控制台启动成功

### 前端启动（网页）
1. 进入 `frontend` 目录
2. 直接打开 `index.html`
3. 浏览器即可使用完整界面

---

## 📦 Maven 配置说明
- groupId：`com.example`
- artifactId：parking-system
- JDK 版本：17
- source / target：17
- 打包方式：jar
- 输出：可执行文件

---

## 🎯 适合人群
- Java 初学者
- 想学习前后端分离的新手
- 需要课程设计 / 大作业的学生
- 想做完整小项目练手的开发者

---

## 📌 项目特点
✅ 前后端完全独立
✅ 代码结构清晰
✅ 界面美观易用
✅ 适合二次开发
✅ 可本地运行
✅ 可部署上线

---

## 📝 License
本项目仅用于学习、交流、课程设计。
