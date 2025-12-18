# Design Document: 川味-傣味主题系统

## Overview

本设计将现有的 light/dark 主题系统改造为「川味（Sichuan）」和「傣味（Yunnan）」两套餐饮风格主题。基于现有的 next-themes + Tailwind CSS v4 + CSS 变量架构，通过修改 CSS 变量定义和主题切换组件来实现。

## Architecture

```mermaid
graph TB
    subgraph "Theme System"
        TP[ThemeProvider<br/>next-themes]
        TT[ThemeToggle<br/>切换组件]
        CSS[globals.css<br/>CSS 变量定义]
    end
    
    subgraph "Themes"
        SC[.sichuan<br/>川味主题]
        YN[.yunnan<br/>傣味主题]
    end
    
    subgraph "Consumers"
        UI[UI Components]
        TW[Tailwind Classes]
    end
    
    TP --> |attribute="class"| SC
    TP --> |attribute="class"| YN
    TT --> |setTheme| TP
    CSS --> SC
    CSS --> YN
    SC --> |CSS Variables| UI
    YN --> |CSS Variables| UI
    SC --> |@theme inline| TW
    YN --> |@theme inline| TW
```

### 技术方案

1. **主题标识**: 使用 `sichuan` 和 `yunnan` 作为主题名称（替代 `light` 和 `dark`）
2. **CSS 选择器**: 使用 `.sichuan` 和 `.yunnan` 类名（通过 next-themes 的 `attribute="class"` 实现）
3. **默认主题**: 川味主题（sichuan）作为默认
4. **持久化**: 利用 next-themes 内置的 localStorage 持久化

## Components and Interfaces

### 1. ThemeProvider 配置更新

```typescript
// src/app/[locale]/layout.tsx
<ThemeProvider
  attribute="class"
  defaultTheme="sichuan"
  themes={["sichuan", "yunnan"]}
  disableTransitionOnChange
>
```

### 2. ThemeToggle 组件接口

```typescript
// src/components/theme/theme-toggle.tsx
interface ThemeToggleProps {
  className?: string;
}

// 主题配置
const themeConfig = {
  sichuan: {
    icon: Flame,      // lucide-react 火焰图标
    label: "川味主题",
    next: "yunnan"
  },
  yunnan: {
    icon: Leaf,       // lucide-react 叶子图标  
    label: "傣味主题",
    next: "sichuan"
  }
};
```

## Data Models

### 主题颜色令牌定义

#### 川味主题（Sichuan）色值

| Token | HEX | 用途 |
|-------|-----|------|
| --primary | #8C1D18 | 主色/品牌红 |
| --primary-foreground | #FFFFFF | 主色上的文字 |
| --secondary | #B1120A | 强调红/辣椒红 |
| --secondary-foreground | #FFFFFF | 强调色上的文字 |
| --accent | #5A0F0C | 深红/酱红 |
| --accent-foreground | #FFFFFF | 深红上的文字 |
| --background | #FAF7F2 | 米白底色 |
| --foreground | #2B2B2B | 深炭灰正文 |
| --muted | #F7E6E4 | 浅红背景 |
| --muted-foreground | #6B6B6B | 次级文字灰 |
| --border | #E5E0DA | 分割线/边框 |
| --input | #E5E0DA | 输入框边框 |
| --ring | #8C1D18 | 焦点环 |
| --destructive | #B1120A | 危险/删除 |
| --success | #28A745 | 成功绿 |
| --warning | #FFC107 | 警告黄 |
| --info | #16A2B7 | 信息青 |

#### 傣味主题（Yunnan）色值

| Token | HEX | 用途 |
|-------|-----|------|
| --primary | #2F8F6B | 主色/品牌绿 |
| --primary-foreground | #FFFFFF | 主色上的文字 |
| --secondary | #3FB28A | 强调绿/薄荷绿 |
| --secondary-foreground | #FFFFFF | 强调色上的文字 |
| --accent | #1E5E46 | 深绿/森林绿 |
| --accent-foreground | #FFFFFF | 深绿上的文字 |
| --background | #F6FBF8 | 暖白底色 |
| --foreground | #263332 | 深灰正文 |
| --muted | #E8F5EF | 浅绿背景 |
| --muted-foreground | #6C7F79 | 次级文字 |
| --border | #DDEAE3 | 分割线/边框 |
| --input | #DDEAE3 | 输入框边框 |
| --ring | #2F8F6B | 焦点环 |
| --destructive | #DC3545 | 危险/删除 |
| --success | #2F8F6B | 成功绿（与主色一致） |
| --warning | #FFC107 | 警告黄 |
| --info | #16A2B7 | 信息青 |

### 图表配色

#### 川味图表色

| Token | HEX | 说明 |
|-------|-----|------|
| --chart-1 | #8C1D18 | 主红 |
| --chart-2 | #B1120A | 辣椒红 |
| --chart-3 | #D43C2C | 亮红 |
| --chart-4 | #5A0F0C | 深红 |
| --chart-5 | #FFC107 | 点缀黄 |

#### 傣味图表色

| Token | HEX | 说明 |
|-------|-----|------|
| --chart-1 | #2F8F6B | 主绿 |
| --chart-2 | #3FB28A | 薄荷绿 |
| --chart-3 | #5BC4A1 | 亮绿 |
| --chart-4 | #1E5E46 | 深绿 |
| --chart-5 | #FFC107 | 点缀黄 |



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: 主题切换正确性

*For any* 当前主题状态，当用户触发主题切换时，document 的 class 应该正确切换到目标主题，且所有 CSS 变量应该立即更新为目标主题的值。

**Validates: Requirements 1.1, 1.2**

### Property 2: 主题持久化一致性

*For any* 用户选择的主题，该主题值应该被存储到 localStorage，且在页面重新加载后，主题状态应该与存储的值一致。

**Validates: Requirements 1.3**

### Property 3: 川味主题颜色正确性

*For any* 激活川味主题的状态，所有核心 CSS 变量（primary、secondary、accent、background、foreground、muted-foreground、border）的计算值应该与设计规范中定义的 HEX 值一致。

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**

### Property 4: 傣味主题颜色正确性

*For any* 激活傣味主题的状态，所有核心 CSS 变量（primary、secondary、accent、background、foreground、muted-foreground、border）的计算值应该与设计规范中定义的 HEX 值一致。

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

### Property 5: 颜色变量完整性

*For any* 主题（sichuan 或 yunnan），该主题应该定义完整的颜色变量集，包括：语义化颜色（success、warning、info、destructive）、组件颜色（card、popover、sidebar 及其 foreground）、图表颜色（chart-1 至 chart-5）。

**Validates: Requirements 4.1, 4.2, 4.3**

### Property 6: 颜色对比度可访问性

*For any* 主题中的前景色/背景色配对（foreground/background、primary-foreground/primary 等），其对比度应该满足 WCAG 2.1 AA 标准（普通文本 4.5:1，大文本 3:1）。

**Validates: Requirements 4.4**

## Error Handling

| 场景 | 处理方式 |
|------|----------|
| localStorage 不可用 | 回退到默认主题（sichuan），不影响功能使用 |
| 无效主题值 | 自动回退到默认主题（sichuan） |
| CSS 变量未定义 | 使用 CSS 变量的 fallback 值 |
| 主题切换时组件未挂载 | next-themes 内部处理，避免 hydration mismatch |

## Testing Strategy

### 测试框架选择

- **单元测试**: Vitest
- **属性测试**: fast-check（JavaScript/TypeScript 的 PBT 库）
- **组件测试**: @testing-library/react

### 单元测试

1. **ThemeToggle 组件测试**
   - 验证川味主题时显示火焰图标
   - 验证傣味主题时显示叶子图标
   - 验证点击切换主题功能

2. **CSS 变量测试**
   - 验证川味主题颜色值
   - 验证傣味主题颜色值

### 属性测试

每个属性测试配置运行 100 次迭代。

1. **Feature: theme-sichuan-yunnan, Property 1: 主题切换正确性**
   - 生成随机的初始主题状态
   - 执行切换操作
   - 验证 class 和 CSS 变量正确更新

2. **Feature: theme-sichuan-yunnan, Property 3: 川味主题颜色正确性**
   - 激活川味主题
   - 验证所有核心 CSS 变量值

3. **Feature: theme-sichuan-yunnan, Property 4: 傣味主题颜色正确性**
   - 激活傣味主题
   - 验证所有核心 CSS 变量值

4. **Feature: theme-sichuan-yunnan, Property 5: 颜色变量完整性**
   - 对于每个主题，验证所有必需的 CSS 变量都已定义

5. **Feature: theme-sichuan-yunnan, Property 6: 颜色对比度可访问性**
   - 对于每个前景/背景配对，计算对比度
   - 验证满足 WCAG AA 标准
