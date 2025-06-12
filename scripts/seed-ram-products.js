import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// RAM product data
const ramProducts = [
  {
    name: "Corsair Vengeance RGB Pro 32GB (2x16GB) DDR4-3600",
    description: "Corsair Vengeance RGB Pro Series DDR4 memory illuminates your system with dynamic, multi-zone RGB lighting while delivering the best in DDR4 performance and stability.",
    price: 119.99,
    oldPrice: 149.99,
    images: [
      "https://www.corsair.com/corsairmedia/sys_master/productcontent/CMW32GX4M2D3600C18-Gallery-VENG-RGB-PRO-BLK-01.png",
      "https://www.corsair.com/corsairmedia/sys_master/productcontent/CMW32GX4M2D3600C18-Gallery-VENG-RGB-PRO-BLK-02.png",
      "https://www.corsair.com/corsairmedia/sys_master/productcontent/CMW32GX4M2D3600C18-Gallery-VENG-RGB-PRO-BLK-03.png"
    ],
    category: "RAM",
    brand: "Corsair",
    stock: 50,
    sku: "RAM-CORSAIR-VRGBP-32GB",
    rating: 4.8,
    reviews: [
      {
        name: "Robert J.",
        rating: 5,
        comment: "Great RAM, runs at advertised speeds with XMP. RGB looks fantastic.",
        date: new Date("2023-01-15")
      },
      {
        name: "Emily T.",
        rating: 5,
        comment: "Easy to install and the RGB lighting is customizable through iCUE software.",
        date: new Date("2023-02-20")
      },
      {
        name: "Daniel M.",
        rating: 4,
        comment: "Good performance but the RGB software can be a bit finicky at times.",
        date: new Date("2023-03-25")
      }
    ],
    features: [
      "Dynamic multi-zone RGB lighting",
      "High performance DDR4 memory",
      "Custom performance PCB for better signal quality",
      "Tightly screened memory ICs for extended overclocking",
      "Aluminum heat spreader for faster heat dissipation"
    ],
    specs: {
      common: {
        brand: "Corsair",
        model: "Vengeance RGB Pro",
        warranty: "Limited Lifetime",
        releaseYear: 2019,
        dimensions: "137mm x 44mm x 8mm",
        weight: "92g"
      },
      ram: {
        capacity: "32GB (2x16GB)",
        type: "DDR4",
        speed: "3600MHz",
        modules: 2,
        casLatency: "18-22-22-42",
        voltage: "1.35V",
        heatSpreader: true,
        rgb: true,
        timing: "18-22-22-42",
        profile: "XMP 2.0"
      }
    }
  },
  {
    name: "G.SKILL Trident Z Royal 32GB (2x16GB) DDR4-4000",
    description: "G.SKILL Trident Z Royal Series DDR4 memory features a crown jewel design with crystalline light bar and polished silver or gold heatspreader, delivering high performance and stunning aesthetics.",
    price: 189.99,
    oldPrice: 219.99,
    images: [
      "https://www.gskill.com/img/16/371/16371-1.jpg",
      "https://www.gskill.com/img/16/371/16371-2.jpg",
      "https://www.gskill.com/img/16/371/16371-3.jpg"
    ],
    category: "RAM",
    brand: "G.SKILL",
    stock: 30,
    sku: "RAM-GSKILL-TZROYAL-32GB",
    rating: 4.9,
    reviews: [
      {
        name: "William P.",
        rating: 5,
        comment: "The most beautiful RAM on the market. Performance matches the looks.",
        date: new Date("2023-02-10")
      },
      {
        name: "Sophia K.",
        rating: 5,
        comment: "Runs at 4000MHz without any issues. The crystal RGB diffuser is stunning.",
        date: new Date("2023-03-15")
      },
      {
        name: "Alexander B.",
        rating: 5,
        comment: "Premium RAM with premium performance. Worth every penny.",
        date: new Date("2023-04-20")
      }
    ],
    features: [
      "Crystalline light bar design",
      "Polished silver aluminum heat spreader",
      "Extreme performance DDR4 memory",
      "RGB lighting with G.SKILL control software",
      "Carefully screened ICs for maximum overclocking potential"
    ],
    specs: {
      common: {
        brand: "G.SKILL",
        model: "Trident Z Royal",
        warranty: "Limited Lifetime",
        releaseYear: 2020,
        dimensions: "133mm x 44mm x 8mm",
        weight: "94g"
      },
      ram: {
        capacity: "32GB (2x16GB)",
        type: "DDR4",
        speed: "4000MHz",
        modules: 2,
        casLatency: "16-19-19-39",
        voltage: "1.4V",
        heatSpreader: true,
        rgb: true,
        timing: "16-19-19-39",
        profile: "XMP 2.0"
      }
    }
  },
  {
    name: "Kingston FURY Beast 32GB (2x16GB) DDR5-6000",
    description: "Kingston FURY Beast DDR5 memory delivers cutting-edge performance with higher frequencies, greater capacities, and lower latencies for the next generation of high-performance computing.",
    price: 169.99,
    images: [
      "https://media.kingston.com/kingston/product/DDR5_FURY_Beast_Black_DIMM_1_angle-lg.jpg",
      "https://media.kingston.com/kingston/product/DDR5_FURY_Beast_Black_DIMM_2_top-lg.jpg",
      "https://media.kingston.com/kingston/product/DDR5_FURY_Beast_Black_DIMM_3_front-lg.jpg"
    ],
    category: "RAM",
    brand: "Kingston",
    stock: 40,
    sku: "RAM-KINGSTON-FURY-32GB",
    rating: 4.7,
    reviews: [
      {
        name: "Thomas L.",
        rating: 5,
        comment: "Great DDR5 memory for new Intel and AMD platforms. Fast and stable.",
        date: new Date("2023-03-05")
      },
      {
        name: "Olivia R.",
        rating: 4,
        comment: "Good performance but make sure your motherboard supports these speeds.",
        date: new Date("2023-04-10")
      },
      {
        name: "Christopher J.",
        rating: 5,
        comment: "Excellent DDR5 RAM. Works perfectly with my Z690 motherboard.",
        date: new Date("2023-05-15")
      }
    ],
    features: [
      "Intel XMP 3.0 Certified",
      "On-die ECC (Error Correction Code)",
      "Low-profile heat spreader design",
      "DDR5 PMIC for improved power efficiency",
      "Plug N Play at 4800MHz"
    ],
    specs: {
      common: {
        brand: "Kingston",
        model: "FURY Beast",
        warranty: "Limited Lifetime",
        releaseYear: 2022,
        dimensions: "133.35mm x 34.9mm x 6.62mm",
        weight: "85g"
      },
      ram: {
        capacity: "32GB (2x16GB)",
        type: "DDR5",
        speed: "6000MHz",
        modules: 2,
        casLatency: "40-40-40-80",
        voltage: "1.35V",
        heatSpreader: true,
        rgb: false,
        timing: "40-40-40-80",
        profile: "XMP 3.0"
      }
    }
  },
  {
    name: "Crucial Ballistix RGB 16GB (2x8GB) DDR4-3200",
    description: "Crucial Ballistix RGB DDR4 memory delivers a customizable RGB experience with 16 RGB LEDs in 8 zones on each module, along with high-performance overclocking potential.",
    price: 79.99,
    oldPrice: 99.99,
    images: [
      "https://m.media-amazon.com/images/I/61Rr8Jgz1-L._AC_SL1000_.jpg",
      "https://m.media-amazon.com/images/I/71qKGPQJ+aL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71oPJQhDMkL._AC_SL1500_.jpg"
    ],
    category: "RAM",
    brand: "Crucial",
    stock: 60,
    sku: "RAM-CRUCIAL-BALLISTIX-16GB",
    rating: 4.6,
    reviews: [
      {
        name: "Jennifer S.",
        rating: 5,
        comment: "Great RAM for the price. RGB looks good and performance is solid.",
        date: new Date("2023-01-20")
      },
      {
        name: "Brian K.",
        rating: 4,
        comment: "Good value and overclocks well beyond the rated speed.",
        date: new Date("2023-02-25")
      },
      {
        name: "Michelle P.",
        rating: 5,
        comment: "Easy to install and works perfectly with my Ryzen system.",
        date: new Date("2023-03-30")
      }
    ],
    features: [
      "Customizable RGB lighting",
      "Anodized aluminum heat spreader",
      "XMP 2.0 support for automatic overclocking",
      "Optimized for Intel and AMD platforms",
      "Engineered for high-performance overclocking"
    ],
    specs: {
      common: {
        brand: "Crucial",
        model: "Ballistix RGB",
        warranty: "Limited Lifetime",
        releaseYear: 2020,
        dimensions: "133.35mm x 39.2mm x 7.7mm",
        weight: "78g"
      },
      ram: {
        capacity: "16GB (2x8GB)",
        type: "DDR4",
        speed: "3200MHz",
        modules: 2,
        casLatency: "16-18-18-36",
        voltage: "1.35V",
        heatSpreader: true,
        rgb: true,
        timing: "16-18-18-36",
        profile: "XMP 2.0"
      }
    }
  },
  {
    name: "Corsair Dominator Platinum RGB 64GB (2x32GB) DDR5-5600",
    description: "Corsair Dominator Platinum RGB DDR5 memory combines iconic design with cutting-edge DDR5 technology and 12 ultra-bright CAPELLIX RGB LEDs per module for unparalleled performance and style.",
    price: 349.99,
    oldPrice: 399.99,
    images: [
      "https://www.corsair.com/corsairmedia/sys_master/productcontent/DOMINATOR_PLATINUM_RGB_DDR5_BLACK_01.png",
      "https://www.corsair.com/corsairmedia/sys_master/productcontent/DOMINATOR_PLATINUM_RGB_DDR5_BLACK_02.png",
      "https://www.corsair.com/corsairmedia/sys_master/productcontent/DOMINATOR_PLATINUM_RGB_DDR5_BLACK_03.png"
    ],
    category: "RAM",
    brand: "Corsair",
    stock: 25,
    sku: "RAM-CORSAIR-DOMINATOR-64GB",
    rating: 4.8,
    reviews: [
      {
        name: "David R.",
        rating: 5,
        comment: "Premium RAM with excellent performance. The CAPELLIX LEDs are incredibly bright.",
        date: new Date("2023-04-05")
      },
      {
        name: "Katherine L.",
        rating: 5,
        comment: "Works perfectly with my high-end build. The iCUE software integration is seamless.",
        date: new Date("2023-05-10")
      },
      {
        name: "Jonathan T.",
        rating: 4,
        comment: "Great performance but definitely on the expensive side.",
        date: new Date("2023-06-15")
      }
    ],
    features: [
      "CAPELLIX RGB LED technology",
      "Patented DHX cooling technology",
      "Custom high-performance PCB",
      "Intel XMP 3.0 support",
      "iCUE software compatibility for RGB control"
    ],
    specs: {
      common: {
        brand: "Corsair",
        model: "Dominator Platinum RGB",
        warranty: "Limited Lifetime",
        releaseYear: 2022,
        dimensions: "137mm x 54mm x 7.5mm",
        weight: "110g"
      },
      ram: {
        capacity: "64GB (2x32GB)",
        type: "DDR5",
        speed: "5600MHz",
        modules: 2,
        casLatency: "36-36-36-76",
        voltage: "1.25V",
        heatSpreader: true,
        rgb: true,
        timing: "36-36-36-76",
        profile: "XMP 3.0"
      }
    }
  }
];

// Function to seed RAM products
const seedRAMProducts = async () => {
  try {
    // Delete existing RAM products
    await Product.deleteMany({ category: 'RAM' });
    console.log('Existing RAM products deleted');

    // Insert new RAM products
    const result = await Product.insertMany(ramProducts);
    console.log(`${result.length} RAM products seeded successfully`);
    
    // Log the IDs of the inserted products
    result.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ID: ${product._id}`);
    });

    mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error seeding RAM products:', error);
    mongoose.disconnect();
    process.exit(1);
  }
};

// Run the seeding function
seedRAMProducts();
