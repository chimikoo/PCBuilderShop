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

// GPU product data
const gpuProducts = [
  {
    name: "NVIDIA GeForce RTX 4090",
    description: "The NVIDIA GeForce RTX 4090 is the ultimate GeForce GPU, delivering revolutionary performance for gamers and creators with 16,384 CUDA cores and 24GB of high-speed Lovelace architecture-based GDDR6X memory.",
    price: 1599.99,
    oldPrice: 1699.99,
    images: [
      "https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ada/rtx-4090/geforce-ada-4090-product-gallery-full-screen-3840-1.jpg",
      "https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ada/rtx-4090/geforce-ada-4090-product-gallery-full-screen-3840-2.jpg",
      "https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ada/rtx-4090/geforce-ada-4090-product-gallery-full-screen-3840-3.jpg"
    ],
    category: "GPU",
    brand: "NVIDIA",
    stock: 15,
    sku: "GPU-RTX4090-FE",
    rating: 4.9,
    reviews: [
      {
        name: "John D.",
        rating: 5,
        comment: "The RTX 4090 is an absolute beast. Gaming at 4K with max settings and still getting 100+ FPS is incredible.",
        date: new Date("2023-01-15")
      },
      {
        name: "Sarah M.",
        rating: 5,
        comment: "Worth every penny for content creation. Renders that used to take hours now take minutes.",
        date: new Date("2023-02-20")
      },
      {
        name: "Mike T.",
        rating: 4,
        comment: "Amazing performance but runs hot. Make sure you have good case airflow.",
        date: new Date("2023-03-10")
      }
    ],
    features: [
      "NVIDIA Ada Lovelace Streaming Multiprocessors",
      "4th Generation Tensor Cores",
      "3rd Generation RT Cores",
      "24GB GDDR6X memory",
      "DLSS 3 support"
    ],
    specs: {
      common: {
        warranty: "3 years limited",
        releaseDate: "2022-10-12"
      },
      gpu: {
        chipset: "NVIDIA GeForce RTX 4090",
        memorySize: "24GB",
        memoryType: "GDDR6X",
        memoryBus: "384-bit",
        coreClock: "2.23 GHz",
        boostClock: "2.52 GHz",
        cudaCores: 16384,
        rtCores: 128,
        tensorCores: 512,
        architecture: "Ada Lovelace",
        pciExpressInterface: "PCIe 4.0 x16",
        length: "304mm",
        displayPorts: 3,
        hdmiPorts: 1,
        powerConnectors: "16-pin",
        recommendedPSU: "850W"
      }
    }
  },
  {
    name: "ASUS ROG Strix GeForce RTX 4080 OC",
    description: "The ASUS ROG Strix GeForce RTX 4080 OC Edition delivers next-gen performance with advanced cooling and premium build quality for enthusiast gamers and content creators.",
    price: 1249.99,
    oldPrice: 1349.99,
    images: [
      "https://dlcdnwebimgs.asus.com/gain/47A914A7-FD98-40E7-A14F-31C63F2D1D2C/w1000/h732",
      "https://dlcdnwebimgs.asus.com/gain/E5E7A7BB-3B40-4F56-B2F9-75C55CDC2E5B/w1000/h732",
      "https://dlcdnwebimgs.asus.com/gain/C5F04B2E-9F8C-4BDC-B954-97FE39C4C3C9/w1000/h732"
    ],
    category: "GPU",
    brand: "ASUS",
    stock: 22,
    sku: "GPU-RTX4080-ASUS-ROG",
    rating: 4.8,
    reviews: [
      {
        name: "Alex P.",
        rating: 5,
        comment: "The ROG Strix cooling is phenomenal. Card stays cool even under heavy load.",
        date: new Date("2023-01-25")
      },
      {
        name: "Chris L.",
        rating: 5,
        comment: "Build quality is top notch. The RGB lighting looks amazing in my case.",
        date: new Date("2023-02-14")
      },
      {
        name: "Emma R.",
        rating: 4,
        comment: "Great card but it's massive. Make sure your case has enough space.",
        date: new Date("2023-03-05")
      }
    ],
    features: [
      "ASUS Axial-tech fans with full-height barrier rings",
      "3.5-slot design maximizes cooling performance",
      "Military-grade capacitors rated for 20K hours at 105°C",
      "Auto-Extreme Technology manufacturing",
      "GPU Tweak III software for intuitive performance tuning"
    ],
    specs: {
      common: {
        warranty: "3 years limited",
        releaseDate: "2022-11-16"
      },
      gpu: {
        chipset: "NVIDIA GeForce RTX 4080",
        memorySize: "16GB",
        memoryType: "GDDR6X",
        memoryBus: "256-bit",
        coreClock: "2.21 GHz",
        boostClock: "2.61 GHz",
        cudaCores: 9728,
        rtCores: 76,
        tensorCores: 304,
        architecture: "Ada Lovelace",
        pciExpressInterface: "PCIe 4.0 x16",
        length: "358mm",
        displayPorts: 3,
        hdmiPorts: 2,
        powerConnectors: "16-pin",
        recommendedPSU: "750W"
      }
    }
  },
  {
    name: "MSI Gaming GeForce RTX 4070 Ti",
    description: "The MSI Gaming GeForce RTX 4070 Ti delivers exceptional performance with MSI's renowned cooling solution and premium build quality for high-end gaming and content creation.",
    price: 799.99,
    images: [
      "https://m.media-amazon.com/images/I/81J5nVZ1qoL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/81dR+ybUVwL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/81Qu4vXEgFL._AC_SL1500_.jpg"
    ],
    category: "GPU",
    brand: "MSI",
    stock: 30,
    sku: "GPU-RTX4070TI-MSI",
    rating: 4.7,
    reviews: [
      {
        name: "David K.",
        rating: 5,
        comment: "Perfect balance of price and performance. Handles 1440p gaming with ease.",
        date: new Date("2023-04-12")
      },
      {
        name: "Lisa J.",
        rating: 4,
        comment: "MSI's cooling solution works well, but the card is a bit loud under load.",
        date: new Date("2023-05-03")
      },
      {
        name: "Robert N.",
        rating: 5,
        comment: "Great value compared to the higher-end cards. Still plenty powerful.",
        date: new Date("2023-05-22")
      }
    ],
    features: [
      "TORX Fan 5.0: Maximized air pressure and airflow",
      "Core Pipe: Precision-machined heat pipes ensure optimal contact",
      "Airflow Control: Deflectors direct air to heat pipes",
      "Reinforced metal anti-bending strip",
      "Zero Frozr technology stops fans in low-load situations"
    ],
    specs: {
      common: {
        warranty: "3 years limited",
        releaseDate: "2023-01-05"
      },
      gpu: {
        chipset: "NVIDIA GeForce RTX 4070 Ti",
        memorySize: "12GB",
        memoryType: "GDDR6X",
        memoryBus: "192-bit",
        coreClock: "2.31 GHz",
        boostClock: "2.61 GHz",
        cudaCores: 7680,
        rtCores: 60,
        tensorCores: 240,
        architecture: "Ada Lovelace",
        pciExpressInterface: "PCIe 4.0 x16",
        length: "337mm",
        displayPorts: 3,
        hdmiPorts: 1,
        powerConnectors: "16-pin",
        recommendedPSU: "700W"
      }
    }
  },
  {
    name: "Gigabyte AORUS GeForce RTX 4060 Ti Elite",
    description: "The Gigabyte AORUS GeForce RTX 4060 Ti Elite offers excellent 1440p gaming performance with advanced cooling and RGB lighting in a compact design.",
    price: 449.99,
    images: [
      "https://m.media-amazon.com/images/I/71p-uTSUYwL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71Vg8QHEbkL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71KJdYBRLlL._AC_SL1500_.jpg"
    ],
    category: "GPU",
    brand: "Gigabyte",
    stock: 45,
    sku: "GPU-RTX4060TI-AORUS",
    rating: 4.6,
    reviews: [
      {
        name: "Thomas W.",
        rating: 5,
        comment: "Perfect for my compact build. Runs cool and quiet even in a small case.",
        date: new Date("2023-06-15")
      },
      {
        name: "Jennifer P.",
        rating: 4,
        comment: "Good 1440p performance at a reasonable price point.",
        date: new Date("2023-07-08")
      },
      {
        name: "Kevin M.",
        rating: 5,
        comment: "The RGB lighting is customizable and looks fantastic.",
        date: new Date("2023-07-29")
      }
    ],
    features: [
      "WINDFORCE cooling system with alternate spinning fans",
      "RGB Fusion 2.0 with 16.7 million customizable color options",
      "Graphene nano lubricant for longer fan life",
      "Ultra-durable materials with anti-sag bracket",
      "Compact design ideal for smaller cases"
    ],
    specs: {
      common: {
        warranty: "4 years limited",
        releaseDate: "2023-05-24"
      },
      gpu: {
        chipset: "NVIDIA GeForce RTX 4060 Ti",
        memorySize: "8GB",
        memoryType: "GDDR6",
        memoryBus: "128-bit",
        coreClock: "2.31 GHz",
        boostClock: "2.54 GHz",
        cudaCores: 4352,
        rtCores: 34,
        tensorCores: 136,
        architecture: "Ada Lovelace",
        pciExpressInterface: "PCIe 4.0 x8",
        length: "282mm",
        displayPorts: 3,
        hdmiPorts: 1,
        powerConnectors: "8-pin",
        recommendedPSU: "550W"
      }
    }
  },
  {
    name: "AMD Radeon RX 7900 XTX",
    description: "The AMD Radeon RX 7900 XTX delivers exceptional performance for 4K gaming and content creation with AMD's RDNA 3 architecture and 24GB of high-speed memory.",
    price: 999.99,
    oldPrice: 1099.99,
    images: [
      "https://m.media-amazon.com/images/I/81U5H5c0jyL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/81Zx7Bh5ULL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/81KVc2X0UBL._AC_SL1500_.jpg"
    ],
    category: "GPU",
    brand: "AMD",
    stock: 18,
    sku: "GPU-RX7900XTX-AMD",
    rating: 4.7,
    reviews: [
      {
        name: "Brian T.",
        rating: 5,
        comment: "AMD really delivered with this card. Performance is comparable to NVIDIA's best.",
        date: new Date("2023-01-30")
      },
      {
        name: "Michelle S.",
        rating: 4,
        comment: "Great for gaming but driver support could be better for some applications.",
        date: new Date("2023-02-28")
      },
      {
        name: "Daniel R.",
        rating: 5,
        comment: "The 24GB of VRAM is amazing for 3D rendering and AI workloads.",
        date: new Date("2023-03-25")
      }
    ],
    features: [
      "AMD RDNA 3 architecture",
      "24GB GDDR6 memory",
      "DisplayPort 2.1 support",
      "AMD Infinity Cache",
      "AV1 encode/decode support"
    ],
    specs: {
      common: {
        warranty: "2 years limited",
        releaseDate: "2022-12-13"
      },
      gpu: {
        chipset: "AMD Radeon RX 7900 XTX",
        memorySize: "24GB",
        memoryType: "GDDR6",
        memoryBus: "384-bit",
        coreClock: "1.9 GHz",
        boostClock: "2.5 GHz",
        streamProcessors: 12288,
        architecture: "RDNA 3",
        pciExpressInterface: "PCIe 4.0 x16",
        length: "287mm",
        displayPorts: 2,
        hdmiPorts: 2,
        powerConnectors: "2x 8-pin",
        recommendedPSU: "800W"
      }
    }
  }
];

// Function to seed GPU products
const seedGPUProducts = async () => {
  try {
    // Delete existing GPU products
    await Product.deleteMany({ category: 'GPU' });
    console.log('Existing GPU products deleted');

    // Insert new GPU products
    const result = await Product.insertMany(gpuProducts);
    console.log(`${result.length} GPU products seeded successfully`);
    
    // Log the IDs of the inserted products
    result.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ID: ${product._id}`);
    });

    mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error seeding GPU products:', error);
    mongoose.disconnect();
    process.exit(1);
  }
};

// Run the seeding function
seedGPUProducts();
