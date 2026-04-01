export interface CodeSnippet {
  title: string;
  language: string;
  code: string;
  description: string;
}

export interface FileInfo {
  path: string;
  lines: number;
  description: string;
}

export interface FlowStep {
  id: string;
  label: string;
  description: string;
}

export interface FlowConnection {
  from: string;
  to: string;
  label?: string;
}

export interface ArchNode {
  id: string;
  label: string;
  description: string;
  x: number;
  y: number;
  color: string;
}

export interface ArchEdge {
  source: string;
  target: string;
  label?: string;
}

export interface Chapter {
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  overview: string;
  keyPoints: string[];
  archNodes: ArchNode[];
  archEdges: ArchEdge[];
  coreFiles: FileInfo[];
  codeSnippets: CodeSnippet[];
  flowSteps: FlowStep[];
  flowConnections: FlowConnection[];
  details: string[];
}

export const stats = {
  totalFiles: 1885,
  totalLines: 515386,
  tools: 42,
  commands: 86,
  hooks: 87,
  components: 146,
  services: 38,
  skills: 19,
};

export const chapters: Chapter[] = [
  {
    slug: "overview",
    title: "项目总览",
    subtitle: "仓库结构、构建系统与入口流程",
    icon: "Layout",
    color: "#3B82F6",
    overview:
      "Claude Code 是一个基于 TypeScript 和 React (Ink) 构建的单体 CLI 应用，约 515K 行代码，使用 Bun 打包为单个可执行文件 cli.js（约 13MB）。它通过 Anthropic API 与 Claude 模型交互，提供终端内的 AI 辅助编程体验。",
    keyPoints: [
      "单体 TypeScript 应用，ESM 模块系统",
      "使用 Bun 构建和打包，零 npm 依赖",
      "React + Ink 驱动终端 UI",
      "Feature Flags 条件编译（bun:bundle）",
      "多层设置系统（User → Project → Local → CLI → MDM → Remote）",
    ],
    archNodes: [
      { id: "cli", label: "cli.js", description: "入口脚本", x: 250, y: 0, color: "#3B82F6" },
      { id: "main", label: "main.tsx", description: "主入口（4683 LOC）", x: 250, y: 100, color: "#3B82F6" },
      { id: "init", label: "entrypoints/init.ts", description: "初始化", x: 50, y: 100, color: "#60A5FA" },
      { id: "app", label: "App.tsx", description: "根组件", x: 250, y: 200, color: "#10B981" },
      { id: "repl", label: "REPL Loop", description: "交互循环", x: 250, y: 300, color: "#F59E0B" },
      { id: "tools", label: "工具系统", description: "42 个工具", x: 100, y: 400, color: "#EF4444" },
      { id: "commands", label: "命令系统", description: "86 个命令", x: 400, y: 400, color: "#8B5CF6" },
      { id: "api", label: "Anthropic API", description: "模型调用", x: 250, y: 500, color: "#EC4899" },
    ],
    archEdges: [
      { source: "cli", target: "main" },
      { source: "main", target: "init", label: "bootstrap" },
      { source: "main", target: "app", label: "渲染" },
      { source: "app", target: "repl", label: "启动" },
      { source: "repl", target: "tools", label: "调度" },
      { source: "repl", target: "commands", label: "分发" },
      { source: "repl", target: "api", label: "查询" },
    ],
    coreFiles: [
      { path: "cli.js", lines: 13000, description: "打包后的入口脚本（Node 可执行文件）" },
      { path: "main.tsx", lines: 4683, description: "主入口，CLI 参数解析、认证、设置加载、REPL 启动" },
      { path: "entrypoints/init.ts", lines: 500, description: "初始化逻辑" },
      { path: "entrypoints/cli.tsx", lines: 1500, description: "CLI 引导器" },
      { path: "components/App.tsx", lines: 800, description: "根 React 组件" },
      { path: "Tool.ts", lines: 792, description: "工具基类定义" },
      { path: "tools.ts", lines: 600, description: "工具注册中心" },
      { path: "commands.ts", lines: 900, description: "命令注册中心" },
    ],
    codeSnippets: [
      {
        title: "主入口流程 — main.tsx",
        language: "typescript",
        code: `// main.tsx - 简化的启动流程
import { render } from 'ink'
import { App } from './components/App'

// 1. 解析 CLI 参数
const args = parseCliArgs(process.argv)

// 2. 初始化认证
await initAuth(args)

// 3. 加载设置（多层合并）
const settings = mergeSettings(
  userSettings,      // ~/.claude/settings.json
  projectSettings,   // .claude/settings.json
  localSettings,     // .claude/local-settings.json
  cliFlags,          // CLI 参数
  mdmSettings,       // MDM 策略
  remoteSettings     // 远程管理
)

// 4. 初始化 Feature Flags (GrowthBook)
await initFeatureFlags()

// 5. 加载 MCP 配置和技能
await loadMCPConfig()
await loadSkills()

// 6. 渲染 React TUI
render(<App settings={settings} />)`,
        description: "Claude Code 的启动流程：解析参数 → 认证 → 加载设置 → Feature Flags → MCP/技能 → 渲染 UI",
      },
      {
        title: "Feature Flags 条件编译",
        language: "typescript",
        code: `// 使用 bun:bundle 的 feature() 进行条件编译
// 构建时会被替换为 true/false，实现死代码消除

if (feature('COORDINATOR_MODE')) {
  // KAIROS 多代理协调模式
  import('./coordinator/kairos')
}

if (feature('VOICE_MODE')) {
  // 语音交互模式
  import('./voice/voiceHandler')
}

if (feature('BRIDGE_MODE')) {
  // IDE Bridge 模式
  import('./bridge/bridgeMain')
}`,
        description: "Bun 构建时的 Feature Flags，实现按需加载和死代码消除",
      },
    ],
    flowSteps: [
      { id: "start", label: "用户启动 claude", description: "执行 cli.js" },
      { id: "parse", label: "解析参数", description: "Commander.js 解析 CLI 参数" },
      { id: "auth", label: "认证", description: "OAuth / API Key / Bedrock / Vertex" },
      { id: "settings", label: "加载设置", description: "6 层设置合并" },
      { id: "features", label: "Feature Flags", description: "GrowthBook 初始化" },
      { id: "mcp", label: "MCP + 技能", description: "加载外部工具和技能" },
      { id: "render", label: "渲染 UI", description: "Ink React TUI" },
      { id: "loop", label: "REPL 循环", description: "等待用户输入，处理请求" },
    ],
    flowConnections: [
      { from: "start", to: "parse" },
      { from: "parse", to: "auth" },
      { from: "auth", to: "settings" },
      { from: "settings", to: "features" },
      { from: "features", to: "mcp" },
      { from: "mcp", to: "render" },
      { from: "render", to: "loop" },
    ],
    details: [
      "Claude Code 使用 Bun 作为构建工具，将所有 TypeScript 源码打包为单个 cli.js 文件（~13MB），实现零依赖部署。",
      "设置系统采用 6 层优先级合并：CLI 参数 > 本地设置 > 项目设置 > 用户设置 > MDM 策略 > 远程管理设置。",
      "Feature Flags 通过 bun:bundle 的 feature() 函数实现编译时条件判断，支持 COORDINATOR_MODE、VOICE_MODE、BRIDGE_MODE 等特性的按需启用。",
      "React + Ink 的组合让 Claude Code 能在终端中渲染丰富的交互界面，包括进度条、语法高亮、文件树等。",
    ],
  },
  {
    slug: "tools",
    title: "工具系统",
    subtitle: "42 个内置工具的架构与实现",
    icon: "Wrench",
    color: "#EF4444",
    overview:
      "工具系统是 Claude Code 的核心执行层。每个工具实现 Tool 接口，通过 tools.ts 注册中心统一管理。工具被分为多个类别：执行工具（Bash）、文件操作（Read/Write/Edit）、搜索工具（Grep/Glob）、MCP 集成、Agent 协调等。",
    keyPoints: [
      "Tool.ts 定义统一接口：schema、execute、canUse",
      "42 个内置工具，按目录组织",
      "条件加载 — 根据 Feature Flags 和用户类型",
      "权限检查 — CanUseToolFn 在执行前验证",
      "进度追踪 — BashProgress、MCPProgress 等类型",
    ],
    archNodes: [
      { id: "registry", label: "tools.ts", description: "工具注册中心", x: 250, y: 0, color: "#EF4444" },
      { id: "base", label: "Tool.ts", description: "基类/接口", x: 250, y: 100, color: "#EF4444" },
      { id: "exec", label: "执行工具", description: "Bash, PowerShell, REPL", x: 50, y: 250, color: "#F59E0B" },
      { id: "file", label: "文件工具", description: "Read, Write, Edit, Glob", x: 200, y: 250, color: "#10B981" },
      { id: "search", label: "搜索工具", description: "Grep, WebSearch, WebFetch", x: 350, y: 250, color: "#3B82F6" },
      { id: "agent", label: "Agent 工具", description: "AgentTool, Task*", x: 500, y: 250, color: "#8B5CF6" },
      { id: "mcp", label: "MCP 工具", description: "MCPTool, Resources", x: 100, y: 380, color: "#EC4899" },
      { id: "plan", label: "规划工具", description: "PlanMode, Worktree", x: 350, y: 380, color: "#6366F1" },
    ],
    archEdges: [
      { source: "registry", target: "base", label: "注册" },
      { source: "base", target: "exec" },
      { source: "base", target: "file" },
      { source: "base", target: "search" },
      { source: "base", target: "agent" },
      { source: "base", target: "mcp" },
      { source: "base", target: "plan" },
    ],
    coreFiles: [
      { path: "Tool.ts", lines: 792, description: "工具基类，定义 ToolInputJSONSchema、ToolUseBlockParam 等接口" },
      { path: "tools.ts", lines: 600, description: "工具注册中心，导入并注册所有 42 个工具" },
      { path: "tools/BashTool/", lines: 2000, description: "Bash 命令执行工具，含 20 个子模块" },
      { path: "tools/FileReadTool/", lines: 500, description: "文件读取工具，支持文本、图片、PDF、Jupyter" },
      { path: "tools/FileEditTool/", lines: 800, description: "文件编辑工具，精确字符串替换" },
      { path: "tools/FileWriteTool/", lines: 400, description: "文件创建/覆盖工具" },
      { path: "tools/GrepTool/", lines: 600, description: "基于 ripgrep 的内容搜索" },
      { path: "tools/GlobTool/", lines: 400, description: "文件模式匹配" },
      { path: "tools/AgentTool/", lines: 1200, description: "子代理编排工具" },
      { path: "tools/MCPTool/", lines: 800, description: "MCP 协议工具执行" },
    ],
    codeSnippets: [
      {
        title: "Tool 接口定义 — Tool.ts",
        language: "typescript",
        code: `// Tool.ts - 所有工具的基础接口
interface Tool {
  // 工具名称（如 "Bash", "Read", "Edit"）
  name: string

  // JSON Schema 定义输入参数
  inputSchema: ToolInputJSONSchema

  // 工具描述（发送给模型）
  description: string

  // 执行工具逻辑
  execute(
    input: Record<string, unknown>,
    context: ToolExecutionContext
  ): Promise<ToolResult>

  // 权限检查函数
  canUse?: CanUseToolFn

  // 是否在当前环境下可用
  isAvailable?: () => boolean
}

// 工具执行上下文
interface ToolExecutionContext {
  workingDirectory: string
  permissions: PermissionContext
  abortSignal: AbortSignal
  onProgress?: (progress: ToolProgress) => void
}`,
        description: "Tool 接口定义了所有工具必须实现的方法：名称、输入 Schema、执行逻辑和权限检查。",
      },
      {
        title: "BashTool 执行示例",
        language: "typescript",
        code: `// tools/BashTool/BashTool.ts - 简化版
export const BashTool: Tool = {
  name: "Bash",
  description: "执行 bash 命令并返回输出",
  inputSchema: {
    type: "object",
    properties: {
      command: { type: "string", description: "要执行的命令" },
      timeout: { type: "number", description: "超时时间(ms)" },
      run_in_background: { type: "boolean" }
    },
    required: ["command"]
  },

  async execute(input, context) {
    const { command, timeout = 120000 } = input

    // 1. 沙箱检查
    if (!context.permissions.allowBash(command)) {
      throw new PermissionDeniedError()
    }

    // 2. 在子进程中执行
    const result = await execInShell(command, {
      cwd: context.workingDirectory,
      timeout,
      signal: context.abortSignal
    })

    // 3. 返回结果
    return {
      output: result.stdout + result.stderr,
      exitCode: result.exitCode
    }
  }
}`,
        description: "BashTool 展示了工具的典型实现模式：输入验证 → 权限检查 → 执行 → 返回结果。",
      },
    ],
    flowSteps: [
      { id: "model", label: "模型请求工具", description: "Claude 输出 tool_use 块" },
      { id: "dispatch", label: "工具分发", description: "tools.ts 查找对应工具" },
      { id: "permission", label: "权限检查", description: "canUse() 验证权限" },
      { id: "execute", label: "执行工具", description: "调用 tool.execute()" },
      { id: "progress", label: "进度回调", description: "实时更新 UI" },
      { id: "result", label: "返回结果", description: "tool_result 发回模型" },
    ],
    flowConnections: [
      { from: "model", to: "dispatch" },
      { from: "dispatch", to: "permission" },
      { from: "permission", to: "execute" },
      { from: "execute", to: "progress" },
      { from: "execute", to: "result" },
    ],
    details: [
      "每个工具以独立目录存在于 tools/ 下，如 tools/BashTool/BashTool.ts，方便模块化管理。",
      "工具通过 Feature Flags 条件加载，内部用户（ant）可以访问额外工具。",
      "BashTool 是最复杂的工具，包含 20 个子模块，处理沙箱、超时、后台执行等。",
      "MCPTool 支持动态加载外部 MCP 服务器提供的工具，实现无限扩展。",
    ],
  },
  {
    slug: "commands",
    title: "命令系统",
    subtitle: "86 个 Slash 命令的注册与执行",
    icon: "Terminal",
    color: "#8B5CF6",
    overview:
      "命令系统处理用户输入的 /command 指令。所有命令注册在 commands.ts 中，每个命令以独立目录存在于 commands/ 下，包含元数据、处理逻辑和权限配置。",
    keyPoints: [
      "86 个内置命令，按目录组织",
      "命令与工具分离 — 命令面向用户，工具面向模型",
      "支持参数解析和自动补全",
      "部分命令仅内部用户可用（ant-only）",
      "命令可触发复杂工作流（如 commit-push-pr）",
    ],
    archNodes: [
      { id: "input", label: "用户输入", description: "/command args", x: 250, y: 0, color: "#8B5CF6" },
      { id: "registry", label: "commands.ts", description: "命令注册中心", x: 250, y: 100, color: "#8B5CF6" },
      { id: "session", label: "会话命令", description: "resume, teleport", x: 50, y: 250, color: "#3B82F6" },
      { id: "dev", label: "开发命令", description: "commit, review, pr", x: 200, y: 250, color: "#10B981" },
      { id: "config", label: "配置命令", description: "config, settings", x: 350, y: 250, color: "#F59E0B" },
      { id: "admin", label: "管理命令", description: "init, doctor, status", x: 500, y: 250, color: "#EF4444" },
    ],
    archEdges: [
      { source: "input", target: "registry", label: "解析" },
      { source: "registry", target: "session" },
      { source: "registry", target: "dev" },
      { source: "registry", target: "config" },
      { source: "registry", target: "admin" },
    ],
    coreFiles: [
      { path: "commands.ts", lines: 900, description: "命令注册中心，导入所有命令" },
      { path: "commands/commit/", lines: 300, description: "Git commit 命令" },
      { path: "commands/review/", lines: 400, description: "代码审查命令" },
      { path: "commands/session/", lines: 500, description: "会话管理命令" },
      { path: "commands/config/", lines: 300, description: "配置管理命令" },
      { path: "commands/mcp/", lines: 400, description: "MCP 服务器命令" },
      { path: "commands/agents/", lines: 500, description: "Agent 平台命令" },
      { path: "commands/skills/", lines: 300, description: "技能管理命令" },
    ],
    codeSnippets: [
      {
        title: "命令注册 — commands.ts",
        language: "typescript",
        code: `// commands.ts - 命令注册中心
export const commands: Command[] = [
  // 会话管理
  { name: "resume",    handler: resumeCommand,    description: "恢复之前的会话" },
  { name: "teleport",  handler: teleportCommand,  description: "传送到另一个会话" },

  // 开发工作流
  { name: "commit",    handler: commitCommand,    description: "创建 git commit" },
  { name: "review",    handler: reviewCommand,    description: "代码审查" },
  { name: "pr",        handler: prCommand,        description: "创建 Pull Request" },

  // 配置
  { name: "config",    handler: configCommand,    description: "管理配置" },
  { name: "model",     handler: modelCommand,     description: "切换模型" },
  { name: "theme",     handler: themeCommand,      description: "切换主题" },

  // 管理
  { name: "init",      handler: initCommand,      description: "初始化项目" },
  { name: "doctor",    handler: doctorCommand,     description: "诊断问题" },
  { name: "help",      handler: helpCommand,       description: "显示帮助" },
  // ... 更多命令
]`,
        description: "命令注册中心统一管理所有 slash 命令的名称、处理函数和描述。",
      },
    ],
    flowSteps: [
      { id: "input", label: "用户输入 /command", description: "在 REPL 中输入斜杠命令" },
      { id: "parse", label: "解析命令名和参数", description: "提取命令名和参数列表" },
      { id: "lookup", label: "查找命令", description: "在 commands.ts 注册表中查找" },
      { id: "validate", label: "验证权限", description: "检查命令是否可用" },
      { id: "execute", label: "执行命令", description: "调用 handler 函数" },
      { id: "output", label: "输出结果", description: "显示命令结果" },
    ],
    flowConnections: [
      { from: "input", to: "parse" },
      { from: "parse", to: "lookup" },
      { from: "lookup", to: "validate" },
      { from: "validate", to: "execute" },
      { from: "execute", to: "output" },
    ],
    details: [
      "命令和工具是两个独立的系统：命令面向用户（/commit），工具面向模型（Bash, Read 等）。",
      "部分命令如 commit-push-pr 是复合命令，串联多个操作为完整工作流。",
      "命令支持自动补全，在 REPL 中按 Tab 可以看到可用命令列表。",
    ],
  },
  {
    slug: "permissions",
    title: "权限系统",
    subtitle: "多层权限控制与分类器审批",
    icon: "Shield",
    color: "#10B981",
    overview:
      "权限系统是 Claude Code 安全架构的核心。它通过多层权限源、规则匹配和分类器审批来控制工具的执行权限，确保 AI 不会执行危险操作。",
    keyPoints: [
      "6 种权限模式：default, acceptEdits, bypassPermissions, plan, auto, bubble",
      "3 种权限行为：allow, deny, ask",
      "多层权限源：用户设置 → 项目设置 → 本地设置 → CLI 参数",
      "分类器系统 — 2 阶段（fast + thinking）自动审批",
      "危险权限剥离 — 自动移除高风险权限",
    ],
    archNodes: [
      { id: "request", label: "工具请求", description: "模型请求执行工具", x: 250, y: 0, color: "#10B981" },
      { id: "rules", label: "规则匹配", description: "多层规则合并", x: 250, y: 100, color: "#10B981" },
      { id: "user", label: "用户设置", description: "~/.claude/settings.json", x: 50, y: 200, color: "#60A5FA" },
      { id: "project", label: "项目设置", description: ".claude/settings.json", x: 200, y: 200, color: "#60A5FA" },
      { id: "local", label: "本地设置", description: ".claude/local-settings.json", x: 350, y: 200, color: "#60A5FA" },
      { id: "cli", label: "CLI 参数", description: "命令行标志", x: 500, y: 200, color: "#60A5FA" },
      { id: "decision", label: "权限决策", description: "Allow / Ask / Deny", x: 250, y: 320, color: "#F59E0B" },
      { id: "classifier", label: "分类器", description: "2 阶段自动审批", x: 450, y: 320, color: "#EC4899" },
    ],
    archEdges: [
      { source: "request", target: "rules" },
      { source: "user", target: "rules" },
      { source: "project", target: "rules" },
      { source: "local", target: "rules" },
      { source: "cli", target: "rules" },
      { source: "rules", target: "decision" },
      { source: "decision", target: "classifier", label: "ask 时" },
    ],
    coreFiles: [
      { path: "types/permissions.ts", lines: 400, description: "权限类型定义：PermissionMode、PermissionBehavior 等" },
      { path: "utils/permissions/permissions.ts", lines: 600, description: "权限检查核心逻辑" },
      { path: "utils/permissions/permissionSetup.ts", lines: 300, description: "权限上下文初始化" },
      { path: "utils/permissions/permissionExplainer.ts", lines: 200, description: "权限解释（用户可读）" },
      { path: "hooks/useCanUseTool.tsx", lines: 1500, description: "权限检查 React Hook（40K）" },
    ],
    codeSnippets: [
      {
        title: "权限模式定义",
        language: "typescript",
        code: `// types/permissions.ts
type PermissionMode =
  | 'default'           // 默认 — 每次询问
  | 'acceptEdits'       // 接受编辑 — 自动批准文件操作
  | 'bypassPermissions' // 绕过 — 全部自动批准（危险）
  | 'dontAsk'           // 不询问 — 静默拒绝
  | 'plan'              // 计划模式 — 只读，禁止修改
  | 'auto'              // 自动模式 — 分类器审批
  | 'bubble'            // 冒泡 — 向上级传递

type PermissionBehavior = 'allow' | 'deny' | 'ask'

interface PermissionRule {
  tool: string          // 工具名称匹配
  content?: string      // 内容匹配（正则）
  behavior: PermissionBehavior
  source: PermissionSource
}

// 权限决策结果
type PermissionDecision =
  | PermissionAllowDecision   // 允许（可修改输入）
  | PermissionAskDecision     // 询问用户
  | PermissionDenyDecision    // 拒绝（附原因）`,
        description: "权限系统定义了 7 种模式和 3 种行为，通过规则匹配决定每次工具调用的权限。",
      },
    ],
    flowSteps: [
      { id: "request", label: "工具调用请求", description: "模型输出 tool_use" },
      { id: "collect", label: "收集权限规则", description: "从 6 层设置源合并" },
      { id: "match", label: "规则匹配", description: "按工具名和内容匹配" },
      { id: "decide", label: "权限决策", description: "Allow / Ask / Deny" },
      { id: "classify", label: "分类器审批", description: "自动模式下 2 阶段审批" },
      { id: "execute", label: "执行或拒绝", description: "最终执行决策" },
    ],
    flowConnections: [
      { from: "request", to: "collect" },
      { from: "collect", to: "match" },
      { from: "match", to: "decide" },
      { from: "decide", to: "classify" },
      { from: "classify", to: "execute" },
    ],
    details: [
      "权限系统是 Claude Code 最重要的安全机制，防止 AI 执行危险操作（如 rm -rf, git push --force）。",
      "auto 模式使用 2 阶段分类器：先用快速分类器判断，不确定时使用思考型分类器。",
      "危险权限（如 bypassPermissions）在某些环境下会被自动剥离。",
      "每个权限决策都包含详细的来源信息，方便用户追溯。",
    ],
  },
  {
    slug: "messages",
    title: "消息与对话",
    subtitle: "消息流水线与上下文压缩",
    icon: "MessageSquare",
    color: "#F59E0B",
    overview:
      "消息系统处理用户与 Claude 之间的所有通信，包括文本消息、工具调用、系统消息等。上下文压缩系统通过 4 层策略确保对话不超过模型的上下文窗口。",
    keyPoints: [
      "消息类型：user, assistant, system, progress, tool_use, tool_result",
      "系统消息子类型：local_command, interruption, hook, notification",
      "虚拟消息 — REPL 内部调用时对用户不可见",
      "4 层上下文压缩：裁剪 → 摘要 → 截断 → 驱逐",
      "粘贴内容去重和引用系统",
    ],
    archNodes: [
      { id: "user", label: "用户输入", description: "文本/图片/文件", x: 100, y: 0, color: "#F59E0B" },
      { id: "system", label: "系统消息", description: "hooks/commands", x: 400, y: 0, color: "#6366F1" },
      { id: "pipeline", label: "消息管道", description: "处理和转换", x: 250, y: 120, color: "#F59E0B" },
      { id: "history", label: "历史管理", description: "history.ts", x: 100, y: 250, color: "#3B82F6" },
      { id: "compress", label: "上下文压缩", description: "4 层策略", x: 400, y: 250, color: "#EF4444" },
      { id: "api", label: "发送到 API", description: "Anthropic Messages API", x: 250, y: 380, color: "#EC4899" },
    ],
    archEdges: [
      { source: "user", target: "pipeline" },
      { source: "system", target: "pipeline" },
      { source: "pipeline", target: "history", label: "存储" },
      { source: "pipeline", target: "compress", label: "压缩" },
      { source: "compress", target: "api", label: "发送" },
    ],
    coreFiles: [
      { path: "types/message.ts", lines: 300, description: "消息类型定义" },
      { path: "history.ts", lines: 500, description: "会话历史管理（14K）" },
      { path: "services/compact/", lines: 1500, description: "上下文压缩服务" },
      { path: "utils/messages.ts", lines: 400, description: "消息处理工具函数" },
      { path: "query.ts", lines: 1729, description: "查询系统" },
      { path: "QueryEngine.ts", lines: 1295, description: "查询执行引擎" },
    ],
    codeSnippets: [
      {
        title: "4 层上下文压缩策略",
        language: "typescript",
        code: `// services/compact/ - 上下文压缩
// 当对话接近上下文限制时，自动触发压缩

// 第 1 层：裁剪 (Pruning)
// 移除不相关的工具结果、大型输出
function pruneMessages(messages: Message[]): Message[] {
  return messages.filter(msg => {
    // 保留最近的消息
    // 移除冗余的工具输出
    // 压缩大型文件内容
  })
}

// 第 2 层：摘要 (Summarization)
// 用 AI 生成对话摘要替换原始消息
async function summarizeMessages(messages: Message[]): Promise<Message[]> {
  const summary = await generateSummary(messages)
  return [{ role: 'system', content: summary }, ...recentMessages]
}

// 第 3 层：截断 (Truncation)
// 按大小限制截断消息内容
function truncateMessages(messages: Message[], limit: number): Message[]

// 第 4 层：驱逐 (Eviction)
// LRU 策略移除最旧的消息
function evictMessages(messages: Message[], maxTokens: number): Message[]`,
        description: "4 层渐进式压缩确保对话始终在上下文窗口内，同时保留最重要的信息。",
      },
    ],
    flowSteps: [
      { id: "input", label: "用户/系统消息", description: "新消息进入管道" },
      { id: "process", label: "消息处理", description: "类型标注、附件解析" },
      { id: "store", label: "历史存储", description: "持久化到会话文件" },
      { id: "check", label: "检查上下文", description: "是否接近限制" },
      { id: "compress", label: "压缩", description: "4 层渐进压缩" },
      { id: "send", label: "发送 API", description: "带上下文发送请求" },
    ],
    flowConnections: [
      { from: "input", to: "process" },
      { from: "process", to: "store" },
      { from: "store", to: "check" },
      { from: "check", to: "compress" },
      { from: "compress", to: "send" },
    ],
    details: [
      "消息系统是 Claude Code 的通信中枢，所有用户交互和模型响应都通过它流转。",
      "上下文压缩是保证长对话可用性的关键：对话越长，越早的内容会被逐步压缩和摘要化。",
      "粘贴内容通过引用系统去重，避免大量重复文本占用上下文窗口。",
    ],
  },
  {
    slug: "hooks",
    title: "Hook 系统",
    subtitle: "生命周期钩子与事件驱动扩展",
    icon: "Anchor",
    color: "#6366F1",
    overview:
      "Hook 系统提供事件驱动的扩展机制，允许用户在 Claude Code 的关键生命周期点注入自定义逻辑。通过 settings.json 配置 shell 命令，在特定事件触发时执行。",
    keyPoints: [
      "11 种生命周期事件：SessionStart, PreToolUse, PostToolUse 等",
      "通过 settings.json 配置，由 harness 执行",
      "支持同步和异步响应",
      "可修改工具输入/输出、设置权限",
      "超时保护机制",
    ],
    archNodes: [
      { id: "event", label: "生命周期事件", description: "触发钩子", x: 250, y: 0, color: "#6366F1" },
      { id: "config", label: "Hook 配置", description: "settings.json", x: 250, y: 100, color: "#6366F1" },
      { id: "pre", label: "PreToolUse", description: "工具执行前", x: 50, y: 250, color: "#3B82F6" },
      { id: "post", label: "PostToolUse", description: "工具执行后", x: 200, y: 250, color: "#10B981" },
      { id: "session", label: "SessionStart", description: "会话开始", x: 350, y: 250, color: "#F59E0B" },
      { id: "prompt", label: "UserPromptSubmit", description: "用户提交", x: 500, y: 250, color: "#EF4444" },
    ],
    archEdges: [
      { source: "event", target: "config", label: "查找" },
      { source: "config", target: "pre" },
      { source: "config", target: "post" },
      { source: "config", target: "session" },
      { source: "config", target: "prompt" },
    ],
    coreFiles: [
      { path: "types/hooks.ts", lines: 500, description: "Hook 类型定义和 Zod Schema" },
      { path: "utils/hooks/hooksConfigManager.ts", lines: 400, description: "Hook 配置管理" },
      { path: "utils/hooks/hookEvents.ts", lines: 300, description: "Hook 事件追踪" },
      { path: "utils/hooks/hookHelpers.ts", lines: 200, description: "Hook 工具函数" },
    ],
    codeSnippets: [
      {
        title: "Hook 事件类型定义",
        language: "typescript",
        code: `// types/hooks.ts - Hook 事件类型
type HookEvent =
  | 'SessionStart'        // 会话初始化
  | 'Setup'               // 初始设置
  | 'PreToolUse'          // 工具执行前（可修改输入/设置权限）
  | 'PostToolUse'         // 工具执行后（可修改输出）
  | 'PostToolUseFailure'  // 工具执行失败
  | 'UserPromptSubmit'    // 用户提交输入
  | 'PermissionRequest'   // 权限检查时
  | 'PermissionDenied'    // 权限被拒绝时
  | 'Notification'        // 通知事件
  | 'CwdChanged'          // 工作目录变更
  | 'FileChanged'         // 文件变更

// settings.json 中的 Hook 配置示例
// {
//   "hooks": {
//     "PreToolUse": [{
//       "matcher": "Bash",
//       "command": "echo 'About to run bash'",
//       "timeout": 5000
//     }],
//     "PostToolUse": [{
//       "command": "my-audit-logger.sh",
//       "timeout": 10000
//     }]
//   }
// }`,
        description: "11 种生命周期事件覆盖了 Claude Code 的完整工作流程，从会话开始到工具执行。",
      },
    ],
    flowSteps: [
      { id: "trigger", label: "事件触发", description: "如工具即将执行" },
      { id: "lookup", label: "查找 Hook", description: "在 settings.json 中查找匹配的 Hook" },
      { id: "execute", label: "执行 Hook", description: "运行 shell 命令" },
      { id: "response", label: "处理响应", description: "修改输入/输出/权限" },
      { id: "continue", label: "继续执行", description: "Hook 处理完毕，继续主流程" },
    ],
    flowConnections: [
      { from: "trigger", to: "lookup" },
      { from: "lookup", to: "execute" },
      { from: "execute", to: "response" },
      { from: "response", to: "continue" },
    ],
    details: [
      "Hook 是 Claude Code 的主要扩展机制，替代了传统插件系统。",
      "PreToolUse Hook 可以修改工具输入或直接设置权限（allow/deny），实现自定义安全策略。",
      "PostToolUse Hook 可以审计工具执行结果，实现合规日志记录。",
      "所有 Hook 都有超时保护，防止挂起阻塞主流程。",
    ],
  },
  {
    slug: "mcp",
    title: "MCP 集成",
    subtitle: "Model Context Protocol 客户端与服务器管理",
    icon: "Plug",
    color: "#EC4899",
    overview:
      "MCP (Model Context Protocol) 是 Claude Code 连接外部工具和资源的标准协议。它支持多种 MCP 服务器类型，实现了工具发现、资源访问和权限管理。",
    keyPoints: [
      "支持内置、用户配置、NPM 安装、项目级 MCP 服务器",
      "22 个 MCP 专用文件",
      "WebSocket 传输层",
      "通道白名单和权限控制",
      "动态工具注册 — MCP 工具自动可用",
    ],
    archNodes: [
      { id: "claude", label: "Claude Code", description: "MCP 客户端", x: 250, y: 0, color: "#EC4899" },
      { id: "manager", label: "ConnectionManager", description: "连接管理", x: 250, y: 100, color: "#EC4899" },
      { id: "builtin", label: "内置服务器", description: "Chrome, Computer Use", x: 50, y: 250, color: "#3B82F6" },
      { id: "user", label: "用户配置", description: "settings.json", x: 200, y: 250, color: "#10B981" },
      { id: "npm", label: "NPM 插件", description: "已安装插件", x: 350, y: 250, color: "#F59E0B" },
      { id: "project", label: "项目级", description: "claude_mcp.json", x: 500, y: 250, color: "#8B5CF6" },
    ],
    archEdges: [
      { source: "claude", target: "manager", label: "管理" },
      { source: "manager", target: "builtin" },
      { source: "manager", target: "user" },
      { source: "manager", target: "npm" },
      { source: "manager", target: "project" },
    ],
    coreFiles: [
      { path: "services/mcp/client.ts", lines: 500, description: "MCP 客户端接口" },
      { path: "services/mcp/config.ts", lines: 600, description: "MCP 配置解析和管理" },
      { path: "services/mcp/MCPConnectionManager.tsx", lines: 800, description: "连接状态管理" },
      { path: "services/mcp/types.ts", lines: 300, description: "MCP 类型定义" },
      { path: "services/mcp/channelAllowlist.ts", lines: 200, description: "通道白名单" },
      { path: "services/mcp/channelPermissions.ts", lines: 300, description: "通道权限" },
      { path: "tools/MCPTool/MCPTool.ts", lines: 500, description: "MCP 工具执行" },
      { path: "utils/mcpWebSocketTransport.ts", lines: 400, description: "WebSocket 传输" },
    ],
    codeSnippets: [
      {
        title: "MCP 服务器配置示例",
        language: "json",
        code: `// settings.json 或 claude_mcp.json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_..."
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-filesystem", "/path/to/dir"]
    },
    "custom-api": {
      "url": "ws://localhost:8080/mcp",
      "transport": "websocket"
    }
  }
}`,
        description: "MCP 服务器支持命令行启动和 WebSocket 连接两种方式。",
      },
    ],
    flowSteps: [
      { id: "config", label: "加载配置", description: "解析 MCP 服务器配置" },
      { id: "connect", label: "建立连接", description: "启动进程或 WebSocket" },
      { id: "discover", label: "工具发现", description: "获取可用工具列表" },
      { id: "register", label: "注册工具", description: "添加到工具注册中心" },
      { id: "use", label: "使用工具", description: "模型调用 MCP 工具" },
      { id: "result", label: "返回结果", description: "MCP 结果返回模型" },
    ],
    flowConnections: [
      { from: "config", to: "connect" },
      { from: "connect", to: "discover" },
      { from: "discover", to: "register" },
      { from: "register", to: "use" },
      { from: "use", to: "result" },
    ],
    details: [
      "MCP 让 Claude Code 能够无限扩展工具能力，连接到任何实现了 MCP 协议的服务器。",
      "内置服务器包括 Chrome 集成和 Computer Use（计算机控制），无需额外配置。",
      "通道白名单和权限系统确保 MCP 工具的安全使用。",
      "MCP 输出会被缓存到 mcpOutputStorage，提高重复调用的效率。",
    ],
  },
  {
    slug: "agent",
    title: "Agent/子代理",
    subtitle: "多代理协调与 KAIROS 自主规划",
    icon: "Users",
    color: "#8B5CF6",
    overview:
      "Agent 系统支持 Claude Code 创建子代理来并行处理复杂任务。AgentTool 是核心组件，支持内置代理、自定义代理和异步代理。KAIROS 系统则提供自主多步规划能力。",
    keyPoints: [
      "AgentTool — 子代理分叉、内存管理、颜色编码",
      "支持内置代理、自定义代理（.claude/agents/）、异步代理",
      "Swarm 框架 — 多代理协调工作流",
      "KAIROS — 自主多步规划和自我反思",
      "Worktree 隔离 — 每个代理可在独立 git worktree 中工作",
    ],
    archNodes: [
      { id: "main", label: "主代理", description: "Claude Code 主进程", x: 250, y: 0, color: "#8B5CF6" },
      { id: "tool", label: "AgentTool", description: "子代理编排", x: 250, y: 100, color: "#8B5CF6" },
      { id: "builtin", label: "内置代理", description: "Explore, Plan 等", x: 50, y: 250, color: "#3B82F6" },
      { id: "custom", label: "自定义代理", description: ".claude/agents/", x: 200, y: 250, color: "#10B981" },
      { id: "async", label: "异步代理", description: "后台执行", x: 350, y: 250, color: "#F59E0B" },
      { id: "kairos", label: "KAIROS", description: "自主规划", x: 500, y: 250, color: "#EF4444" },
      { id: "swarm", label: "Swarm", description: "多代理协调", x: 250, y: 380, color: "#EC4899" },
    ],
    archEdges: [
      { source: "main", target: "tool", label: "创建" },
      { source: "tool", target: "builtin" },
      { source: "tool", target: "custom" },
      { source: "tool", target: "async" },
      { source: "tool", target: "kairos" },
      { source: "kairos", target: "swarm", label: "协调" },
    ],
    coreFiles: [
      { path: "tools/AgentTool/AgentTool.ts", lines: 600, description: "Agent 工具主实现" },
      { path: "tools/AgentTool/forkSubagent.ts", lines: 400, description: "子代理分叉逻辑" },
      { path: "tools/AgentTool/agentMemory.ts", lines: 300, description: "代理内存管理" },
      { path: "tools/AgentTool/agentColorManager.ts", lines: 200, description: "颜色编码显示" },
      { path: "utils/coordinator/", lines: 1000, description: "KAIROS 协调器" },
      { path: "utils/swarm/", lines: 800, description: "Swarm 多代理框架" },
      { path: "commands/agents/", lines: 500, description: "Agent 管理命令" },
    ],
    codeSnippets: [
      {
        title: "AgentTool — 子代理分叉",
        language: "typescript",
        code: `// tools/AgentTool/AgentTool.ts - 简化版
export const AgentTool: Tool = {
  name: "Agent",
  description: "启动子代理处理复杂任务",
  inputSchema: {
    type: "object",
    properties: {
      prompt: { type: "string", description: "任务描述" },
      subagent_type: { type: "string", enum: ["general", "Explore", "Plan"] },
      isolation: { type: "string", enum: ["worktree"] },
      run_in_background: { type: "boolean" }
    },
    required: ["prompt"]
  },

  async execute(input, context) {
    // 1. 创建子代理环境
    const agentEnv = createAgentEnvironment({
      type: input.subagent_type || 'general',
      isolation: input.isolation,
      workingDirectory: context.workingDirectory
    })

    // 2. 分叉子代理
    const result = await forkSubagent({
      prompt: input.prompt,
      environment: agentEnv,
      background: input.run_in_background
    })

    // 3. 返回结果
    return { output: result.response }
  }
}`,
        description: "AgentTool 支持创建不同类型的子代理，可选择在 worktree 中隔离运行。",
      },
    ],
    flowSteps: [
      { id: "request", label: "主代理请求", description: "需要并行处理的任务" },
      { id: "create", label: "创建子代理", description: "分叉新进程" },
      { id: "isolate", label: "环境隔离", description: "可选 worktree 隔离" },
      { id: "execute", label: "执行任务", description: "子代理独立工作" },
      { id: "report", label: "汇报结果", description: "返回到主代理" },
    ],
    flowConnections: [
      { from: "request", to: "create" },
      { from: "create", to: "isolate" },
      { from: "isolate", to: "execute" },
      { from: "execute", to: "report" },
    ],
    details: [
      "子代理是 Claude Code 处理复杂任务的关键机制 — 将大任务分解为可并行的小任务。",
      "Explore 类型代理专门用于快速搜索代码库，Plan 类型用于设计实现方案。",
      "KAIROS (coordinator) 是高级自主规划系统，支持多步规划和自我反思循环。",
      "Swarm 框架支持多个代理之间的消息传递和协调。",
    ],
  },
  {
    slug: "state",
    title: "状态管理",
    subtitle: "React Context、Store 与观察者模式",
    icon: "Database",
    color: "#14B8A6",
    overview:
      "状态管理系统使用 React Context + Store 模式，集中管理应用状态。AppState 是核心，包含消息、工具状态、UI 状态、设置等。变更通过观察者模式通知所有订阅者。",
    keyPoints: [
      "AppState — 中央 React Context",
      "AppStateStore — 持久化 Store",
      "onChangeAppState — 观察者模式",
      "不可变更新 — setAppState 回调",
      "Selector 模式 — 精确订阅状态片段",
    ],
    archNodes: [
      { id: "state", label: "AppState", description: "中央状态", x: 250, y: 0, color: "#14B8A6" },
      { id: "store", label: "AppStateStore", description: "持久化", x: 100, y: 120, color: "#14B8A6" },
      { id: "observers", label: "观察者", description: "变更通知", x: 400, y: 120, color: "#F59E0B" },
      { id: "messages", label: "消息状态", description: "对话历史", x: 50, y: 270, color: "#3B82F6" },
      { id: "tools", label: "工具状态", description: "执行进度", x: 200, y: 270, color: "#EF4444" },
      { id: "ui", label: "UI 状态", description: "界面状态", x: 350, y: 270, color: "#10B981" },
      { id: "settings", label: "设置状态", description: "配置数据", x: 500, y: 270, color: "#8B5CF6" },
    ],
    archEdges: [
      { source: "state", target: "store", label: "持久化" },
      { source: "state", target: "observers", label: "通知" },
      { source: "state", target: "messages" },
      { source: "state", target: "tools" },
      { source: "state", target: "ui" },
      { source: "state", target: "settings" },
    ],
    coreFiles: [
      { path: "state/AppState.tsx", lines: 500, description: "中央 React Context" },
      { path: "state/AppStateStore.ts", lines: 400, description: "持久化 Store" },
      { path: "state/store.ts", lines: 300, description: "Redux-like Store" },
      { path: "state/onChangeAppState.ts", lines: 200, description: "变更观察者" },
      { path: "state/selectors.ts", lines: 300, description: "状态选择器" },
    ],
    codeSnippets: [
      {
        title: "AppState 核心结构",
        language: "typescript",
        code: `// state/AppState.tsx - 简化版
interface AppState {
  // 消息
  messages: Message[]
  currentToolUses: Map<string, ToolUseState>

  // UI
  isLoading: boolean
  activeOverlay: OverlayType | null

  // 设置
  settings: Settings
  permissions: PermissionContext

  // Agent
  subagents: Map<string, SubagentState>

  // 订阅
  subscription: SubscriptionState
}

// 不可变更新
function setAppState(updater: (prev: AppState) => AppState) {
  const next = updater(currentState)
  currentState = next
  // 通知所有观察者
  observers.forEach(fn => fn(next))
}

// 选择器 — 精确订阅
function useAppState<T>(selector: (state: AppState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getState())
  )
}`,
        description: "AppState 使用不可变更新和观察者模式，支持精确的状态订阅。",
      },
    ],
    flowSteps: [
      { id: "action", label: "状态变更", description: "用户操作或工具执行" },
      { id: "update", label: "setAppState", description: "不可变更新函数" },
      { id: "notify", label: "通知观察者", description: "触发所有订阅回调" },
      { id: "render", label: "重新渲染", description: "UI 组件更新" },
      { id: "persist", label: "持久化", description: "Store 写入磁盘" },
    ],
    flowConnections: [
      { from: "action", to: "update" },
      { from: "update", to: "notify" },
      { from: "notify", to: "render" },
      { from: "notify", to: "persist" },
    ],
    details: [
      "AppState 是 Claude Code 的单一数据源，所有 UI 组件从中读取状态。",
      "不可变更新确保了状态变更的可追踪性和 React 渲染的正确性。",
      "观察者模式允许非 React 代码（如服务层）响应状态变更。",
    ],
  },
  {
    slug: "bridge",
    title: "Bridge/IDE 集成",
    subtitle: "REPL Bridge、远程控制与会话管理",
    icon: "Monitor",
    color: "#0EA5E9",
    overview:
      "Bridge 系统让 Claude Code 能与 IDE（VS Code、JetBrains）集成，并支持远程控制。它通过 REPL Bridge 传输层在本地进程和 IDE 之间双向通信。",
    keyPoints: [
      "bridgeMain.ts — 115K 主事件循环",
      "replBridge.ts — 100K REPL 通信层",
      "多会话支持 — single-session, worktree, same-dir",
      "WebSocket 消息路由",
      "设备信任与会话认证",
    ],
    archNodes: [
      { id: "ide", label: "IDE 扩展", description: "VS Code / JetBrains", x: 100, y: 0, color: "#0EA5E9" },
      { id: "cloud", label: "Cloud API", description: "远程控制", x: 400, y: 0, color: "#0EA5E9" },
      { id: "bridge", label: "Bridge 主循环", description: "bridgeMain.ts", x: 250, y: 120, color: "#0EA5E9" },
      { id: "repl", label: "REPL Bridge", description: "replBridge.ts", x: 100, y: 270, color: "#3B82F6" },
      { id: "session", label: "Session Runner", description: "会话管理", x: 400, y: 270, color: "#10B981" },
      { id: "local", label: "本地 Claude", description: "Claude Code 进程", x: 250, y: 400, color: "#F59E0B" },
    ],
    archEdges: [
      { source: "ide", target: "bridge", label: "连接" },
      { source: "cloud", target: "bridge", label: "轮询" },
      { source: "bridge", target: "repl", label: "通信" },
      { source: "bridge", target: "session", label: "管理" },
      { source: "session", target: "local", label: "启动" },
    ],
    coreFiles: [
      { path: "bridge/bridgeMain.ts", lines: 3500, description: "Bridge 主事件循环（115K）" },
      { path: "bridge/replBridge.ts", lines: 3000, description: "REPL Bridge 通信（100K）" },
      { path: "bridge/remoteBridgeCore.ts", lines: 1200, description: "远程 Bridge 核心（39K）" },
      { path: "bridge/bridgeApi.ts", lines: 600, description: "Bridge API 客户端" },
      { path: "bridge/sessionRunner.ts", lines: 500, description: "会话执行器" },
      { path: "bridge/types.ts", lines: 400, description: "Bridge 类型定义" },
    ],
    codeSnippets: [
      {
        title: "Bridge 工作流程",
        language: "typescript",
        code: `// bridge/bridgeMain.ts - 简化的主循环
async function bridgeMainLoop() {
  // 1. 注册环境
  await registerEnvironment({
    workingDirectory: process.cwd(),
    capabilities: getCapabilities()
  })

  // 2. 轮询任务
  while (true) {
    const work = await pollForWork('/worker/work')

    if (work.type === 'new_session') {
      // 3. 启动本地 Claude 进程
      const session = await spawnSession({
        mode: work.spawnMode,  // 'single-session' | 'worktree' | 'same-dir'
        goal: work.goal,
        environment: work.env
      })

      // 4. WebSocket 双向转发消息
      forwardMessages(session, work.websocket)

      // 5. 处理权限响应
      handlePermissionResponses(session, work)
    }

    // 6. 归档完成的会话
    await archiveCompletedSessions()
  }
}`,
        description: "Bridge 通过轮询任务、启动本地进程、双向转发消息来实现 IDE 集成。",
      },
    ],
    flowSteps: [
      { id: "register", label: "注册环境", description: "Bridge 向后端注册" },
      { id: "poll", label: "轮询任务", description: "获取新会话请求" },
      { id: "spawn", label: "启动进程", description: "创建本地 Claude 实例" },
      { id: "forward", label: "消息转发", description: "WebSocket 双向通信" },
      { id: "permission", label: "权限处理", description: "转发权限请求和响应" },
      { id: "archive", label: "归档", description: "会话完成后归档" },
    ],
    flowConnections: [
      { from: "register", to: "poll" },
      { from: "poll", to: "spawn" },
      { from: "spawn", to: "forward" },
      { from: "forward", to: "permission" },
      { from: "permission", to: "archive" },
    ],
    details: [
      "Bridge 是 Claude Code IDE 集成的核心，bridgeMain.ts 和 replBridge.ts 共约 215K，是代码量最大的模块。",
      "支持 3 种会话模式：single-session（单会话）、worktree（Git Worktree 隔离）、same-dir（同目录）。",
      "设备信任机制确保只有授权设备可以通过 Bridge 执行操作。",
    ],
  },
  {
    slug: "skills",
    title: "技能与插件",
    subtitle: "Skill 加载、内置技能与 MCP 技能构建",
    icon: "Sparkles",
    color: "#D946EF",
    overview:
      "技能系统让用户可以通过 /command 形式触发预定义的提示词模板。支持内置技能、用户自定义技能和从 MCP 服务器动态生成的技能。",
    keyPoints: [
      "19 个内置技能（commit, review, simplify 等）",
      "动态加载 — 从目录和 MCP 服务器发现",
      "Skill = 提示词模板 + 触发规则",
      "支持参数传递",
      "可通过 settings.json 配置",
    ],
    archNodes: [
      { id: "user", label: "用户输入", description: "/skill-name args", x: 250, y: 0, color: "#D946EF" },
      { id: "loader", label: "Skill Loader", description: "技能发现与加载", x: 250, y: 100, color: "#D946EF" },
      { id: "bundled", label: "内置技能", description: "19 个预置", x: 100, y: 250, color: "#3B82F6" },
      { id: "custom", label: "自定义技能", description: "用户目录", x: 250, y: 250, color: "#10B981" },
      { id: "mcp", label: "MCP 技能", description: "动态生成", x: 400, y: 250, color: "#F59E0B" },
      { id: "execute", label: "执行", description: "展开模板并执行", x: 250, y: 380, color: "#EF4444" },
    ],
    archEdges: [
      { source: "user", target: "loader", label: "触发" },
      { source: "loader", target: "bundled" },
      { source: "loader", target: "custom" },
      { source: "loader", target: "mcp" },
      { source: "bundled", target: "execute" },
      { source: "custom", target: "execute" },
      { source: "mcp", target: "execute" },
    ],
    coreFiles: [
      { path: "skills/loadSkillsDir.ts", lines: 1000, description: "技能发现和加载（34K）" },
      { path: "skills/bundled/", lines: 800, description: "内置技能定义" },
      { path: "skills/mcpSkillBuilders.ts", lines: 400, description: "MCP 技能构建器" },
      { path: "skills/bundledSkills.ts", lines: 300, description: "技能加载器" },
      { path: "tools/SkillTool/", lines: 400, description: "Skill 执行工具" },
    ],
    codeSnippets: [
      {
        title: "内置技能示例 — commit",
        language: "typescript",
        code: `// skills/bundled/commit.ts
export const commitSkill: Skill = {
  name: "commit",
  description: "创建 git commit",
  trigger: "user-invocable",  // 用户可直接调用

  // 技能本质上是提示词模板
  prompt: \`请帮我创建一个 git commit。
1. 运行 git status 和 git diff 查看变更
2. 分析变更内容，撰写简洁的 commit message
3. 创建 commit

规则：
- 不要使用 --no-verify
- commit message 聚焦于"为什么"而非"做了什么"
- 末尾添加 Co-Authored-By\`,

  // 自动触发条件（可选）
  autoTrigger: {
    match: "user asks to commit",
    confidence: 0.8
  }
}`,
        description: "技能本质上是预定义的提示词模板，封装了最佳实践和工作流。",
      },
    ],
    flowSteps: [
      { id: "trigger", label: "触发技能", description: "用户输入 /skill-name" },
      { id: "resolve", label: "解析技能", description: "查找匹配的技能定义" },
      { id: "expand", label: "展开模板", description: "注入参数到提示词" },
      { id: "execute", label: "执行", description: "将提示词发送给模型" },
    ],
    flowConnections: [
      { from: "trigger", to: "resolve" },
      { from: "resolve", to: "expand" },
      { from: "expand", to: "execute" },
    ],
    details: [
      "技能是 Claude Code 的用户友好扩展机制 — 比 Hook 更简单，直接通过 /command 触发。",
      "内置技能包括 commit、review、simplify 等常用开发工作流。",
      "MCP 技能构建器可以将 MCP 服务器的工具自动包装为可调用的技能。",
    ],
  },
  {
    slug: "special",
    title: "特色功能",
    subtitle: "Buddy 宠物、Vim 模式、语音交互与反蒸馏",
    icon: "Star",
    color: "#F59E0B",
    overview:
      "Claude Code 包含多个有趣和独特的功能：Buddy 虚拟宠物系统、完整的 Vim 键绑定支持、语音交互模式，以及防止模型输出被用于蒸馏的保护措施。",
    keyPoints: [
      "Buddy — 18 种物种的 Tamagotchi 宠物系统（1% 传奇，0.01% 闪光传奇）",
      "Vim 模式 — 完整 Vim 键绑定支持",
      "语音交互 — 语音输入和转录",
      "反蒸馏 — 输出样式剥离、undercover 模式",
      "Cron 调度 — 定时任务系统",
    ],
    archNodes: [
      { id: "buddy", label: "Buddy 宠物", description: "18 种物种", x: 100, y: 0, color: "#F59E0B" },
      { id: "vim", label: "Vim 模式", description: "键绑定", x: 300, y: 0, color: "#10B981" },
      { id: "voice", label: "语音", description: "语音交互", x: 500, y: 0, color: "#3B82F6" },
      { id: "anti", label: "反蒸馏", description: "输出保护", x: 100, y: 180, color: "#EF4444" },
      { id: "cron", label: "Cron 调度", description: "定时任务", x: 300, y: 180, color: "#8B5CF6" },
      { id: "ultra", label: "UltraPlan", description: "超级规划", x: 500, y: 180, color: "#EC4899" },
    ],
    archEdges: [],
    coreFiles: [
      { path: "utils/buddy/", lines: 800, description: "Buddy 宠物系统（18 种物种，ASCII 艺术）" },
      { path: "utils/vim/", lines: 600, description: "Vim 键绑定实现" },
      { path: "services/voice.ts", lines: 400, description: "语音交互服务" },
      { path: "utils/undercover.ts", lines: 200, description: "反蒸馏保护" },
      { path: "utils/cronScheduler.ts", lines: 700, description: "Cron 调度器" },
      { path: "commands/ultraplan.tsx", lines: 500, description: "UltraPlan UI" },
    ],
    codeSnippets: [
      {
        title: "Buddy 宠物系统",
        language: "typescript",
        code: `// utils/buddy/ - Tamagotchi 宠物系统
interface Buddy {
  species: BuddySpecies     // 18 种物种
  name: string
  rarity: Rarity            // common, rare, legendary, shiny_legendary
  stats: {
    happiness: number       // 0-100
    energy: number
    hunger: number
    experience: number
    level: number
  }
  asciiArt: string          // ASCII 艺术图
}

// 稀有度概率
const RARITY_RATES = {
  common: 0.7,              // 70%
  rare: 0.29,               // 29%
  legendary: 0.01,          // 1%
  shiny_legendary: 0.0001   // 0.01%
}

// 每次用户使用 Claude Code 时，Buddy 会获得经验值
function onUserInteraction(buddy: Buddy) {
  buddy.stats.experience += 10
  if (buddy.stats.experience >= levelThreshold(buddy.stats.level)) {
    buddy.stats.level++
    showLevelUpAnimation(buddy)
  }
}`,
        description: "Buddy 是隐藏的 Tamagotchi 宠物系统，有 18 种物种和极低概率的闪光传奇。",
      },
      {
        title: "反蒸馏保护",
        language: "typescript",
        code: `// utils/undercover.ts
// 防止模型输出被用于训练竞争模型

// 输出样式处理器：
// 1. 剥离工具列表 — 不暴露内部工具名称
// 2. 剥离模型信息 — 不暴露模型 ID 和配置
// 3. 剥离 thinking 内容 — 不暴露推理过程
// 4. 模型代号管理 — 使用代号而非真实模型名

// "Do not blow your cover"
// 确保 Claude 在输出中不会泄露其系统提示词
// 或内部工具的实现细节`,
        description: "反蒸馏措施保护 Claude Code 的实现细节不被用于训练竞争模型。",
      },
    ],
    flowSteps: [
      { id: "feature", label: "特色功能", description: "独立的子系统" },
      { id: "buddy", label: "Buddy", description: "宠物陪伴用户" },
      { id: "vim", label: "Vim 模式", description: "高效键盘操作" },
      { id: "voice", label: "语音交互", description: "语音输入命令" },
    ],
    flowConnections: [
      { from: "feature", to: "buddy" },
      { from: "feature", to: "vim" },
      { from: "feature", to: "voice" },
    ],
    details: [
      "Buddy 宠物系统是 Claude Code 的彩蛋之一，为长期用户提供趣味性。",
      "Vim 模式支持完整的 Vim 键绑定，让 Vim 用户感到宾至如归。",
      "反蒸馏是商业保护措施，防止竞争对手通过分析输出来训练类似模型。",
      "Cron 调度器支持在后台定时执行任务，如定期检查部署状态。",
    ],
  },
];

export function getChapterBySlug(slug: string): Chapter | undefined {
  return chapters.find((c) => c.slug === slug);
}

export function getAllChapterSlugs(): string[] {
  return chapters.map((c) => c.slug);
}
