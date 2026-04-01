"use client";

import { useEffect } from "react";

export default function VersionInfo() {
  useEffect(() => {
    console.log("%c🚀 portal-chuan-dai-h5 v0.1.0", "color: #4CAF50; font-weight: bold; font-size: 14px;");
    console.log("%c   构建时间: " + new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" }), "color: #888;");
  }, []);

  return null;
}
