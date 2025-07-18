# QuestionTimingTracker Component Usage Guide

## 🎯 **Overview**

The `QuestionTimingTracker` component is a powerful, interactive visualization tool for students to track their timing performance across standardized test questions. It provides visual feedback on which subtopics they're spending too much time on.

## ✨ **Features**

- **Interactive Bar Chart**: Hover over bars to see question details
- **Subtopic Highlighting**: Automatically highlights related questions when hovering
- **Color-Coded Subtopics**: Each subtopic has its own color for easy identification
- **Responsive Tooltip**: Shows question number, time, and subtopic
- **Legend with Grouping**: Organized by main topics with question counts
- **Responsive Design**: Works on desktop and mobile
- **Theme Support**: Adapts to light/dark mode

## 🚀 **Usage**

### Basic Usage

```jsx
import QuestionTimingTracker from "./components/QuestionTimingTracker/QuestionTimingTracker";

// Sample timing data for 27 verbal questions (in seconds)
const questionTimes = [
  42, 55, 38, 70, 25, 60, 80, 35, 50, 45, 90, 100, 110, 30, 20, 40, 60, 70, 80,
  90, 25, 35, 45, 55, 65, 75, 85,
];

function MyComponent() {
  return (
    <QuestionTimingTracker
      questionTimes={questionTimes}
      title="Timing Across Verbal Questions"
    />
  );
}
```

### Props

| Prop            | Type       | Default                            | Description                                        |
| --------------- | ---------- | ---------------------------------- | -------------------------------------------------- |
| `questionTimes` | `number[]` | `[]`                               | Array of timing data in seconds (max 27 questions) |
| `title`         | `string`   | `"Timing Across Verbal Questions"` | Chart title                                        |

## 📊 **Data Structure**

### Question Times Array

- **Length**: Up to 27 elements (for verbal SAT)
- **Format**: Time in seconds for each question
- **Order**: Questions 1-27 in sequence
- **Range**: 0-120+ seconds (visualized up to 2 minutes optimally)

### Subtopic Mapping

Questions are automatically mapped to subtopics in this order:

1. **Craft and Structure** (7 questions)

   - Words in Context: 4 questions
   - Text Structure and Purpose: 2 questions
   - Cross-Text Connections: 1 question

2. **Information and Ideas** (7 questions)

   - Central Ideas and Details: 2 questions
   - Command of Evidence: 4 questions
   - Inferences: 1 question

3. **Standard English Conventions** (6 questions)

   - Boundaries: 3 questions
   - Form, Structure, and Sense: 3 questions

4. **Expression of Ideas** (7 questions)
   - Transitions: 3 questions
   - Rhetorical Synthesis: 4 questions

## 🎨 **Styling**

The component uses CSS custom properties for theming:

```css
/* Theme variables used */
--bg-primary         /* Main background */
--bg-secondary       /* Secondary background */
--bg-tertiary        /* Tooltip background */
--text-primary       /* Main text color */
--text-secondary     /* Secondary text color */
--border-color       /* Border colors */
--verbal-color       /* Accent color */
```

## 🔧 **Customization**

### Custom Colors per Subtopic

The component uses predefined colors for each subtopic:

- **Craft and Structure**: Blue variations (#3b82f6, #1d4ed8, #1e40af)
- **Information and Ideas**: Green variations (#059669, #047857, #065f46)
- **Standard English Conventions**: Red variations (#dc2626, #b91c1c)
- **Expression of Ideas**: Purple variations (#7c3aed, #6d28d9)

### Highlighted State

When hovering over a question:

- Related questions turn **sky blue** (`#0ea5e9`)
- Legend items get highlighted
- Tooltip shows detailed information

## 💡 **Use Cases**

1. **Performance Lab Dashboard**: Show student timing across questions
2. **Test Review**: Identify slow subtopic areas
3. **Study Planning**: Focus on time-consuming subtopics
4. **Progress Tracking**: Compare timing across multiple tests

## 🔍 **Interactive Features**

### Hover Effects

- **Question Bars**: Hover to see question details
- **Subtopic Highlighting**: All questions in same subtopic highlight
- **Tooltip**: Shows question #, time, and subtopic name
- **Legend Animation**: Corresponding legend items highlight

### Responsive Behavior

- **Desktop**: Full features with detailed legend
- **Mobile**: Optimized spacing and touch-friendly interactions
- **Grid Layout**: Legend adapts to screen size

## 🎯 **Example Integration**

```jsx
// In your LabPage or Dashboard component
import QuestionTimingTracker from "../components/QuestionTimingTracker/QuestionTimingTracker";

const LabPage = () => {
  // Get timing data from your API or state
  const studentTimingData = useStudentTimingData();

  return (
    <div className="lab-content">
      <QuestionTimingTracker
        questionTimes={studentTimingData.verbalTimes}
        title="Your Verbal Timing Performance"
      />
    </div>
  );
};
```

## 📈 **Performance Tips**

- Component handles up to 27 questions efficiently
- Uses `position: fixed` for tooltip to avoid layout shifts
- Optimized CSS transitions for smooth interactions
- Minimal re-renders with proper state management

---

**🎉 Ready to help students identify their timing weaknesses and improve their test performance!**
