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
<head><meta charset="utf-8"><title>Quên mật khẩu</title></head>
<body>
  <h1>Quên mật khẩu</h1>
  <input id="email" type="text" placeholder="Email">
  <p id="email-error" hidden>Email không đúng định dạng</p>
  ${btnHtml}
  <div class="toast" hidden></div>
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
    if (API === 'slow') return setTimeout(ok, 3000 + Math.random() * 2800)
    return ok()
  }
  res.writeHead(404)
  res.end()
}).listen(3000, () => {
  console.log(`Web demo: http://localhost:3000/forgot-password  (btn=${BTN}, api=${API})`)
})
