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
const reply = (res, code, body) => {
  res.writeHead(code, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
}
http.createServer((req, res) => {
  if (req.method === 'GET' && (req.url === '/' || req.url === '/forgot-password')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    return res.end(html)
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
}).listen(3000, () => {
  console.log(`Web demo: http://localhost:3000/forgot-password  (btn=${BTN}, api=${API})`)
})
