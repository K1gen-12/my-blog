import LoginForm from '@/components/admin/LoginForm'
import { Lock } from 'lucide-react'

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
            <Lock className="text-purple-400" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">管理者ログイン</h1>
          <p className="text-gray-400">げんのすけの秘密基地 - Admin Dashboard</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 shadow-xl">
          <LoginForm />
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          管理者権限を持つアカウントのみログインできます
        </p>
      </div>
    </div>
  )
}