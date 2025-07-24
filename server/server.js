// ...existing code...
import stripeSessionRoutes from './routes/stripeSession.routes.js';
// ...existing code...
// After app is defined
import stripeWebhookRoutes from './routes/stripeWebhook.routes.js';
/* ────────────────────────────────────────────────────────────
   server.js  (backend entry point)
   ──────────────────────────────────────────────────────────── */
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import ambulanceRoutes from './routes/ambulance.routes.js';


/* ---------- env ---------- */
dotenv.config();
const PORT        = process.env.PORT       || 5000;
const CLIENT_URL  = process.env.CLIENT_URL || 'http://localhost:5173';
const MONGO_URI   =
  process.env.MONGO_URI ||
  'mongodb+srv://srithivyanesan2002:0Oc4RauGqE8L3Ffc@cluster0.rufe3mm.mongodb.net/alert-x';

/* ---------- express + http ---------- */
const app        = express();
const httpServer = createServer(app);

/* ---------- socket.io ---------- */
export const io = new SocketIOServer(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

/* Make io available in any controller via req.app.get('io') */
app.set('io', io);

/* Helper that controllers can import to broadcast status changes */
export const notifyBookingStatusUpdate = (userId, booking) => {
  io.to(userId.toString()).emit('bookingStatusUpdated', booking);
  io.to('adminNotifications').emit('bookingStatusUpdated', booking);
};

/* Socket rooms */
io.on('connection', socket => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  socket.on('joinUserRoom', userId => {
    socket.join(userId.toString());
    console.log(`Socket ${socket.id} joined user room ${userId}`);
  });

  socket.on('joinAdminNotifications', () => {
    socket.join('adminNotifications');
    console.log(`Socket ${socket.id} joined adminNotifications`);
  });

  socket.on('disconnect', () =>
    console.log(`Socket disconnected: ${socket.id}`)
  );
});

/* ---------- middleware ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

/* ---------- routes ---------- */
import authRoutes     from './routes/auth.routes.js';
import userRoutes     from './routes/user.routes.js';
import bookingRoutes  from './routes/booking.routes.js';
import alertRoutes    from './routes/alert.routes.js';
import adminRoutes    from './routes/admin.routes.js';
import hospitalRoutes from './routes/hospital.routes.js';
import feedbackRoutes from './routes/feedback.routes.js';
import chatRoutes     from './routes/chat.routes.js';

import medicalRoutes  from './routes/medical.routes.js';
import caretakerAdminRoutes from './routes/caretakerAdmin.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import adminPaymentRoutes from './routes/adminPayment.routes.js';

app.use('/api/auth',      authRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/alerts',    alertRoutes);
app.use('/api/medical',   medicalRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/feedback',  feedbackRoutes);
app.use('/api/chat',      chatRoutes);
app.use('/api/caretakers', caretakerAdminRoutes);
 app.use('/api/ambulances', ambulanceRoutes);
app.use('/api/admin-payments', adminPaymentRoutes);
app.use('/api/stripe-sessions', stripeSessionRoutes);

// Stripe payment endpoints
app.use('/api/payments', paymentRoutes);
app.use('/api/stripe-webhook', stripeWebhookRoutes);

/* ---------- health check ---------- */
app.get('/', (_req, res) => res.send('API is running…'));

/* ---------- db connect & start server ---------- */
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');
    httpServer.listen(PORT, () =>
      console.log(`Server & Socket.IO running on port ${PORT}`)
    );
  })
  .catch(err => {
    console.error('DB connection error:', err.message);
    process.exit(1);
  });


 
