const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const adminRoutes = require('./routes/admin/adminRoute');
const cors = require('cors');

const path = require('path');
//const upload = require('./upload'); // Import the Multer configuration
const router = express.Router();
// const patientRoutes= require('./routes/patient/patientRoute');
// const pharmacistRoutes= require('./routes/pharmacist/pharmacistRoute');



// Express app
const app = express();



const allowedOrigins = ['http://localhost:5173'];
// Set up CORS options.


const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

// Enable CORS for all routes or specify it for specific routes.
app.use(cors(corsOptions));



const adminMedicineCatalogRoutes = require('./routes/admin/medicineCatalogRoute')
const patientMedicineCatalogRoutes = require('./routes/patient/medicineCatalogRoute')
const pharmacistMedicineCatalogRoutes = require('./routes/pharmacist/medicineCatalogRoute')
const patientCheckoutAddressRoutes = require('./routes/patient/checkoutAddressRoute')
const patientPastOrdersRoutes = require('./routes/patient/pastOrdersRoute')
const myCartRoutes = require('./routes/patient/myCartRoute')


mongoose.set('strictQuery', false);

const pharmaRoutes = require('./routes/admin/pharmaRoute');
const patientRoutes = require('./routes/admin/patientRoute');
const medicineRoutes = require('./routes/pharmacist/medicineRoute');




// App variables
const Port = process.env.PORT || 5000;
const MongoURI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//const pharmaRoutes = require('server/routes/pharmaRoutes');


// Middleware for allowing react to fetch() from server
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, OPTIONS');
  next();
});

// Connect to MongoDB

mongoose.connect(MongoURI)
  .then(() => {
    console.log("MongoDB is now connected!")

    // Starting server
    app.listen(Port, () => {
      console.log(`Listening to requests on http://localhost:${Port}`);
    })
  })
  .catch(err => console.log(err));

//Routes
//admin
app.use('/admin/medicineCatalog', adminMedicineCatalogRoutes)
app.use('/admin/viewREQPharmacists', require('./routes/admin/viewRequestedPharmacistsInfo'));
//patient
app.use('/patient/medicineCatalog', patientMedicineCatalogRoutes)

app.use('/patient/checkoutAddress', patientCheckoutAddressRoutes)
app.use('/patient/pastOrders', patientPastOrdersRoutes)
app.use('/patient/myCartRoute', myCartRoutes)

//pharmacist
app.use('/pharmacist/medicineCatalog', pharmacistMedicineCatalogRoutes)

app.use('/pharmaRoutes', pharmaRoutes);
app.use('/patientRoutes', patientRoutes);
app.use('/medicineRoutes', medicineRoutes);

app.use('/admin/addremove', adminRoutes);

app.use('/patient/register', require('./routes/patient/registerRoute'));
app.use('/patient/paymentCreditCard', require('./routes/patient/medicinePayments/medicineCreditCardPayment'));
app.use('/patient/paymentWallet', require('./routes/patient/medicinePayments/medicineWalletPayment'));
app.use('/patient/paymentCashOnDelivery', require('./routes/patient/medicinePayments/medicineCashOnDeliveryPayment'));
app.use('/patient/afterCreditCardPayment', require('./routes/patient/medicinePayments/afterCreditCardPayment'));
// app.use('/patient/receipt', require('./routes/patient/medicinePayments/paymentReceipt'));

// Pharmacist
app.use('/pharmacist/register', require('./routes/pharmacist/registerRoute'));


// app.use('/patient/remove', patientRoutes);
// app.use('/pharmacist/remove', pharmacistRoutes);



