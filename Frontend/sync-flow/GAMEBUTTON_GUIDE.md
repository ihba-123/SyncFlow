# GameButton Component - Usage Guide

A reusable, styled button component with 3D Clash of Clans-inspired design for consistent UI across the SyncFlow application.

## Location
`src/components/ui/GameButton.jsx`

## Features
- 🎮 **3D Game-Style Design** - Premium beveled button effect with layered shadows
- 🎨 **Color Variants** - primary, success, danger, secondary
- 📏 **Size Variants** - sm, md, lg
- ✨ **Smooth Animations** - Scale and transform effects on hover/active
- 📱 **Responsive** - Works perfectly on all screen sizes
- ♿ **Accessible** - Proper disabled states and loading indicators

## Basic Usage

```jsx
import GameButton from "@/components/ui/GameButton";

export default function MyComponent() {
  return (
    <GameButton variant="primary" size="lg">
      Click Me
    </GameButton>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | string | "primary" | Color variant: primary, success, danger, secondary |
| `size` | string | "md" | Button size: sm, md, lg |
| `loading` | boolean | false | Shows loading spinner when true |
| `disabled` | boolean | false | Disables the button |
| `fullWidth` | boolean | false | Button takes full width of container |
| `onClick` | function | - | Click handler |
| `type` | string | "button" | HTML button type: button, submit, reset |
| `icon` | Component | - | Optional icon from lucide-react |
| `children` | ReactNode | - | Button text/content |

## Examples

### Primary Button
```jsx
<GameButton variant="primary" size="lg" onClick={handleSubmit}>
  Submit <ArrowRight size={18} />
</GameButton>
```

### Success Button (For confirmations)
```jsx
<GameButton variant="success" size="md">
  Confirm Delete
</GameButton>
```

### Danger Button (For destructive actions)
```jsx
<GameButton variant="danger" size="md">
  Delete Account
</GameButton>
```

### Secondary Button (For alternative actions)
```jsx
<GameButton variant="secondary" size="lg">
  Cancel
</GameButton>
```

### With Loading State
```jsx
const [isLoading, setIsLoading] = useState(false);

<GameButton 
  loading={isLoading}
  disabled={isLoading}
  onClick={async () => {
    setIsLoading(true);
    await saveData();
    setIsLoading(false);
  }}
>
  Save
</GameButton>
```

### Small Button
```jsx
<GameButton variant="secondary" size="sm">
  Edit
</GameButton>
```

## Color Variants

- **primary** - Black (#000000) - Main actions
- **success** - Green (#047857) - Confirmation, create, approve
- **danger** - Red (#991b1b) - Delete, remove, reject  
- **secondary** - Gray (#1f2937) - Cancel, alternative actions

## Size Guide

- **sm** - 14px text, compact padding - Use for secondary/inline buttons
- **md** - 16px text, medium padding - Use for normal buttons
- **lg** - 18px text, large padding - Use for primary/prominent buttons

## Already Updated Components

✅ Login page - Primary button  
✅ Signup page - Primary button  
✅ Forgot Password - All buttons (primary)

## Components to Update

- Logout button
- Dashboard action buttons
- Project management buttons
- Team settings buttons
- Modal confirm/cancel buttons
- Profile edit buttons

## Implementation Tips

1. **Import once per file** - No need to import Material-UI Button
2. **Use consistent sizing** - lg for main actions, md for secondary, sm for inline
3. **Use appropriate variants** - success for positive, danger for destructive
4. **Loading state** - Always set both `loading` and `disabled` props
5. **Full width** - Use `fullWidth` for form submit buttons, modal actions

## Example Full Integration

```jsx
import GameButton from "@/components/ui/GameButton";
import { Trash2, Check } from "lucide-react";

export default function DeleteModal() {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteItem();
      toast.success("Deleted successfully");
    } catch (err) {
      toast.error("Failed to delete");
    }
    setIsDeleting(false);
  };

  return (
    <div className="flex gap-3">
      <GameButton 
        variant="danger" 
        size="lg"
        fullWidth 
        loading={isDeleting}
        disabled={isDeleting}
        onClick={handleDelete}
      >
        <Trash2 size={18} />
        Delete
      </GameButton>
      <GameButton variant="secondary" size="lg" fullWidth>
        <Check size={18} />
        Cancel
      </GameButton>
    </div>
  );
}
```

## Theming

All colors are defined in the `colorVariants` object inside GameButton.jsx. To customize:

1. Edit the color hex values in `colorVariants`
2. Ensure `hoverBg` is slightly lighter/darker for hover effect
3. Test on actual components to ensure contrast and readability
