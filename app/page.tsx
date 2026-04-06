// app/page.tsx
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import LogoutButton from './components/LogoutButton'
import { getCurrentUser } from './actions/getCurrentUser'

export default async function Page() {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data: users, error } = await supabase.from('User').select('*')

	// console.log(users)

	if (error) return <p>Lỗi kết nối: {error.message}</p>

	const user2 = await getCurrentUser()
	console.log(user2)


	return (
		<main className="p-10">
			<h1 className="text-2xl font-bold mb-4">Danh sách thành viên đồ câu:</h1>
			<ul>
				{users?.map((u) => (
				<li key={u.id} className="border-b py-2">
					{u.email} - <strong>{u.role}</strong>	
				</li>
				))}
			</ul>



			<LogoutButton />
		</main>
	)
}
