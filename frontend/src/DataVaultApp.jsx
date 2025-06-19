import React, { useState } from 'react';
import './DataVault.css';

const DataVaultApp = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Sample data
  const vaultItems = [
    { id: 1, name: 'Financial Reports 2024', type: 'folder', size: '2.4 GB', modified: '2 hours ago', encrypted: true },
    { id: 2, name: 'Personal Documents', type: 'folder', size: '1.2 GB', modified: '1 day ago', encrypted: true },
    { id: 3, name: 'Project Proposal.pdf', type: 'document', size: '4.2 MB', modified: '3 hours ago', encrypted: false },
    { id: 4, name: 'Family Photos', type: 'folder', size: '850 MB', modified: '5 days ago', encrypted: true },
    { id: 5, name: 'Contract_2024.pdf', type: 'document', size: '1.8 MB', modified: '1 week ago', encrypted: true },
    { id: 6, name: 'Presentation.pptx', type: 'document', size: '12.5 MB', modified: '2 days ago', encrypted: false },
    { id: 7, name: 'Database Backup', type: 'archive', size: '156 MB', modified: '1 day ago', encrypted: true },
    { id: 8, name: 'Video_Meeting_Recording.mp4', type: 'video', size: '89 MB', modified: '6 hours ago', encrypted: false }
  ];

  const getFileIcon = (type) => {
    const icons = {
      folder: '📁',
      document: '📄',
      image: '🖼️',
      video: '🎥',
      audio: '🎵',
      archive: '📦'
    };
    return icons[type] || '📄';
  };

  const toggleSelection = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredItems = vaultItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="vault-app">
      {/* Header */}
      <header className="vault-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              <div className="logo-icon">🔒</div>
              <h1>SecureVault</h1>
            </div>
          </div>
          
          <div className="header-right">
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search vault..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <button className="btn-primary">
              <span>➕</span>
              Add Files
            </button>
          </div>
        </div>
      </header>

      <div className="vault-layout">
        {/* Sidebar */}
        <aside className="vault-sidebar">
          <div className="sidebar-content">
            <nav className="sidebar-nav">
              <div className="nav-section">
                <div className="nav-title">Storage</div>
                <a href="#" className="nav-link">
                  <span>📁</span>
                  All Files
                </a>
                <a href="#" className="nav-link">
                  <span>🔒</span>
                  Encrypted
                </a>
                <a href="#" className="nav-link">
                  <span>🔗</span>
                  Shared
                </a>
              </div>

              <div className="nav-section">
                <div className="nav-title">Categories</div>
                {['all', 'folder', 'document', 'image', 'video', 'archive'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                  >
                    {filter === 'all' ? 'All Items' : `${filter.charAt(0).toUpperCase() + filter.slice(1)}s`}
                  </button>
                ))}
              </div>
            </nav>

            {/* Storage Usage */}
            <div className="storage-info">
              <div className="storage-title">Storage Used</div>
              <div className="storage-bar">
                <div className="storage-fill" style={{ width: '68%' }}></div>
              </div>
              <div className="storage-text">6.8 GB of 10 GB used</div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="vault-main">
          {/* Toolbar */}
          <div className="main-toolbar">
            <div className="toolbar-left">
              <h2 className="page-title">
                {activeFilter === 'all' ? 'All Files' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}s`}
              </h2>
              <span className="item-count">
                {filteredItems.length} items
              </span>
            </div>

            <div className="toolbar-right">
              <button className="toolbar-btn">⚙️</button>
              <div className="view-toggle">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                >
                  ▦
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                >
                  ☰
                </button>
              </div>
            </div>
          </div>

          {/* Files Grid/List */}
          {viewMode === 'grid' ? (
            <div className="files-grid">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className={`file-card ${selectedItems.includes(item.id) ? 'selected' : ''}`}
                  onClick={() => toggleSelection(item.id)}
                >
                  <div className="card-header">
                    <span className="file-icon">{getFileIcon(item.type)}</span>
                    <div className="card-actions">
                      {item.encrypted && <span className="encrypted-badge">🔒</span>}
                      <button className="action-btn">⋮</button>
                    </div>
                  </div>
                  <h3 className="file-name">{item.name}</h3>
                  <p className="file-size">{item.size}</p>
                  <p className="file-modified">{item.modified}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="files-list">
              <div className="list-header">
                <div className="list-col-name">Name</div>
                <div className="list-col-size">Size</div>
                <div className="list-col-modified">Modified</div>
                <div className="list-col-actions">Actions</div>
              </div>
              <div className="list-body">
                {filteredItems.map(item => (
                  <div
                    key={item.id}
                    className={`list-row ${selectedItems.includes(item.id) ? 'selected' : ''}`}
                    onClick={() => toggleSelection(item.id)}
                  >
                    <div className="list-col-name">
                      <span className="file-icon">{getFileIcon(item.type)}</span>
                      <div className="file-info">
                        <span className="file-name">{item.name}</span>
                        {item.encrypted && <span className="encrypted-badge">🔒</span>}
                      </div>
                    </div>
                    <div className="list-col-size">{item.size}</div>
                    <div className="list-col-modified">{item.modified}</div>
                    <div className="list-col-actions">
                      <button className="action-btn" title="View">👁️</button>
                      <button className="action-btn" title="Download">⬇️</button>
                      <button className="action-btn" title="Share">🔗</button>
                      <button className="action-btn danger" title="Delete">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedItems.length > 0 && (
            <div className="selection-toolbar">
              <div className="selection-info">
                <span>{selectedItems.length} items selected</span>
              </div>
              <div className="selection-actions">
                <button className="selection-btn" title="Download">⬇️</button>
                <button className="selection-btn" title="Share">🔗</button>
                <button className="selection-btn danger" title="Delete">🗑️</button>
                <button
                  onClick={() => setSelectedItems([])}
                  className="selection-clear"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DataVaultApp;