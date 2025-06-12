import mongoose from 'mongoose';

// Standardized specifications schema for all product types
const specsSchema = new mongoose.Schema({
  // Common specifications
  brand: { type: String },
  model: { type: String },
  releaseYear: { type: Number },
  warranty: { type: String },
  dimensions: { type: String },
  weight: { type: String },
  powerConsumption: { type: String },
  
  // CPU specifications
  cores: { type: Number },
  threads: { type: Number },
  baseClockSpeed: { type: String },
  boostClockSpeed: { type: String },
  cache: { type: String },
  socket: { type: String },
  architecture: { type: String },
  lithography: { type: String },
  tdp: { type: String },
  integratedGraphics: { type: String },
  coolerIncluded: { type: Boolean },
  supportedMemoryTypes: { type: String },
  maxMemorySupport: { type: String },
  
  // GPU specifications
  chipset: { type: String },
  memorySize: { type: String },
  memoryType: { type: String },
  memoryBus: { type: String },
  coreClock: { type: String },
  boostClock: { type: String },
  cudaCores: { type: Number },
  streamProcessors: { type: Number },
  rtCores: { type: String },
  tensorCores: { type: String },
  directX: { type: String },
  openGL: { type: String },
  maxResolution: { type: String },
  displayPorts: { type: Number },
  hdmiPorts: { type: Number },
  dviPorts: { type: Number },
  vgaPorts: { type: Number },
  powerConnectors: { type: String },
  recommendedPSU: { type: String },
  length: { type: String },
  cooling: { type: String },
  backlighting: { type: String },
  
  // RAM specifications
  capacity: { type: String },
  type: { type: String },
  speed: { type: String },
  modules: { type: Number },
  casLatency: { type: String },
  voltage: { type: String },
  heatSpreader: { type: Boolean },
  rgb: { type: Boolean },
  timing: { type: String },
  profile: { type: String },
  
  // Storage specifications
  formFactor: { type: String },
  interface: { type: String },
  readSpeed: { type: String },
  writeSpeed: { type: String },
  tbw: { type: String },
  mtbf: { type: String },
  nandType: { type: String },
  controller: { type: String },
  
  // Motherboard specifications
  formFactor: { type: String },
  memorySlots: { type: Number },
  maxMemory: { type: String },
  pciExpressSlots: { type: String },
  pciExpressVersion: { type: String },
  m2Slots: { type: Number },
  sataConnectors: { type: Number },
  raidSupport: { type: String },
  wirelessNetworking: { type: String },
  bluetooth: { type: String },
  lanSpeed: { type: String },
  audioChipset: { type: String },
  usbPorts: { type: String },
  rgbHeaders: { type: String },
  fanHeaders: { type: Number },
  bios: { type: String },
  
  // Cooling specifications
  radiatorSize: { type: String },
  fanSize: { type: String },
  fanCount: { type: Number },
  airflow: { type: String },
  noiseLevel: { type: String },
  compatibleSockets: { type: String },
  maxTDP: { type: String },
  fanSpeed: { type: String },
  pumpSpeed: { type: String },
  
  // Legacy support for nested specs (to be migrated)
  cpu: { type: mongoose.Schema.Types.Mixed },
  gpu: { type: mongoose.Schema.Types.Mixed },
  ram: { type: mongoose.Schema.Types.Mixed },
  storage: { type: mongoose.Schema.Types.Mixed },
  motherboard: { type: mongoose.Schema.Types.Mixed },
  cooling: { type: mongoose.Schema.Types.Mixed },
}, { _id: false, strict: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  oldPrice: { type: Number }, // For discounts/sales
  images: { type: [String] }, // Array of image URLs
  category: { type: String, required: true },
  subcategory: { type: String },
  stock: { type: Number, default: 0 },
  brand: { type: String },
  sku: { type: String },
  rating: { type: Number, default: 0 },
  reviews: [{
    name: { type: String },
    rating: { type: Number },
    comment: { type: String },
    date: { type: Date, default: Date.now }
  }],
  features: { type: [String] }, // Array of feature highlights
  specs: specsSchema, // Flattened specs schema
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);
