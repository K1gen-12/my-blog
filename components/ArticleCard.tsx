import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Tag } from 'lucide-react'
import { Database } from '@/types/database.types'

type Article = Database['public']['Tables']['articles']['Row']

interface ArticleCardProps {
  article: Article
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const formattedDate = new Date(article.updated_at).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link href={`/articles/${article.id}`}>
      <article className="group bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all duration-300 h-full flex flex-col">
        {/* サムネイル */}
        <div className="relative w-full aspect-video bg-gray-700 overflow-hidden">
          {article.thumbnail ? (
            <Image
              src={article.thumbnail}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* コンテンツ */}
        <div className="p-5 flex-1 flex flex-col">
          {/* カテゴリ */}
          <div className="flex items-center gap-2 text-sm text-purple-400 mb-2">
            <Tag size={14} />
            <span>{article.category}</span>
          </div>

          {/* タイトル */}
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
            {article.title}
          </h3>

          {/* 概要 */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
            {article.excerpt}
          </p>

          {/* 更新日時 */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar size={14} />
            <time dateTime={article.updated_at}>{formattedDate}</time>
          </div>
        </div>
      </article>
    </Link>
  )
}