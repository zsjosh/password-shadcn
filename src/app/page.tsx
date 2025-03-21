"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw, Github, Twitter } from "lucide-react";
import { Toaster, toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

const PRESETS = [
  { name: "简单密码", length: 8, uppercase: false, lowercase: true, numbers: true, symbols: false },
  { name: "标准密码", length: 12, uppercase: true, lowercase: true, numbers: true, symbols: true },
  { name: "强密码", length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true },
  { name: "超强密码", length: 24, uppercase: true, lowercase: true, numbers: true, symbols: true },
];

const PASSWORD_OPTIONS = [
  { id: "uppercase", label: "大写字母 (A-Z)" },
  { id: "lowercase", label: "小写字母 (a-z)" },
  { id: "numbers", label: "数字 (0-9)" },
  { id: "symbols", label: "特殊字符 (!@#$%^&*)" },
] as const;

export default function Home() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setLength(preset.length);
    setUppercase(preset.uppercase);
    setLowercase(preset.lowercase);
    setNumbers(preset.numbers);
    setSymbols(preset.symbols);
    toast.success(`已应用${preset.name}预设`);
  };

  const generatePassword = () => {
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let chars = "";
    if (uppercase) chars += uppercaseChars;
    if (lowercase) chars += lowercaseChars;
    if (numbers) chars += numberChars;
    if (symbols) chars += symbolChars;

    if (!chars) {
      setPassword("请至少选择一个字符类型");
      toast.error("请至少选择一个字符类型");
      return;
    }

    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      generatedPassword += chars[randomIndex];
    }

    setPassword(generatedPassword);
    toast.success("密码已生成");
  };

  const copyToClipboard = () => {
    if (!password) {
      toast.error("请先生成密码");
      return;
    }
    navigator.clipboard.writeText(password);
    toast.success("密码已复制到剪贴板");
  };

  const getOptionState = (id: typeof PASSWORD_OPTIONS[number]["id"]) => {
    switch (id) {
      case "uppercase": return uppercase;
      case "lowercase": return lowercase;
      case "numbers": return numbers;
      case "symbols": return symbols;
    }
  };

  const setOptionState = (id: typeof PASSWORD_OPTIONS[number]["id"], checked: boolean) => {
    switch (id) {
      case "uppercase": setUppercase(checked); break;
      case "lowercase": setLowercase(checked); break;
      case "numbers": setNumbers(checked); break;
      case "symbols": setSymbols(checked); break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-center">
          <h1 className="text-xl font-bold">密码生成器</h1>
        </div>
      </header>

      <main className="flex-1 bg-background">
        <div className="container max-w-2xl py-12">
          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">生成安全的随机密码</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label className="text-base">密码预设</Label>
                  <Select onValueChange={(value) => {
                    const preset = PRESETS.find(p => p.name === value);
                    if (preset) applyPreset(preset);
                  }}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="选择预设" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRESETS.map((preset) => (
                        <SelectItem key={preset.name} value={preset.name}>
                          {preset.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="grid gap-5">
                  {PASSWORD_OPTIONS.map((option) => (
                    <div key={option.id} className="flex items-center space-x-4">
                      <Checkbox 
                        id={option.id}
                        checked={getOptionState(option.id)}
                        onCheckedChange={(checked) => setOptionState(option.id, checked as boolean)}
                        className="h-5 w-5"
                      />
                      <Label htmlFor={option.id} className="text-base cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex space-x-3">
                    <Input
                      value={password}
                      readOnly
                      placeholder="生成的密码将显示在这里"
                      className="font-mono text-lg h-12"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyToClipboard}
                      className="h-12 w-12"
                    >
                      <Copy className="h-5 w-5" />
                    </Button>
                  </div>
                  <Button
                    onClick={generatePassword}
                    className="w-full h-12 text-base"
                    size="lg"
                  >
                    <RefreshCw className="h-5 w-5 mr-2" />
                    生成随机密码
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-6 md:h-16 md:flex-row md:py-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with <a href="https://ui.shadcn.com" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">shadcn/ui</a>. The source code is available on <a href="https://github.com" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">GitHub</a>.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="font-medium">Source Code</span>
            </a>
            <Separator orientation="vertical" className="h-4" />
            <a
              href="https://x.com/ZS_JOSH"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span className="font-medium">@ZS_JOSH</span>
            </a>
          </div>
        </div>
      </footer>
      <Toaster position="top-center" />
    </div>
  );
}
