import Link from 'next/link';

export default function Home() {
  const hubs = [
    { title: 'Map Editor', desc: 'Deep dive into the 1,000+ tile grid of Cvstodia.', path: '/map', icon: '🗺️' },
    { title: 'Rosary Beads', desc: 'Track all 50+ beads and their divine effects.', path: '/beads', icon: '📿' },
    { title: 'Prayers', desc: 'Command the Miracle with magical abilities.', path: '/prayers', icon: '📜' },
    { title: 'Relics', desc: 'Passive items to alter your perception.', path: '/relics', icon: '👁️' },
    { title: 'Collectibles', desc: 'Find all 44 bones for the Ossuary achievement.', path: '/bones', icon: '🦴' },
  ];

  return (
    <div className="hub-wrapper">
      <div className="background-overlay"></div>
      
      <h1>CVSTODIA ARCHIVES</h1>
      <p className="subtitle">The Penitent One's Comprehensive Guide</p>

      <div className="hub-grid">
        {hubs.map((hub) => (
          <Link key={hub.path} href={hub.path} className="hub-card">
            <span className="icon">{hub.icon}</span>
            <h2>{hub.title}</h2>
            <p>{hub.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
