const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
let port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Configurações do MongoDB
const mongoURI = "mongodb+srv://lucassamuelmc:bancodedados123@cluster1.wftix1e.mongodb.net/?retryWrites=true&w=majority";
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(mongoURI, mongoOptions);

const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

app.use('/images', express.static('upload/images'));

const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  images: {
    type: [String], 
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});



// ... (seu código existente)

app.post('/addproduct', upload.array('images', 4), async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    console.log('Uploaded Files:', req.files);

    const { name, category, new_price, old_price } = req.body;

    if (!name || !category || !new_price || !old_price || !req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, errors: 'Por favor, preencha todos os campos e forneça pelo menos uma imagem.' });
    }

    const products = await Product.find({});
    const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const images = req.files.map(file => `http://localhost:4000/images/${file.filename}`);

    const product = new Product({
      id: id,
      name: name,
      images: images,
      category: category,
      new_price: new_price,
      old_price: old_price,
    });

    await product.save();

    res.json({
      success: true,
      name: name,
    });
  } catch (error) {
    console.error('Erro durante o processamento do produto:', error.message);
    res.status(500).json({ success: false, errors: 'Erro interno no servidor.' });
  }
});






app.post('/removeproduct', async(req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.json({
    success: true,
    name: req.body.name,
  });
});

app.get('/allproducts', async (req, res) => {
  let products = await Product.find({});
  console.log("All Products Fetched");
  res.send(products);
});

const Users = mongoose.model('Users', {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {  
    type: Date,
    default: Date.now,
  }
});


const startServer = () => {
 
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${server.address().port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Trying another port...`);
      server.close();
     
      port = 0;
      startServer();
    } else {
      console.error('Error starting the server:', err);
    }
  });
};


startServer();




// Creating Endpoint for registering the user
app.post('/signup', async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({ success: false, errors: 'existing user found with the same email address' });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });

  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(data, 'secret_ecom');
  res.json({ success: true, token });
});

// Creating endPoint for user login
app.post('/login', async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, 'secret_ecom');
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: "Wrong Password" });
    }
  } else {
    res.json({ success: false, errors: 'Wrong Email Id' });
  }
});

// Creating endpoint for new collection data
app.get('/newcollections', async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("NewCollection Fetched");
  res.send(newcollection);
});

// Creating endpoints for popular in women section
app.get('/popularinwomen', async (req, res) => {
  let products = await Product.find({ category: "women" });
  let popular_in_women = products.slice(0, 4);
  console.log("Popular in women fet");
  res.send(popular_in_women);
});

// Creating middleware to fetch user
const fetchUser = async (req, res, next) => {

        const token = req.header('auth-token');
        if (!token) {   
            res.status(401).send({errors:"Please authenticate using valid token"})
        }
        else{
            try{
                const data= jwt.verify(token,'secret_ecom');
                req.user = data.user;
                next();
            } catch (error){
                res.status(401).send({errors:"please authenticate using a valid token"})
            }
        }
    }




//Creating endpoint for adding products in cartdata
app.post('/addtocart',fetchUser, async (req,res)=>{
    console.log('Added',req.body.itemId);
    let:userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] +=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added")
})







//creating endpoit to remove product from cartdata
app.post('/removefromcart',fetchUser, async(req,res)=>{
    console.log('removed',req.body.itemId);
    let:userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Remove")
})




//Creating endpoint to get cart data
app.post('/getcart',fetchUser, async(req,res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartdata);

})




app.listen(port,(error)=>{
    if(!error){
        console.log("Server Running on Port"+port)
    }
    else
    {
        console.log("Error :" +error)
    }
    
})