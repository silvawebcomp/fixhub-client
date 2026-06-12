function Login() {
  return (
    <section className="login">
      <h1>Welcome Back</h1>

      <p>Sign in to manage your repair business.</p>

      <form>
        <input
          type="email"
          placeholder="Email Address"
        />

        <input
          type="password"
          placeholder="Password"
        />

        <button type="submit">
          Sign In
        </button>
      </form>
    </section>
  )
}

export default Login