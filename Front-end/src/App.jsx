import React, { useState } from 'react';
import './styles/App.css';
import Users from './components/Users';
import Reservas from './components/Reservas';


function App() {
  const [activeTab, setActiveTab] = useState('users');

  // ==================== CONFIGURACIÓN DE PESTAÑAS ====================
  const tabs = [
    { id: 'users', label: 'Usuarios', icon: '👥' },
    { id: 'reservas', label: 'Reservas', icon: '🐵' },
    
    // { id: 'products', label: 'Productos', icon: '📦' },
    // { id: 'orders', label: 'Órdenes', icon: '📋' },
  ];

  // ==================== RENDERIZADO DE CONTENIDO ====================
  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <Users />;
      case 'reservas':
        return <Reservas />;
      
      

      default:
        return <Users />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AventaTrabel Group</h1>
      </header>

      {/* ==================== NAVEGACIÓN DE PESTAÑAS ==================== */}
      <nav className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'active' : ''}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </nav>

      <main className="content">
        <div className="section">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
