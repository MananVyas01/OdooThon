// Smart Tag Suggestion Utility
export const suggestTags = (title = '', description = '', category = '') => {
  const text = `${title} ${description} ${category}`.toLowerCase();
  const suggestedTags = new Set();

  // Material-based suggestions
  const materials = {
    'cotton': ['cotton', 'breathable', 'natural'],
    'denim': ['denim', 'casual', 'versatile'],
    'silk': ['silk', 'elegant', 'luxury'],
    'wool': ['wool', 'warm', 'winter'],
    'polyester': ['polyester', 'durable', 'easy-care'],
    'linen': ['linen', 'summer', 'lightweight'],
    'cashmere': ['cashmere', 'soft', 'premium'],
    'leather': ['leather', 'durable', 'classic'],
    'suede': ['suede', 'textured', 'stylish'],
    'velvet': ['velvet', 'luxurious', 'formal']
  };

  // Style-based suggestions
  const styles = {
    'vintage': ['vintage', 'retro', 'classic'],
    'modern': ['modern', 'contemporary', 'sleek'],
    'casual': ['casual', 'everyday', 'comfortable'],
    'formal': ['formal', 'professional', 'elegant'],
    'business': ['business', 'professional', 'work'],
    'party': ['party', 'festive', 'dressy'],
    'street': ['streetwear', 'urban', 'trendy'],
    'boho': ['bohemian', 'free-spirited', 'artistic'],
    'minimalist': ['minimalist', 'simple', 'clean'],
    'grunge': ['grunge', 'edgy', 'alternative']
  };

  // Color-based suggestions
  const colors = {
    'black': ['black', 'versatile', 'classic'],
    'white': ['white', 'clean', 'fresh'],
    'blue': ['blue', 'calming', 'versatile'],
    'red': ['red', 'bold', 'statement'],
    'green': ['green', 'natural', 'fresh'],
    'yellow': ['yellow', 'bright', 'cheerful'],
    'pink': ['pink', 'feminine', 'soft'],
    'purple': ['purple', 'royal', 'elegant'],
    'brown': ['brown', 'earthy', 'natural'],
    'gray': ['gray', 'neutral', 'sophisticated'],
    'grey': ['grey', 'neutral', 'sophisticated'],
    'navy': ['navy', 'classic', 'professional'],
    'beige': ['beige', 'neutral', 'timeless'],
    'tan': ['tan', 'warm', 'earthy']
  };

  // Item-specific suggestions
  const itemTypes = {
    'jeans': ['jeans', 'casual', 'denim', 'everyday'],
    'dress': ['dress', 'feminine', 'elegant'],
    'shirt': ['shirt', 'versatile', 'professional'],
    'blouse': ['blouse', 'feminine', 'elegant'],
    'jacket': ['jacket', 'outerwear', 'layering'],
    'coat': ['coat', 'outerwear', 'warm'],
    'sweater': ['sweater', 'cozy', 'warm'],
    'skirt': ['skirt', 'feminine', 'versatile'],
    'pants': ['pants', 'bottoms', 'versatile'],
    'shorts': ['shorts', 'summer', 'casual'],
    'top': ['top', 'casual', 'everyday'],
    'cardigan': ['cardigan', 'layering', 'cozy'],
    'blazer': ['blazer', 'professional', 'structured'],
    'hoodie': ['hoodie', 'casual', 'comfortable'],
    'tshirt': ['tshirt', 'casual', 'everyday'],
    't-shirt': ['tshirt', 'casual', 'everyday'],
    'tank': ['tank', 'summer', 'layering'],
    'jumpsuit': ['jumpsuit', 'one-piece', 'versatile'],
    'romper': ['romper', 'playful', 'summer']
  };

  // Brand-based suggestions
  const brands = {
    'zara': ['zara', 'trendy', 'affordable'],
    'h&m': ['h&m', 'fast-fashion', 'trendy'],
    'uniqlo': ['uniqlo', 'basic', 'quality'],
    'levi': ['levis', 'denim', 'classic'],
    'nike': ['nike', 'athletic', 'sportswear'],
    'adidas': ['adidas', 'athletic', 'streetwear'],
    'gap': ['gap', 'casual', 'american'],
    'forever': ['forever21', 'trendy', 'young'],
    'urban': ['urban-outfitters', 'trendy', 'alternative'],
    'anthropologie': ['anthropologie', 'bohemian', 'unique'],
    'j.crew': ['jcrew', 'preppy', 'classic'],
    'banana': ['banana-republic', 'professional', 'sophisticated']
  };

  // Condition-based suggestions
  const conditions = {
    'new': ['new', 'unworn', 'perfect'],
    'like-new': ['like-new', 'excellent', 'barely-worn'],
    'good': ['good-condition', 'well-maintained'],
    'fair': ['fair-condition', 'some-wear'],
    'vintage': ['vintage', 'pre-loved', 'character']
  };

  // Season-based suggestions
  const seasons = {
    'summer': ['summer', 'lightweight', 'breathable'],
    'winter': ['winter', 'warm', 'cozy'],
    'spring': ['spring', 'transitional', 'fresh'],
    'fall': ['fall', 'autumn', 'layering'],
    'autumn': ['autumn', 'fall', 'layering']
  };

  // Check each category and add relevant tags
  Object.entries(materials).forEach(([key, tags]) => {
    if (text.includes(key)) {
      tags.forEach(tag => suggestedTags.add(tag));
    }
  });

  Object.entries(styles).forEach(([key, tags]) => {
    if (text.includes(key)) {
      tags.forEach(tag => suggestedTags.add(tag));
    }
  });

  Object.entries(colors).forEach(([key, tags]) => {
    if (text.includes(key)) {
      tags.forEach(tag => suggestedTags.add(tag));
    }
  });

  Object.entries(itemTypes).forEach(([key, tags]) => {
    if (text.includes(key)) {
      tags.forEach(tag => suggestedTags.add(tag));
    }
  });

  Object.entries(brands).forEach(([key, tags]) => {
    if (text.includes(key)) {
      tags.forEach(tag => suggestedTags.add(tag));
    }
  });

  Object.entries(conditions).forEach(([key, tags]) => {
    if (text.includes(key)) {
      tags.forEach(tag => suggestedTags.add(tag));
    }
  });

  Object.entries(seasons).forEach(([key, tags]) => {
    if (text.includes(key)) {
      tags.forEach(tag => suggestedTags.add(tag));
    }
  });

  // Category-specific suggestions
  if (category) {
    const categoryTags = {
      'tops': ['tops', 'upper-body', 'layering'],
      'bottoms': ['bottoms', 'lower-body', 'pants'],
      'dresses': ['dresses', 'one-piece', 'feminine'],
      'outerwear': ['outerwear', 'layering', 'protection'],
      'shoes': ['shoes', 'footwear', 'accessories'],
      'accessories': ['accessories', 'finishing-touch', 'style'],
      'activewear': ['activewear', 'athletic', 'performance'],
      'formal': ['formal', 'dressy', 'special-occasion']
    };

    if (categoryTags[category.toLowerCase()]) {
      categoryTags[category.toLowerCase()].forEach(tag => suggestedTags.add(tag));
    }
  }

  // Convert to array and limit to 8 suggestions
  return Array.from(suggestedTags).slice(0, 8);
};

// Enhanced version with OpenAI integration (optional)
export const suggestTagsWithAI = async (title, description, category) => {
  try {
    // This would require OpenAI API key and configuration
    // For now, fallback to rule-based suggestions
    const ruleBased = suggestTags(title, description, category);
    
    // If OpenAI is configured, you could enhance with:
    /*
    const response = await fetch('/api/suggest-tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        category,
        fallback: ruleBased
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.tags;
    }
    */
    
    return ruleBased;
  } catch (error) {
    console.error('Error suggesting tags:', error);
    return suggestTags(title, description, category);
  }
};

export default suggestTags;
