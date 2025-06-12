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

// CPU product data
const cpuProducts = [
  {
    name: "AMD Ryzen 9 7950X",
    description: "The AMD Ryzen 9 7950X is a high-end desktop processor with 16 cores and 32 threads, offering exceptional multi-threaded performance for content creation, gaming, and professional workloads.",
    price: 599.99,
    oldPrice: 699.99,
    images: [
      "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024/akamai/content/categories/cpu/amd-ryzen-9-7950x.png",
      "https://www.amd.com/system/files/styles/992px/private/2022-08/1556194-amd-ryzen-9-7000-series-PIB-angle-1260x709_0.png",
      "https://www.amd.com/system/files/styles/992px/private/2022-08/1556196-amd-ryzen-9-7000-series-PIB-front-1260x709_0.png"
    ],
    category: "CPU",
    brand: "AMD",
    stock: 25,
    sku: "CPU-R9-7950X",
    rating: 4.9,
    reviews: [
      {
        name: "Michael S.",
        rating: 5,
        comment: "Incredible performance for both gaming and productivity. Handles everything I throw at it with ease.",
        date: new Date("2023-02-10")
      },
      {
        name: "Jessica L.",
        rating: 5,
        comment: "Video rendering times have been cut in half compared to my previous CPU. Worth every penny.",
        date: new Date("2023-03-15")
      },
      {
        name: "Andrew T.",
        rating: 4,
        comment: "Amazing performance but runs hot. Make sure you have good cooling.",
        date: new Date("2023-04-20")
      }
    ],
    features: [
      "16 cores and 32 threads for exceptional multi-threaded performance",
      "Up to 5.7 GHz max boost clock",
      "AMD Zen 4 architecture",
      "Support for PCIe 5.0 and DDR5 memory",
      "Unlocked for overclocking"
    ],
    specs: {
      common: {
        warranty: "3 years limited",
        releaseDate: "2022-09-27"
      },
      cpu: {
        cores: 16,
        threads: 32,
        baseClockSpeed: "4.5 GHz",
        boostClockSpeed: "5.7 GHz",
        cache: "80MB (16MB L2 + 64MB L3)",
        socket: "AM5",
        architecture: "Zen 4",
        lithography: "5nm",
        tdp: "170W",
        integratedGraphics: "AMD Radeon Graphics",
        coolerIncluded: false,
        supportedMemoryTypes: "DDR5-5200",
        maxMemorySupport: "128GB",
        pciExpressVersion: "PCIe 5.0"
      }
    }
  },
  {
    name: "Intel Core i9-13900K",
    description: "The Intel Core i9-13900K is a high-performance desktop processor featuring 24 cores (8 P-cores and 16 E-cores) and 32 threads, delivering exceptional gaming and content creation performance.",
    price: 569.99,
    oldPrice: 649.99,
    images: [
      "https://www.intel.com/content/dam/www/central-libraries/us/en/images/2022-08/13th-gen-core-i9-k-series-16x9.png.rendition.intel.web.864.486.png",
      "https://www.intel.com/content/dam/www/central-libraries/us/en/images/2022-08/13th-gen-core-i9-k-series-1x1.png.rendition.intel.web.480.480.png",
      "https://www.intel.com/content/dam/www/central-libraries/us/en/images/2022-08/13th-gen-core-i9-k-series-16x9.png.rendition.intel.web.1648.927.png"
    ],
    category: "CPU",
    brand: "Intel",
    stock: 30,
    sku: "CPU-I9-13900K",
    rating: 4.8,
    reviews: [
      {
        name: "Richard B.",
        rating: 5,
        comment: "Best gaming CPU on the market. Handles 4K gaming with ease while streaming.",
        date: new Date("2023-01-25")
      },
      {
        name: "Laura M.",
        rating: 5,
        comment: "The hybrid architecture really shines in multitasking scenarios.",
        date: new Date("2023-02-18")
      },
      {
        name: "Paul D.",
        rating: 4,
        comment: "Amazing performance but power consumption is high. Get a good PSU and cooler.",
        date: new Date("2023-03-22")
      }
    ],
    features: [
      "24 cores (8 P-cores + 16 E-cores) and 32 threads",
      "Up to 5.8 GHz max turbo frequency",
      "Intel 7 process technology",
      "Support for PCIe 5.0 and DDR5/DDR4 memory",
      "Unlocked for overclocking"
    ],
    specs: {
      common: {
        warranty: "3 years limited",
        releaseDate: "2022-10-20"
      },
      cpu: {
        cores: 24,
        threads: 32,
        baseClockSpeed: "3.0 GHz (P-cores) / 2.2 GHz (E-cores)",
        boostClockSpeed: "5.8 GHz",
        cache: "68MB (32MB L2 + 36MB L3)",
        socket: "LGA 1700",
        architecture: "Raptor Lake",
        lithography: "Intel 7 (10nm)",
        tdp: "125W (253W Turbo)",
        integratedGraphics: "Intel UHD Graphics 770",
        coolerIncluded: false,
        supportedMemoryTypes: "DDR5-5600, DDR4-3200",
        maxMemorySupport: "128GB",
        pciExpressVersion: "PCIe 5.0"
      }
    }
  },
  {
    name: "AMD Ryzen 7 7800X3D",
    description: "The AMD Ryzen 7 7800X3D is a gaming-focused processor featuring 8 cores, 16 threads, and AMD's innovative 3D V-Cache technology for exceptional gaming performance.",
    price: 449.99,
    images: [
      "https://www.amd.com/system/files/styles/992px/private/2023-01/1735379-amd-ryzen-7000-series-x3d-PIB-angle-1260x709.png",
      "https://www.amd.com/system/files/styles/992px/private/2023-01/1735381-amd-ryzen-7000-series-x3d-PIB-front-1260x709.png",
      "https://www.amd.com/system/files/styles/992px/private/2023-01/1735380-amd-ryzen-7000-series-x3d-PIB-top-1260x709.png"
    ],
    category: "CPU",
    brand: "AMD",
    stock: 35,
    sku: "CPU-R7-7800X3D",
    rating: 4.9,
    reviews: [
      {
        name: "James K.",
        rating: 5,
        comment: "Best gaming CPU I've ever used. The 3D V-Cache makes a huge difference in games.",
        date: new Date("2023-05-10")
      },
      {
        name: "Sophia R.",
        rating: 5,
        comment: "Incredible gaming performance and good productivity performance too.",
        date: new Date("2023-06-15")
      },
      {
        name: "Nathan P.",
        rating: 5,
        comment: "The gaming performance is unmatched at this price point.",
        date: new Date("2023-07-20")
      }
    ],
    features: [
      "8 cores and 16 threads with 3D V-Cache technology",
      "Up to 5.0 GHz max boost clock",
      "AMD Zen 4 architecture",
      "96MB of L3 cache",
      "Support for PCIe 5.0 and DDR5 memory"
    ],
    specs: {
      common: {
        warranty: "3 years limited",
        releaseDate: "2023-04-06"
      },
      cpu: {
        cores: 8,
        threads: 16,
        baseClockSpeed: "4.2 GHz",
        boostClockSpeed: "5.0 GHz",
        cache: "104MB (8MB L2 + 96MB L3)",
        socket: "AM5",
        architecture: "Zen 4 with 3D V-Cache",
        lithography: "5nm",
        tdp: "120W",
        integratedGraphics: "AMD Radeon Graphics",
        coolerIncluded: false,
        supportedMemoryTypes: "DDR5-5200",
        maxMemorySupport: "128GB",
        pciExpressVersion: "PCIe 5.0"
      }
    }
  },
  {
    name: "Intel Core i5-13600K",
    description: "The Intel Core i5-13600K is a mid-range desktop processor with 14 cores (6 P-cores and 8 E-cores) and 20 threads, offering excellent gaming and multitasking performance at a competitive price.",
    price: 319.99,
    images: [
      "https://m.media-amazon.com/images/I/61zYP7oYYSL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71OxPxRBpkL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71Vv-G1uFNL._AC_SL1500_.jpg"
    ],
    category: "CPU",
    brand: "Intel",
    stock: 40,
    sku: "CPU-I5-13600K",
    rating: 4.8,
    reviews: [
      {
        name: "Eric T.",
        rating: 5,
        comment: "Best value CPU on the market. Gaming performance is nearly identical to the i9.",
        date: new Date("2023-03-05")
      },
      {
        name: "Amanda L.",
        rating: 5,
        comment: "Perfect balance of gaming and productivity performance for the price.",
        date: new Date("2023-04-12")
      },
      {
        name: "Mark S.",
        rating: 4,
        comment: "Great performance but runs a bit hot under load. Get a good cooler.",
        date: new Date("2023-05-18")
      }
    ],
    features: [
      "14 cores (6 P-cores + 8 E-cores) and 20 threads",
      "Up to 5.1 GHz max turbo frequency",
      "Intel 7 process technology",
      "Support for PCIe 5.0 and DDR5/DDR4 memory",
      "Unlocked for overclocking"
    ],
    specs: {
      common: {
        warranty: "3 years limited",
        releaseDate: "2022-10-20"
      },
      cpu: {
        cores: 14,
        threads: 20,
        baseClockSpeed: "3.5 GHz (P-cores) / 2.6 GHz (E-cores)",
        boostClockSpeed: "5.1 GHz",
        cache: "44MB (20MB L2 + 24MB L3)",
        socket: "LGA 1700",
        architecture: "Raptor Lake",
        lithography: "Intel 7 (10nm)",
        tdp: "125W (181W Turbo)",
        integratedGraphics: "Intel UHD Graphics 770",
        coolerIncluded: false,
        supportedMemoryTypes: "DDR5-5600, DDR4-3200",
        maxMemorySupport: "128GB",
        pciExpressVersion: "PCIe 5.0"
      }
    }
  },
  {
    name: "AMD Ryzen 5 7600X",
    description: "The AMD Ryzen 5 7600X is a mid-range desktop processor with 6 cores and 12 threads, offering excellent gaming performance and good productivity capabilities at an affordable price point.",
    price: 249.99,
    oldPrice: 299.99,
    images: [
      "https://www.amd.com/system/files/styles/992px/private/2022-08/1556188-amd-ryzen-5-7000-series-PIB-angle-1260x709_0.png",
      "https://www.amd.com/system/files/styles/992px/private/2022-08/1556190-amd-ryzen-5-7000-series-PIB-front-1260x709_0.png",
      "https://www.amd.com/system/files/styles/992px/private/2022-08/1556189-amd-ryzen-5-7000-series-PIB-top-1260x709_0.png"
    ],
    category: "CPU",
    brand: "AMD",
    stock: 45,
    sku: "CPU-R5-7600X",
    rating: 4.7,
    reviews: [
      {
        name: "Steven R.",
        rating: 5,
        comment: "Great gaming CPU for the price. Handles 1440p gaming with ease.",
        date: new Date("2023-02-15")
      },
      {
        name: "Rachel K.",
        rating: 4,
        comment: "Good performance for both gaming and productivity tasks.",
        date: new Date("2023-03-20")
      },
      {
        name: "Jason M.",
        rating: 5,
        comment: "Excellent value. Paired with a good GPU, it handles any game I throw at it.",
        date: new Date("2023-04-25")
      }
    ],
    features: [
      "6 cores and 12 threads",
      "Up to 5.3 GHz max boost clock",
      "AMD Zen 4 architecture",
      "Support for PCIe 5.0 and DDR5 memory",
      "Unlocked for overclocking"
    ],
    specs: {
      common: {
        warranty: "3 years limited",
        releaseDate: "2022-09-27"
      },
      cpu: {
        cores: 6,
        threads: 12,
        baseClockSpeed: "4.7 GHz",
        boostClockSpeed: "5.3 GHz",
        cache: "38MB (6MB L2 + 32MB L3)",
        socket: "AM5",
        architecture: "Zen 4",
        lithography: "5nm",
        tdp: "105W",
        integratedGraphics: "AMD Radeon Graphics",
        coolerIncluded: false,
        supportedMemoryTypes: "DDR5-5200",
        maxMemorySupport: "128GB",
        pciExpressVersion: "PCIe 5.0"
      }
    }
  }
];

// Function to seed CPU products
const seedCPUProducts = async () => {
  try {
    // Delete existing CPU products
    await Product.deleteMany({ category: 'CPU' });
    console.log('Existing CPU products deleted');

    // Insert new CPU products
    const result = await Product.insertMany(cpuProducts);
    console.log(`${result.length} CPU products seeded successfully`);
    
    // Log the IDs of the inserted products
    result.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ID: ${product._id}`);
    });

    mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error seeding CPU products:', error);
    mongoose.disconnect();
    process.exit(1);
  }
};

// Run the seeding function
seedCPUProducts();
