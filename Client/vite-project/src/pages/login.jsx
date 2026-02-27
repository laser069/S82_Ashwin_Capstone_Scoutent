// pages/LoginPage.jsx
function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm p-8 bg-white shadow-md rounded">
        <h2 className="text-3xl font-bold text-center text-black mb-6">Log-In</h2>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter Username"
            className="p-3 bg-gray-200 text-black placeholder-gray-600 rounded focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 bg-gray-200 text-black placeholder-gray-600 rounded focus:outline-none"
          />
          <button
            type="submit"
            className="mt-4 bg-gray-300 text-black text-lg font-semibold py-2 rounded hover:bg-gray-400"
          >
            Log-In
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage