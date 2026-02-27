function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm p-8 bg-white shadow-md rounded">
        <h2 className="text-3xl font-bold text-center text-black mb-6">Sign Up</h2>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            className="p-3 bg-gray-200 text-black placeholder-gray-600 rounded focus:outline-none"
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="p-3 bg-gray-200 text-black placeholder-gray-600 rounded focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 bg-gray-200 text-black placeholder-gray-600 rounded focus:outline-none"
            required
          />

          <div className="flex items-center gap-6 text-black">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="player"
                className="accent-black"
                required
              />
              Player
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="scout"
                className="accent-black"
                required
              />
              Scout
            </label>
          </div>

          <button
            type="submit"
            className="mt-4 bg-gray-300 text-black text-lg font-semibold py-2 rounded hover:bg-gray-400"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignupPage