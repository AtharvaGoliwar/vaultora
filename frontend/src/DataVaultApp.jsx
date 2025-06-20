import React, { useEffect, useState } from "react";
import "./DataVault.css";
// import "./CSS.css";
import axios from "axios";

const DataVaultApp = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedItem, setExpandedItem] = useState(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [profilePassword, setProfilePassword] = useState("12345");
  const [showPassword, setShowPassword] = useState(false);
  const [currItem, setCurrItem] = useState(null);

  // Sample data with hidden content
  const vaultItems = [
    {
      id: 1,
      name: "Financial Reports 2024",
      type: "folder",
      size: "2.4 GB",
      modified: "2 hours ago",
      encrypted: true,
      // password: "secure123",
      hiddenContent: {
        description: "Quarterly financial reports and tax documents",
        files: [
          "Q1_Report.pdf",
          "Q2_Report.pdf",
          "Q3_Report.pdf",
          "Tax_Documents.pdf",
        ],
        lastAccessed: "Yesterday at 3:45 PM",
      },
    },
    {
      id: 2,
      name: "Personal Documents",
      type: "folder",
      size: "1.2 GB",
      modified: "1 day ago",
      encrypted: true,
      // password: "mypass456",
      hiddenContent: {
        description: "Personal identification and important documents",
        files: [
          "Passport.pdf",
          "Birth_Certificate.pdf",
          "Insurance_Policy.pdf",
        ],
        lastAccessed: "2 days ago at 10:30 AM",
      },
    },
    {
      id: 3,
      name: "Project Proposal.pdf",
      type: "document",
      size: "4.2 MB",
      modified: "3 hours ago",
      encrypted: false,
      hiddenContent: {
        description: "Detailed project proposal for Q1 2025 initiatives",
        content:
          "This proposal outlines the strategic initiatives for the first quarter of 2025, including budget allocations, timeline, and expected outcomes.",
        lastAccessed: "Today at 2:15 PM",
      },
    },
    {
      id: 4,
      name: "Family Photos",
      type: "folder",
      size: "850 MB",
      modified: "5 days ago",
      encrypted: true,
      // password: "family789",
      hiddenContent: {
        description: "Family vacation and celebration photos",
        files: ["Vacation_2024/", "Birthday_Party/", "Christmas_2024/"],
        lastAccessed: "1 week ago at 7:20 PM",
      },
    },
    {
      id: 5,
      name: "Contract_2024.pdf",
      type: "document",
      size: "1.8 MB",
      modified: "1 week ago",
      encrypted: true,
      // password: "contract2024",
      hiddenContent: {
        description: "Employment contract and legal agreements",
        content:
          "This document contains confidential employment terms, salary information, and legal clauses effective from January 2024.",
        lastAccessed: "3 days ago at 9:45 AM",
      },
    },
    {
      id: 6,
      name: "Presentation.pptx",
      type: "document",
      size: "12.5 MB",
      modified: "2 days ago",
      encrypted: false,
      hiddenContent: {
        description: "Company presentation for quarterly review",
        content:
          "Contains slides covering Q4 performance metrics, team achievements, and strategic goals for the upcoming quarter.",
        lastAccessed: "Today at 11:30 AM",
      },
    },
    {
      id: 7,
      name: "Database Backup",
      type: "archive",
      size: "156 MB",
      modified: "1 day ago",
      encrypted: true,
      // password: "backup2024",
      hiddenContent: {
        description: "Complete database backup with user data",
        files: ["users.sql", "transactions.sql", "logs.sql"],
        lastAccessed: "2 days ago at 4:00 PM",
      },
    },
    {
      id: 8,
      name: "Video_Meeting_Recording.mp4",
      type: "video",
      size: "89 MB",
      modified: "6 hours ago",
      encrypted: false,
      hiddenContent: {
        description: "Team meeting recording from project kickoff",
        content:
          "Recording of the project kickoff meeting discussing timeline, responsibilities, and deliverables.",
        lastAccessed: "Today at 1:20 PM",
      },
    },
  ];

  const [vaultItemsNew, setVaultItemsNew] = useState([]);
  const [groupname, setGroupname] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const getMe = async () => {
      try {
        let res = await axios.get("http://localhost:8080/me", {
          headers: { Username: "def" },
        });
        setGroupname(res.data.groupname);
        // setUsername(res.data.username);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    const initGetKeys = async () => {
      try {
        const res = await axios.get("http://localhost:8080/keys", {
          headers: {
            Username: "def", // send username here
          },
          // params: {
          //   key: "group1:callfromfrontend", // the key to get
          // },
        });
        console.log("Data from server:", res.data);
        let tempArr = res.data.keys;
        let abc = [];
        tempArr.map((key) => {
          let x = key.split(":");
          if (x.length == 2) {
            let name = x[1];
            let type = "cred";
            let encrypted = false;
            abc.push({
              id: abc.length + 1,
              name: name,
              type: type,
              encrypted: encrypted,
            });
          } else if (x[1] == "file") {
            let encrypted = false;
            let type;
            let name;
            if (x[2] == "image") {
              type = "image";
              name = x[3];
            } else if (x[2] == "video") {
              type = "video";
              name = x[3];
            } else if (x[2] == "txt") {
              type = "txt";
              name = x[3];
            } else {
              type = "doc";
              name = x[2];
            }
            abc.push({
              id: abc.length + 1,
              name: name,
              type: type,
              encrypted: encrypted,
            });
          }
        });
        setVaultItemsNew(abc);
      } catch (err) {
        console.error("Error fetching key:", err);
      }
    };

    initGetKeys();
    getMe();
  }, []);

  const getFileIcon = (type) => {
    const icons = {
      folder: "📁",
      document: "📄",
      image: "🖼️",
      video: "🎥",
      audio: "🎵",
      archive: "📦",
      cred: "🔑",
    };
    return icons[type] || "📄";
  };

  const handleItemClick = (item, event) => {
    setCurrItem(item);
    if (expandedItem === item.id) {
      setExpandedItem(null);
      return;
    }
    // Prevent event bubbling for action buttons
    if (
      event.target.closest(".action-btn") ||
      event.target.closest(".card-actions")
    ) {
      return;
    }

    if (item.encrypted) {
      setShowPasswordPrompt(true);
      setPassword("");
    } else {
      setExpandedItem(expandedItem === item.id ? null : item.id);
    }
  };

  const handlePasswordSubmit = () => {
    console.log(password);
    // console.log(item.password);
    console.log(currItem.id);
    if (password === profilePassword) {
      setShowPasswordPrompt(null);
      setExpandedItem(currItem.id);
      setPassword("");
    } else {
      alert("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  const handleClosePasswordPrompt = () => {
    setShowPasswordPrompt(null);
    setPassword("");
  };

  const toggleSelection = (id, event) => {
    event.stopPropagation();
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredItems = vaultItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "all" || item.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="vault-app">
      {/* Header */}
      {console.log(currItem)}
      {console.log(username, groupname)}
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
                {["all", "folder", "document", "image", "video", "archive"].map(
                  (filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`filter-btn ${
                        activeFilter === filter ? "active" : ""
                      }`}
                    >
                      {filter === "all"
                        ? "All Items"
                        : `${
                            filter.charAt(0).toUpperCase() + filter.slice(1)
                          }s`}
                    </button>
                  )
                )}
              </div>
            </nav>

            {/* Storage Usage */}
            <div className="storage-info">
              <div className="storage-title">Storage Used</div>
              <div className="storage-bar">
                <div className="storage-fill" style={{ width: "68%" }}></div>
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
                {activeFilter === "all"
                  ? "All Files"
                  : `${
                      activeFilter.charAt(0).toUpperCase() +
                      activeFilter.slice(1)
                    }s`}
              </h2>
              <span className="item-count">{filteredItems.length} items</span>
            </div>

            <div className="toolbar-right">
              <button className="toolbar-btn">⚙️</button>
              <div className="view-toggle">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                >
                  ▦
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                >
                  ☰
                </button>
              </div>
            </div>
          </div>

          {/* Password Prompt Modal */}
          {showPasswordPrompt && (
            <div className="password-overlay">
              <div className="password-modal">
                <div className="password-header">
                  {/* <Lock
                          size={20}
                          style={{ color: "#059669" }}
                        /> */}
                  <h3>Enter Password</h3>
                  <button
                    className="close-btn"
                    onClick={() => setShowPasswordPrompt(null)}
                  >
                    {/* <X size={16} /> */}X
                  </button>
                </div>
                <p className="password-description">
                  This file is encrypted. Please enter the password to view its
                  contents.
                </p>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="password-input"
                    placeholder="Enter password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handlePasswordSubmit()
                    }
                    autoFocus
                  />
                  <button
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword
                      ? // <EyeOff size={16} />
                        "hide"
                      : // <Eye size={16} />
                        "show"}
                  </button>
                </div>
                <div className="password-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => setShowPasswordPrompt(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => handlePasswordSubmit()}
                  >
                    Unlock
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Files Grid/List */}
          {viewMode === "grid" ? (
            <div className="files-grid">
              {filteredItems.map((item) => (
                <div key={item.id} className="file-card-container">
                  <div
                    className={`file-card ${
                      selectedItems.includes(item.id) ? "selected" : ""
                    } ${expandedItem === item.id ? "expanded" : ""}`}
                    onClick={(e) => handleItemClick(item, e)}
                  >
                    <div className="card-header">
                      <span className="file-icon">
                        {getFileIcon(item.type)}
                      </span>
                      <div className="card-actions">
                        {item.encrypted && (
                          <span className="encrypted-badge">🔒</span>
                        )}
                        <button
                          className="action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelection(item.id, e);
                          }}
                        >
                          {selectedItems.includes(item.id) ? "✓" : "⋮"}
                        </button>
                      </div>
                    </div>
                    <h3 className="file-name">{item.name}</h3>
                    <p className="file-size">{item.size}</p>
                    <p className="file-modified">{item.modified}</p>

                    {expandedItem === item.id && (
                      <div className="expanded-content">
                        <div className="expanded-header">
                          <h4>Details</h4>
                          <button
                            className="close-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExpandClose();
                            }}
                          >
                            ✕
                          </button>
                        </div>
                        <div className="expanded-body">
                          <p className="content-description">
                            {item.hiddenContent.description}
                          </p>

                          {item.hiddenContent.files && (
                            <div className="file-list">
                              <strong>Files:</strong>
                              <ul>
                                {item.hiddenContent.files.map((file, index) => (
                                  <li key={index}>{file}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {item.hiddenContent.content && (
                            <div className="content-preview">
                              <strong>Content:</strong>
                              <p>{item.hiddenContent.content}</p>
                            </div>
                          )}

                          <div className="access-info">
                            <small>
                              Last accessed: {item.hiddenContent.lastAccessed}
                            </small>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
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
                {filteredItems.map((item) => (
                  <div key={item.id} className="list-item-container">
                    <div
                      className={`list-row ${
                        selectedItems.includes(item.id) ? "selected" : ""
                      } ${expandedItem === item.id ? "expanded" : ""}`}
                      onClick={(e) => handleItemClick(item, e)}
                    >
                      <div className="list-col-name">
                        <span className="file-icon">
                          {getFileIcon(item.type)}
                        </span>
                        <div className="file-info">
                          <span className="file-name">{item.name}</span>
                          {item.encrypted && (
                            <span className="encrypted-badge">🔒</span>
                          )}
                        </div>
                      </div>
                      <div className="list-col-size">{item.size}</div>
                      <div className="list-col-modified">{item.modified}</div>
                      <div className="list-col-actions">
                        <button
                          className="action-btn"
                          title="Select"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelection(item.id, e);
                          }}
                        >
                          {selectedItems.includes(item.id) ? "✓" : "◯"}
                        </button>
                        <button className="action-btn" title="View">
                          👁️
                        </button>
                        <button className="action-btn" title="Download">
                          ⬇️
                        </button>
                        <button className="action-btn" title="Share">
                          🔗
                        </button>
                        <button className="action-btn danger" title="Delete">
                          🗑️
                        </button>
                      </div>
                    </div>

                    {expandedItem === item.id && (
                      <div className="list-expanded-content">
                        <div className="expanded-header">
                          <h4>Details</h4>
                          <button
                            className="close-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExpandClose();
                            }}
                          >
                            ✕
                          </button>
                        </div>
                        <div className="expanded-body">
                          <p className="content-description">
                            {item.hiddenContent.description}
                          </p>

                          {item.hiddenContent.files && (
                            <div className="file-list">
                              <strong>Files:</strong>
                              <ul>
                                {item.hiddenContent.files.map((file, index) => (
                                  <li key={index}>{file}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {item.hiddenContent.content && (
                            <div className="content-preview">
                              <strong>Content:</strong>
                              <p>{item.hiddenContent.content}</p>
                            </div>
                          )}

                          <div className="access-info">
                            <small>
                              Last accessed: {item.hiddenContent.lastAccessed}
                            </small>
                          </div>
                        </div>
                      </div>
                    )}
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
                <button className="selection-btn" title="Download">
                  ⬇️
                </button>
                <button className="selection-btn" title="Share">
                  🔗
                </button>
                <button className="selection-btn danger" title="Delete">
                  🗑️
                </button>
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
