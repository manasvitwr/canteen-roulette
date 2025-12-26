
import React, { useState } from 'react';
import { doc, setDoc, collection, writeBatch, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase.ts';
import { MenuItem, FoodType, Temperature } from '../types/firestore.ts';
import { getEmojiForItem } from '../lib/menu.ts';

const RAW_MENU_DATA = `
## Cafeteria Canteen (Olive Greens by Jimmy Boy)
**Veg Savouries**
- Veg Punjabi Samosa - ₹25
- Mawa Samosa - ₹30
- Veg Puff - ₹30
- Veg Roll - ₹40
- Mushroom Puff - ₹40
- Veg Tandoori Puff - ₹40
- Veg Aloo Paratha - ₹40
- Mushroom & Cheese Quiche - ₹45
- Paneer Chilli Puff - ₹45
- 5" Veg Pizza - ₹50
- Paneer Sherwan Puff - ₹50
- Chutney Cheese Sandwich - ₹60
- Veg Wrap - ₹60
- Paneer Kulcha - ₹60
- Veg Burger - ₹70
- Veg Junglee Sandwich - ₹70
- Paneer Cheese Roll - ₹70
- Veg Forest Sandwich - ₹70
- Veg 3 Layer Sandwich (Brown) - ₹70
- Basil Cheese Tomato Sandwich (Multigrain) - ₹75
- Paneer Burji Sandwich - ₹75
- Paneer Tikka Sandwich - ₹80
- Broccoli & Corn Sandwich - ₹90
- Paneer Burger - ₹90
- Stuffed Croissant - ₹100

**Eggless Bakery**
- Choco Ball - ₹20
- Chocolate Tart - ₹40
- Chocolate Doughnut - ₹50
- Choco Lava - ₹60
- Chocolate Mousse Cup - ₹60
- Pineapple Well Cake - ₹70
- Eggless Brownie - ₹70
- Butter Croissant - ₹70
- Chocolate Pie - ₹70
- Apple Pie - ₹75
- Blueberry Pie - ₹80
- Honey Almond Pie - ₹80
- Garlic Cheese Croissant - ₹80
- Chocolate Croissant - ₹80
- Bombolini - ₹80
- Chocolate Well Cake - ₹80

**Lavazza Barista Coffee**
- Espresso - ₹100
- Americano - ₹110
- Macchiato - ₹120
- Cappuccino - ₹130
- Latte - ₹130
- Caramel Latte/Cappuccino - ₹150
- Hazelnut Latte/Cappuccino - ₹150
- Tiramisu Latte/Cappuccino - ₹150
- Classic Cold Coffee - ₹190
- Affogato - ₹200
- Classic Cold Coffee with Ice Cream - ₹230
- Caramel Cold Coffee - ₹240
- Tiramisu Cold Coffee - ₹240
- Tiramisu Cold Coffee with Ice Cream - ₹275

**Drinks**
- Half Cup Tea - ₹10
- Full Cup Tea - ₹14
- Filter Coffee - ₹18
- Fresh Lime Water - ₹60
- Fresh Lime Soda - ₹80
- Mint Mojito - ₹110
- Lemon Ice Tea - ₹120
- Blue Lagoon - ₹120
- Watermelon Fresh Juice - ₹130
- Mosambi Fresh Juice - ₹130
- Apple Fresh Juice - ₹130
- Blueberry Ice Tea - ₹130
- Vanilla Milkshake - ₹140
- ABC Fresh Juice - ₹150
- Chocolate Milkshake - ₹160
- Blueberry Milkshake - ₹160
- Hazelnut Chocolate Milkshake - ₹170
- Oreo Milkshake - ₹170
- Caramel Frappe - ₹185
- Irish Frappe - ₹185
- Hazelnut Frappe - ₹185
- Orange Fresh Juice - ₹190
- Vienna Frappe - ₹190

**Mughlai Dishes**
- Veg Korma - ₹150
- Veg Kadai - ₹180
- Veg Makhanwala - ₹180
- Veg Kolhapuri - ₹180
- Veg Hyderabadi - ₹180
- Bhindi Do Pyaza - ₹180
- Mushroom Kadai - ₹180
- Alu Gobi - ₹180
- Alu Mutter - ₹160
- Alu Palak - ₹160
- Jeera Alu - ₹160
- Paneer Kadai - ₹200
- Paneer Masala Gravy - ₹200
- Paneer Makhanwala - ₹200
- Paneer Tikka Masala - ₹220

**Chinese Value Bowls**
- Veg Schezwan Fried Rice with Veg Hot Garlic Gravy - ₹150
- Veg Hong Kong Fried Rice with Veg Hot Garlic Gravy - ₹150
- Veg Singapore Fried Rice with Veg Manchurian Gravy - ₹150
- Veg Burnt Garlic Fried Rice with Paneer Chilly Gravy - ₹160

**Salads**
- Mixed Sprout Salad - ₹180
- Garden Salad - ₹180
- Cold Mixed Lettuce Salad - ₹180
- Warm Roast Veg Salad - ₹250
- Fresh Citrus Salad - ₹250

**Soups**
- Tomato Soup - ₹150
- Veg Manchow Soup - ₹150
- Cream of Mushroom Soup - ₹200
- Broccoli Spinach Soup - ₹220

**Pastas**
- White Sauce Pasta - ₹250
- Red Sauce Pasta - ₹250
- Spicy Red Sauce Pasta - ₹250
- Pesto Pasta - ₹250
- Mornay Sauce Pasta - ₹250
- Pink Sauce Pasta - ₹250
- Aglio Olio Pasta - ₹250

## Maggi house
**Hot Favourites**
- Nescafe - ₹25
- Nescafe Cappuccino - ₹25
- Nescafe Moccucino - ₹25
- Hot Chocolate - ₹25
- Nescafe Black Coffee - ₹20
- Nescafe Café Latte - ₹20
- Chocolate Classic - ₹20
- Maggi Hot Cup Soup (Tomato) - ₹20
- Nestea Tea Bag - ₹10
- Nestea Lemon Tea - ₹20
- Chocolate Tea - ₹20

**Little Bites**
- Maggi Noodles - ₹25
- Maggi Pasta - ₹25
- Maggi (Flavour) - ₹25

**Cold Refreshers**
- Nescafe Frappe - ₹30
- Nestea Ice Tea (Lemon) - ₹25
- Coco Cold Coffee - ₹30
- Cold Chocolate - ₹30

## Engineering Canteen (Siddhi Services)
**Fresh Fruit Juice**
- Orange Juice - ₹52
- Mosambi Juice - ₹52
- Pineapple Juice - ₹52
- WaterMelon Juice - ₹52
- Mara Mari Juice - ₹52
- Ganga Jamuna Juice - ₹52
- Cocktail Juice - ₹52
- Papaya Juice - ₹52
- Grape Juice - ₹52
- Ice Tea - ₹52

**Milk Shakes**
- Chikku Milk Shake - ₹52
- Chocolate Milk Shake - ₹52
- Banana Milk Shake - ₹52
- Butter Scotch Milk Shake - ₹52
- Rose Milk Shake - ₹52
- Lichi Milk Shake - ₹52
- Strawberry Liquid Milk Shake - ₹52

**Special Milk Shakes**
- Chocolate + Coffee - ₹65
- Double + Chocolate - ₹65
- Chikku + Chocolate - ₹65
- Chikku + Banana - ₹65
- Rose + Watermelon - ₹65
- Kit Kat Milk Shake - ₹75
- Oreo Milk Shake - ₹75
- Mango Milk Shake (SSL) - ₹75
- Strawberry Milk Shake (SSL) - ₹75

**Franky Menu**
- Schezwan Noodles Franky - ₹50
- Double Cheese Franky - ₹105
- Cheese Schezwan Franky - ₹94
- Cheese Schezwan Paneer Franky - ₹100
- Cheese Schezwan Mayonise Franky - ₹100
- Cheese Schezwan Noodle Franky - ₹105
- Cheese Mayonise Paneer Franky - ₹105
- Cheese Schezwan Manchurian Franky - ₹79
- Cheese Schezwan Chilly Franky - ₹94
- Manchurian Schezwan Franky - ₹89
- Manchurian Chilly Cheese Franky - ₹58
- Manchurian Paneer Franky - ₹105
- Manchurian Mayonise Paneer Franky - ₹84
- Manchurian Cheese Mayonise Paneer Franky - ₹52
- Manchurian Noodles Franky - ₹100
- Paneer Cheese Chilly Franky - ₹126
- Paneer Mayonise Cheese Franky - ₹58
- Paneer Samosa Franky - ₹105
- Paneer Schezwan Franky - ₹115
- Paneer Noodles Franky - ₹84
- Paneer Mayonise Franky - ₹68
- Mayonise Schezwan Franky - ₹68
- Mayonise Samosa Franky - ₹58
- Mayonise Samosa Cheese Chilly Franky - ₹73
- Mayonise Noodles Franky - ₹115

**Sandwich**
- Bread Butter - ₹15
- Bread Butter Jam - ₹20
- Veg Sandwich - ₹25
- Veg Cheese Sandwich - ₹35
- Veg Toast Sandwich - ₹30
- Veg Cheese Toast Sandwich - ₹40
- Chutney Cheese Sandwich - ₹30
- Mayonnaise Cheese Sandwich - ₹40
- Schezwan Cheese Sandwich - ₹40
- Bread Toast Butter - ₹20
- Aloo Toast Sandwich - ₹30
- Jam Toast Sandwich - ₹30
- Veg Cheese Toast Sandwich - ₹40
- Paneer Toast Sandwich - ₹45
- Mayonnaise Toast Sandwich - ₹40
- Schezwan Toast Sandwich - ₹40

**Masala Sandwich**
- Masala Toast - ₹30
- Cheese Masala Toast - ₹40
- Paneer Masala Toast - ₹50
- Mayonnaise Masala Toast - ₹45
- Schezwan Masala Toast - ₹45

**Grill Sandwich**
- Veg Grill - ₹60
- Veg Cheese Grill - ₹70
- Paneer Grill - ₹80
- Veg Mayonnaise Grill - ₹70
- Veg Schezwan Grill - ₹70
- Chinese Cheese Grill - ₹80
- Samosa Grill - ₹60

**Chat Item**
- Sev Puri - ₹30
- Dahi Puri - ₹40
- Bhel Puri - ₹30
- Cheese Bhel - ₹45
- Samosa Plate - ₹30
- Ragda Patties - ₹40

**Hot Items**
- Tea - ₹15
- Coffee - ₹19
- Hot Milk - ₹26
- Tea (Half) - ₹10
- Tea (Staff) - ₹8

**Snacks**
- Samosa Pav - ₹20
- Vada Pav - ₹20
- Pav - ₹5
- Butter Pav - ₹10
- Batata Vada - ₹33
- Samosa Usal - ₹54
- Vada Usal - ₹48
- Vada Usal (Single) - ₹27
- Samosa Usal (Single) - ₹27
- Vada Samosa Usal - ₹54
- Dahi Samosa - ₹47
- Usal Pav - ₹34
- Misal Pav - ₹50
- Bread Pakoda - ₹39
- Idli Sambar - ₹39
- Medu Vada Sambar - ₹50
- Idli Wada - ₹50
- Dahi Idli - ₹53
- Butter Idli - ₹53
- Idli Fry - ₹50
- Dahi Misal Pav - ₹65
- Upma / Poha - ₹34

**Fast Items**
- Potato Chips with Lassi - ₹50
- Potato Toast with Lassi - ₹50
- Sabhudana Vada / Khichdi - ₹50
- Alu Jira - ₹50

**Dosa Items**
- Sada Dosa - ₹42
- Butter Sada Dosa - ₹60
- Cheese Sada Dosa - ₹76
- Masala Dosa - ₹60
- Cheese Masala Dosa - ₹80
- Mysore Sada Dosa - ₹55
- Mysore Masala Dosa - ₹76
- Cheese Mysore Sada - ₹80
- Cheese Mysore Masala - ₹97
- Chinese Sada Dosa - ₹50
- Chinese Dosa (Noodles) - ₹81
- Cheese Chinese Dosa - ₹105

**Special Uttappa**
- Sada Uttappa - ₹50
- Butter Sada Uttappa - ₹65
- Cheese Uttappa - ₹86
- Onion Uttappa - ₹55
- Cheese Onion Uttappa - ₹86
- Masala Uttappa - ₹55
- Cheese Masala Uttappa - ₹86
- Tomato Uttappa - ₹55
- Cheese Tomato Uttappa - ₹86
- Four Test Uttappa - ₹70
- Tomato Omlate - ₹60

## Aurobindo Canteen
**Energy Zone**
- Red Bull Energy Drink - ₹125
- Red Bull Sugarfree - ₹125
- Red Bull Yellow Edition - ₹125
- Red Bull Red Edition - ₹125

**Hot**
- Tea - ₹15
- Coffee - ₹19
- Hot Milk - ₹26
- Tea Half - ₹10
- Tea Staff - ₹8

**Fast Items**
- Potato Chips with Lassi - ₹50
- Potato Toast with Lassi - ₹50
- Sabudana Wada - ₹50
- Sabudana Khichadi with Lassi - ₹50
- Alu Khichadi with Lassi - ₹50
- Alu Jeera - ₹50

**Snacks**
- Samosa Pav - ₹20
- Vada Pav - ₹20
- Samosa Plate - ₹38
- Pav - ₹5
- Butter Pav - ₹10
- Batata Wada - ₹33
- Samosa Usal (Plate) - ₹54
- Vada Usal (Plate) - ₹48
- Vada Usal (Single) - ₹27
- Samosa Usal (Single) - ₹27
- Vada Samosa Usal - ₹54
- Dahi Samosa (Single) - ₹47
- Usal Pav - ₹34
- Misal Pav with 2 Pav - ₹50
- Bread Pakoda - ₹39
- Idli Sambar - ₹39
- Medu Wada Sambar - ₹50
- Idli Wada - ₹50
- Dahi Idli - ₹53
- Butter Idli - ₹53
- Idli Fry - ₹50
- Dahi Misal Pav - ₹65
- Upma / Poha - ₹34

**Dosa**
- Sada Dosa - ₹42
- Butter Sada Dosa - ₹60
- Cheese Sada Dosa - ₹76
- Masala Dosa - ₹60
- Cheese Masala Dosa - ₹80
- Mysore Sada Dosa - ₹55
- Mysore Masala Dosa - ₹76
- Cheese Mysore Sada Dosa - ₹80
- Cheese Mysore Masala Dosa - ₹97
- Chinese Sada Dosa - ₹50
- Chinese Dosa (Noodles) - ₹81
- Cheese Chinese Dosa - ₹105

**Uttapam**
- Sada Uttapam - ₹50
- Butter Sada Uttapam - ₹65
- Cheese Sada Uttapam - ₹86
- Onion Uttapam - ₹55
- Cheese Onion Uttapam - ₹86
- Masala Uttapam - ₹55
- Cheese Masala Uttapam - ₹86
- Tomato Uttapam - ₹55
- Cheese Tomato Uttapam - ₹86
- Four Taste Uttapam - ₹70
- Tomato Omlate - ₹60

**Sandwiches**
- Bread Butter - ₹30
- Toast Bread Butter - ₹40
- Veg. Sandwich - ₹36
- Veg. Cheese Sandwich - ₹86
- Veg. Cheese Toast Sandwich - ₹97
- Only Cheese Sandwich - ₹76
- Tomato Sandwich - ₹37
- Veg. Toast Sandwich - ₹60
- Only Cheese Toast Sandwich - ₹90
- Chinese Toast Sandwich - ₹65
- Cheese Club Sandwich - ₹105
- Cheese Chinese Toast Sandwich - ₹102
- Club Sandwich - ₹76

**Grilled**
- Veg Grilled Sandwich - ₹80
- Veg Cheese Grilled Sandwich - ₹102
- Chinese Grill Sandwich - ₹80
- Veg Chinese Cheese Grill Sandwich - ₹102

**Chaat**
- Bhel Puri - ₹38
- Sev Puri - ₹38
- Dahi Potato Puri - ₹60
- Bombay Puri - ₹66
- Sukha Bhel - ₹38
- Cheese Bhel - ₹80

**Extras**
- Extra Cheese - ₹37
- Extra Butter - ₹32
- Extra Pav - ₹30
- Extra Vati Sambar - ₹22
- Extra Vati Chutni - ₹15
- Extra Vati Sauce - ₹10

**Noodles**
- Veg. Hakka Noodles - ₹86
- Schezwan Noodles - ₹91
- Singapore Noodles - ₹91
- Manchurian Noodles - ₹91
- Triple Schezwan Noodles - ₹97

**Rice**
- Veg Fried Rice - ₹86
- Schezwan Rice - ₹91
- Singapore Rice - ₹91
- Manchurian Rice - ₹91
- Triple Schezwan Rice - ₹97

**Special Rice**
- Tomato Rice with Dahl - ₹80
- Lemon Rice - ₹66
- Paneer Chilli Rice - ₹118
- Veg Biryani Rice - ₹97
- Paneer Biryani Rice - ₹118

**Gravy**
- Veg Manchurian - ₹66
- Veg Chilly - ₹66
- Paneer Chilly - ₹107
- Idli Chilly - ₹66
- Schwan Manchurian - ₹66

**Choupsey**
- American Choupsey - ₹76
- Schezwan Choupsey - ₹76
- Chinese Choupsey - ₹76

**Soup**
- Manchow Soup - ₹68
- Tomato Soup - ₹68
- Clear Soup - ₹68

**Lunch**
- Chappati Bhaji - ₹60
- Chappati Paneer Bhaji - ₹76
- Puri Sada Bhaji - ₹60
- Puri Paneer Bhaji - ₹76
- Potato Bhaji - ₹45
- Paneer Bhaji (Full) - ₹76
- Paneer Bhaji (Half) - ₹47
- Sada Bhaji (Full) - ₹55
- Sada Bhaji (Half) - ₹37
- Veg Raita - ₹34
- Plain Dahi (Curd) - ₹28
- Single Chappati - ₹7
- Dal Fry - ₹38
- Lunch - ₹76
- Lunch with Pulav - ₹86
- Lunch with Jeera Rice - ₹86
- Dal Rice - ₹44
- Dal Fry Rice - ₹70
- Dal Rice with Bhaji - ₹65
- Dahi Rice (Plain) - ₹65
- Dahi Masala Rice - ₹76
- Jeera Rice with Sambar - ₹65
- Jeera Rice with Sada Bhaji - ₹76
- Jeera Rice with Paneer Bhaji - ₹86
- Jeera Rice with Dal Fry - ₹81
- Jeera Rice with Raita - ₹86
- Pulav Rice with Sambar - ₹76
- Pulav Rice with Sada Bhaji - ₹81
- Pulav Rice with Paneer Bhaji - ₹86
- Pulav Rice with Dal Fry - ₹76
- Masala Rice with Sambar - ₹76
- Masala Rice with Raita - ₹86
- Masala Rice with Sada Bhaji - ₹86
- Masala Rice with Paneer Bhaji - ₹91
`;

const AdminSeed: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  if (process.env.NODE_ENV !== 'development') {
    return <div className="p-8 text-center text-neutral-500 uppercase font-black text-xs">Restricted</div>;
  }

  const parseMenu = () => {
    const lines = RAW_MENU_DATA.split('\n');
    const menuItems: MenuItem[] = [];
    let currentCanteenId = '';
    let currentCategory = '';
    let skippedLines = 0;

    const canteenMap: Record<string, string> = {
      'Cafeteria Canteen (Olive Greens by Jimmy Boy)': 'eklavya',
      'Maggi house': 'maggi',
      'Engineering Canteen (Siddhi Services)': 'engg',
      'Aurobindo Canteen': 'aurobindo'
    };

    const getType = (category: string): FoodType => {
      const c = category.toLowerCase();
      if (c.includes('coffee') || c.includes('drinks') || c.includes('juice') || c.includes('shake') || c.includes('refreshers') || c.includes('tea')) return 'beverage';
      if (c.includes('dishes') || c.includes('bowl') || c.includes('pasta') || c.includes('soup') || c.includes('salad') || c.includes('thali')) return 'meal';
      return 'snack';
    };

    const getTemperature = (name: string, category: string): Temperature => {
      const combined = (name + ' ' + category).toLowerCase();
      if (combined.includes('cold') || combined.includes('ice') || combined.includes('juice') || combined.includes('shake') || combined.includes('frappe') || combined.includes('soda') || combined.includes('mojito') || combined.includes('bhel') || combined.includes('puri') || combined.includes('salad') || combined.includes('fresh')) {
        if (combined.includes('warm roast')) return 'hot';
        return 'cold';
      }
      return 'hot';
    };

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      if (trimmed.startsWith('## ')) {
        const canteenName = trimmed.replace('## ', '');
        currentCanteenId = canteenMap[canteenName] || '';
      } else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        currentCategory = trimmed.replace(/\*\*/g, '');
      } else if (trimmed.startsWith('- ')) {
        if (!currentCanteenId || !currentCategory) {
          skippedLines++;
          return;
        }

        const parts = trimmed.replace('- ', '').split(' - ₹');
        if (parts.length === 2) {
          const name = parts[0].trim();
          const price = parseInt(parts[1].trim());
          const id = `${currentCanteenId}-${currentCategory.toLowerCase().replace(/\s+/g, '-')}-${name.toLowerCase().replace(/[\s\/]+/g, '-')}`.slice(0, 100);

          menuItems.push({
            id,
            canteenId: currentCanteenId,
            name,
            category: currentCategory,
            price,
            isVeg: true, // Dataset is largely vegetarian based on names
            type: getType(currentCategory),
            temperature: getTemperature(name, currentCategory),
            tags: price > 70 ? [currentCategory.toLowerCase(), 'popular'] : [currentCategory.toLowerCase()],
            rarityWeight: price > 80 ? 2 : 4,
            emoji: getEmojiForItem(name, currentCategory)
          });
        }
      }
    });

    console.log(`Parsed ${menuItems.length} items. Skipped ${skippedLines} lines.`);
    return menuItems;
  };

  const seedData = async () => {
    setLoading(true);
    setStatus('Parsing menu data...');
    try {
      const canteens = [
        { id: 'engg', name: 'Engineering Canteen', slug: 'engineering-canteen', locationTag: 'Near Bhaskaracharya Building', isActive: true, type: 'canteen' as const },
        { id: 'maggi', name: 'Maggi House', slug: 'maggi-house', locationTag: 'Near AryaBhatta Building', isActive: true, type: 'canteen' as const },
        { id: 'eklavya', name: 'Eklavya Café', slug: 'eklavya-cafe', locationTag: 'Sports Canteen (opp to Somaiya Sports Academy Building)', isActive: true, type: 'canteen' as const },
        { id: 'aurobindo', name: 'Aurobindo Canteen', slug: 'aurobindo-canteen', locationTag: 'Aurobindo Building', isActive: true, type: 'canteen' as const },
        { id: 'management', name: 'Management Canteen', slug: 'management-canteen', locationTag: 'Management Building', isActive: true, type: 'canteen' as const },
        { id: 'poly-hostel', name: 'Polytechnic Hostel', slug: 'polytechnic-hostel', locationTag: 'Near K.J Somaiya Polytechnic Building', isActive: true, type: 'mess' as const },
        { id: 'maitreyi-hostel', name: 'Maitreyi Hostel', slug: 'maitreyi-hostel', locationTag: 'Near KJSIM', isActive: true, type: 'mess' as const },
        { id: 'sandipani-hostel', name: 'Sandipani Hostel', slug: 'sandipani-hostel', locationTag: 'Near KJSIM', isActive: true, type: 'mess' as const }
      ];

      // Parse all items from RAW_MENU_DATA
      const menuItems = parseMenu();
      const parsedItemIds = new Set(menuItems.map(item => item.id));

      setStatus('Cleaning up old items...');

      // Get all existing items from Firestore
      const menuRef = collection(db, 'menu_items');
      const existingSnapshot = await getDocs(menuRef);

      let deletedCount = 0;
      const deleteBatch = writeBatch(db);

      // Delete items that are NOT in the parsed data
      existingSnapshot.forEach((docSnapshot) => {
        if (!parsedItemIds.has(docSnapshot.id)) {
          deleteBatch.delete(doc(db, 'menu_items', docSnapshot.id));
          deletedCount++;
        }
      });

      if (deletedCount > 0) {
        await deleteBatch.commit();
        console.log(`Deleted ${deletedCount} old items`);
      }

      setStatus('Seeding canteens and menu items...');

      // Seed canteens and menu items
      const seedBatch = writeBatch(db);

      canteens.forEach(c => {
        seedBatch.set(doc(db, 'canteens', c.id), c);
      });

      menuItems.forEach(m => {
        seedBatch.set(doc(db, 'menu_items', m.id), m);
      });

      await seedBatch.commit();
      setStatus(`Success! Seeded ${canteens.length} canteens and ${menuItems.length} menu items. Deleted ${deletedCount} old items.`);
    } catch (error: any) {
      console.error(error);
      setStatus('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-black">Admin Seeding</h1>
      <p className="text-sm text-neutral-500">Seed real Somaiya menu data parsed from RAW_MENU_DATA.</p>
      <button onClick={seedData} disabled={loading} className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black shadow-lg">
        {loading ? 'Processing...' : 'Seed Real Data'}
      </button>
      {status && <div className="p-4 rounded-xl text-center text-xs font-black bg-neutral-100 border">{status}</div>}
    </div>
  );
};

export default AdminSeed;
