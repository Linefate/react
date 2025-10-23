import React from 'react';
    import { createRoot } from 'react-dom/client';

// babel 不会处理引入的脚本，你可以将 Count 中的 jsx 使用 createElement 手动转义，也行
// import Count from './Count.js';

function App() {
    return <h1>Hello, React!</h1>;
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);

