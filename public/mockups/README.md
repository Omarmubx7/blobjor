# Product Mockup Assets Setup Guide

## Directory Structure

```
public/mockups/
├── hoodie/
│   ├── black-front.png     # Black hoodie, front view
│   ├── black-back.png      # Black hoodie, back view
│   ├── white-front.png     # White hoodie, front view
│   ├── white-back.png      # White hoodie, back view
│   ├── heather-grey-front.png
│   ├── heather-grey-back.png
│   ├── navy-front.png
│   ├── navy-back.png
│   └── masks/
│       ├── front-print-area.png   # Transparent mask for front
│       └── back-print-area.png    # Transparent mask for back
├── mug/
│   ├── white-front.png
│   ├── black-front.png
│   └── masks/
│       └── front-print-area.png
└── textures/
    └── fabric-overlay.png  # Fabric texture for realism
```

## Image Requirements

### Product Photos
- **Resolution**: 2400x2400px minimum (3x the display size)
- **Format**: PNG with consistent lighting
- **Background**: Solid color or transparent
- **Consistency**: Same angle, lighting, and positioning across all colors

### Print Area Masks
- **Format**: PNG with transparency
- **Purpose**: Defines where the design can be placed
- **White area**: Print area (where design appears)
- **Transparent area**: Non-printable (product area)

### Fabric Texture
- **Size**: 512x512px tileable
- **Opacity**: Very subtle (will be applied at 10-15%)
- **Purpose**: Adds realistic fabric feel to digital mockups

## Where to Get Mockups

### Option 1: Professional Mockup Services (Recommended)
1. **Placeit.net** - Ready-made mockups with multiple colors
2. **Smartmockups.com** - High-quality product mockups
3. **Envato Elements** - Large library of mockups
4. **Yellow Images** - Premium quality 3D mockups

### Option 2: DIY Photography
1. Purchase blank hoodies/mugs in all your colors
2. Hire a photographer for consistent studio shots
3. Use Photoshop to create print area masks
4. Ensure same angle and lighting for all photos

### Option 3: 3D Rendering
1. Use Blender (free) with hoodie/mug 3D models
2. Render multiple colors with consistent lighting
3. Export high-resolution PNG files

## Print Area Specifications

### Hoodie Front
- Position: 22% from left, 25% from top
- Size: 56% width, 40% height
- Actual print size: ~11" x 14" (28cm x 35cm)

### Hoodie Back
- Position: 20% from left, 18% from top
- Size: 60% width, 50% height
- Actual print size: ~12" x 16" (30cm x 40cm)

### Mug
- Position: 12% from left, 20% from top
- Size: 60% width, 45% height
- Wrap-around print area

## Color IDs Mapping

| Color ID       | Display Name (AR) | Hex Code |
|---------------|-------------------|----------|
| black         | أسود              | #1a1a1a  |
| white         | أبيض              | #FFFFFF  |
| heather-grey  | رمادي فاتح        | #9CA3AF  |
| navy          | كحلي              | #1E3A5F  |
| royal-blue    | أزرق ملكي         | #1D4ED8  |
| forest-green  | أخضر غامق         | #166534  |
| maroon        | عنابي             | #7F1D1D  |
| purple        | بنفسجي            | #7C3AED  |

## Testing

Once you've added the mockup images, the system will automatically:
1. Detect if a product photo exists for the selected color
2. Use the realistic photo-based mockup if available
3. Fall back to the synthetic (shape-based) mockup if not

The preview will show a "✓ صورة واقعية" badge when using real photos.

## Performance Tips

1. Optimize images with tools like TinyPNG before adding
2. Use WebP format if browser support allows
3. Consider lazy loading for colors not initially selected
4. Pre-generate mockups on server for frequently used combinations
