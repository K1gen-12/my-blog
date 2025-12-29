import { createClient } from '@/lib/supabase/server'
import ArticleCard from '@/components/ArticleCard'
import CategoryFilter from '@/components/CategoryFilter'

export const revalidate = 60

// 1. searchParams を Promise 型として定義
interface ArticlesPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  // 2. searchParams を await して中身を取り出す
  const resolvedSearchParams = await searchParams
  const selectedCategory = resolvedSearchParams.category

  const supabase = await createClient()

  // カテゴリ一覧を取得
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  // 記事一覧を取得
  let query = supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('updated_at', { ascending: false })

  // 3. await して取り出した selectedCategory を使用してフィルタリング
  if (selectedCategory && selectedCategory !== 'すべて') {
    query = query.eq('category', selectedCategory)
  }

  const { data: articles } = await query

  return (
    <div className="space-y-8 py-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-white">Articles</h1>
        <p className="text-gray-400 text-lg">すべての記事を閲覧できます</p>
      </div>

      {/* カテゴリフィルター */}
      <CategoryFilter 
        categories={categories || []} 
        selectedCategory={selectedCategory || 'すべて'} 
      />

      {/* 記事一覧 */}
      {articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
          <p className="text-gray-400 text-lg">該当する記事が見つかりませんでした。</p>
        </div>
      )}
    </div>
  )
}