# Implementation Plan

- [x] 1. 更新 CSS 变量定义


  - [x] 1.1 将 globals.css 中的 `:root` 改为 `.sichuan` 选择器，更新为川味主题色值


    - 主色 #8C1D18、强调色 #B1120A、背景 #FAF7F2、前景 #2B2B2B 等
    - 更新图表颜色 chart-1 至 chart-5
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_
  - [x] 1.2 将 `.dark` 选择器改为 `.yunnan`，更新为傣味主题色值

    - 主色 #2F8F6B、强调色 #3FB28A、背景 #F6FBF8、前景 #263332 等
    - 更新图表颜色 chart-1 至 chart-5
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  - [x] 1.3 确保两套主题都包含完整的语义化颜色变量（success、warning、info、destructive）

    - _Requirements: 4.1_
  - [x] 1.4 确保两套主题都包含组件颜色变量（card、popover、sidebar 及其 foreground）

    - _Requirements: 4.2_
  - [x] 1.5 确保两套主题都包含图表颜色变量（chart-1 至 chart-5）

    - _Requirements: 4.3_

- [x] 2. 更新 ThemeProvider 配置



  - [x] 2.1 修改 layout.tsx 中的 ThemeProvider 配置

    - 设置 `defaultTheme="sichuan"`
    - 设置 `themes={["sichuan", "yunnan"]}`
    - 移除 `enableSystem` 配置
    - _Requirements: 1.4_

- [x] 3. 更新 ThemeToggle 组件


  - [x] 3.1 修改 theme-toggle.tsx，使用火焰和叶子图标

    - 川味主题显示 Flame 图标
    - 傣味主题显示 Leaf 图标
    - _Requirements: 5.1, 5.2_

  - [x] 3.2 添加主题名称提示（title 或 aria-label）
    - _Requirements: 5.3_

  - [x] 3.3 更新切换逻辑，在 sichuan 和 yunnan 之间切换
    - _Requirements: 1.1_

- [x] 4. Checkpoint - 确保所有测试通过

  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 5. 属性测试实现
  - [ ]* 5.1 设置测试环境（Vitest + fast-check）
    - 安装依赖：vitest, @testing-library/react, fast-check
    - 配置 vitest.config.ts
  - [ ]* 5.2 编写属性测试：主题切换正确性
    - **Property 1: 主题切换正确性**
    - **Validates: Requirements 1.1, 1.2**
  - [ ]* 5.3 编写属性测试：川味主题颜色正确性
    - **Property 3: 川味主题颜色正确性**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**
  - [ ]* 5.4 编写属性测试：傣味主题颜色正确性
    - **Property 4: 傣味主题颜色正确性**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**
  - [ ]* 5.5 编写属性测试：颜色变量完整性
    - **Property 5: 颜色变量完整性**
    - **Validates: Requirements 4.1, 4.2, 4.3**
  - [ ]* 5.6 编写属性测试：颜色对比度可访问性
    - **Property 6: 颜色对比度可访问性**
    - **Validates: Requirements 4.4**

- [x] 6. Final Checkpoint - 确保所有测试通过


  - Ensure all tests pass, ask the user if questions arise.
