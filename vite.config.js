import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { query, run } from './server/db.js'
import bodyParser from 'body-parser'

// API Plugin for local SQLite access
const apiPlugin = () => ({
  name: 'api-plugin',
  configureServer(server) {
    // Use body-parser for POST requests
    server.middlewares.use(bodyParser.json())

    server.middlewares.use(async (req, res, next) => {
      if (req.url.startsWith('/api/drinks')) {
        const url = new URL(req.url, `http://${req.headers.host}`)
        
        if (req.method === 'GET') {
          const search = url.searchParams.get('q')
          let sql = 'SELECT * FROM Fifty_Lan ORDER BY date DESC'
          let params = []
          
          if (search) {
            sql = 'SELECT * FROM Fifty_Lan WHERE product LIKE ? ORDER BY date DESC'
            params = [`%${search}%`]
          }
          
          try {
            const rows = await query(sql, params)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(rows))
          } catch (err) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: err.message }))
          }
          return
        }

        if (req.method === 'POST') {
          const { date, product, price } = req.body
          
          if (!date || !product || !price) {
            res.statusCode = 400
            res.end(JSON.stringify({ error: 'Missing Required Fields' }))
            return
          }

          try {
            // Check for duplicates
            const existing = await query(
              'SELECT id FROM Fifty_Lan WHERE date = ? AND product = ?',
              [date, product]
            )
            
            if (existing.length > 0) {
              res.statusCode = 409
              res.end(JSON.stringify({ error: 'Record already exists for this date and product' }))
              return
            }

            const result = await run(
              'INSERT INTO Fifty_Lan (date, product, price) VALUES (?, ?, ?)',
              [date, product, price]
            )
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, id: result.id }))
          } catch (err) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: err.message }))
          }
          return
        }

        if (req.method === 'DELETE') {
          const id = url.pathname.split('/').pop()
          try {
            await run('DELETE FROM Fifty_Lan WHERE id = ?', [id])
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true }))
          } catch (err) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: err.message }))
          }
          return
        }
      }
      next()
    })
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    apiPlugin(),
  ],
  base: 'vue-drink/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
