'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface EditableListProps {
    items: string[];
    onChange: (items: string[]) => void;
    placeholder?: string;
    label: string;
}

export default function EditableList({ items = [], onChange, placeholder = 'Add item...', label }: EditableListProps) {
    const [newItem, setNewItem] = useState('');

    const addItem = () => {
        if (newItem.trim()) {
            onChange([...items, newItem.trim()]);
            setNewItem('');
        }
    };

    const removeItem = (index: number) => {
        onChange(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, value: string) => {
        const updated = [...items];
        updated[index] = value;
        onChange(updated);
    };

    return (
        <div className="space-y-2">
            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">{label}</label>
            <div className="space-y-2">
                {items.map((item, index) => (
                    <div key={index} className="flex gap-2">
                        <input
                            type="text"
                            value={item}
                            onChange={(e) => updateItem(index, e.target.value)}
                            className="flex-1 px-4 py-2 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                        />
                        <button
                            onClick={() => removeItem(index)}
                            className="px-3 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addItem()}
                        placeholder={placeholder}
                        className="flex-1 px-4 py-2 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                    />
                    <button
                        onClick={addItem}
                        className="px-4 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}









