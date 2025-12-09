import { useState } from 'react'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    // TODO: wire to backend registration endpoint
    console.log('Register', { name, email, password })
  }

  return (
    <div className="page">
      <h2>Create Account</h2>
      <div className="card">
        <form className="form" onSubmit={handleSubmit}>
          <label className="form-group">
            <span>Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label className="form-group">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="form-group">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="primary">
            Register
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register

