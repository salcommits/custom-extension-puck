# New Puck Components 🎨

I've added 6 new components to your Puck extension! Here's what each one does:

## 📊 StatCard - Display Metrics

Perfect for dashboards and key performance indicators.

**Features:**
- Display a large value with a label
- Show change percentage (e.g., "+12%")
- Trend indicator (up ↑, down ↓, neutral →)
- 5 color options (blue, green, red, yellow, purple)

**Example Use:**
- Total sales: $45,234 ↑ +15%
- Active users: 1,234 → No change
- Error rate: 2.3% ↓ -8%

**How to Use in Airtable:**
You could fetch these values from Airtable records using formulas or rollup fields!

---

## 🎯 Signpost - Call-to-Action

Eye-catching CTA component for driving user actions.

**Features:**
- Title and description
- Clickable button with URL
- 4 style options (primary/blue, secondary/gray, success/green, warning/yellow)
- 3 sizes (small, medium, large)

**Example Use:**
- "Get Started Today" → Links to onboarding
- "Contact Sales" → Opens contact form
- "Download Report" → Links to PDF

---

## 🏷️ StatusBadge - Show Status

Display status from your Airtable single select fields.

**Features:**
- Label and status text
- 6 color options matching Airtable colors
- Optional status indicator dot
- Compact inline design

**Example Use:**
- Project Status: "In Progress" (blue)
- Task Status: "Complete" (green)
- Priority: "High" (red)

**Airtable Integration:**
Map the colors to match your single select field colors!

---

## 🖼️ ImageCard - Display Images

Show images with optional title and caption.

**Features:**
- Any image URL (including Airtable attachments!)
- Optional title and caption
- 4 aspect ratios (1:1, 16:9, 4:3, 3:2)
- Rounded corners option

**How to Get Airtable Image URLs:**
1. Add an attachment field to your table
2. Upload images
3. Get the attachment URL from the record
4. Pass it to this component!

**Example:**
```javascript
// In a custom component wrapper:
const attachmentField = table.getFieldIfExists('Cover Image');
const attachment = record.getCellValue(attachmentField);
const imageUrl = attachment?.[0]?.url;
```

---

## ✅ CheckboxToggle - Toggle Checkboxes (Needs Custom Implementation)

**Note:** This is a placeholder component that shows how you could implement checkbox toggling.

**Why it's disabled:**
Puck's `render` functions can't use React hooks directly. To make this work, you'll need to create a wrapper component outside of Puck.

**How to Enable:**
1. Create a custom React component that uses `useBase()` and `useRecords()`
2. Fetch your record by ID
3. Implement the toggle logic
4. Pass it as a custom Puck component

**What it could do:**
- Toggle "Completed" checkbox on tasks
- Mark items as "Reviewed"
- Enable/disable features

---

## 📝 TextUpdate - Edit Text Fields (Needs Custom Implementation)

**Note:** This is also a placeholder showing how you could implement text editing.

**Why it's disabled:**
Same reason as CheckboxToggle - can't use hooks in Puck's render functions.

**What it could do:**
- Edit notes directly from the page
- Update descriptions
- Quick text changes without opening full record

---

## 🎨 All Components Available in Puck

When you reload your extension, you'll see these in the component panel:

1. **Hero** ⭐ (original)
2. **RichText** ⭐ (original)
3. **RecordList** ⭐ (original)
4. **StatCard** ✨ NEW
5. **Signpost** ✨ NEW
6. **StatusBadge** ✨ NEW
7. **CheckboxToggle** ✨ NEW (placeholder)
8. **TextUpdate** ✨ NEW (placeholder)
9. **ImageCard** ✨ NEW

---

## 💡 Tips for Using with Airtable Data

### Static Content
The new components work great for static content:
- Add a StatCard with manual values
- Create a Signpost for a specific CTA
- Show a StatusBadge with hardcoded status

### Dynamic Content
To make them truly dynamic with Airtable data:

1. **Option A: Manual Configuration**
   - Copy record IDs from Airtable
   - Paste them into component properties
   - Component fetches that specific record

2. **Option B: Custom Wrapper Components** (Advanced)
   - Create React components that fetch Airtable data
   - Register them as Puck components
   - Pass data to the presentational components

### Example: Dynamic StatCard

```javascript
// In a custom component file:
import { useBase, useRecords } from '@airtable/blocks/interface/ui';
import StatCard from './StatCard';

function DynamicStatCard({ tableId, fieldName }) {
  const base = useBase();
  const table = base.getTableByIdIfExists(tableId);
  const records = useRecords(table);
  
  // Calculate your stat
  const total = records.length;
  const lastMonth = /* your calculation */;
  const change = ((total - lastMonth) / lastMonth * 100).toFixed(1);
  
  return (
    <StatCard
      label="Total Records"
      value={total.toString()}
      change={`${change > 0 ? '+' : ''}${change}%`}
      trend={change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'}
      color="blue"
    />
  );
}
```

---

## 🚀 Try Them Out!

1. **Reload** your Airtable interface
2. **Open** the Puck editor
3. **Drag** any of the new components from the left panel
4. **Configure** them in the right panel
5. **See** them update in real-time!

---

## 🎯 Best Practices

### For StatCards:
- Use for important metrics that users check frequently
- Keep labels short (2-3 words max)
- Update values from Airtable formulas or rollups

### For Signposts:
- Limit to 1-2 per page (avoid CTA overload)
- Use action-oriented button text ("Get Started", not "Click Here")
- Test URLs to make sure they work!

### For StatusBadges:
- Match colors to your Airtable single select colors
- Use consistent status names across your base
- Consider creating a color scheme document

### For ImageCards:
- Optimize images before uploading to Airtable
- Use consistent aspect ratios for visual harmony
- Add captions for accessibility

---

## 🔧 Customization

All components use Tailwind CSS with Airtable's design tokens. To customize:

1. **Edit the component file** in `frontend/puck/components/`
2. **Modify Tailwind classes** for styling
3. **Add new fields** to the component config
4. **Test** in Puck editor

Example:
```javascript
// Add a new field to StatCard
fields: {
  // ... existing fields
  fontSize: {
    type: 'select',
    label: 'Font Size',
    options: [
      { label: 'Small', value: 'text-2xl' },
      { label: 'Medium', value: 'text-4xl' },
      { label: 'Large', value: 'text-6xl' },
    ],
  },
}
```

---

## 📚 Next Steps

1. **Experiment** with different combinations
2. **Create layouts** for different use cases (dashboards, landing pages, reports)
3. **Extend components** with your own custom features
4. **Share** your creations with your team!

**Happy building!** 🎨✨

