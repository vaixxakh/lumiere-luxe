require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

const products = [
    {
      "id": "1",
      "category": "Chandeliers",
      "name": "Royal Crystal Chandelier Light",
      "description": "Elegant gold chandelier with sparkling crystals.",
      "image": "https://assets.wfcdn.com/im/95743852/resize-h1200-w1200%5Ecompr-r85/3479/347998256/19+-+Light+Dimmable+Empire+Chandelier-433158536.jpg",
      "price": 58200,
      "reviews": 4.9
    },
    {
      "id": "2",
      "name": "Golden Luxe Chandelier Light",
      "category": "Chandeliers",
      "description": "Empire-style chandelier with golden brilliance.",
      "image": "https://assets.wfcdn.com/im/85633969/resize-h1200-w1200%5Ecompr-r85/2977/297764850/Bartho+13+-+Light+Dimmable+Empire+Chandelier.jpg",
      "price": 37800,
      "reviews": 4.6
    },
    {
      "id": "3",
      "category": "Chandeliers",
      "name": "Mother Of Pearl Crystal Chandelier",
      "description": "Pearl-inspired chandelier with iridescent shine.",
      "image": "https://assets.wfcdn.com/im/16160979/resize-h1200-w1200%5Ecompr-r85/2746/274643787/Hooriyah+12+-+Light+Dimmable+Chandelier.jpg",
      "price": 23999,
      "reviews": 4.7
    },
    {
      "id": "4",
      "category": "Chandeliers",
      "name": "Three Rings Crystal LED Chandelier",
      "description": "Modern LED chandelier with tiered crystal rings.",
      "image": "https://assets.wfcdn.com/im/32940442/resize-h1200-w1200%5Ecompr-r85/1706/170629138/Daveonte+3+-+Light+LED+Tiered+Chandelier-441781056.jpg",
      "price": 19500,
      "reviews": 4.4
    },
    {
      "id": "5",
      "category": "Chandeliers",
      "name": "Golden Crystal Chandelier",
      "description": "Classic crystal chandelier with golden accents.",
      "image": "https://assets.wfcdn.com/im/32655020/resize-h1200-w1200%5Ecompr-r85/2635/263526913/Imma+Crystal+Empire+Chandelier+with+Crystal+Accents-1701360673-1701360675.jpg",
      "price": 19800,
      "reviews": 4.5
    },
    {
      "id": "6",
      "category": "Chandeliers",
      "name": "Amber Crystal Chandelier",
      "description": "Round chandelier glowing with amber tones.",
      "image": "https://assets.wfcdn.com/im/61173939/resize-h1200-w1200%5Ecompr-r85/2128/212839566/Craggie+6+-+Light+Round+Crystal+Chandelier-1475021835-1474882090.jpg",
      "price": 19999,
      "reviews": 4.3
    },
    {
      "id": "7",
      "category": "Chandeliers",
      "name": "Ceramic Round Crystal Chandelier",
      "description": "Ceramic and crystal fusion chandelier design.",
      "image": "https://assets.wfcdn.com/im/73821331/resize-h1200-w1200%5Ecompr-r85/3329/332954666/Modern+Round+K9+Crystal+Chandelier-1309166280.jpg",
      "price": 15900,
      "reviews": 4.2
    },
    {
      "id": "8",
      "category": "Pendant",
      "name": "Keep it Collected Clear Glass Pendant",
      "description": "Industrial pendant with threaded clear glass shade.",
      "image": "https://assets.wfcdn.com/im/22003069/resize-h1200-w1200%5Ecompr-r85/3212/321264657/3+Light+Pendant+Light+Chandelier+With+Threaded+Clear+Glass+Globe+Shade.jpg",
      "price": 40490,
      "reviews": 4.5
    },
    {
      "id": "9",
      "category": "Pendant",
      "name": "Awake At Down LED Pendant",
      "description": "Sleek modern pendant with LED glow.",
      "image": "https://assets.wfcdn.com/im/53631309/resize-h1200-w1200%5Ecompr-r85/2737/273787668/Josse+2+-+Light+LED+Pendant.jpg",
      "price": 21170,
      "reviews": 4.4
    },
    {
      "id": "10",
      "category": "Pendant",
      "name": "Show Me A Sign Wooden Pendant",
      "description": "Rustic wood pendant for dining spaces.",
      "image": "https://assets.wfcdn.com/im/07798961/resize-h1200-w1200%5Ecompr-r85/1268/126835443/Breiden+4+-+Light+39%22W+Kitchen+Island+Linear+LED+Modern+Pendant+with+Black+Metal+%26+Wood+for+Dining+Room+or+Kitchen.jpg",
      "price": 19400,
      "reviews": 4.6
    },
    {
      "id": "11",
      "category": "Pendant",
      "name": "Perfect Landing Glass Pendant",
      "description": "Elegant pendant with round glass shade.",
      "image": "https://assets.wfcdn.com/im/59091887/resize-h1200-w1200%5Ecompr-r85/3087/308707980/Modern+Pendant+Light+With+Globe+Glass+Shade-1861199158.jpg",
      "price": 13650,
      "reviews": 4.3
    },
    {
      "id": "12",
      "category": "Pendant",
      "name": "Golden Goddess Glass Pendant",
      "description": "Antique bronze pendant with crystal accents.",
      "image": "https://assets.wfcdn.com/im/84405745/resize-h1200-w1200%5Ecompr-r85/2726/272674530/+Dhamender+Retro+Antique+Bronze+Crystal+Globe+Pendant+With+Crystal+Accents-656777497-649377861.jpg",
      "price": 12450,
      "reviews": 4.2
    },
    {
      "id": "13",
      "category": "Floor Light",
      "name": "Rose Gold Lady Art Sculpture Floor Lamp",
      "description": "Artistic rose gold floor lamp sculpture.",
      "image": "https://assets.wfcdn.com/im/03038410/resize-h1200-w1200%5Ecompr-r85/7241/72419891/Terrie+63.5%27%27+Gold+Leaf+Novelty+Floor+Lamp.jpg",
      "price": 95999,
      "reviews": 4.8
    },
    {
      "id": "14",
      "category": "Floor Light",
      "name": "Black & White Lady Art Sculpture Floor Lamp",
      "description": "Bold artistic black and white floor lamp.",
      "image": "https://assets.wfcdn.com/im/30849899/resize-h1200-w1200%5Ecompr-r85/1901/190194963/83%27%27+Novelty+Floor+Lamp.jpg",
      "price": 89999,
      "reviews": 4.7
    },
    {
      "id": "15",
      "category": "Floor Light",
      "name": "Nordic Sculpture Resin Glass Floor Lamp",
      "description": "Minimal Nordic lamp with glass elegance.",
      "image": "https://assets.wfcdn.com/im/01730307/resize-h1200-w1200%5Ecompr-r85/3740/374051556/Minimalist+Modern+Resin+and+Acrylic+Floor+Lamp-1842703705.jpg",
      "price": 59999,
      "reviews": 4.6
    },
    {
      "id": "16",
      "category": "Floor Light",
      "name": "Modern Marble Glass Floor Lamp",
      "description": "Rust marble floor lamp with LED light.",
      "image": "https://assets.wfcdn.com/im/67799979/resize-h1200-w1200%5Ecompr-r85/2297/229722693/Allicia+66.9%27%27+Rust+LED+Novelty+Floor+Lamp.jpg",
      "price": 29999,
      "reviews": 4.5
    },
    {
      "id": "17",
      "category": "Floor Light",
      "name": "Contemporary 5-Light Glass Globe Floor Lamp",
      "description": "Modern LED lamp with frosted globes.",
      "image": "https://assets.wfcdn.com/im/04693632/resize-h1200-w1200%5Ecompr-r85/3089/308996921/Sphere+20%22+Modern+LED+Table+Lamp+with+Frosted+Globe+Shades+and+Gold+Finish%2C+USB-C+Port%2C+3-Way+Dimming.jpg",
      "price": 9999,
      "reviews": 4.1
    },
    {
      "id": "18",
      "category": "Ceiling Light",
      "name": "Time To Shine Antique Gold Ceiling Light",
      "description": "Elegant ceiling light in antique gold finish.",
      "image": "https://www.asianpaints.com/content/dam/asian_paints/new-furniture/lights-collection/CL17-10004/CL17-10004-3.jpg.transform/cc-width-720-height-540/image.jpg",
      "price": 51872,
      "reviews": 4.4
    },
    {
      "id": "19",
      "category": "Ceiling Light",
      "name": "Black Metal Frame Wall Lamp With Planter",
      "description": "Wall lamp featuring black frame and planter.",
      "image": "https://assets.wfcdn.com/im/69091407/resize-h1200-w1200%5Ecompr-r85/2803/280332127/Polikron+Classic+Outdoor+Wall+Sconce+1+Light+with+Dusk+to+Dawn+in+Matte+Black+Rectangular-957323256.jpg",
      "price": 9999,
      "reviews": 3.9
    },
    {
      "id": "20",
      "category": "Ceiling Light",
      "name": "LED Wall Owl Lamp With Vase",
      "description": "Creative owl wall lamp with vase holder.",
      "image": "https://assets.wfcdn.com/im/26581734/resize-h1200-w1200%5Ecompr-r85/2494/249478665/Litherland+Table+Lamp-88694414.jpg",
      "price": 5999,
      "reviews": 4
    }
    ];


    const seedProducts = async () => {
        try {
            await mongoose.connect(process.env.MONGO_URI);
            console.log("MongoDB  connected");


            await Product.deleteMany();
            await Product.insertMany(products);

            console.log("Products seeded successfully");
            process.exit();
        } catch ( error ) {
            console.error("Products seeding failed", error);
            process.exit(1);
        }
    };
    seedProducts();
