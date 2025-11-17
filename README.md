# Airtable Puck Extension 🎨

A powerful Airtable Interface Extension that integrates [Puck](https://puckeditor.com/) as a visual page builder, allowing you to create rich content layouts backed by Airtable data.

## 🎯 Features

- **Visual Page Builder**: Drag-and-drop interface powered by Puck
- **Airtable Integration**: Store page content as JSON in Airtable fields
- **DataRef Query System** 🔗: Query Airtable data dynamically instead of hard-coding record IDs
- **Dark Mode Support**: Automatic dark/light mode using Tailwind CSS with Airtable's design tokens
- **Publish on Demand**: Click "Publish" to save your changes to Airtable
- **Custom Components**: Hero sections, columns layout, text, and data-driven stats cards
- **TypeScript**: Fully typed for better DX and fewer bugs
- **Performance Optimized**: Minimal re-renders and efficient data loading

## 📋 Prerequisites

1. **Airtable Account** with permission to create Interface Extensions
2. **Node.js** 18+ and npm
3. **Airtable Base** with a table configured (see setup below)

## 🚀 Quick Start

### 1. Fix NPM Permissions (if needed)

If you encounter npm cache permission errors, run:

```bash
sudo chown -R $(whoami) ~/.npm
```

### 2. Install Dependencies

```bash
npm install

# Install Puck (may need legacy peer deps for React 19)
npm install @measured/puck --legacy-peer-deps

# Install TypeScript and dev dependencies
npm install --save-dev typescript @types/react @types/react-dom prettier
```

### 3. Set Up Your Airtable Base

Create a table in your Airtable base with these fields:

**Table Name**: `Layouts` (or any name you prefer)

| Field Name | Field Type | Description |
|------------|------------|-------------|
| Name | Single line text | Page/layout name |
| Doc | Long text | JSON content for Puck (stores page structure) |
| Assets | Attachment | For uploading images and other media |

**Important**: Add at least one record to your Layouts table before running the extension.

### 4. Run the Extension

Open your Airtable base in the browser and add this extension to an Interface page. The extension will load from your local `frontend/index.tsx` file.

### 5. Configure Extension

1. When you first open the extension, you'll see a setup screen
2. Open the **Properties Panel** (right sidebar in Airtable)
3. Configure the following custom properties:
   - **Layouts Table**: Select your "Layouts" table
   - **Name Field**: Select the "Name" field
   - **Doc Field**: Select the "Doc" field
   - **Assets Field**: Select the "Assets" field

### 6. Start Building!

The Puck editor will appear with:
- **Left Panel**: Drag components from here onto your page
- **Center**: Visual editor and preview
- **Right Panel**: Edit component properties

Click **Publish** in the top-right to save your changes to Airtable! 🎉

## 🧩 Available Components

### Hero
Large header section perfect for landing pages:
- **Headline**: Main heading text
- **Subheadline**: Supporting text
- **Background Image URL**: Optional background image
- **Background Color**: Choose from preset colors
- **Text Alignment**: Left, center, or right

### Columns
Dynamic multi-column layout (1-5 columns):
- **Number of Columns**: Choose 1-5 columns
- **Distribution**: Equal, auto-fit, wide-left, or wide-right
- **Gap**: Spacing between columns
- **Nested Components**: Drop any component into each column

### Text
Customizable text block:
- **Content**: Your text content
- **Size**: xs to 5xl
- **Weight**: Light to black
- **Alignment**: Left, center, or right
- **Color**: Various color presets

### StatsCard 🔗
**Live data from Airtable** using the DataRef query system:
- **Title**: Card heading
- **Table Name**: Which Airtable table to query
- **View Name**: Optional view filter
- **Field to Display**: Which field value to show
- **Pick Strategy**: First, last, max, or min
- **Filters**: Optional field filters (equals, contains, greater than, etc.)
- **Sort**: Optional sorting

> 💡 **See [DataRef Guide](DATAREF_GUIDE.md) for advanced query patterns**

## 🎨 Customization

### Adding New Components

1. **Create a new component file** in `frontend/puck/components/`:

```typescript
// frontend/puck/components/MyComponent.tsx
import React from 'react';
import { ComponentConfig } from '@measured/puck';

export type MyComponentProps = {
  title: string;
  color: string;
};

const MyComponent: ComponentConfig<MyComponentProps> = {
  fields: {
    title: { 
      type: 'text', 
      label: 'Title' 
    },
    color: {
      type: 'select',
      label: 'Color',
      options: [
        { label: 'Blue', value: 'blue' },
        { label: 'Green', value: 'green' },
      ],
    },
  },
  defaultProps: {
    title: 'Default Title',
    color: 'blue',
  },
  render: ({ title, color }) => (
    <div className={`p-6 bg-${color}-${color} text-white rounded-lg`}>
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
  ),
};

export default MyComponent;
```

2. **Register it** in `frontend/puck/config.tsx`:

```typescript
import MyComponent from './components/MyComponent';

const config: Config = {
  components: {
    Hero,
    RichText,
    RecordList,
    MyComponent, // Add your component here
  },
};
```

3. **Reload the extension** and your component will appear in the left panel!

### Styling with Tailwind

This extension uses **Tailwind CSS** configured with Airtable's design tokens:

#### Airtable Colors
```jsx
// Use Airtable's color palette
<div className="bg-blue-blue text-white">Blue</div>
<div className="bg-gray-gray700 text-gray-gray200">Gray</div>
<div className="bg-green-green text-white">Green</div>
```

#### Dark Mode
```jsx
// Automatic dark mode support
<div className="bg-white dark:bg-gray-gray700">
  <p className="text-gray-gray700 dark:text-gray-gray200">
    Adapts to user's theme preference
  </p>
</div>
```

#### Standard Tailwind Utilities
```jsx
<div className="p-4 rounded-lg shadow-md hover:shadow-lg">
  All standard Tailwind classes work!
</div>
```

### Accessing Additional Airtable Data

To pass more data to Puck components, update `renderProps` in `ExtensionRoot.tsx`:

```typescript
<Puck
  config={config}
  data={puckData}
  onPublish={handlePuckChange}
  renderProps={{
    records: records || [],
    table,
    assetsField,
    // Add custom data here
    userData: session.currentUser,
    customSettings: mySettings,
  }}
/>
```

Then access it in your component:

```typescript
type MyRenderProps = {
  userData: User;
  customSettings: any;
};

const MyComponent: ComponentConfig<MyProps, MyRenderProps> = {
  render: (props, { userData, customSettings }) => {
    return <div>Hello, {userData.name}!</div>;
  },
};
```

## 🔧 Development Scripts

```bash
# Check TypeScript types
npm run typecheck

# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

## 📦 Project Structure

```
puck_extension/
├─ frontend/
│  ├─ index.tsx              # Entry point with error boundary
│  ├─ style.css              # Tailwind CSS with Airtable tokens
│  ├─ app/
│  │  └─ ExtensionRoot.tsx   # Main app component with Puck
│  ├─ airtable/
│  │  ├─ customProperties.ts # Custom property definitions
│  │  └─ mutations.ts        # Debounced Airtable updates
│  └─ puck/
│     ├─ config.tsx          # Puck configuration
│     └─ components/         # Custom Puck components
│        ├─ Hero.tsx
│        ├─ RichText.tsx
│        └─ RecordList.tsx
├─ block.json                # Extension configuration
├─ package.json              # Dependencies
├─ tsconfig.json             # TypeScript configuration
├─ tailwind.config.js        # Tailwind with Airtable design tokens
└─ README.md                 # This file!
```

## ⚠️ Important Notes

### Performance Considerations

- **JSON Size**: Keep your Doc field under 100KB for best performance
- **Auto-save Debounce**: Set to 1000ms (1 second) to balance UX and API rate limits
- **Record Limits**: Use `maxRecords` prop in RecordList to limit large datasets
- **Mutation Rate**: Airtable allows 15 updates/second - our debounce handles this

### Permissions

The extension respects Airtable permissions:
- ✅ Updates require write permissions on the Doc field
- ✅ Record expansion requires appropriate view permissions
- ✅ Permission checks run before all operations

### Data Structure

Puck stores data as JSON in this format:

```json
{
  "content": [
    {
      "type": "Hero",
      "props": {
        "headline": "Welcome",
        "subhead": "Get started",
        "alignment": "center"
      }
    },
    {
      "type": "RichText",
      "props": {
        "content": "Your content here",
        "textSize": "base"
      }
    }
  ],
  "root": {
    "props": {}
  }
}
```

## 🐛 Troubleshooting

### Extension Won't Load

**Problem**: Blank screen or error on load

**Solutions**:
- Check that all custom properties are configured in the Properties Panel
- Ensure your table has at least one record
- Open browser console (F12) and check for errors
- Verify that dependencies are installed (`npm install`)

### Changes Not Saving

**Problem**: Edits don't persist to Airtable

**Solutions**:
- Verify you have write permissions on the table
- Check that the Doc field is "Long text" type (not "Rich text")
- Look for permission errors in browser console
- Try manually updating the record in Airtable to test permissions

### Components Not Rendering

**Problem**: Custom components don't appear

**Solutions**:
- Ensure components are registered in `config.tsx`
- Check TypeScript types match Puck's expected format
- Verify render function returns valid React elements
- Check for errors in browser console

### TypeScript Errors

**Problem**: Type errors when building

**Solutions**:
```bash
# Run type checking
npm run typecheck

# Common fixes:
# - Install missing type definitions
npm install --save-dev @types/react @types/react-dom

# - Check that Puck types are correct
# - Ensure all imports are from correct paths
```

### NPM Permission Issues

**Problem**: `EACCES` or `EPERM` errors during npm install

**Solution**:
```bash
# Fix npm cache permissions
sudo chown -R $(whoami) ~/.npm

# Or use a version manager like nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

## 🚀 Advanced Usage

### Custom Properties for Configuration

Add user-configurable settings using custom properties:

```typescript
// In customProperties.ts
{
  key: 'maxRecords',
  label: 'Maximum Records to Display',
  type: 'number',
  defaultValue: 50,
}
```

### Image Uploads

To handle image uploads through Airtable's attachment field:

```typescript
// In your component
const handleImageUpload = async (file: File) => {
  if (!table || !assetsField) return;
  
  // Create attachment in Airtable
  const attachments = [{ url: URL.createObjectURL(file) }];
  await table.updateRecordAsync(record.id, {
    [assetsField.name]: attachments
  });
  
  // Get the attachment URL and use in Puck JSON
  const cellValue = record.getCellValue(assetsField);
  const imageUrl = cellValue[0].url;
  return imageUrl;
};
```

### Multiple Views

Support different Puck layouts by creating multiple records in your Layouts table. Each record represents a different page or layout.

## 📚 Resources

- [Puck Documentation](https://puckeditor.com/docs)
- [Airtable Extensions SDK](https://airtable.com/developers/extensions)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

This is a template project to get you started. Feel free to:
- Add more components
- Enhance existing features
- Customize styling
- Share your improvements!

## 📝 License

MIT - See LICENSE.md

---

**Built with ❤️ using Airtable Extensions, Puck, React, and TypeScript**

Need help? Check the troubleshooting section above or open an issue!

