import { getCurrentUser } from './actions/getCurrentUser'
import LogoutButton from './components/LogoutButton'
import NavigationBar from './components/NavigationBar'

export default async function Page() {

	const user2 = await getCurrentUser()
	// console.log("user?: ", user2)

	return (
		<main className="p-10">
			{/* <NavigationBar /> */}
			<h1 className="text-5xl font-bold mb-4">Main Page</h1>

			{user2 && (
				<>
					<div className="p-2 m-2 bg-blue-300">
						<p className='text-2xl font-bold'>Current User:</p>
						<div>{user2?.email}</div>
						<div>{user2?.profile?.role}</div>
						<div>{user2?.role}</div>
					</div>
				</>
			)}

			<LogoutButton />

		</main>
	)
}
