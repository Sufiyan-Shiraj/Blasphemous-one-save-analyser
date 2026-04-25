"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Hub', path: '/' },
    { name: 'Map Editor', path: '/map' },
    { name: 'Rosary Beads', path: '/beads' },
    { name: 'Prayers', path: '/prayers' },
    { name: 'Relics', path: '/relics' },
    { name: 'Collectibles', path: '/bones' },
  ];

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link href="/">BLASPHEMOVS</Link>
      </div>
      <div className="nav-links">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={`nav-link ${pathname === item.path ? 'active' : ''}`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
