const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const contactRoutes = require('./routes/contactRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const ensureDefaultAdmin = require('./utils/ensureAdmin');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};

// Middleware
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html lang="vi">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>An Hy Candle API</title>
        <style>
          body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: linear-gradient(180deg, #fff7f2 0%, #ffd8d0 100%);
            color: #5a332f;
            font-family: Arial, sans-serif;
          }
          .card {
            max-width: 560px;
            margin: 24px;
            padding: 32px;
            border-radius: 24px;
            background: rgba(255,255,255,0.88);
            box-shadow: 0 18px 42px rgba(211, 126, 100, 0.16);
          }
          h1 {
            margin-top: 0;
            font-size: 2rem;
          }
          p {
            line-height: 1.6;
          }
          code {
            background: #fff0eb;
            border-radius: 10px;
            padding: 2px 8px;
          }
        </style>
      </head>
      <body>
        <main class="card">
          <h1>An Hy Candle Backend</h1>
          <p>Server Render này đang chạy API cho website An Hy Candle.</p>
          <p>Kiểm tra nhanh tại <code>/api</code> hoặc dùng frontend Vercel để truy cập giao diện khách hàng.</p>
        </main>
      </body>
    </html>
  `);
});

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to An Hy Candle API' });
});

// Route-level error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

// Start Server
const startServer = async () => {
  const dbConnection = await connectDB();
  if (dbConnection) {
    await ensureDefaultAdmin();
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
