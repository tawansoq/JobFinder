import { Link } from 'react-router-dom';

export default function Brand({ small = false }) {
  return (
    <Link className={`brand ${small ? 'brand-small' : ''}`} to="/">
      <span className="brand-mark">J</span>
      <span>jobfinder<span className="brand-dot">.</span><small>งานที่ใช่ เริ่มต้นที่นี่</small></span>
    </Link>
  );
}