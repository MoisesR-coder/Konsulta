import React, { useState } from 'react';
import Navbar from './Navbar';
import ProcessView from './ProcessView';
import DataTableView from './DataTableView';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('process');
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onViewChange={handleViewChange} activeView={activeView} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'process' && <ProcessView message={message} setMessage={setMessage} />}
        {activeView === 'data' && <DataTableView />}
      </main>
    </div>
  );
};

export default Dashboard;