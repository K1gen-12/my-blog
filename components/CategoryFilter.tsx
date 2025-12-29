'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Database } from '@/types/database.types'

type Category = Database['public']['Tables']['categories']['Row']

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string
}

export default function CategoryFilter({ categories, selectedCategory }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (category === 'すべて') {
      params.delete('category')
    } else {
      params.set('category', category)
    }

    router.push(`/articles?${params.toString()}`)
  }

  const allCategories = ['すべて', ...categories.map(c => c.name)]

  return (
    <div className="flex flex-wrap gap-3">
      {allCategories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryChange(category)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === category
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/50'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}