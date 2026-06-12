import Logo from '../common/Logo'
import './Navbar.css'
function Navbar() {
  return (
    <nav>
      <Logo />

      <ul>
        <li>Features</li>
        <li>Pricing</li>
        <li>About</li>
        <li>Contact</li>
      </ul>

      <button>Get Started</button>
    </nav>
  )
}

export default Navbar