export interface CarPart {
  id: string
  name: string
  description: string
  icon: string
  position: { top: string; left: string }
  condition?: string
  price?: number
}

export const getCarParts = (category: string): CarPart[] => {
  const commonParts: CarPart[] = [
    {
      id: 'engine',
      name: 'Engine',
      description: 'High-performance powertrain',
      icon: 'mdi-engine',
      position: { top: '45%', left: '25%' },
      condition: 'Excellent'
    },
    {
      id: 'transmission',
      name: 'Transmission',
      description: 'Precision gearbox system',
      icon: 'mdi-car-shift-pattern',
      position: { top: '45%', left: '75%' },
      condition: 'Like New'
    },
    {
      id: 'wheels',
      name: 'Wheels',
      description: 'Premium alloy wheels',
      icon: 'mdi-car-wheel',
      position: { top: '75%', left: '20%' },
      condition: 'Perfect'
    },
    {
      id: 'interior',
      name: 'Interior',
      description: 'Luxury cabin materials',
      icon: 'mdi-seat',
      position: { top: '30%', left: '50%' },
      condition: 'Immaculate'
    },
    {
      id: 'headlights',
      name: 'Lighting',
      description: 'LED lighting system',
      icon: 'mdi-car-light-high',
      position: { top: '35%', left: '15%' },
      condition: 'New'
    },
    {
      id: 'brakes',
      name: 'Brakes',
      description: 'Performance braking system',
      icon: 'mdi-car-brake-alert',
      position: { top: '60%', left: '80%' },
      condition: 'Excellent'
    }
  ]

  const categorySpecific: Record<string, CarPart[]> = {
    electric: [
      {
        id: 'battery',
        name: 'Battery Pack',
        description: 'High-capacity lithium-ion battery',
        icon: 'mdi-battery-charging-high',
        position: { top: '55%', left: '50%' },
        condition: '95% Health'
      },
      {
        id: 'motor',
        name: 'Electric Motor',
        description: 'Dual motor all-wheel drive',
        icon: 'mdi-lightning-bolt',
        position: { top: '40%', left: '30%' },
        condition: 'Perfect'
      }
    ],
    sports: [
      {
        id: 'exhaust',
        name: 'Exhaust',
        description: 'Performance exhaust system',
        icon: 'mdi-muffler',
        position: { top: '70%', left: '50%' },
        condition: 'Sport Tuned'
      },
      {
        id: 'suspension',
        name: 'Suspension',
        description: 'Adaptive sport suspension',
        icon: 'mdi-shock-absorber',
        position: { top: '65%', left: '35%' },
        condition: 'Track Ready'
      }
    ],
    truck: [
      {
        id: 'bed',
        name: 'Truck Bed',
        description: 'Heavy-duty cargo area',
        icon: 'mdi-truck-cargo-container',
        position: { top: '50%', left: '70%' },
        condition: 'Bed Liner'
      },
      {
        id: 'tow',
        name: 'Tow Package',
        description: 'Heavy-duty towing capacity',
        icon: 'mdi-truck-trailer',
        position: { top: '60%', left: '85%' },
        condition: 'Equipped'
      }
    ],
    luxury: [
      {
        id: 'sound',
        name: 'Audio System',
        description: 'Premium surround sound',
        icon: 'mdi-speaker',
        position: { top: '40%', left: '60%' },
        condition: 'Bespoke Audio'
      },
      {
        id: 'climate',
        name: 'Climate Control',
        description: '4-zone climate system',
        icon: 'mdi-thermometer',
        position: { top: '35%', left: '40%' },
        condition: 'Perfect'
      }
    ]
  }

  return [...commonParts, ...(categorySpecific[category?.toLowerCase()] || [])]
}