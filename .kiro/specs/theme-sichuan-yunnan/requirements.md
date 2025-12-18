# Requirements Document

## Introduction

本功能将现有的浅色/深色主题系统改造为「川味（四川麻辣红）」和「傣味（云南清爽绿）」两套餐饮风格主题。川味主题体现麻辣、烟火气、厚重的视觉感受，适合川菜馆、火锅、麻辣香锅等场景；傣味主题体现清新、野菜、薄荷、雨林的视觉感受，适合云南菜、野生菌、米线、傣味等场景。

## Glossary

- **Theme System（主题系统）**: 基于 CSS 变量和 next-themes 库实现的主题切换机制
- **Sichuan Theme（川味主题）**: 以麻辣红为主色调的四川风格配色方案
- **Yunnan Theme（傣味主题）**: 以清爽绿为主色调的云南风格配色方案
- **CSS Variables（CSS 变量）**: 用于定义主题颜色的自定义属性
- **Theme Toggle（主题切换器）**: 用户界面组件，允许用户在两套主题之间切换
- **Design Token（设计令牌）**: 设计系统中的基础变量，如颜色、间距、圆角等

## Requirements

### Requirement 1

**User Story:** 作为用户，我希望能够在川味和傣味两套主题之间切换，以便根据我的偏好或餐厅类型选择合适的视觉风格。

#### Acceptance Criteria

1. WHEN 用户点击主题切换按钮 THEN Theme System SHALL 在川味主题和傣味主题之间切换
2. WHEN 主题切换完成 THEN Theme System SHALL 立即更新页面所有使用主题变量的元素颜色
3. WHEN 用户选择主题后刷新页面 THEN Theme System SHALL 保持用户上次选择的主题
4. WHEN Theme System 初始化 THEN Theme System SHALL 默认显示川味主题

### Requirement 2

**User Story:** 作为开发者，我希望川味主题能够准确体现四川麻辣风格的视觉设计，以便为川菜类餐饮页面提供合适的配色。

#### Acceptance Criteria

1. WHEN 川味主题激活 THEN Theme System SHALL 将主色（primary）设置为麻辣深红色 #8C1D18
2. WHEN 川味主题激活 THEN Theme System SHALL 将强调色（accent）设置为辣椒红 #B1120A
3. WHEN 川味主题激活 THEN Theme System SHALL 将背景色设置为米白色 #FAF7F2
4. WHEN 川味主题激活 THEN Theme System SHALL 将正文文字色设置为深炭灰 #2B2B2B
5. WHEN 川味主题激活 THEN Theme System SHALL 将次级文字色设置为 #6B6B6B
6. WHEN 川味主题激活 THEN Theme System SHALL 将边框/分割线色设置为 #E5E0DA

### Requirement 3

**User Story:** 作为开发者，我希望傣味主题能够准确体现云南清爽风格的视觉设计，以便为云南菜类餐饮页面提供合适的配色。

#### Acceptance Criteria

1. WHEN 傣味主题激活 THEN Theme System SHALL 将主色（primary）设置为清爽绿 #2F8F6B
2. WHEN 傣味主题激活 THEN Theme System SHALL 将强调色（accent）设置为薄荷绿 #3FB28A
3. WHEN 傣味主题激活 THEN Theme System SHALL 将背景色设置为暖白色 #F6FBF8
4. WHEN 傣味主题激活 THEN Theme System SHALL 将正文文字色设置为深灰 #263332
5. WHEN 傣味主题激活 THEN Theme System SHALL 将次级文字色设置为 #6C7F79
6. WHEN 傣味主题激活 THEN Theme System SHALL 将边框/分割线色设置为 #DDEAE3

### Requirement 4

**User Story:** 作为开发者，我希望主题系统提供完整的语义化颜色变量，以便在各种 UI 组件中使用一致的配色。

#### Acceptance Criteria

1. WHEN 任一主题激活 THEN Theme System SHALL 提供 success、warning、info、destructive 等语义化颜色变量
2. WHEN 任一主题激活 THEN Theme System SHALL 提供 card、popover、sidebar 等组件专用颜色变量
3. WHEN 任一主题激活 THEN Theme System SHALL 提供 chart-1 至 chart-5 的图表配色变量
4. WHEN 颜色变量被使用 THEN Theme System SHALL 确保前景色与背景色之间有足够的对比度以满足可访问性要求

### Requirement 5

**User Story:** 作为用户，我希望主题切换器有直观的视觉反馈，以便我能清楚地知道当前使用的是哪个主题。

#### Acceptance Criteria

1. WHEN 川味主题激活 THEN Theme Toggle SHALL 显示代表川味的图标（如辣椒或火焰图标）
2. WHEN 傣味主题激活 THEN Theme Toggle SHALL 显示代表傣味的图标（如叶子或薄荷图标）
3. WHEN 用户悬停在主题切换按钮上 THEN Theme Toggle SHALL 显示当前主题名称的提示信息
