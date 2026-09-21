import { ShipmentRecord } from '../types/logistics';

// Helper to generate derived fields
const createShipment = (
  orderId: string,
  customerId: string,
  customerFname: string,
  customerCity: string,
  customerCountry: string,
  customerState: string,
  customerSegment: 'Consumer' | 'Corporate' | 'Home Office' | 'Sports & Fitness' | 'Industrial',
  orderCity: string,
  orderCountry: string,
  orderRegion: string,
  market: 'Pacific Asia' | 'USCA' | 'Africa' | 'Europe' | 'LATAM',
  shippingMode: 'Air' | 'Sea' | 'Road' | 'Rail',
  daysReal: number,
  daysScheduled: number,
  categoryName: string,
  productName: string,
  productPrice: number,
  quantity: number,
  discount: number,
  profitRatio: number,
  rootCause?: string,
  milestone: 'ORDER_PLACED' | 'WAREHOUSE' | 'ORIGIN_PORT' | 'IN_TRANSIT' | 'DESTINATION_PORT' | 'DELIVERED' = 'DELIVERED',
  originHub = 'Origin Port',
  destHub = 'Destination Port',
  carrier = 'Maersk Global'
): ShipmentRecord => {
  const delayGap = Number((daysReal - daysScheduled).toFixed(1));
  let deliveryClassification: 'EARLY' | 'ON SCHEDULE' | 'DELAYED' = 'ON SCHEDULE';
  let deliveryStatus: 'Advance shipping' | 'Late delivery' | 'Shipping on time' | 'Shipping canceled' = 'Shipping on time';
  let lateRisk: 0 | 1 = 0;

  if (delayGap < 0) {
    deliveryClassification = 'EARLY';
    deliveryStatus = 'Advance shipping';
    lateRisk = 0;
  } else if (delayGap === 0) {
    deliveryClassification = 'ON SCHEDULE';
    deliveryStatus = 'Shipping on time';
    lateRisk = 0;
  } else {
    deliveryClassification = 'DELAYED';
    deliveryStatus = 'Late delivery';
    lateRisk = 1;
  }

  const sales = productPrice * quantity;
  const orderItemTotal = sales * (1 - discount);
  const benefitPerOrder = orderItemTotal * profitRatio;

  // Compute risk score (0-100)
  const baseRisk = lateRisk === 1 ? 65 : 15;
  const gapPenalty = Math.min(30, Math.max(0, delayGap * 8));
  const riskScore = Math.min(99, Math.round(baseRisk + gapPenalty + (Math.random() * 8 - 4)));

  return {
    orderId,
    orderCustomerId: `CUST-ID-${customerId}`,
    customerId,
    customerFname,
    customerCity,
    customerCountry,
    customerState,
    customerStreet: 'Central Logistics Way ' + customerId,
    customerZipcode: '100' + customerId.slice(-2),
    customerSegment,
    orderCity,
    orderCountry,
    orderRegion,
    orderState: orderCountry,
    market,
    orderStatus: delayGap > 3 ? 'PROCESSING' : 'COMPLETE',
    orderDate: '2026-09-' + String(Math.floor(Math.random() * 20) + 1).padStart(2, '0'),
    shippingMode,
    daysForShippingReal: daysReal,
    daysForShipmentScheduled: daysScheduled,
    deliveryStatus,
    lateDeliveryRisk: lateRisk,
    latitude: 1.3521 + (Math.random() * 20 - 10),
    longitude: 103.8198 + (Math.random() * 20 - 10),
    originHub,
    destinationHub: destHub,
    carrier,
    categoryId: Math.floor(Math.random() * 10) + 1,
    categoryName,
    departmentId: Math.floor(Math.random() * 5) + 1,
    departmentName: 'Global Operations',
    productName,
    productPrice,
    orderItemQuantity: quantity,
    sales,
    orderItemTotal: Number(orderItemTotal.toFixed(2)),
    orderItemDiscount: discount,
    orderItemDiscountRate: discount * 100,
    orderItemProfitRatio: profitRatio,
    orderProfitPerOrder: Number(benefitPerOrder.toFixed(2)),
    benefitPerOrder: Number(benefitPerOrder.toFixed(2)),
    salesPerCustomer: sales,
    delayGap,
    deliveryClassification,
    riskScore,
    rootCause: lateRisk === 1 ? rootCause || 'Port congestion and berthing delay' : undefined,
    currentMilestone: milestone
  };
};

export const MOCK_SHIPMENTS: ShipmentRecord[] = [
  // Flagship shipments mentioned in prompt
  createShipment('SO-44321', '9041', 'Elena Rostova', 'Hamburg', 'Germany', 'HH', 'Corporate', 'Singapore', 'Singapore', 'Southeast Asia', 'Pacific Asia', 'Sea', 7.2, 4.0, 'Electronics', 'Industrial Optical Sensors', 850, 4, 0.05, 0.28, 'Port congestion at Singapore & Customs clearance backlog', 'DESTINATION_PORT', 'Port of Singapore', 'Port of Hamburg', 'Maersk Line'),
  createShipment('ORD-45821', '8192', 'Marcus Thorne', 'Rotterdam', 'Netherlands', 'ZH', 'Consumer', 'Shanghai', 'China', 'Eastern Asia', 'Pacific Asia', 'Sea', 6.8, 4.0, 'Consumer Tech', 'Lithium Battery Modules', 420, 8, 0.1, 0.22, 'Berth queue delays at Shanghai Port', 'IN_TRANSIT', 'Port of Shanghai', 'Port of Rotterdam', 'COSCO Shipping'),
  createShipment('SO-44103', '7430', 'Sophia Chen', 'San Francisco', 'United States', 'CA', 'Industrial', 'Tokyo', 'Japan', 'Eastern Asia', 'Pacific Asia', 'Air', 2.0, 2.0, 'Medical Devices', 'Diagnostic Telemetry Sensors', 1200, 2, 0.0, 0.35, undefined, 'DELIVERED', 'Tokyo Haneda Air Cargo', 'SFO Logistics Terminal', 'FedEx International'),
  createShipment('ORD-98214', '6211', 'Jean Dupont', 'Le Havre', 'France', 'NOR', 'Corporate', 'Santos', 'Brazil', 'South America', 'LATAM', 'Sea', 8.5, 5.0, 'Automotive Parts', 'Precision Transmission Gears', 640, 6, 0.08, 0.25, 'Customs inspection delays and vessel scheduling conflicts', 'IN_TRANSIT', 'Port of Santos', 'Port of Le Havre', 'CMA CGM'),
  createShipment('SO-31092', '5520', 'Hans Gruber', 'Frankfurt', 'Germany', 'HE', 'Consumer', 'Chicago', 'United States', 'USCA', 'USCA', 'Air', 1.8, 2.0, 'Apparel', 'Thermal Protective Jackets', 180, 12, 0.15, 0.18, undefined, 'DELIVERED', 'O\'Hare Air Cargo', 'Frankfurt Airport Hub', 'Lufthansa Cargo'),

  // Asia -> Europe Trade Corridor (High Delay Risk)
  createShipment('ORD-10023', '1001', 'Alexander Meyer', 'Rotterdam', 'Netherlands', 'ZH', 'Corporate', 'Shenzhen', 'China', 'Eastern Asia', 'Pacific Asia', 'Sea', 7.9, 4.0, 'Electronics', 'Server Rack Power Supplies', 340, 15, 0.05, 0.31, 'Suez Canal traffic choke and port berthing delay', 'IN_TRANSIT', 'Port of Shenzhen', 'Port of Rotterdam', 'Evergreen Marine'),
  createShipment('ORD-10024', '1002', 'Claire Dubois', 'Antwerp', 'Belgium', 'VLG', 'Industrial', 'Busan', 'South Korea', 'Eastern Asia', 'Pacific Asia', 'Sea', 6.5, 4.0, 'Heavy Machinery', 'Hydraulic Pump Assemblies', 920, 3, 0.0, 0.24, 'Port congestion at Antwerp container terminal', 'DESTINATION_PORT', 'Port of Busan', 'Port of Antwerp', 'Hapag-Lloyd'),
  createShipment('ORD-10025', '1003', 'Liam O\'Connor', 'Dublin', 'Ireland', 'LEI', 'Consumer', 'Singapore', 'Singapore', 'Southeast Asia', 'Pacific Asia', 'Air', 3.2, 2.0, 'Consumer Electronics', 'Noise-Canceling Wireless Earbuds', 220, 20, 0.1, 0.38, 'Flight cargo hold reassignment in Dubai transit', 'DESTINATION_PORT', 'Changi Air Cargo', 'Dublin Airport Freight', 'Emirates SkyCargo'),
  createShipment('ORD-10026', '1004', 'Lars Lindqvist', 'Gothenburg', 'Sweden', 'VG', 'Corporate', 'Klang', 'Malaysia', 'Southeast Asia', 'Pacific Asia', 'Sea', 5.0, 4.0, 'Industrial Hardware', 'Titanium Fasteners M12', 150, 40, 0.12, 0.2, 'Feeder vessel delay in Rotterdam transshipment', 'IN_TRANSIT', 'Port Klang', 'Port of Gothenburg', 'Maersk Line'),
  createShipment('ORD-10027', '1005', 'Isabella Romano', 'Genoa', 'Italy', 'LIG', 'Sports & Fitness', 'Bangkok', 'Thailand', 'Southeast Asia', 'Pacific Asia', 'Air', 2.0, 2.0, 'Sports Equipment', 'Carbon Fiber Road Bike Frames', 890, 5, 0.05, 0.3, undefined, 'DELIVERED', 'Suvarnabhumi Cargo', 'Genoa Cargo Terminal', 'DHL Global Forwarding'),
  createShipment('ORD-10028', '1006', 'Matthias Weber', 'Munich', 'Germany', 'BY', 'Corporate', 'Taipei', 'Taiwan', 'Eastern Asia', 'Pacific Asia', 'Air', 4.1, 2.0, 'Semiconductors', 'Microcontroller Evaluation Boards', 1450, 4, 0.0, 0.42, 'Air customs export audit and security re-screening', 'DESTINATION_PORT', 'Taoyuan Air Freight', 'Munich Airport Hub', 'Cathay Cargo'),
  createShipment('ORD-10029', '1007', 'Freja Nielsen', 'Copenhagen', 'Denmark', 'HS', 'Home Office', 'Ho Chi Minh City', 'Vietnam', 'Southeast Asia', 'Pacific Asia', 'Sea', 4.0, 4.0, 'Home Furnishings', 'Ergonomic Mesh Task Chairs', 260, 10, 0.15, 0.19, undefined, 'DELIVERED', 'Cat Lai Terminal', 'Port of Copenhagen', 'ONE Line'),
  createShipment('ORD-10030', '1008', 'Dmitri Volkov', 'Gdansk', 'Poland', 'PM', 'Industrial', 'Ningbo', 'China', 'Eastern Asia', 'Pacific Asia', 'Rail', 9.2, 6.0, 'Industrial Hardware', 'CNC Spindle Units', 1100, 2, 0.05, 0.26, 'Eurasian rail border gauge interchange bottleneck', 'IN_TRANSIT', 'Ningbo Rail Depot', 'Gdansk Intermodal Terminal', 'China-Europe Railway Express'),

  // North America Corridors
  createShipment('ORD-20031', '2001', 'David Miller', 'Los Angeles', 'United States', 'CA', 'Corporate', 'Yokohama', 'Japan', 'Eastern Asia', 'Pacific Asia', 'Sea', 6.7, 4.0, 'Automotive Parts', 'Electric Vehicle Drive Inverters', 1750, 4, 0.0, 0.32, 'Long Beach / LA port drayage truck shortages', 'DESTINATION_PORT', 'Port of Yokohama', 'Port of Los Angeles', 'Ocean Network Express'),
  createShipment('ORD-20032', '2002', 'Sarah Jenkins', 'Seattle', 'United States', 'WA', 'Consumer', 'Shanghai', 'China', 'Eastern Asia', 'Pacific Asia', 'Sea', 4.0, 4.0, 'Consumer Tech', '4K Drone Gimbal Assemblies', 550, 6, 0.08, 0.28, undefined, 'DELIVERED', 'Port of Shanghai', 'Port of Seattle', 'COSCO Shipping'),
  createShipment('ORD-20033', '2003', 'Carlos Ortiz', 'Houston', 'United States', 'TX', 'Industrial', 'Veracruz', 'Mexico', 'Central America', 'LATAM', 'Road', 2.0, 2.0, 'Industrial Hardware', 'High-Pressure Valve Manifolds', 780, 5, 0.05, 0.25, undefined, 'DELIVERED', 'Veracruz Logistics Yard', 'Houston Central Freight Hub', 'Swift Cross-Border'),
  createShipment('ORD-20034', '2004', 'Emily Watson', 'Toronto', 'Canada', 'ON', 'Consumer', 'London', 'United Kingdom', 'Northern Europe', 'Europe', 'Air', 1.8, 2.0, 'Luxury Goods', 'Swiss Automatic Chronographs', 2100, 2, 0.0, 0.45, undefined, 'DELIVERED', 'Heathrow Cargo World', 'Toronto Pearson Freight', 'Air Canada Cargo'),
  createShipment('ORD-20035', '2005', 'Robert Taylor', 'New York', 'United States', 'NY', 'Corporate', 'Rotterdam', 'Netherlands', 'Western Europe', 'Europe', 'Sea', 7.1, 4.0, 'Pharmaceuticals', 'Cold-Chain Reagent Kits', 1350, 8, 0.05, 0.36, 'Newark terminal crane maintenance and container hold', 'DESTINATION_PORT', 'Port of Rotterdam', 'Port of New York & New Jersey', 'Maersk Line'),
  createShipment('ORD-20036', '2006', 'Jessica Alba', 'Miami', 'United States', 'FL', 'Sports & Fitness', 'Cartagena', 'Colombia', 'South America', 'LATAM', 'Sea', 3.8, 3.0, 'Sports Equipment', 'Inflatable Stand-Up Paddleboards', 380, 14, 0.1, 0.22, 'Caribbean weather advisory delay', 'IN_TRANSIT', 'Port of Cartagena', 'PortMiami Terminal', 'Seaboard Marine'),
  createShipment('ORD-20037', '2007', 'Michael Chang', 'Vancouver', 'Canada', 'BC', 'Home Office', 'Shenzhen', 'China', 'Eastern Asia', 'Pacific Asia', 'Sea', 4.0, 4.0, 'Electronics', 'Thunderbolt Docking Hubs', 190, 25, 0.15, 0.25, undefined, 'DELIVERED', 'Port of Shenzhen', 'Port of Vancouver', 'Yang Ming'),

  // Latin America Corridors
  createShipment('ORD-30041', '3001', 'Mateo Fernandez', 'Sao Paulo', 'Brazil', 'SP', 'Corporate', 'Antwerp', 'Belgium', 'Western Europe', 'Europe', 'Sea', 8.2, 5.0, 'Chemicals', 'Specialty Emulsifiers 200L', 650, 12, 0.05, 0.21, 'Santos harbor dredging delays & terminal dwell', 'IN_TRANSIT', 'Port of Antwerp', 'Port of Santos', 'MSC Mediterranean'),
  createShipment('ORD-30042', '3002', 'Camila Rodriguez', 'Buenos Aires', 'Argentina', 'CABA', 'Industrial', 'Hamburg', 'Germany', 'Western Europe', 'Europe', 'Sea', 9.1, 5.0, 'Agricultural Tech', 'Grain Silo Moisture Sensor Units', 840, 4, 0.1, 0.24, 'Customs clearance audit at Buenos Aires terminal', 'DESTINATION_PORT', 'Port of Hamburg', 'Port of Buenos Aires', 'Hapag-Lloyd'),
  createShipment('ORD-30043', '3003', 'Gabriel Silva', 'Bogota', 'Colombia', 'DC', 'Consumer', 'Miami', 'United States', 'USCA', 'USCA', 'Air', 1.0, 1.0, 'Perishables', 'Fresh Cut Export Florals', 95, 50, 0.0, 0.18, undefined, 'DELIVERED', 'El Dorado Cargo Hub', 'Miami Cargo International', 'Avianca Cargo'),
  createShipment('ORD-30044', '3004', 'Valeria Ramos', 'Santiago', 'Chile', 'RM', 'Industrial', 'Callao', 'Peru', 'South America', 'LATAM', 'Road', 4.8, 3.0, 'Mining Equipment', 'Pneumatic Drill Replacement Bits', 1600, 3, 0.05, 0.29, 'Andean mountain pass winter road closure', 'IN_TRANSIT', 'Lima Logistics Center', 'Santiago Intermodal Terminal', 'Andes Freightways'),
  createShipment('ORD-30045', '3005', 'Santiago Gomez', 'Mexico City', 'Mexico', 'CDMX', 'Corporate', 'Tokyo', 'Japan', 'Eastern Asia', 'Pacific Asia', 'Air', 2.0, 2.0, 'Electronics', 'SMD Placement Nozzle Kits', 450, 8, 0.0, 0.35, undefined, 'DELIVERED', 'Narita Cargo Terminal', 'AICM Cargo Terminal', 'ANA Cargo'),

  // Africa & Middle East Corridors
  createShipment('ORD-40051', '4001', 'Kwame Mensah', 'Tema', 'Ghana', 'AA', 'Corporate', 'Rotterdam', 'Netherlands', 'Western Europe', 'Europe', 'Sea', 9.8, 5.0, 'Industrial', 'Raw Bauxite Processing Components', 520, 10, 0.05, 0.19, 'Tema port berthing delays and customs platform outage', 'DESTINATION_PORT', 'Port of Rotterdam', 'Port of Tema', 'Maersk West Africa'),
  createShipment('ORD-40052', '4002', 'Amina Al-Mansoor', 'Dubai', 'United Arab Emirates', 'DU', 'Corporate', 'Singapore', 'Singapore', 'Southeast Asia', 'Pacific Asia', 'Air', 1.5, 2.0, 'Luxury Goods', 'Aviation Avionics Spare Modules', 3200, 2, 0.0, 0.48, undefined, 'DELIVERED', 'Changi Air Cargo', 'Dubai South Hub', 'Emirates SkyCargo'),
  createShipment('ORD-40053', '4003', 'Tariq Hassan', 'Jeddah', 'Saudi Arabia', 'Makkah', 'Consumer', 'Mumbai', 'India', 'South Asia', 'Pacific Asia', 'Sea', 5.5, 3.0, 'Textiles', 'Organic Cotton Yarn Spools', 110, 60, 0.15, 0.15, 'Red Sea commercial vessel rerouting delay', 'IN_TRANSIT', 'Nhava Sheva Terminal', 'Jeddah Islamic Port', 'Bahri Logistics'),
  createShipment('ORD-40054', '4004', 'Nia Okafor', 'Lagos', 'Nigeria', 'LA', 'Industrial', 'Antwerp', 'Belgium', 'Western Europe', 'Europe', 'Sea', 11.2, 5.0, 'Infrastructure', 'Generator Transformer Spares', 1950, 2, 0.0, 0.22, 'Apapa Port truck congestion and extended customs clearance', 'DESTINATION_PORT', 'Port of Antwerp', 'Lagos Port Complex', 'CMA CGM Africa'),
  createShipment('ORD-40055', '4005', 'Zaid Al-Fassi', 'Casablanca', 'Morocco', 'CAS', 'Consumer', 'Valencia', 'Spain', 'Southern Europe', 'Europe', 'Road', 1.8, 2.0, 'Apparel', 'Fast-Fashion Tailored Blousons', 85, 45, 0.1, 0.25, undefined, 'DELIVERED', 'Valencia Logistics Hub', 'Casablanca Port Terminal', 'Baleària Intermodal'),

  // Europe Internal & Cross-Border
  createShipment('ORD-50061', '5001', 'Christian Becker', 'Berlin', 'Germany', 'BE', 'Corporate', 'Milan', 'Italy', 'Southern Europe', 'Europe', 'Road', 2.0, 2.0, 'Industrial Hardware', 'Industrial Servo Motors', 740, 6, 0.05, 0.28, undefined, 'DELIVERED', 'Milan Segrate DC', 'Berlin Spandau Hub', 'DB Schenker'),
  createShipment('ORD-50062', '5002', 'Astrid Lind', 'Stockholm', 'Sweden', 'AB', 'Consumer', 'Frankfurt', 'Germany', 'Western Europe', 'Europe', 'Rail', 3.0, 3.0, 'Sports & Fitness', 'Nordic Cross-Country Ski Sets', 320, 10, 0.1, 0.22, undefined, 'DELIVERED', 'Frankfurt Rail Cargo', 'Stockholm Intermodal Depot', 'Green Cargo'),
  createShipment('ORD-50063', '5003', 'Pierre Laurent', 'Marseille', 'France', 'PAC', 'Industrial', 'Barcelona', 'Spain', 'Southern Europe', 'Europe', 'Road', 4.2, 1.0, 'Chemicals', 'Catalytic Wash Solutions', 490, 8, 0.0, 0.2, 'Border toll system strike & transport delays', 'DESTINATION_PORT', 'Barcelona Intermodal', 'Marseille Fos Logistics', 'Geodis'),
  createShipment('ORD-50064', '5004', 'Monika Horvat', 'Vienna', 'Austria', 'W', 'Home Office', 'Bratislava', 'Slovakia', 'Eastern Europe', 'Europe', 'Road', 1.0, 1.0, 'Home Office', 'Acoustic Desk Partition Panels', 140, 15, 0.12, 0.26, undefined, 'DELIVERED', 'Bratislava Logistics Park', 'Vienna Airport City DC', 'Kuehne+Nagel'),
  createShipment('ORD-50065', '5005', 'Lukas Novak', 'Prague', 'Czech Republic', 'PR', 'Corporate', 'Hamburg', 'Germany', 'Western Europe', 'Europe', 'Rail', 2.0, 2.0, 'Automotive Parts', 'Disc Brake Assemblies', 390, 16, 0.08, 0.24, undefined, 'DELIVERED', 'Hamburg Billwerder Depot', 'Prague Uhrineves Rail Terminal', 'Metrans Rail'),

  // Oceania
  createShipment('ORD-60071', '6001', 'Oliver Smith', 'Sydney', 'Australia', 'NSW', 'Consumer', 'Singapore', 'Singapore', 'Southeast Asia', 'Pacific Asia', 'Air', 2.1, 2.0, 'Electronics', 'Laser Projector Modules', 780, 3, 0.05, 0.32, undefined, 'DELIVERED', 'Changi Air Cargo', 'Sydney Kingsford Freight', 'Qantas Freight'),
  createShipment('ORD-60072', '6002', 'Mia Wilson', 'Melbourne', 'Australia', 'VIC', 'Corporate', 'Yokohama', 'Japan', 'Eastern Asia', 'Pacific Asia', 'Sea', 6.9, 4.0, 'Industrial Hardware', 'Robotic Arm End-Effectors', 1420, 2, 0.0, 0.3, 'Melbourne waterfront terminal industrial action', 'IN_TRANSIT', 'Port of Yokohama', 'Port of Melbourne', 'ANL Container Line'),
  createShipment('ORD-60073', '6003', 'Jack Taylor', 'Auckland', 'New Zealand', 'AUK', 'Consumer', 'Los Angeles', 'United States', 'USCA', 'USCA', 'Sea', 7.5, 5.0, 'Sports & Fitness', 'All-Weather Sailing Salopettes', 290, 8, 0.1, 0.27, 'South Pacific storm deviation', 'DESTINATION_PORT', 'Port of Long Beach', 'Ports of Auckland', 'Pacifica Shipping'),

  // Additional 80 shipments generated with balanced distributions across all parameters
  ...Array.from({ length: 85 }).map((_, idx) => {
    const id = 101 + idx;
    const modes: ('Air' | 'Sea' | 'Road' | 'Rail')[] = ['Sea', 'Sea', 'Air', 'Road', 'Rail'];
    const mode = modes[idx % modes.length];
    
    const markets: ('Pacific Asia' | 'USCA' | 'Africa' | 'Europe' | 'LATAM')[] = ['Pacific Asia', 'Europe', 'USCA', 'LATAM', 'Africa'];
    const market = markets[idx % markets.length];

    const regions: Record<string, string[]> = {
      'Pacific Asia': ['Southeast Asia', 'Eastern Asia', 'South Asia', 'Oceania'],
      'Europe': ['Western Europe', 'Northern Europe', 'Southern Europe', 'Eastern Europe'],
      'USCA': ['USCA'],
      'LATAM': ['South America', 'Central America', 'Caribbean'],
      'Africa': ['North Africa', 'Sub-Saharan Africa', 'Middle East']
    };
    const regionList = regions[market];
    const region = regionList[idx % regionList.length];

    const scheduled = mode === 'Air' ? 2 : mode === 'Road' ? 2 : mode === 'Rail' ? 3 : 4;
    
    // 55% normal/on-time, 45% delayed
    const isDelayed = idx % 2 === 0;
    const delayAdd = isDelayed ? Number((1.2 + (idx % 6) * 0.8).toFixed(1)) : (idx % 3 === 0 ? -1 : 0);
    const real = Math.max(1, scheduled + delayAdd);

    const products = [
      { cat: 'Electronics', name: 'Micro-Inverter 1200W', price: 420 },
      { cat: 'Apparel', name: 'Technical Shell Jacket', price: 195 },
      { cat: 'Industrial', name: 'Pneumatic Actuator Gen4', price: 680 },
      { cat: 'Automotive', name: 'Ceramic Brake Rotor Set', price: 540 },
      { cat: 'Consumer Tech', name: 'Smart Video Conference Bar', price: 310 },
      { cat: 'Sports & Fitness', name: 'Hydration Vest Pro 15L', price: 130 },
      { cat: 'Heavy Machinery', name: 'Linear Ball Bushing Cartridge', price: 890 }
    ];
    const prod = products[idx % products.length];

    const segments: ('Consumer' | 'Corporate' | 'Home Office' | 'Sports & Fitness' | 'Industrial')[] = [
      'Consumer', 'Corporate', 'Home Office', 'Sports & Fitness', 'Industrial'
    ];
    const segment = segments[idx % segments.length];

    const rootCauses = [
      'Port congestion at transshipment terminal',
      'Customs documentation clearance backlog',
      'Intermodal carrier shortage and chassis deficit',
      'Severe weather storm deviation',
      'Warehouse cross-dock sorting bottleneck',
      'Bespoke safety compliance inspection hold'
    ];
    const rootCause = isDelayed ? rootCauses[idx % rootCauses.length] : undefined;

    const milestones: ('ORDER_PLACED' | 'WAREHOUSE' | 'ORIGIN_PORT' | 'IN_TRANSIT' | 'DESTINATION_PORT' | 'DELIVERED')[] = [
      'ORDER_PLACED', 'WAREHOUSE', 'ORIGIN_PORT', 'IN_TRANSIT', 'DESTINATION_PORT', 'DELIVERED'
    ];
    const milestone = isDelayed ? milestones[(idx % 3) + 2] : 'DELIVERED';

    return createShipment(
      `ORD-${50000 + id}`,
      `${7000 + id}`,
      `Operator ${id}`,
      `PortCity-${idx % 12}`,
      market === 'Europe' ? 'Germany' : market === 'Pacific Asia' ? 'Singapore' : market === 'USCA' ? 'United States' : market === 'LATAM' ? 'Brazil' : 'UAE',
      'REG',
      segment,
      `Origin-${idx % 8}`,
      market === 'Pacific Asia' ? 'China' : 'Netherlands',
      region,
      market,
      mode,
      real,
      scheduled,
      prod.cat,
      prod.name,
      prod.price,
      Math.floor(Math.random() * 8) + 1,
      0.05,
      0.22,
      rootCause,
      milestone,
      'Global Dispatch Hub ' + (idx % 5),
      'Regional Receiver Terminal ' + (idx % 6),
      idx % 2 === 0 ? 'Maersk Logistics' : 'DHL Global Cargo'
    );
  })
];
