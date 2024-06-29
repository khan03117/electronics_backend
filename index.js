const express = require('express');
const app = express();
const cors = require('cors');


app.use(cors());
app.use(express.json());

require('dotenv').config();

const port = process.env.PORT || 5000;

const categoryroutes = require('./routes/CategoryRoutes');
const brandroutes = require('./routes/BrandRoutes');
const modalroutes = require('./routes/ModalRoutes');
const variantby = require('./routes/VariantByRoutes');
const product = require('./routes/ProductRoutes');
const variant = require('./routes/VariantRoutes');
const cartRoutes = require('./routes/CartRoutes');
const userRoutes = require('./routes/UserRoutes');
const bannerRoutes = require('./routes/BannerRoutes');
const asksRoutes = require('./routes/TestimonialRoutes');
const adminRoutes = require('./routes/AdminRoutes');
const policyroutes = require('./routes/PolicyRoutes');

const mongoose = require('mongoose');
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error);
});

database.once('connected', () => {
    console.log('database connected');
});

app.use('/api/v1/category', categoryroutes);
app.use('/api/v1/brand', brandroutes);
app.use('/api/v1/modal', modalroutes);
app.use('/api/v1/variantby', variantby);
app.use('/api/v1/product', product);
app.use('/api/v1/variant', variant);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/banner', bannerRoutes);
app.use('/api/v1/testimonial', asksRoutes);
app.use('/api/v1/social', adminRoutes);
app.use('/api/v1/policy', policyroutes)


app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send('hello from simple server :)');
});

app.listen(port, () => console.log('> Server is up and running on port : ' + port));
