const http = require('http')
const arg = n => (process.argv.find(a => a.startsWith(`--${n}=`)) || '').split('=')[1]
const BTN = arg('btn') || 'old'
const API = arg('api') || 'ok'
const RESET_LINK_MINUTES = 15
const btnHtml = BTN === 'new'
  ? '<button data-testid="send-reset-link">Gửi link</button>'
  : '<button id="btn-send">Gửi link</button>'
const html = `<!doctype html>
<html lang="vi">
<head><meta charset="utf-8"><title>Quên mật khẩu</title>
<style>
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f3f4f6; font-family: Segoe UI, Arial, sans-serif; }
  .card { width: 360px; padding: 32px; background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,.08); }
  h1 { margin: 0 0 8px; font-size: 22px; }
  .sub { margin: 0 0 20px; color: #6b7280; font-size: 14px; }
  input { width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 15px; }
  button { width: 100%; margin-top: 14px; padding: 11px; border: 0; border-radius: 8px; background: #2563eb; color: #fff; font-size: 15px; cursor: pointer; }
  #email-error { margin: 8px 0 0; color: #dc2626; font-size: 13px; }
  .toast { margin-top: 16px; padding: 10px 12px; border-radius: 8px; background: #ecfdf5; color: #065f46; font-size: 14px; }
  .toast.err { background: #fef2f2; color: #991b1b; }
</style>
</head>
<body>
  <div class="card">
  <h1>Quên mật khẩu</h1>
  <p class="sub">Nhập email để nhận link đặt lại mật khẩu</p>
  <input id="email" type="text" placeholder="Email">
  <p id="email-error" hidden>Email không đúng định dạng</p>
  ${btnHtml}
  <div class="toast" hidden></div>
  </div>
  <script>
    const btn = document.querySelector('button')
    const toast = document.querySelector('.toast')
    const err = document.getElementById('email-error')
    btn.onclick = async () => {
      const email = document.getElementById('email').value
      err.hidden = /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(email)
      if (!err.hidden) return
      const r = await fetch('/api/password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      toast.textContent = r.ok ? 'Đã gửi link đặt lại mật khẩu' : 'Lỗi máy chủ (' + r.status + ')'
      toast.classList.toggle('err', !r.ok)
      toast.hidden = false
    }
  </script>
</body>
</html>`
const style = html.slice(html.indexOf('<style>'), html.indexOf('</style>') + 8)
const page = (title, sub, body, script) => `<!doctype html>
<html lang="vi">
<head><meta charset="utf-8"><title>${title}</title>${style}</head>
<body>
  <div class="card">
  <h1>${title}</h1>
  <p class="sub">${sub}</p>
  ${body}
  <div class="toast" hidden></div>
  </div>
  <script>
    const show = (ok, text) => {
      const t = document.querySelector('.toast')
      t.textContent = text
      t.classList.toggle('err', !ok)
      t.hidden = false
    }
    ${script}
  </script>
</body>
</html>`
const pages = {
  '/login': page('Đăng nhập', 'Đăng nhập bằng tài khoản của bạn',
    `<input id="username" type="text" placeholder="Tên đăng nhập">
  <input id="password" type="password" placeholder="Mật khẩu" style="margin-top:10px">
  <button id="btn-login">Đăng nhập</button>`,
    `document.getElementById('btn-login').onclick = () => setTimeout(() => {
      const ok = document.getElementById('password').value === 'Pass@123'
      show(ok, ok ? 'Đăng nhập thành công' : 'Sai mật khẩu')
    }, 1000)`),
  '/register': page('Đăng ký', 'Tạo tài khoản mới',
    `<input id="reg-email" type="text" placeholder="Email">
  <input id="reg-password" type="password" placeholder="Mật khẩu (tối thiểu 8 ký tự)" style="margin-top:10px">
  <button id="btn-register">Đăng ký</button>`,
    `document.getElementById('btn-register').onclick = () => setTimeout(() => {
      const ok = document.getElementById('reg-password').value.length >= 8
      show(ok, ok ? 'Đăng ký thành công' : 'Mật khẩu phải có ít nhất 8 ký tự')
    }, 1500)`),
  '/checkout': page('Thanh toán', 'Áo thun x1, tổng 199.000đ',
    `<button id="btn-pay">Thanh toán</button>`,
    `document.getElementById('btn-pay').onclick = () => setTimeout(() => show(true, 'Thanh toán thành công'), 2500)`)
}
const reply = (res, code, body) => {
  res.writeHead(code, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
}
http.createServer((req, res) => {
  if (req.method === 'GET' && (req.url === '/' || req.url === '/forgot-password')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    return res.end(html)
  }
  if (req.method === 'GET' && pages[req.url]) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    return res.end(pages[req.url])
  }
  if (req.method === 'POST' && req.url === '/api/password/reset') {
    if (API === '500') return reply(res, 500, { error: 'Internal Server Error' })
    const ok = () => reply(res, 200, { sent: true, expiresInMinutes: RESET_LINK_MINUTES })
    if (API === 'slow') {
      const ms = Math.round(3000 + Math.random() * 2800)
      return setTimeout(() => {
        console.log(`POST /api/password/reset trả về sau ${(ms / 1000).toFixed(1)} giây`)
        ok()
      }, ms)
    }
    return ok()
  }
  res.writeHead(404)
  res.end()
}).listen(PORT, () => {
  console.log(`Web demo: http://localhost:${PORT}/forgot-password  (btn=${BTN}, api=${API})`)
})
