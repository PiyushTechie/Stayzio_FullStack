const sampleListings = [
  {
    title: "Cozy Beachfront Cottage",
    description:
      "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1500,
    location: "Malibu",
    country: "United States",
    category: "beach",
  },
  {
    title: "Modern Loft in Downtown",
    description:
      "Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers!",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1200,
    location: "New York City",
    country: "United States",
    category: "cities",
  },
  {
    title: "Mountain Retreat",
    description:
      "Unplug and unwind in this peaceful mountain cabin. Surrounded by nature, it's a perfect place to recharge.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 1000,
    location: "Aspen",
    country: "United States",
    category: "mountains",
  },
  {
    title: "Historic Villa in Tuscany",
    description:
      "Experience the charm of Tuscany in this beautifully restored villa. Explore the rolling hills and vineyards.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 2500,
    location: "Florence",
    country: "Italy",
    category: "luxury",
  },
  {
    title: "Secluded Treehouse Getaway",
    description:
      "Live among the treetops in this unique treehouse retreat. A true nature lover's paradise.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 800,
    location: "Portland",
    country: "United States",
    category: "rooms",
  },
  {
    title: "Beachfront Paradise",
    description:
      "Step out of your door onto the sandy beach. This beachfront condo offers the ultimate relaxation.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 2000,
    location: "Cancun",
    country: "Mexico",
    category: "beach",
  },
  {
    title: "Rustic Cabin by the Lake",
    description:
      "Spend your days fishing and kayaking on the serene lake. This cozy cabin is perfect for outdoor enthusiasts.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 900,
    location: "Lake Tahoe",
    country: "United States",
    category: "cabins",
  },
  {
    title: "Luxury Penthouse with City Views",
    description:
      "Indulge in luxury living with panoramic city views from this stunning penthouse apartment.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2t5JTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 3500,
    location: "Los Angeles",
    country: "United States",
    category: "luxury",
  },
  {
    title: "Ski-In/Ski-Out Chalet",
    description:
      "Hit the slopes right from your doorstep in this ski-in/ski-out chalet in the Swiss Alps.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNreSUyMHZhY2F0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 3000,
    location: "Verbier",
    country: "Switzerland",
    category: "mountains",
  },
  {
    title: "Safari Lodge in the Serengeti",
    description:
      "Experience the thrill of the wild in a comfortable safari lodge. Witness the Great Migration up close.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 4000,
    location: "Serengeti National Park",
    country: "Tanzania",
    category: "camping",
  },
  {
    title: "Historic Canal House",
    description:
      "Stay in a piece of history in this beautifully preserved canal house in Amsterdam's iconic district.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FtcGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1800,
    location: "Amsterdam",
    country: "Netherlands",
    category: "rooms",
  },
  {
    title: "Private Island Retreat",
    description:
      "Have an entire island to yourself for a truly exclusive and unforgettable vacation experience.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1618140052121-39fc6db33972?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bG9kZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 10000,
    location: "Fiji",
    country: "Fiji",
    category: "luxury",
  },
  {
    title: "Charming Cottage in the Cotswolds",
    description:
      "Escape to the picturesque Cotswolds in this quaint and charming cottage with a thatched roof.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1602088113235-229c19758e9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmVhY2glMjB2YWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1200,
    location: "Cotswolds",
    country: "United Kingdom",
    category: "cabins",
  },
  {
    title: "Historic Brownstone in Boston",
    description:
      "Step back in time in this elegant historic brownstone located in the heart of Boston.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1533619239233-6280475a633a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNreSUyMHZhY2F0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 2200,
    location: "Boston",
    country: "United States",
    category: "cities",
  },
  {
    title: "Beachfront Bungalow in Bali",
    description:
      "Relax on the sandy shores of Bali in this beautiful beachfront bungalow with a private pool.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1602391833977-358a52198938?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGNhbXBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1800,
    location: "Bali",
    country: "Indonesia",
    category: "beach",
  },
  {
    title: "Mountain View Cabin in Banff",
    description:
      "Enjoy breathtaking mountain views from this cozy cabin in the Canadian Rockies.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 1500,
    location: "Banff",
    country: "Canada",
    category: "mountains",
  },
  {
    title: "Art Deco Apartment in Miami",
    description:
      "Step into the glamour of the 1920s in this stylish Art Deco apartment in South Beach.",
    image: {
      filename: "listingimage",
      url: "https://plus.unsplash.com/premium_photo-1670963964797-942df1804579?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 1600,
    location: "Miami",
    country: "United States",
    category: "cities",
  },
  {
    title: "Tropical Villa in Phuket",
    description:
      "Escape to a tropical paradise in this luxurious villa with a private infinity pool in Phuket.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1470165301023-58dab8118cc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 3000,
    location: "Phuket",
    country: "Thailand",
    category: "pools",
  },
  {
    title: "Historic Castle in Scotland",
    description:
      "Live like royalty in this historic castle in the Scottish Highlands. Explore the rugged beauty of the area.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1585543805890-6051f7829f98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJlYWNoJTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 4000,
    location: "Scottish Highlands",
    country: "United Kingdom",
    category: "castles",
  },
  {
    title: "Desert Oasis in Dubai",
    description:
      "Experience luxury in the middle of the desert in this opulent oasis in Dubai with a private pool.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHViYWl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 5000,
    location: "Dubai",
    country: "United Arab Emirates",
    category: "pools",
  },
  {
    title: "Rustic Log Cabin in Montana",
    description:
      "Unplug and unwind in this cozy log cabin surrounded by the natural beauty of Montana.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 1100,
    location: "Montana",
    country: "United States",
    category: "cabins",
  },
  {
    title: "Beachfront Villa in Greece",
    description:
      "Enjoy the crystal-clear waters of the Mediterranean in this beautiful beachfront villa on a Greek island.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dmlsbGF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 2500,
    location: "Mykonos",
    country: "Greece",
    category: "beach",
  },
  {
    title: "Eco-Friendly Treehouse Retreat",
    description:
      "Stay in an eco-friendly treehouse nestled in the forest. It's the perfect escape for nature lovers.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c2t5JTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 750,
    location: "Costa Rica",
    country: "Costa Rica",
    category: "rooms",
  },
  {
    title: "Historic Cottage in Charleston",
    description:
      "Experience the charm of historic Charleston in this beautifully restored cottage with a private garden.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 1600,
    location: "Charleston",
    country: "United States",
    category: "cities",
  },
  {
    title: "Modern Apartment in Tokyo",
    description:
      "Explore the vibrant city of Tokyo from this modern and centrally located apartment.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHRva3lvfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 2000,
    location: "Tokyo",
    country: "Japan",
    category: "cities",
  },
  {
    title: "Lakefront Cabin in New Hampshire",
    description:
      "Spend your days by the lake in this cozy cabin in the scenic White Mountains of New Hampshire.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fGNhbXBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1200,
    location: "New Hampshire",
    country: "United States",
    category: "cabins",
  },
  {
    title: "Luxury Villa in the Maldives",
    description:
      "Indulge in luxury in this overwater villa in the Maldives with stunning views of the Indian Ocean.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFrZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 6000,
    location: "Maldives",
    country: "Maldives",
    category: "luxury",
  },
  {
    title: "Ski Chalet in Aspen",
    description:
      "Hit the slopes in style with this luxurious ski chalet in the world-famous Aspen ski resort.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGxha2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 4000,
    location: "Aspen",
    country: "United States",
    category: "mountains",
  },
  {
    title: "Secluded Beach House in Costa Rica",
    description:
      "Escape to a secluded beach house on the Pacific coast of Costa Rica. Surf, relax, and unwind.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1800,
    location: "Costa Rica",
    country: "Costa Rica",
    category: "beach",
  },
  // Castles
  {
    title: "Highland Castle on the Loch",
    description: "Live like Scottish royalty in this historic stone castle overlooking a serene loch. Perfect for exploring the rugged beauty of the Scottish Highlands.",
    image: {
      filename: "castle_scotland",
      url: "https://images.pexels.com/photos/4170478/pexels-photo-4170478.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    price: 4500,
    location: "Dornie",
    country: "United Kingdom",
    category: "castles"
  },
  {
    title: "Bavarian Fairytale Getaway",
    description: "Nestled in the heart of the German Alps, this enchanting castle offers breathtaking views and storybook architecture. A magical escape from the everyday.",
    image: {
      filename: "castle_germany",
      url: "https://images.pexels.com/photos/257360/pexels-photo-257360.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    price: 5200,
    location: "Bavaria",
    country: "Germany",
    category: "castles"
  },
  {
    title: "Irish Coastal Fortress",
    description: "Experience the wild Atlantic coast from this beautifully restored medieval fortress. Enjoy dramatic sea views, roaring fires, and centuries of history.",
    image: {
      filename: "castle_ireland",
      url: "https://images.pexels.com/photos/1105389/pexels-photo-1105389.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    price: 3800,
    location: "County Clare",
    country: "Ireland",
    category: "castles"
  },
  {
    title: "Elegant Loire Valley Château",
    description: "Stay in an exquisite Renaissance château surrounded by manicured gardens and vineyards. The perfect base for exploring the famous castles of the Loire Valley.",
    image: {
      filename: "castle_france",
      url: "https://images.pexels.com/photos/259863/pexels-photo-259863.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    price: 6000,
    location: "Tours",
    country: "France",
    category: "castles"
  },
  {
    title: "Royal Rajasthani Haveli",
    description: "Experience the opulence of ancient royalty in this stunning haveli in the heart of Rajasthan. Features intricate carvings, courtyards, and vibrant decor.",
    image: {
      filename: "castle_india",
      url: "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    price: 3500,
    location: "Udaipur",
    country: "India",
    category: "castles"
  },
  // Pools
  {
    title: "Santorini Infinity Pool Villa",
    description: "A breathtaking villa carved into the cliffs of Oia, featuring a private infinity pool with panoramic views of the Aegean Sea and the caldera.",
    image: {
      filename: "pool_greece",
      url: "https://images.pexels.com/photos/261169/pexels-photo-261169.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    price: 7500,
    location: "Oia",
    country: "Greece",
    category: "pools"
  },
  {
    title: "Jungle Oasis with Private Pool",
    description: "Escape to this serene villa in Ubud, surrounded by lush jungle. Your private infinity pool overlooks the vibrant green rice terraces.",
    image: {
      filename: "pool_bali",
      url: "https://images.pexels.com/photos/261395/pexels-photo-261395.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    price: 2800,
    location: "Ubud",
    country: "Indonesia",
    category: "pools"
  },
  {
    title: "Rooftop Pool with Cityscape Views",
    description: "Stay in a luxury apartment with access to one of the world's most famous rooftop infinity pools, offering stunning 360-degree views of the Singapore skyline.",
    image: {
      filename: "pool_singapore",
      url: "https://images.pexels.com/photos/261101/pexels-photo-261101.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    price: 6200,
    location: "Marina Bay",
    country: "Singapore",
    category: "pools"
  },
  {
    title: "Desert Modern Home & Pool",
    description: "Relax in this stylish mid-century modern home in Palm Springs. The beautifully designed pool is your private oasis in the desert heat.",
    image: {
      filename: "pool_palmsprings",
      url: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    price: 3200,
    location: "Palm Springs",
    country: "United States",
    category: "pools"
  },
  {
    title: "Heated Alpine Pool Retreat",
    description: "Enjoy a luxurious stay at this alpine resort, where you can swim in a heated outdoor pool while surrounded by the majestic snow-capped Swiss Alps.",
    image: {
      filename: "pool_alps",
      url: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    price: 8000,
    location: "Adelboden",
    country: "Switzerland",
    category: "pools"
  },
  // Camping
  {
    title: "Glamping Dome in Wadi Rum",
    description: "Experience the magic of the desert in a luxury geodesic dome. Enjoy modern comforts and a clear ceiling for incredible stargazing over the Jordanian desert.",
    image: {
      filename: "camping_jordan",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwXeG7HT8eJJoKMLY07E0McWxdjvgkcc9Odg&s"
    },
    price: 2500,
    location: "Wadi Rum",
    country: "Jordan",
    category: "camping"
  },
  {
    title: "Yosemite Valley Campsite",
    description: "A classic camping experience in the heart of Yosemite National Park. Pitch your tent with views of El Capitan and listen to the sounds of the Merced River.",
    image: {
      filename: "camping_yosemite",
      url: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    price: 500,
    location: "Yosemite",
    country: "United States",
    category: "camping"
  },
  {
    title: "Safari Tent on the Mara",
    description: "A luxury safari tent on the edge of the Maasai Mara. Fall asleep to the sounds of the wild and wake up to incredible wildlife viewing opportunities.",
    image: {
      filename: "camping_kenya",
      url: "https://cdn.audleytravel.com/700/500/79/439509-offbeat-mara-camp-masai-mara.jpg"
    },
    price: 9000,
    location: "Maasai Mara",
    country: "Kenya",
    category: "camping"
  },
  {
    title: "Lakeside Airstream in Banff",
    description: "Stay in a vintage, fully-equipped Airstream trailer parked by a turquoise lake in Banff National Park. Enjoy hiking, kayaking, and stunning mountain views.",
    image: {
      filename: "camping_banff",
      url: "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    price: 1800,
    location: "Banff",
    country: "Canada",
    category: "camping"
  },
  {
    title: "Aurora Borealis Yurt",
    description: "A cozy, heated yurt in Finnish Lapland designed for Northern Lights viewing. Experience the arctic wilderness in comfort and style.",
    image: {
      filename: "camping_finland",
      url: "https://images.pexels.com/photos/2666598/pexels-photo-2666598.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    price: 3200,
    location: "Lapland",
    country: "Finland",
    category: "camping"
  },
  // Farms
  {
    title: "Tuscan Vineyard Agriturismo",
    description: "Stay at a working vineyard in the heart of Tuscany. Participate in wine tasting, enjoy authentic Italian meals, and relax by the pool overlooking rolling hills.",
    image: {
      filename: "farm_italy",
      url: "https://images.pexels.com/photos/1128302/pexels-photo-1128302.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    price: 2200,
    location: "Chianti",
    country: "Italy",
    category: "farms"
  },
  {
    title: "Cotswolds Sheep Farm Cottage",
    description: "A charming stone cottage on a traditional sheep farm in the picturesque Cotswolds. Enjoy fresh farm eggs for breakfast and peaceful countryside walks.",
    image: {
      filename: "farm_england",
      url: "https://images.pexels.com/photos/132192/pexels-photo-132192.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    price: 1500,
    location: "Gloucestershire",
    country: "United Kingdom",
    category: "farms"
  },
  {
    title: "Lavender Farm Guesthouse in Provence",
    description: "Immerse yourself in the fragrant fields of Provence with a stay at this beautiful lavender farm. The guesthouse offers stunning views and rustic French charm.",
    image: {
      filename: "farm_france",
      url: "https://images.pexels.com/photos/2134224/pexels-photo-2134224.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    price: 1900,
    location: "Provence",
    country: "France",
    category: "farms"
  },
  {
    title: "Costa Rican Coffee Plantation Cabin",
    description: "Wake up to the smell of fresh coffee at this eco-friendly cabin on a working coffee plantation. Learn about the bean-to-cup process and explore the cloud forest.",
    image: {
      filename: "farm_costarica",
      url: "https://lp-cms-production.imgix.net/2024-10/GettyRF159111700.jpg?auto=format,compress&q=72&fit=crop"
    },
    price: 1300,
    location: "Monteverde",
    country: "Costa Rica",
    category: "farms"
  },
  {
    title: "Vermont Dairy Farm Stay",
    description: "A cozy getaway on a classic Vermont dairy farm. Help with morning chores, sample award-winning cheese, and enjoy the stunning New England landscape.",
    image: {
      filename: "farm_vermont",
      url: "https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    price: 1600,
    location: "Stowe",
    country: "United States",
    category: "farms"
  },
  // Boats
  {
    title: "Classic Amsterdam Houseboat",
    description: "Experience Amsterdam like a local on this charming houseboat in the Jordaan district. Enjoy breakfast on your private deck while watching the city wake up.",
    image: {
      filename: "boat_amsterdam",
      url: "https://images.pexels.com/photos/1682909/pexels-photo-1682909.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    price: 2100,
    location: "Amsterdam",
    country: "Netherlands",
    category: "boats"
  },
  {
    title: "Ha Long Bay Junk Boat Cruise",
    description: "Spend the night on a traditional junk boat, sailing through the stunning limestone karsts of Ha Long Bay. All meals and excursions included.",
    image: {
      filename: "boat_vietnam",
      url: "https://images.pexels.com/photos/1007088/pexels-photo-1007088.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    price: 3000,
    location: "Ha Long Bay",
    country: "Vietnam",
    category: "boats"
  },
  {
    title: "Sailing Yacht on the Croatian Coast",
    description: "Charter a modern sailing yacht and explore the idyllic islands of the Dalmatian Coast. Wake up in a new secluded bay every morning.",
    image: {
      filename: "boat_croatia",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeQw_SFZ81CaBzcQrIMzk8DU_0XZXMuah7-g&s"
    },
    price: 12000,
    location: "Split",
    country: "Croatia",
    category: "boats"
  },
  {
    title: "Kerala Backwaters Houseboat",
    description: "A traditional 'Kettuvallam' rice barge, converted into a luxury houseboat. Gently cruise the serene backwaters of Alleppey, enjoying authentic Keralan cuisine.",
    image: {
      filename: "boat_kerala",
      url: "https://images.pexels.com/photos/208701/pexels-photo-208701.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    price: 2500,
    location: "Alleppey",
    country: "India",
    category: "boats"
  },
  {
    title: "Norwegian Fjord Catamaran",
    description: "A private catamaran experience through the dramatic fjords of Norway. See towering cliffs, waterfalls, and quaint villages from the comfort of your own boat.",
    image: {
      filename: "boat_norway",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWu54OngRNF9C1UhGPW9ilXkLLcW2iwMbOVQ&s"
    },
    price: 15000,
    location: "Bergen",
    country: "Norway",
    category: "boats"
  }

];

export default sampleListings;