/**
 * 在 Service Worker 安装阶段执行。
 * install：首次注册 SW 或更新版本时触发；
 * e.waitUntil(promise)：告诉浏览器“等这个异步任务完成后再算安装完成”。
 * 所以这里做的是：在安装阶段，把 Babel 运行时加载进来。
 */
self.addEventListener('install', (e) => e.waitUntil(getBabel()));
/**
 * Service Worker 可以拦截所有页面发起的网络请求，并自定义返回结果。
 * e.respondWith(promise)：告诉浏览器“等这个异步任务完成后再返回响应”。
 * 所以这里做的是：在每次请求资源时，动态编译 JSX 并返回编译后的结果。
 */
self.addEventListener('fetch', (e) => e.respondWith(handleRequest(e.request)));

async function getBabel() {
  const r = await fetch('https://unpkg.com/@babel/standalone@7.27.0/babel.min.js');
  const babel = await r.text();
  /**
   * ✅ 相当于给 Service Worker 动态“注入了 Babel 环境”。
   * 使用 new Function(babel).apply(self) 执行这段 JS —— 相当于在 SW 作用域中加载 Babel；
   * 加载完成后，全局会出现 self.Babel 对象。
   */
  new Function(babel).apply(self);
}

async function handleRequest(request) {
  const url = new URL(request.url);
  const r = await fetch(request);
  // 复制原始响应，以便后续修改。
  const nextResponse = new Response(r.body, r);
  // 如果请求的是 JSX 文件，则设置 Content-Type 为 application/javascript。
  if (url.pathname.endsWith('.jsx')) {
    nextResponse.headers.set('Content-Type', 'application/javascript');
  }

  // 如果请求的是 JSX 文件，则动态编译 JSX 并返回编译后的结果。
  if (nextResponse.status === 200 && url.pathname.endsWith('.jsx')) {
    // 读取原始 JSX 内容。
    const jsx = await nextResponse.text();
    // 使用 Babel 编译 JSX。
    const js = self.Babel.transform(jsx, { presets: ['react'] }).code;
    // 返回编译后的 JavaScript 代码。
    return new Response(js, nextResponse);
  } else {
    return nextResponse;
  }
}