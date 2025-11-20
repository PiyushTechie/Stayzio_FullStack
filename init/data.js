const sampleListings = [
  {
    title: "Cozy Beachfront Cottage",
    description: "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1500,
    location: "Malibu",
    country: "United States",
    category: "beach",
    geometry: {
      type: "Point",
      coordinates: [-118.788, 34.035],
    },
  },
  {
    title: "Modern Loft in Downtown",
    description: "Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers!",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1200,
    location: "New York City",
    country: "United States",
    category: "cities",
    geometry: {
      type: "Point",
      coordinates: [-74.006, 40.7128],
    },
  },
  {
    title: "Mountain Retreat",
    description: "Unplug and unwind in this peaceful mountain cabin. Surrounded by nature, it's a perfect place to recharge.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 1000,
    location: "Aspen",
    country: "United States",
    category: "mountains",
    geometry: {
      type: "Point",
      coordinates: [-106.8175, 39.1911],
    },
  },
  {
    title: "Historic Villa in Tuscany",
    description: "Experience the charm of Tuscany in this beautifully restored villa. Explore the rolling hills and vineyards.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 2500,
    location: "Florence",
    country: "Italy",
    category: "luxury",
    geometry: {
      type: "Point",
      coordinates: [11.2558, 43.7696],
    },
  },
  {
    title: "Secluded Treehouse Getaway",
    description: "Live among the treetops in this unique treehouse retreat. A true nature lover's paradise.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 800,
    location: "Portland",
    country: "United States",
    category: "rooms",
    geometry: {
      type: "Point",
      coordinates: [-122.6784, 45.5152],
    },
  },
  {
    title: "Beachfront Paradise",
    description: "Step out of your door onto the sandy beach. This beachfront condo offers the ultimate relaxation.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 2000,
    location: "Cancun",
    country: "Mexico",
    category: "beach",
    geometry: {
      type: "Point",
      coordinates: [-86.8515, 21.1619],
    },
  },
  {
    title: "Rustic Cabin by the Lake",
    description: "Spend your days fishing and kayaking on the serene lake. This cozy cabin is perfect for outdoor enthusiasts.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 900,
    location: "Lake Tahoe",
    country: "United States",
    category: "cabins",
    geometry: {
      type: "Point",
      coordinates: [-120.0324, 39.0968],
    },
  },
  {
    title: "Luxury Penthouse with City Views",
    description: "Indulge in luxury living with panoramic city views from this stunning penthouse apartment.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2t5JTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 3500,
    location: "Los Angeles",
    country: "United States",
    category: "luxury",
    geometry: {
      type: "Point",
      coordinates: [-118.2437, 34.0522],
    },
  },
  {
    title: "Ski-In/Ski-Out Chalet",
    description: "Hit the slopes right from your doorstep in this ski-in/ski-out chalet in the Swiss Alps.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNreSUyMHZhY2F0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 3000,
    location: "Verbier",
    country: "Switzerland",
    category: "mountains",
    geometry: {
      type: "Point",
      coordinates: [7.2286, 46.0959],
    },
  },
  {
    title: "Safari Lodge in the Serengeti",
    description: "Experience the thrill of the wild in a comfortable safari lodge. Witness the Great Migration up close.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 4000,
    location: "Serengeti National Park",
    country: "Tanzania",
    category: "camping",
    geometry: {
      type: "Point",
      coordinates: [34.8333, -2.3333],
    },
  },
  {
    title: "Historic Canal House",
    description: "Stay in a piece of history in this beautifully preserved canal house in Amsterdam's iconic district.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FtcGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1800,
    location: "Amsterdam",
    country: "Netherlands",
    category: "rooms",
    geometry: {
      type: "Point",
      coordinates: [4.8952, 52.3702],
    },
  },
  {
    title: "Private Island Retreat",
    description: "Have an entire island to yourself for a truly exclusive and unforgettable vacation experience.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1618140052121-39fc6db33972?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bG9kZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 10000,
    location: "Fiji",
    country: "Fiji",
    category: "luxury",
    geometry: {
      type: "Point",
      coordinates: [178.4419, -17.7134],
    },
  },
  {
    title: "Charming Cottage in the Cotswolds",
    description: "Escape to the picturesque Cotswolds in this quaint and charming cottage with a thatched roof.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1602088113235-229c19758e9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmVhY2glMjB2YWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1200,
    location: "Cotswolds",
    country: "United Kingdom",
    category: "cabins",
    geometry: {
      type: "Point",
      coordinates: [-1.8333, 51.8333],
    },
  },
  {
    title: "Historic Brownstone in Boston",
    description: "Step back in time in this elegant historic brownstone located in the heart of Boston.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1533619239233-6280475a633a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNreSUyMHZhY2F0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 2200,
    location: "Boston",
    country: "United States",
    category: "cities",
    geometry: {
      type: "Point",
      coordinates: [-71.0589, 42.3601],
    },
  },
  {
    title: "Beachfront Bungalow in Bali",
    description: "Relax on the sandy shores of Bali in this beautiful beachfront bungalow with a private pool.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1602391833977-358a52198938?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGNhbXBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1800,
    location: "Bali",
    country: "Indonesia",
    category: "beach",
    geometry: {
      type: "Point",
      coordinates: [115.1889, -8.4095],
    },
  },
  {
    title: "Mountain View Cabin in Banff",
    description: "Enjoy breathtaking mountain views from this cozy cabin in the Canadian Rockies.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 1500,
    location: "Banff",
    country: "Canada",
    category: "mountains",
    geometry: {
      type: "Point",
      coordinates: [-115.5708, 51.1784],
    },
  },
  {
    title: "Art Deco Apartment in Miami",
    description: "Step into the glamour of the 1920s in this stylish Art Deco apartment in South Beach.",
    image: {
      filename: "listingimage",
      url: "https://plus.unsplash.com/premium_photo-1670963964797-942df1804579?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 1600,
    location: "Miami",
    country: "United States",
    category: "cities",
    geometry: {
      type: "Point",
      coordinates: [-80.1918, 25.7617],
    },
  },
  {
    title: "Tropical Villa in Phuket",
    description: "Escape to a tropical paradise in this luxurious villa with a private infinity pool in Phuket.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1470165301023-58dab8118cc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 3000,
    location: "Phuket",
    country: "Thailand",
    category: "pools",
    geometry: {
      type: "Point",
      coordinates: [98.3923, 7.8804],
    },
  },
  {
    title: "Historic Castle in Scotland",
    description: "Live like royalty in this historic castle in the Scottish Highlands. Explore the rugged beauty of the area.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1585543805890-6051f7829f98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJlYWNoJTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 4000,
    location: "Scottish Highlands",
    country: "United Kingdom",
    category: "castles",
    geometry: {
      type: "Point",
      coordinates: [-4.224, 57.442],
    },
  },
  {
    title: "Desert Oasis in Dubai",
    description: "Experience luxury in the middle of the desert in this opulent oasis in Dubai with a private pool.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHViYWl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 5000,
    location: "Dubai",
    country: "United Arab Emirates",
    category: "pools",
    geometry: {
      type: "Point",
      coordinates: [55.2708, 25.2048],
    },
  },
  {
    title: "Rustic Log Cabin in Montana",
    description: "Unplug and unwind in this cozy log cabin surrounded by the natural beauty of Montana.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 1100,
    location: "Montana",
    country: "United States",
    category: "cabins",
    geometry: {
      type: "Point",
      coordinates: [-110.3626, 46.8797],
    },
  },
  {
    title: "Beachfront Villa in Greece",
    description: "Enjoy the crystal-clear waters of the Mediterranean in this beautiful beachfront villa on a Greek island.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dmlsbGF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 2500,
    location: "Mykonos",
    country: "Greece",
    category: "beach",
    geometry: {
      type: "Point",
      coordinates: [25.3289, 37.4467],
    },
  },
  {
    title: "Eco-Friendly Treehouse Retreat",
    description: "Stay in an eco-friendly treehouse nestled in the forest. It's the perfect escape for nature lovers.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c2t5JTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 750,
    location: "Costa Rica",
    country: "Costa Rica",
    category: "rooms",
    geometry: {
      type: "Point",
      coordinates: [-83.7534, 9.7489],
    },
  },
  {
    title: "Historic Cottage in Charleston",
    description: "Experience the charm of historic Charleston in this beautifully restored cottage with a private garden.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 1600,
    location: "Charleston",
    country: "United States",
    category: "cities",
    geometry: {
      type: "Point",
      coordinates: [-79.932, 32.7765],
    },
  },
  {
    title: "Modern Apartment in Tokyo",
    description: "Explore the vibrant city of Tokyo from this modern and centrally located apartment.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHRva3lvfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 2000,
    location: "Tokyo",
    country: "Japan",
    category: "cities",
    geometry: {
      type: "Point",
      coordinates: [139.6917, 35.6895],
    },
  },
  {
    title: "Lakefront Cabin in New Hampshire",
    description: "Spend your days by the lake in this cozy cabin in the scenic White Mountains of New Hampshire.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fGNhbXBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1200,
    location: "New Hampshire",
    country: "United States",
    category: "cabins",
    geometry: {
      type: "Point",
      coordinates: [-71.5724, 43.1939],
    },
  },
  {
    title: "Luxury Villa in the Maldives",
    description: "Indulge in luxury in this overwater villa in the Maldives with stunning views of the Indian Ocean.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFrZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 6000,
    location: "Maldives",
    country: "Maldives",
    category: "luxury",
    geometry: {
      type: "Point",
      coordinates: [73.2207, 3.2028],
    },
  },
  {
    title: "Ski Chalet in Aspen",
    description: "Hit the slopes in style with this luxurious ski chalet in the world-famous Aspen ski resort.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGxha2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 4000,
    location: "Aspen",
    country: "United States",
    category: "mountains",
    geometry: {
      type: "Point",
      coordinates: [-106.8175, 39.1911],
    },
  },
  {
    title: "Secluded Beach House in Costa Rica",
    description: "Escape to a secluded beach house on the Pacific coast of Costa Rica. Surf, relax, and unwind.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1800,
    location: "Costa Rica",
    country: "Costa Rica",
    category: "beach",
    geometry: {
      type: "Point",
      coordinates: [-83.7534, 9.7489],
    },
  },
  {
    title: "Highland Castle on the Loch",
    description: "Live like Scottish royalty in this historic stone castle overlooking a serene loch. Perfect for exploring the rugged beauty of the Scottish Highlands.",
    image: {
      filename: "castle_scotland",
      url: "https://images.pexels.com/photos/4170478/pexels-photo-4170478.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 4500,
    location: "Dornie",
    country: "United Kingdom",
    category: "castles",
    geometry: {
      type: "Point",
      coordinates: [-5.5161, 57.274],
    },
  },
  {
    title: "Bavarian Fairytale Getaway",
    description: "Nestled in the heart of the German Alps, this enchanting castle offers breathtaking views and storybook architecture. A magical escape from the everyday.",
    image: {
      filename: "castle_germany",
      url: "https://images.pexels.com/photos/257360/pexels-photo-257360.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 5200,
    location: "Bavaria",
    country: "Germany",
    category: "castles",
    geometry: {
      type: "Point",
      coordinates: [10.7498, 47.5576],
    },
  },
  {
    title: "Irish Coastal Fortress",
    description: "Experience the wild Atlantic coast from this beautifully restored medieval fortress. Enjoy dramatic sea views, roaring fires, and centuries of history.",
    image: {
      filename: "castle_ireland",
      url: "https://images.pexels.com/photos/1105389/pexels-photo-1105389.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 3800,
    location: "County Clare",
    country: "Ireland",
    category: "castles",
    geometry: {
      type: "Point",
      coordinates: [-9.4315, 52.9715],
    },
  },
  {
    title: "Elegant Loire Valley Château",
    description: "Stay in an exquisite Renaissance château surrounded by manicured gardens and vineyards. The perfect base for exploring the famous castles of the Loire Valley.",
    image: {
      filename: "castle_france",
      url: "https://images.pexels.com/photos/259863/pexels-photo-259863.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 6000,
    location: "Tours",
    country: "France",
    category: "castles",
    geometry: {
      type: "Point",
      coordinates: [0.6848, 47.3941],
    },
  },
  {
    title: "Royal Rajasthani Haveli",
    description: "Experience the opulence of ancient royalty in this stunning haveli in the heart of Rajasthan. Features intricate carvings, courtyards, and vibrant decor.",
    image: {
      filename: "castle_india",
      url: "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 3500,
    location: "Udaipur",
    country: "India",
    category: "castles",
    geometry: {
      type: "Point",
      coordinates: [73.7125, 24.5854],
    },
  },
  {
    title: "Santorini Infinity Pool Villa",
    description: "A breathtaking villa carved into the cliffs of Oia, featuring a private infinity pool with panoramic views of the Aegean Sea and the caldera.",
    image: {
      filename: "pool_greece",
      url: "https://images.pexels.com/photos/261169/pexels-photo-261169.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 7500,
    location: "Oia",
    country: "Greece",
    category: "pools",
    geometry: {
      type: "Point",
      coordinates: [25.3753, 36.4608],
    },
  },
  {
    title: "Jungle Oasis with Private Pool",
    description: "Escape to this serene villa in Ubud, surrounded by lush jungle. Your private infinity pool overlooks the vibrant green rice terraces.",
    image: {
      filename: "pool_bali",
      url: "https://images.pexels.com/photos/261395/pexels-photo-261395.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 2800,
    location: "Ubud",
    country: "Indonesia",
    category: "pools",
    geometry: {
      type: "Point",
      coordinates: [115.2631, -8.5069],
    },
  },
  {
    title: "Rooftop Pool with Cityscape Views",
    description: "Stay in a luxury apartment with access to one of the world's most famous rooftop infinity pools, offering stunning 360-degree views of the Singapore skyline.",
    image: {
      filename: "pool_singapore",
      url: "https://images.pexels.com/photos/261101/pexels-photo-261101.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 6200,
    location: "Marina Bay",
    country: "Singapore",
    category: "pools",
    geometry: {
      type: "Point",
      coordinates: [103.8599, 1.2838],
    },
  },
  {
    title: "Desert Modern Home & Pool",
    description: "Relax in this stylish mid-century modern home in Palm Springs. The beautifully designed pool is your private oasis in the desert heat.",
    image: {
      filename: "pool_palmsprings",
      url: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 3200,
    location: "Palm Springs",
    country: "United States",
    category: "pools",
    geometry: {
      type: "Point",
      coordinates: [-116.5453, 33.8303],
    },
  },
  {
    title: "Heated Alpine Pool Retreat",
    description: "Enjoy a luxurious stay at this alpine resort, where you can swim in a heated outdoor pool while surrounded by the majestic snow-capped Swiss Alps.",
    image: {
      filename: "pool_alps",
      url: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 8000,
    location: "Adelboden",
    country: "Switzerland",
    category: "pools",
    geometry: {
      type: "Point",
      coordinates: [7.5577, 46.4913],
    },
  },
  {
    title: "Glamping Dome in Wadi Rum",
    description: "Experience the magic of the desert in a luxury geodesic dome. Enjoy modern comforts and a clear ceiling for incredible stargazing over the Jordanian desert.",
    image: {
      filename: "camping_jordan",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwXeG7HT8eJJoKMLY07E0McWxdjvgkcc9Odg&s",
    },
    price: 2500,
    location: "Wadi Rum",
    country: "Jordan",
    category: "camping",
    geometry: {
      type: "Point",
      coordinates: [35.418, 29.573],
    },
  },
  {
    title: "Yosemite Valley Campsite",
    description: "A classic camping experience in the heart of Yosemite National Park. Pitch your tent with views of El Capitan and listen to the sounds of the Merced River.",
    image: {
      filename: "camping_yosemite",
      url: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 500,
    location: "Yosemite",
    country: "United States",
    category: "camping",
    geometry: {
      type: "Point",
      coordinates: [-119.5383, 37.8651],
    },
  },
  {
    title: "Safari Tent on the Mara",
    description: "A luxury safari tent on the edge of the Maasai Mara. Fall asleep to the sounds of the wild and wake up to incredible wildlife viewing opportunities.",
    image: {
      filename: "camping_kenya",
      url: "https://cdn.audleytravel.com/700/500/79/439509-offbeat-mara-camp-masai-mara.jpg",
    },
    price: 9000,
    location: "Maasai Mara",
    country: "Kenya",
    category: "camping",
    geometry: {
      type: "Point",
      coordinates: [35.1018, -1.4805],
    },
  },
  {
    title: "Lakeside Airstream in Banff",
    description: "Stay in a vintage, fully-equipped Airstream trailer parked by a turquoise lake in Banff National Park. Enjoy hiking, kayaking, and stunning mountain views.",
    image: {
      filename: "camping_banff",
      url: "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 1800,
    location: "Banff",
    country: "Canada",
    category: "camping",
    geometry: {
      type: "Point",
      coordinates: [-115.5708, 51.1784],
    },
  },
  {
    title: "Aurora Borealis Yurt",
    description: "A cozy, heated yurt in Finnish Lapland designed for Northern Lights viewing. Experience the arctic wilderness in comfort and style.",
    image: {
      filename: "camping_finland",
      url: "https://images.pexels.com/photos/2666598/pexels-photo-2666598.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 3200,
    location: "Lapland",
    country: "Finland",
    category: "camping",
    geometry: {
      type: "Point",
      coordinates: [25.7209, 66.5039],
    },
  },
  {
    title: "Tuscan Vineyard Agriturismo",
    description: "Stay at a working vineyard in the heart of Tuscany. Participate in wine tasting, enjoy authentic Italian meals, and relax by the pool overlooking rolling hills.",
    image: {
      filename: "farm_italy",
      url: "https://images.pexels.com/photos/1128302/pexels-photo-1128302.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 2200,
    location: "Chianti",
    country: "Italy",
    category: "farms",
    geometry: {
      type: "Point",
      coordinates: [11.3858, 43.4682],
    },
  },
  {
    title: "Cotswolds Sheep Farm Cottage",
    description: "A charming stone cottage on a traditional sheep farm in the picturesque Cotswolds. Enjoy fresh farm eggs for breakfast and peaceful countryside walks.",
    image: {
      filename: "farm_england",
      url: "https://images.pexels.com/photos/132192/pexels-photo-132192.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 1500,
    location: "Gloucestershire",
    country: "United Kingdom",
    category: "farms",
    geometry: {
      type: "Point",
      coordinates: [-2.2444, 51.8654],
    },
  },
  {
    title: "Lavender Farm Guesthouse in Provence",
    description: "Immerse yourself in the fragrant fields of Provence with a stay at this beautiful lavender farm. The guesthouse offers stunning views and rustic French charm.",
    image: {
      filename: "farm_france",
      url: "https://images.pexels.com/photos/2134224/pexels-photo-2134224.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 1900,
    location: "Provence",
    country: "France",
    category: "farms",
    geometry: {
      type: "Point",
      coordinates: [5.3698, 43.9352],
    },
  },
  {
    title: "Costa Rican Coffee Plantation Cabin",
    description: "Wake up to the smell of fresh coffee at this eco-friendly cabin on a working coffee plantation. Learn about the bean-to-cup process and explore the cloud forest.",
    image: {
      filename: "farm_costarica",
      url: "https://lp-cms-production.imgix.net/2024-10/GettyRF159111700.jpg?auto=format,compress&q=72&fit=crop",
    },
    price: 1300,
    location: "Monteverde",
    country: "Costa Rica",
    category: "farms",
    geometry: {
      type: "Point",
      coordinates: [-84.825, 10.3015],
    },
  },
  {
    title: "Vermont Dairy Farm Stay",
    description: "A cozy getaway on a classic Vermont dairy farm. Help with morning chores, sample award-winning cheese, and enjoy the stunning New England landscape.",
    image: {
      filename: "farm_vermont",
      url: "https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 1600,
    location: "Stowe",
    country: "United States",
    category: "farms",
    geometry: {
      type: "Point",
      coordinates: [-72.6845, 44.4654],
    },
  },
  {
    title: "Classic Amsterdam Houseboat",
    description: "Experience Amsterdam like a local on this charming houseboat in the Jordaan district. Enjoy breakfast on your private deck while watching the city wake up.",
    image: {
      filename: "boat_amsterdam",
      url: "https://images.pexels.com/photos/1682909/pexels-photo-1682909.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 2100,
    location: "Amsterdam",
    country: "Netherlands",
    category: "boats",
    geometry: {
      type: "Point",
      coordinates: [4.8952, 52.3702],
    },
  },
  {
    title: "Ha Long Bay Junk Boat Cruise",
    description: "Spend the night on a traditional junk boat, sailing through the stunning limestone karsts of Ha Long Bay. All meals and excursions included.",
    image: {
      filename: "boat_vietnam",
      url: "https://images.pexels.com/photos/1007088/pexels-photo-1007088.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 3000,
    location: "Ha Long Bay",
    country: "Vietnam",
    category: "boats",
    geometry: {
      type: "Point",
      coordinates: [107.1627, 20.8559],
    },
  },
  {
    title: "Sailing Yacht on the Croatian Coast",
    description: "Charter a modern sailing yacht and explore the idyllic islands of the Dalmatian Coast. Wake up in a new secluded bay every morning.",
    image: {
      filename: "boat_croatia",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeQw_SFZ81CaBzcQrIMzk8DU_0XZXMuah7-g&s",
    },
    price: 12000,
    location: "Split",
    country: "Croatia",
    category: "boats",
    geometry: {
      type: "Point",
      coordinates: [16.4402, 43.5081],
    },
  },
  {
    title: "Kerala Backwaters Houseboat",
    description: "A traditional 'Kettuvallam' rice barge, converted into a luxury houseboat. Gently cruise the serene backwaters of Alleppey, enjoying authentic Keralan cuisine.",
    image: {
      filename: "boat_kerala",
      url: "https://images.pexels.com/photos/208701/pexels-photo-208701.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 2500,
    location: "Alleppey",
    country: "India",
    category: "boats",
    geometry: {
      type: "Point",
      coordinates: [76.3388, 9.4981],
    },
  },
  {
    title: "Norwegian Fjord Catamaran",
    description: "A private catamaran experience through the dramatic fjords of Norway. See towering cliffs, waterfalls, and quaint villages from the comfort of your own boat.",
    image: {
      filename: "boat_norway",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWu54OngRNF9C1UhGPW9ilXkLLcW2iwMbOVQ&s",
    },
    price: 15000,
    location: "Bergen",
    country: "Norway",
    category: "boats",
    geometry: {
      type: "Point",
      coordinates: [5.3221, 60.3913],
    },
  },
  // Category: Mountains
  {
    title: "AlpenGlow Chalet, Switzerland",
    description: "Breathtaking views of the Eiger. Ski-in/ski-out access and a private hot tub.",
    image: {
      filename: "alpenglow_chalet",
      url: "https://images.pexels.com/photos/756076/pexels-photo-756076.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 4500,
    location: "Grindelwald",
    country: "Switzerland",
    category: "mountains",
    geometry: {
      type: "Point",
      coordinates: [8.033, 46.624],
    },
  },
  {
    title: "Rocky Mountain High Cabin",
    description: "Secluded cabin near Estes Park. Ideal for hiking, wildlife viewing, and unplugging.",
    image: {
      filename: "rocky_mountain_cabin",
      url: "https://images.pexels.com/photos/103290/pexels-photo-103290.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 2800,
    location: "Estes Park",
    country: "United States",
    category: "mountains",
    geometry: {
      type: "Point",
      coordinates: [-105.5217, 40.3772],
    },
  },
  {
    title: "Andean Peak Sanctuary",
    description: "Remote lodge in the Peruvian Andes. Perfect base for trekking to high-altitude lagoons.",
    image: {
      filename: "andean_peak_sanctuary",
      url: "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 2200,
    location: "Huaraz",
    country: "Peru",
    category: "mountains",
    geometry: {
      type: "Point",
      coordinates: [-77.5278, -9.5278],
    },
  },
  {
    title: "Dolomites Designer Retreat",
    description: "Modern architecture meets alpine charm. Floor-to-ceiling windows with stunning views.",
    image: {
      filename: "dolomites_designer_retreat",
      url: "https://images.pexels.com/photos/372098/pexels-photo-372098.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 5000,
    location: "Cortina d'Ampezzo",
    country: "Italy",
    category: "mountains",
    geometry: {
      type: "Point",
      coordinates: [12.1357, 46.5405],
    },
  },
  {
    title: "New Zealand Mountain View",
    description: "Overlook Lake Wakatipu from this stunning home. Close to Queenstown's adventures.",
    image: {
      filename: "new_zealand_mountain_view",
      url: "https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 3800,
    location: "Queenstown",
    country: "New Zealand",
    category: "mountains",
    geometry: {
      type: "Point",
      coordinates: [168.6626, -45.0312],
    },
  },

  // Category: Beach
  {
    title: "Bora Bora Overwater Bungalow",
    description: "Iconic overwater bungalow with direct lagoon access. Crystal clear waters and total privacy.",
    image: {
      filename: "bora_bora_bungalow",
      url: "https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 9000,
    location: "Bora Bora",
    country: "French Polynesia",
    category: "beach",
    geometry: {
      type: "Point",
      coordinates: [-151.7415, -16.5004],
    },
  },
  {
    title: "Private Tulum Beach Villa",
    description: "Eco-chic villa on the white sands of Tulum. Private plunge pool and jungle vibes.",
    image: {
      filename: "tulum_beach_villa",
      url: "https://media.villagetaways.com/villas/mexico/3294/f22fb7bb41c5bdf8501a786a411bd895_full.jpg",
    },
    price: 3200,
    location: "Tulum",
    country: "Mexico",
    category: "beach",
    geometry: {
      type: "Point",
      coordinates: [-87.465, 20.211],
    },
  },
  {
    title: "Amalfi Coast Cliffside Home",
    description: "Historic home carved into the Positano cliffs. Unforgettable views of the Mediterranean.",
    image: {
      filename: "amalfi_cliffside_home",
      url: "https://images.pexels.com/photos/258196/pexels-photo-258196.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 5500,
    location: "Positano",
    country: "Italy",
    category: "beach",
    geometry: {
      type: "Point",
      coordinates: [14.485, 40.628],
    },
  },
  {
    title: "Byron Bay Surf Shack",
    description: "Chic, rustic surf shack just steps from The Pass. Perfect for catching early morning waves.",
    image: {
      filename: "byron_bay_surf_shack",
      url: "https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 1900,
    location: "Byron Bay",
    country: "Australia",
    category: "beach",
    geometry: {
      type: "Point",
      coordinates: [153.618, -28.643],
    },
  },
  {
    title: "Hawaiian Oceanfront Escape",
    description: "Family-friendly home on Maui's north shore. Watch sea turtles from your own lanai.",
    image: {
      filename: "hawaiian_oceanfront_escape",
      url: "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 4000,
    location: "Maui",
    country: "United States",
    category: "beach",
    geometry: {
      type: "Point",
      coordinates: [-156.331, 20.798],
    },
  },

  // Category: Cities
  {
    title: "Parisian Flat with Eiffel View",
    description: "Elegant Haussmann apartment in the 7th. Sip coffee with a view of the Eiffel Tower.",
    image: {
      filename: "parisian_flat_eiffel_view",
      url: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 3000,
    location: "Paris",
    country: "France",
    category: "cities",
    geometry: {
      type: "Point",
      coordinates: [2.3522, 48.8566],
    },
  },
  {
    title: "Shinjuku Skyscraper Apartment",
    description: "High-floor apartment with panoramic views of the Tokyo skyline. Modern and minimal.",
    image: {
      filename: "shinjuku_skyscraper_apartment",
      url: "https://images.pexels.com/photos/2193300/pexels-photo-2193300.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 2500,
    location: "Tokyo",
    country: "Japan",
    category: "cities",
    geometry: {
      type: "Point",
      coordinates: [139.6917, 35.6895],
    },
  },
  {
    title: "London Mews House",
    description: "Charming and quiet mews house in Notting Hill. Cobblestone streets and colorful doors.",
    image: {
      filename: "london_mews_house",
      url: "https://media.houseandgarden.co.uk/photos/688b3c302686064c16535dab/4:3/w_1884,h_1413,c_limit/1782129235",
    },
    price: 2700,
    location: "London",
    country: "United Kingdom",
    category: "cities",
    geometry: {
      type: "Point",
      coordinates: [-0.1276, 51.5072],
    },
  },
  {
    title: "Greenwich Village Brownstone",
    description: "Historic brownstone in the heart of NYC's West Village. Steps from cafes and parks.",
    image: {
      filename: "greenwich_village_brownstone",
      url: "https://images.pexels.com/photos/2983141/pexels-photo-2983141.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 3500,
    location: "New York City",
    country: "United States",
    category: "cities",
    geometry: {
      type: "Point",
      coordinates: [-74.006, 40.7128],
    },
  },
  {
    title: "Roman Terrace Apartment",
    description: "Stunning apartment near the Pantheon with a private rooftop terrace for alfresco dining.",
    image: {
      filename: "roman_terrace_apartment",
      url: "https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 2900,
    location: "Rome",
    country: "Italy",
    category: "cities",
    geometry: {
      type: "Point",
      coordinates: [12.4964, 41.9028],
    },
  },

  // Category: Cabins
  {
    title: "Modern A-Frame in the Woods",
    description: "Stunningly designed A-frame cabin. Perfect for a romantic getaway in the Big Sur forest.",
    image: {
      filename: "modern_a_frame_woods",
      url: "https://images.pexels.com/photos/2524874/pexels-photo-2524874.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 1700,
    location: "Big Sur",
    country: "United States",
    category: "cabins",
    geometry: {
      type: "Point",
      coordinates: [-121.655, 36.270],
    },
  },
  {
    title: "Smoky Mountains Log Cabin",
    description: "Classic log cabin with a wrap-around porch and mountain views. Features a game room and hot tub.",
    image: {
      filename: "smoky_mountains_log_cabin",
      url: "https://images.pexels.com/photos/2088206/pexels-photo-2088206.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 1500,
    location: "Gatlinburg",
    country: "United States",
    category: "cabins",
    geometry: {
      type: "Point",
      coordinates: [-83.510, 35.714],
    },
  },
  {
    title: "Scandinavian Hygge Cabin",
    description: "Minimalist Nordic-style cabin by a fjord. Cozy up by the wood-burning stove.",
    image: {
      filename: "scandinavian_hygge_cabin",
      url: "https://imageio.forbes.com/specials-images/imageserve/63cfaf71a702b64d37766ec0/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds",
    },
    price: 2000,
    location: "Flåm",
    country: "Norway",
    category: "cabins",
    geometry: {
      type: "Point",
      coordinates: [7.113, 60.860],
    },
  },
  {
    title: "Canadian Lakeside Retreat",
    description: "Peaceful cabin on the shores of Lake Louise. Canoe and kayaks included.",
    image: {
      filename: "canadian_lakeside_retreat",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAt8i6N64HutYMYr4SZNRIJ-7DuV1A3tVIAA&s",
    },
    price: 2300,
    location: "Lake Louise",
    country: "Canada",
    category: "cabins",
    geometry: {
      type: "Point",
      coordinates: [-116.177, 51.425],
    },
  },
  {
    title: "Forestry Lookout Tower",
    description: "Unique stay in a converted fire lookout tower. 360-degree views of the national forest.",
    image: {
      filename: "forestry_lookout_tower",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmg1IRWZTOsFi4u7tV4lLHyVIIctKJSReeIA&s",
    },
    price: 1200,
    location: "Mount Hood",
    country: "United States",
    category: "cabins",
    geometry: {
      type: "Point",
      coordinates: [-121.700, 45.373],
    },
  },

  // Category: Luxury
  {
    title: "Emirati Palace Penthouse",
    description: "Opulent penthouse in Dubai with private elevator, butler service, and views of the Burj Khalifa.",
    image: {
      filename: "emirati_palace_penthouse",
      url: "https://cdn.myportfolio.com/ad3ad17d18625d64c978c37bb660f724/1ce636af-d81d-4ea7-8030-5017bb932755_rw_3840.jpg?h=d7b267ec48a7b31a2e57c821b86baf38",
    },
    price: 15000,
    location: "Dubai",
    country: "UAE",
    category: "luxury",
    geometry: {
      type: "Point",
      coordinates: [55.2708, 25.2048],
    },
  },
  {
    title: "St. Barts Mega-Villa",
    description: "A sprawling 8-bedroom villa with a 100-foot infinity pool, private chef, and beach access.",
    image: {
      filename: "st_barts_mega_villa",
      url: "https://images.pexels.com/photos/221540/pexels-photo-221540.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 25000,
    location: "St. Barts",
    country: "France",
    category: "luxury",
    geometry: {
      type: "Point",
      coordinates: [-62.832, 17.900],
    },
  },
  {
    title: "Lake Como Historic Villa",
    description: "Live like a billionaire at this historic villa on Lake Como. Includes a private dock and speedboat.",
    image: {
      filename: "lake_como_historic_villa",
      url: "https://images.pexels.com/photos/1612461/pexels-photo-1612461.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 18000,
    location: "Lake Como",
    country: "Italy",
    category: "luxury",
    geometry: {
      type: "Point",
      coordinates: [9.257, 45.986],
    },
  },
  {
    title: "Aspen Mountain Mansion",
    description: "Modern mountain mansion with an indoor pool, bowling alley, and home theater.",
    image: {
      filename: "aspen_mountain_mansion",
      url: "https://images.pexels.com/photos/209296/pexels-photo-209296.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 30000,
    location: "Aspen",
    country: "United States",
    category: "luxury",
    geometry: {
      type: "Point",
      coordinates: [-106.817, 39.191],
    },
  },
  {
    title: "Private Seychelles Island",
    description: "Your very own private island. Fully staffed, with multiple beaches and absolute seclusion.",
    image: {
      filename: "private_seychelles_island",
      url: "https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 50000,
    location: "Felicité",
    country: "Seychelles",
    category: "luxury",
    geometry: {
      type: "Point",
      coordinates: [55.883, -4.316],
    },
  },

  // Category: Camping
  {
    title: "Patagonia Geodesic Dome",
    description: "Eco-dome in Torres del Paine. Watch the sunrise over the mountains from your bed.",
    image: {
      filename: "patagonia_geodesic_dome",
      url: "https://images.pexels.com/photos/2397653/pexels-photo-2397653.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 1800,
    location: "Torres del Paine",
    country: "Chile",
    category: "camping",
    geometry: {
      type: "Point",
      coordinates: [-72.882, -51.255],
    },
  },
  {
    title: "Luxury Bedouin Tent, Sahara",
    description: "Stay in a luxury tent in the Sahara Desert. Includes camel trekking and traditional meals.",
    image: {
      filename: "luxury_bedouin_tent_sahara",
      url: "https://images.pexels.com/photos/2403391/pexels-photo-2403391.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 2100,
    location: "Merzouga",
    country: "Morocco",
    category: "camping",
    geometry: {
      type: "Point",
      coordinates: [-4.013, 31.099],
    },
  },
  {
    title: "Yellowstone Luxury Tipi",
    description: "Spacious tipi with a king bed and wood stove, just outside Yellowstone National Park.",
    image: {
      filename: "yellowstone_luxury_tipi",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdL8I7tp4za8Uvf1Tn09De7Jc0qMPcN0vVhA&s",
    },
    price: 1300,
    location: "West Yellowstone",
    country: "United States",
    category: "camping",
    geometry: {
      type: "Point",
      coordinates: [-111.100, 44.662],
    },
  },
  {
    title: "Australian Outback Glamping",
    description: "Luxury tent with views of Uluru (Ayers Rock). Experience the spiritual heart of Australia.",
    image: {
      filename: "australian_outback_glamping",
      url: "https://images.pexels.com/photos/67389/pexels-photo-67389.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 3500,
    location: "Uluru",
    country: "Australia",
    category: "camping",
    geometry: {
      type: "Point",
      coordinates: [131.036, -25.344],
    },
  },
  {
    title: "Redwood Forest Tree-Tent",
    description: "Sleep suspended in the air between giant redwood trees. A unique and immersive nature experience.",
    image: {
      filename: "redwood_forest_tree_tent",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEhddAYiayX2-W7ckGrwREvrRBmPJurVqHMg&s",
    },
    price: 900,
    location: "Humboldt",
    country: "United States",
    category: "camping",
    geometry: {
      type: "Point",
      coordinates: [-124.095, 40.742],
    },
  },

  // Category: Pools (All New)
  {
    title: "Mykonos Party Villa Pool",
    description: "The ultimate party villa in Mykonos, featuring a massive infinity pool, DJ booth, and sea views.",
    image: {
      filename: "mykonos_party_villa_pool",
      url: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 6000,
    location: "Mykonos",
    country: "Greece",
    category: "pools",
    geometry: {
      type: "Point",
      coordinates: [25.328, 37.446],
    },
  },
  {
    title: "Balinese Rice Paddy Pool",
    description: "A tranquil villa in Canggu with a stunning pool that blends directly into the surrounding rice paddies.",
    image: {
      filename: "balinese_rice_paddy_pool",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToCMTDRgshNdGp54JcdhvT_otqOC8TLbxu0w&s",
    },
    price: 2400,
    location: "Canggu",
    country: "Indonesia",
    category: "pools",
    geometry: {
      type: "Point",
      coordinates: [115.138, -8.647],
    },
  },
  {
    title: "Marrakech Riad Courtyard Pool",
    description: "Traditional Moroccan riad with a stunning central courtyard and tile pool. An oasis in the city.",
    image: {
      filename: "marrakech_riad_courtyard_pool",
      url: "https://images.pexels.com/photos/2440471/pexels-photo-2440471.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 1900,
    location: "Marrakech",
    country: "Morocco",
    category: "pools",
    geometry: {
      type: "Point",
      coordinates: [-7.981, 31.629],
    },
  },
  {
    title: "Phuket Sea-View Infinity Pool",
    description: "Private villa in Phuket with an infinity pool that seems to drop off into the Andaman Sea.",
    image: {
      filename: "phuket_sea_view_pool",
      url: "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 3200,
    location: "Phuket",
    country: "Thailand",
    category: "pools",
    geometry: {
      type: "Point",
      coordinates: [98.392, 7.880],
    },
  },
  {
    title: "Hollywood Hills Hideaway Pool",
    description: "A celebrity-style hideaway in the Hollywood Hills with a private pool and panoramic views of LA.",
    image: {
      filename: "hollywood_hills_pool",
      url: "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 4800,
    location: "Los Angeles",
    country: "United States",
    category: "pools",
    geometry: {
      type: "Point",
      coordinates: [-118.358, 34.092],
    },
  },

  // Category: Farms (All New)
  {
    title: "Sicilian Lemon Grove Farm",
    description: "Wake up to the smell of citrus. A beautiful guesthouse on a working lemon farm in Sicily.",
    image: {
      filename: "sicilian_lemon_farm",
      url: "https://images.pexels.com/photos/130894/pexels-photo-130894.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 2000,
    location: "Syracuse",
    country: "Italy",
    category: "farms",
    geometry: {
      type: "Point",
      coordinates: [15.279, 37.075],
    },
  },
  {
    title: "Normandy Dairy Farm Cottage",
    description: "Charming stone cottage on a dairy farm in Normandy. Enjoy fresh cheese, milk, and cider.",
    image: {
      filename: "normandy_dairy_farm",
      url: "https://media.istockphoto.com/id/695442556/photo/norman-black-and-white-cows-grazing-on-grassy-green-field-with-trees-on-a-bright-sunny-day-in.jpg?s=612x612&w=0&k=20&c=7gMEOxhqDdvhfKkJwt5gK5I3SPhHuyZyW22OgL9-Oiw=",
    },
    price: 1800,
    location: "Bayeux",
    country: "France",
    category: "farms",
    geometry: {
      type: "Point",
      coordinates: [-0.703, 49.276],
    },
  },
  {
    title: "Vermont Farmhouse Experience",
    description: "Quintessential New England farmhouse. Help feed the animals and collect fresh eggs.",
    image: {
      filename: "vermont_farmhouse_experience",
      url: "https://onekindesign.com/wp-content/uploads/2024/04/Modern-Farmhouse-Style-Home-Vermont-ART-Architects-04-1-Kindesign.jpg",
    },
    price: 1600,
    location: "Woodstock",
    country: "United States",
    category: "farms",
    geometry: {
      type: "Point",
      coordinates: [-72.518, 43.623],
    },
  },
  {
    title: "Panamanian Geisha Coffee Farm",
    description: "Stay on a world-renowned Geisha coffee plantation in the highlands of Panama. A coffee lover's dream.",
    image: {
      filename: "panama_coffee_farm",
      url: "https://images.pexels.com/photos/434258/pexels-photo-434258.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 1300,
    location: "Boquete",
    country: "Panama",
    category: "farms",
    geometry: {
      type: "Point",
      coordinates: [-82.433, 8.783],
    },
  },
  {
    title: "Irish Countryside Sheep Farm",
    description: "Cozy cottage on a working sheep farm in County Kerry. Stunning green hills and fresh air.",
    image: {
      filename: "irish_countryside_sheep_farm",
      url: "https://www.shutterstock.com/image-photo/sheep-marked-colorful-dye-grazing-260nw-2427224231.jpg",
    },
    price: 1400,
    location: "Kenmare",
    country: "Ireland",
    category: "farms",
    geometry: {
      type: "Point",
      coordinates: [-9.584, 51.880],
    },
  },

  // Category: Castles (All New)
  {
    title: "Scottish Highland Fortress",
    description: "Stay in a restored 16th-century Scottish castle. Roaring fires, loch views, and rich history.",
    image: {
      filename: "scottish_highland_fortress",
      url: "https://images.pexels.com/photos/1729828/pexels-photo-1729828.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 6000,
    location: "Isle of Skye",
    country: "United Kingdom",
    category: "castles",
    geometry: {
      type: "Point",
      coordinates: [-6.215, 57.273],
    },
  },
  {
    title: "Dordogne River Castle",
    description: "A stunning cliffside castle overlooking the Dordogne River. Breathtaking views and historic charm.",
    image: {
      filename: "dordogne_river_castle",
      url: "https://media-cdn.tripadvisor.com/media/photo-c/1280x250/0c/25/07/dd/chateau-de-beynac-forteresse.jpg",
    },
    price: 7500,
    location: "Beynac-et-Cazenac",
    country: "France",
    category: "castles",
    geometry: {
      type: "Point",
      coordinates: [1.146, 44.841],
    },
  },
  {
    title: "German Fairytale Castle",
    description: "Live in a storybook. This castle in the German forest inspired fairytale legends.",
    image: {
      filename: "german_fairytale_castle",
      url: "https://www.tripsavvy.com/thmb/JC9CVzd4r_jQMttcX8BT-IaC3WE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/NeushwansteinCastle_BrianLawrence_GettyImages-565c8e393df78c6ddf634289.jpg",
    },
    price: 5200,
    location: "Wierschem",
    country: "Germany",
    category: "castles",
    geometry: {
      type: "Point",
      coordinates: [7.334, 50.205],
    },
  },
  {
    title: "Medieval Keep in Kilkenny",
    description: "Stay within the ancient walls of a restored medieval keep. A truly authentic Irish history experience.",
    image: {
      filename: "kilkenny_keep",
      url: "https://images.pexels.com/photos/612046/pexels-photo-612046.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 4800,
    location: "Kilkenny",
    country: "Ireland",
    category: "castles",
    geometry: {
      type: "Point",
      coordinates: [-7.249, 52.654],
    },
  },
  {
    title: "Tuscan Castello with Pool",
    description: "A medieval castle in Tuscany, beautifully restored with modern luxuries and a stunning pool.",
    image: {
      filename: "tuscan_castello_with_pool",
      url: "https://images.pexels.com/photos/1128302/pexels-photo-1128302.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    price: 8000,
    location: "Siena",
    country: "Italy",
    category: "castles",
    geometry: {
      type: "Point",
      coordinates: [11.330, 43.318],
    },
  },

  // Category: Boats (All New)
  {
    title: "Parisian Seine River Péniche",
    description: "A beautifully converted barge (péniche) moored on the Seine. Watch Paris float by.",
    image: {
      filename: "seine_river_peniche",
      url: "https://cdn.pixabay.com/photo/2018/03/17/16/51/paris-3234472_1280.jpg",
    },
    price: 2200,
    location: "Paris",
    country: "France",
    category: "boats",
    geometry: {
      type: "Point",
      coordinates: [2.352, 48.856],
    },
  },
  {
    title: "Seattle Lake Union Floating Home",
    description: "Iconic 'Sleepless in Seattle' style floating home. Kayak from your front porch.",
    image: {
      filename: "seattle_lake_union_floating_home",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTys4FbvOIM2p_tTHSKEvQ_pxCScPXxqaDV1A&s",
    },
    price: 2600,
    location: "Seattle",
    country: "United States",
    category: "boats",
    geometry: {
      type: "Point",
      coordinates: [-122.329, 47.626],
    },
  },
  {
    title: "Nile River Dahabiya Cruise",
    description: "A traditional, elegant 'Dahabiya' sailing boat for a slow, peaceful cruise between Luxor and Aswan.",
    image: {
      filename: "nile_dahabiya",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_f6G2oK-4mPgjLQgOc9vUz2DjvDm9GhpI5g&s",
    },
    price: 3800,
    location: "Luxor",
    country: "Egypt",
    category: "boats",
    geometry: {
      type: "Point",
      coordinates: [32.639, 25.687],
    },
  },
  {
    title: "Thai Long-tail Boat Charter",
    description: "Charter a private long-tail boat to explore the islands and beaches of Krabi at your own pace.",
    image: {
      filename: "thai_longtail_boat",
      url: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/54/07/ca/caption.jpg?w=1200&h=-1&s=1",
    },
    price: 3000,
    location: "Krabi",
    country: "Thailand",
    category: "boats",
    geometry: {
      type: "Point",
      coordinates: [98.906, 8.086],
    },
  },
  {
    title: "Sausalito Artists' Houseboat",
    description: "Funky, creative houseboat in the famous Sausalito community. A unique and colorful stay.",
    image: {
      filename: "sausalito_artists_houseboat",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgmwYYxtbES_nLImrOh9iXv-BvC9ijtXVX7w&s",
    },
    price: 1900,
    location: "Sausalito",
    country: "United States",
    category: "boats",
    geometry: {
      type: "Point",
      coordinates: [-122.486, 37.859],
    },
  },
];



export default sampleListings;