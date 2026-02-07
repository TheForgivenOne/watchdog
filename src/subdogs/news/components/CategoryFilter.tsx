import type { NewsCategory } from '../types';

interface CategoryFilterProps {
  selectedCategory: NewsCategory | null;
  onSelectCategory: (category: NewsCategory | null) => void;
}

const categories: { value: NewsCategory; label: string }[] = [
  { value: 'top', label: 'Top' },
  { value: 'business', label: 'Business' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'health', label: 'Health' },
  { value: 'science', label: 'Science' },
  { value: 'sports', label: 'Sports' },
  { value: 'technology', label: 'Technology' },
  { value: 'world', label: 'World' },
];

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onSelectCategory(selectedCategory === category.value ? null : category.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === category.value
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
