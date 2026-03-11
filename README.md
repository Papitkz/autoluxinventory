# AutoLux - Car Inventory Shopify-like Application

A full-featured car inventory management system built with Vue 3, Vuetify 3, Tailwind CSS, and Firebase.

![AutoLux Preview](https://via.placeholder.com/800x400?text=AutoLux+Preview)

## Features

### User Features
- Browse car inventory with advanced filtering
- View detailed car information
- Add cars to cart/reservation list
- User authentication (Email/Password & Google)
- User dashboard with order history
- Reserve or purchase vehicles

### Admin Features
- Admin dashboard with statistics
- Add, edit, and delete cars
- Manage orders and reservations
- Update order status
- View all customer orders

### Technical Features
- Vue 3 with Composition API
- Vuetify 3 for UI components
- Tailwind CSS for styling
- Firebase Authentication
- Firebase Firestore database
- Pinia state management
- Vue Router for navigation
- Responsive design

## Project Structure

```
car-inventory-shopify/
├── public/                  # Static assets
├── src/
│   ├── assets/             # CSS and images
│   ├── components/         # Reusable components
│   │   ├── Navbar.vue
│   │   ├── Footer.vue
│   │   ├── CarCard.vue
│   │   └── CarListItem.vue
│   ├── firebase/           # Firebase configuration
│   │   └── config.ts
│   ├── plugins/            # Vue plugins
│   │   └── vuetify.ts
│   ├── router/             # Vue Router
│   │   └── index.ts
│   ├── stores/             # Pinia stores
│   │   ├── auth.ts
│   │   ├── cars.ts
│   │   ├── cart.ts
│   │   └── orders.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── views/              # Page components
│   │   ├── HomeView.vue
│   │   ├── CarsView.vue
│   │   ├── CarDetailsView.vue
│   │   ├── LoginView.vue
│   │   ├── RegisterView.vue
│   │   ├── CartView.vue
│   │   ├── DashboardView.vue
│   │   ├── AdminView.vue
│   │   ├── AdminCarsView.vue
│   │   ├── AdminOrdersView.vue
│   │   └── NotFoundView.vue
│   ├── App.vue
│   └── main.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## Step-by-Step Setup Guide

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "autolux-cars")
4. Disable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication

1. In Firebase Console, click "Authentication" in the left sidebar
2. Click "Get started"
3. Enable "Email/Password" provider:
   - Toggle to "Enabled"
   - Click "Save"
4. Enable "Google" provider:
   - Click "Google"
   - Toggle to "Enabled"
   - Add support email
   - Click "Save"

### Step 3: Create Firestore Database

1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Select "Start in test mode" (for development)
4. Click "Next"
5. Select your region (e.g., "us-central")
6. Click "Enable"

### Step 4: Get Firebase Configuration

1. Click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register app with nickname (e.g., "autolux-web")
6. Copy the firebaseConfig object

### Step 5: Update Firebase Config

Open `src/firebase/config.ts` and replace with your config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
}
```

### Step 6: Install Dependencies

```bash
npm install
```

### Step 7: Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Step 8: Create First Admin User

1. Register a new user at `/register`
2. In Firebase Console, go to "Firestore Database"
3. Find the "users" collection
4. Click on your user document
5. Change the "role" field from "user" to "admin"

## Firestore Database Structure

### Collections:

#### users
```
{
  uid: string,
  email: string,
  displayName: string,
  photoURL?: string,
  role: 'user' | 'admin',
  phone?: string,
  address?: string,
  createdAt: timestamp
}
```

#### cars
```
{
  id: string,
  brand: string,
  model: string,
  year: number,
  price: number,
  originalPrice?: number,
  mileage: number,
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid',
  transmission: 'automatic' | 'manual',
  color: string,
  images: string[],
  description: string,
  features: string[],
  status: 'available' | 'reserved' | 'sold',
  category: 'sedan' | 'suv' | 'truck' | 'sports' | 'luxury' | 'electric',
  engine?: string,
  horsepower?: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### orders
```
{
  id: string,
  userId: string,
  items: [
    {
      car: {
        id: string,
        brand: string,
        model: string,
        year: number,
        price: number,
        images: string[],
        color: string
      },
      quantity: number,
      reservationDate: timestamp,
      notes?: string
    }
  ],
  totalAmount: number,
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled',
  type: 'purchase' | 'reservation',
  customerInfo: {
    name: string,
    email: string,
    phone: string,
    address: string
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Home page | Public |
| `/cars` | Car inventory | Public |
| `/cars/:id` | Car details | Public |
| `/login` | Login page | Guest only |
| `/register` | Register page | Guest only |
| `/cart` | Shopping cart | Authenticated |
| `/dashboard` | User dashboard | Authenticated |
| `/admin` | Admin dashboard | Admin only |
| `/admin/cars` | Manage cars | Admin only |
| `/admin/orders` | Manage orders | Admin only |

## Key Features Explained

### Authentication System
- Email/Password authentication
- Google OAuth integration
- Role-based access control (User/Admin)
- Persistent login state

### Car Inventory
- Advanced filtering (brand, category, price, year, fuel type, transmission)
- Grid and list view options
- Sort by various criteria
- Search functionality

### Cart & Reservations
- Add/remove cars from cart
- Add notes to reservations
- Proceed to checkout
- Choose between reservation or purchase

### Admin Panel
- Dashboard with statistics
- CRUD operations for cars
- Order management
- Status updates

## Customization

### Colors
Edit `src/plugins/vuetify.ts` to change theme colors:

```typescript
colors: {
  primary: '#1976D2',
  secondary: '#424242',
  // ... other colors
}
```

### Tailwind Config
Edit `tailwind.config.js` to customize Tailwind:

```javascript
theme: {
  extend: {
    colors: {
      // Add custom colors
    }
  }
}
```

## Deployment

### Build for Production

```bash
npm run build
```

The `dist` folder will contain the production build.

### Deploy to Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase:
```bash
firebase init
```
- Select "Hosting"
- Select your project
- Set public directory to `dist`
- Configure as single-page app: "Yes"

4. Deploy:
```bash
firebase deploy
```

## Troubleshooting

### Common Issues

1. **Firebase config errors**: Make sure your Firebase config is correct
2. **CORS issues**: Ensure Firestore rules allow read/write
3. **Build errors**: Check TypeScript types and imports

### Firestore Security Rules (Development)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Note**: Use proper security rules for production!

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please create an issue in the repository.

---

Built with ❤️ using Vue 3, Vuetify 3, Tailwind CSS, and Firebase