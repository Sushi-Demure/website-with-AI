// ============================================================
// SUSHI DEMURE — Mock Menu Data
// Replace with dynamic API data when backend is ready.
// ============================================================

window.MENU_DATA = [
  // Our Signature
  { id:1, category:'Our Signature', nameEn:'Sushi Demure', nameAr:'سوشي ديميور', descEn:'Special maki with choice of filling, Japanese mayo, and sriracha.', descAr:'ماكي مميّزة بحشوٍ اختياري ومايونيز ياباني وسيراتشا.', price:55, calories:50, tag:'popular', img:'https://images.deliveryhero.io/image/menu-import-gateway-prd/regions/ME/chains/HS-SUSHI/5539d9d18d366867e1583f3b18046036.png?quality=75&webp=true&width=1440' },
  { id:2, category:'Our Signature', nameEn:'Special Volcano', nameAr:'سبيشال فولكينو', descEn:'Shrimp, avocado, cucumber, bang bang sauce, and crunchy cornflakes.', descAr:'روبيان، أفوكادو، خيار، صلصة بانج بانج، وذرة رقائق مقرمشة.', price:30, calories:33, tag:'popular', img:'https://images.deliveryhero.io/image/menu-import-gateway-prd/regions/ME/chains/HS-SUSHI/35afc2d1621505913d3465c3cf603d63.png?quality=75&webp=true&width=1440' },
  { id:3, category:'Our Signature', nameEn:'Shrimp Bomb', nameAr:'شريمب بومب', descEn:'Crispy shrimp, avocado, yum yum sauce, crunchy breadcrumbs', descAr:'روبيان مقرمش، أفوكادو، صلصة يم يم، فتات خبز مقرمش', price:45, tag:'new', img:'https://unsplash.com/photos/nfUUIpIfm9E/download?force=true&w=1200' },

  // Salmon Sushi
  { id:4, category:'Salmon Sushi', nameEn:'Ocean Roll', nameAr:'أوشن رول', descEn:'Crispy shrimp tempura with Japanese eel sauce; rich smoky taste.', descAr:'روبيان تمبورا مقرمش بصلصة الأنقليس اليابانية؛ نكهة غنية مائلة للدخان.', price:28, calories:61, tag:'popular', img:'https://images.deliveryhero.io/image/menu-import-gateway-prd/regions/ME/chains/HS-SUSHI/777b800259064f521d6e81cceca1b432.jpg?quality=75&webp=true&width=1440' },
  { id:5, category:'Salmon Sushi', nameEn:'Salmon Avocado', nameAr:'سالمون أفوكادو', descEn:'Fresh salmon, avocado, cucumber, sesame', descAr:'سالمون طازج، أفوكادو، خيار، سمسم', price:42, tag:null, img:'https://unsplash.com/photos/dH9zt0QuQL0/download?force=true&w=1200' },
  { id:6, category:'Salmon Sushi', nameEn:'Super Crunchy', nameAr:'سوبر كرانشي', descEn:'Salmon, cream cheese, tempura crunch, spicy mayo', descAr:'سالمون، جبن كريمي، كرانشي تمبورا، مايو حار', price:49, tag:null, img:'https://unsplash.com/photos/5KS7T3Gs3CA/download?force=true&w=1200' },

  // Ramen
  { id:7, category:'Ramen', nameEn:'Tonkotsu Ramen', nameAr:'رامين تونكوتسو', descEn:'Rich pork bone broth, chashu pork, soft egg, bamboo', descAr:'مرق عظام الخنزير الغني، شاشو، بيضة طرية، خيزران', price:62, tag:'popular', img:'https://unsplash.com/photos/gp9fq2XxJ2c/download?force=true&w=1200' },
  { id:8, category:'Ramen', nameEn:'Spicy Miso Ramen', nameAr:'رامين ميسو الحار', descEn:'Miso broth, chili oil, corn, mushrooms, green onion', descAr:'مرق ميسو، زيت فلفل، ذرة، فطر، بصل أخضر', price:58, tag:'spicy', img:'https://unsplash.com/photos/uuwszaQpOHk/download?force=true&w=1200' },

  // De Poke Bowls
  { id:9, category:'De Poke Bowls', nameEn:'Salmon Poke', nameAr:'بوك بول سالمون', descEn:'Sushi rice, fresh salmon, edamame, cucumber, mango, sesame', descAr:'أرز سوشي، سالمون طازج، إيدامامي، خيار، مانجو، سمسم', price:65, tag:'popular', img:'https://unsplash.com/photos/Mwtmk37_0S4/download?force=true&w=1200' },
  { id:10, category:'De Poke Bowls', nameEn:'Tuna Poke', nameAr:'بوك بول تونا', descEn:'Sushi rice, ahi tuna, avocado, radish, ponzu', descAr:'أرز سوشي، تونا، أفوكادو، فجل، بونزو', price:68, tag:null, img:'https://unsplash.com/photos/oj-5gzN_SDg/download?force=true&w=1200' },

  // Starters
  { id:11, category:'Starters', nameEn:'Gomae Salad', nameAr:'سلطة جوماي', descEn:'First in Saudi Arabia — fried shrimp, cucumber, goma sauce, pickles', descAr:'الأول في السعودية — روبيان مقلي، خيار، صلصة جوما، مخلل', price:38, tag:'new', img:'https://unsplash.com/photos/8QJ6Z-s-53c/download?force=true&w=1200' },
  { id:12, category:'Starters', nameEn:'Gyoza (6 pcs)', nameAr:'جيوزا (6 قطع)', descEn:'Pan-fried dumplings, chicken filling, ponzu dip', descAr:'زلابية مقلية، حشوة دجاج، غموس بونزو', price:32, tag:null, img:'https://unsplash.com/photos/klTf2RN37Ts/download?force=true&w=1200' },

  // Chicken Sushi
  { id:13, category:'Chicken Sushi', nameEn:'Shiny Chicken', nameAr:'شايني تشيكن', descEn:'Crispy chicken, teriyaki glaze, mayo, cucumber', descAr:'دجاج مقرمش، صلصة تيرياكي، مايو، خيار', price:40, tag:'popular', img:'https://unsplash.com/photos/FeY6HZIbhnk/download?force=true&w=1200' },
  { id:14, category:'Chicken Sushi', nameEn:'Hot Smiley Crab', nameAr:'هوت سمايلي كراب', descEn:'Spicy crab mix, cucumber, avocado, sriracha drizzle', descAr:'كراب حار، خيار، أفوكادو، سيراتشا', price:44, tag:'spicy', img:'https://unsplash.com/photos/moRC8S5K8AM/download?force=true&w=1200' },

  // Vegetarian Sushi
  { id:15, category:'Vegetarian Sushi', nameEn:'Veggie Garden', nameAr:'فيجي جاردن', descEn:'Avocado, cucumber, mango, carrot, sesame, sweet sauce', descAr:'أفوكادو، خيار، مانجو، جزر، سمسم، صلصة حلوة', price:36, tag:null, img:'https://unsplash.com/photos/7vN6VuTn9sg/download?force=true&w=1200' },

  // Crab Sushi
  { id:16, category:'Crab Sushi', nameEn:'Crazy Crab', nameAr:'كريزي كراب', descEn:'Crab mix, spicy mayo, cucumber, tobiko', descAr:'مزيج كراب، مايو حار، خيار، توبيكو', price:46, tag:'popular', img:'https://unsplash.com/photos/cUXOAApg_so/download?force=true&w=1200' },

  // Shrimp Sushi
  { id:17, category:'Shrimp Sushi', nameEn:'Shrimp Tempura Roll', nameAr:'رول روبيان تمبورا', descEn:'Crispy shrimp, avocado, cucumber, spicy mayo', descAr:'روبيان مقرمش، أفوكادو، خيار، مايو حار', price:44, tag:null, img:'https://unsplash.com/photos/O1S3z5NJldI/download?force=true&w=1200' },

  // Boxes
  { id:18, category:'Boxes', nameEn:'Sushi Demure Box', nameAr:'بوكس سوشي ديميور', descEn:'32 pcs — best-selling mix: maki, volcano, shrimp bomb, crunchy, crab', descAr:'32 قطعة — مزيج الأكثر مبيعاً: ماكي، فولكينو، شريمب بومب، كرانشي، كراب', price:149, tag:'popular', img:'https://unsplash.com/photos/B0CqUD3VaTE/download?force=true&w=1200' },
  { id:19, category:'Boxes', nameEn:'Fun Box (12 pcs)', nameAr:'فن بوكس (12 قطعة)', descEn:'12 assorted rolls, selected to surprise you', descAr:'12 رول متنوع مختار ليفاجئك', price:75, tag:null, img:'https://unsplash.com/photos/7vN6VuTn9sg/download?force=true&w=1200' },

  // Sushi Cake
  { id:20, category:'Sushi Cake', nameEn:'Sushi Cake 3 Persons', nameAr:'كيكة السوشي (٣ أشخاص)', descEn:'Sushi cake signature item, first time in Riyadh.', descAr:'كيكة سوشي مميّزة، تُقدَّم لأول مرة في الرياض.', price:299, calories:1590, tag:'new', img:'https://images.deliveryhero.io/image/menu-import-gateway-prd/regions/ME/chains/HS-SUSHI/4a11cb3698ac3d65404c1e3f8b43ebd0.png?quality=75&webp=true&width=1440' },

  // Japanese Curry
  { id:21, category:'Japanese Curry', nameEn:'Chicken Katsu Curry', nameAr:'كاري كاتسو دجاج', descEn:'Panko-crusted chicken, Japanese golden curry, steamed rice', descAr:'دجاج مغطى بالبانكو، كاري ياباني ذهبي، أرز مطهو', price:55, tag:'popular', img:'https://unsplash.com/photos/_sfMD-OhFR8/download?force=true&w=1200' },

  // Noodles
  { id:22, category:'Noodles', nameEn:'Yaki Udon', nameAr:'ياكي أودون', descEn:'Thick udon noodles, vegetables, teriyaki sauce, soft egg', descAr:'نودلز أودون سميكة، خضروات، صلصة تيرياكي، بيضة طرية', price:48, tag:null, img:'https://unsplash.com/photos/FmZFV2Ba-lk/download?force=true&w=1200' },

  // Fried Rice
  { id:23, category:'Fried Rice', nameEn:'Salmon Fried Rice', nameAr:'أرز مقلي سالمون', descEn:'Wok-fried rice, salmon, egg, green onion, soy glaze', descAr:'أرز مقلي بالووك، سالمون، بيض، بصل أخضر، صلصة صويا', price:52, tag:null, img:'https://unsplash.com/photos/NT5oqzp-050/download?force=true&w=1200' },

  // Special Salad
  { id:24, category:'Special Salad', nameEn:'Al Salad', nameAr:'آل سلاد', descEn:'Mixed greens, Japanese dressing, sesame, crispy wontons', descAr:'خضار مشكلة، تتبيلة يابانية، سمسم، ونتون مقرمش', price:34, tag:null, img:'https://unsplash.com/photos/_vy3L5n8VnI/download?force=true&w=1200' },

  // Drinks
  { id:25, category:'Drinks', nameEn:'Yuzu Lemonade', nameAr:'ليمونادة يوزو', descEn:'Fresh yuzu, lemon, honey, sparkling water', descAr:'يوزو طازج، ليمون، عسل، مياه فوارة', price:22, tag:'new', img:'https://unsplash.com/photos/U-EKeLfuTGU/download?force=true&w=1200' },
  { id:26, category:'Drinks', nameEn:'Matcha Latte', nameAr:'لاتيه ماتشا', descEn:'Ceremonial matcha, steamed milk, oat milk option', descAr:'ماتشا احتفالية، حليب مبخر، خيار حليب الشوفان', price:25, tag:'popular', img:'https://unsplash.com/photos/LKmqNL-E4fk/download?force=true&w=1200' },

  // Sauces
  { id:27, category:'Sauces', nameEn:'Dynamite Sauce', nameAr:'صلصة ديناميت', descEn:'Our house special — spicy, creamy, addictive', descAr:'صلصة البيت المميزة — حارة، كريمية، لا تقاوم', price:8, tag:null, img:'https://unsplash.com/photos/k0Y_hz0FE5I/download?force=true&w=1200' },
  { id:28, category:'Sauces', nameEn:'Yum Yum Sauce', nameAr:'صلصة يم يم', descEn:'Japanese-style mayo sauce, mild & sweet', descAr:'صلصة مايو يابانية، خفيفة وحلوة', price:8, tag:null, img:'https://unsplash.com/photos/XQBQKNlVlXM/download?force=true&w=1200' },
];
