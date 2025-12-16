import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import "./Dashboard.css";

function Dashboard() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    category: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const { logout, token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSweets();
  }, [pagination.page, searchQuery]);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      let url = `/sweets?page=${pagination.page}&limit=${pagination.limit}`;
      
      // Use search endpoint if there's a search query or filters
      if (searchQuery || filters.minPrice || filters.maxPrice || filters.category) {
        url = `/sweets/search?page=${pagination.page}&limit=${pagination.limit}&`;
        const params = [];
        if (searchQuery) params.push(`name=${encodeURIComponent(searchQuery)}`);
        if (filters.minPrice) params.push(`minPrice=${filters.minPrice}`);
        if (filters.maxPrice) params.push(`maxPrice=${filters.maxPrice}`);
        if (filters.category) params.push(`category=${encodeURIComponent(filters.category)}`);
        url += params.join('&');
      }
      
      const response = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Handle both array and paginated response
      if (response.data.data) {
        // Paginated response
        setSweets(response.data.data);
        setPagination({
          ...pagination,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages,
        });
      } else {
        // Array response
        const sweetsData = Array.isArray(response.data) ? response.data : [];
        setSweets(sweetsData);
      }
      setError("");
    } catch (err) {
      setError("Failed to load sweets");
      setSweets([]); // Set empty array on error
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePurchase = async (sweetId) => {
    try {
      await api.post(
        `/sweets/${sweetId}/purchase`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchSweets(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || "Purchase failed");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 }); // Reset to page 1 on search
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilters({
      minPrice: "",
      maxPrice: "",
      category: "",
    });
    setPagination({ ...pagination, page: 1 }); // Reset to page 1
  };

  const handleApplyFilters = () => {
    setPagination({ ...pagination, page: 1 }); // Reset to page 1 on filter
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="header-title">
              <span className="title-icon">🍬</span>
              Sweet Shop
            </h1>
            <p className="header-subtitle">Manage your sweet collection</p>
          </div>
          <div className="header-actions">
            {user?.role === "ADMIN" && (
              <button onClick={() => navigate("/admin")} className="admin-btn">
                <span className="btn-icon">👨‍💼</span>
                Admin Panel
              </button>
            )}
            <button onClick={handleLogout} className="logout-btn">
              <span className="logout-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card stat-card-purple">
              <div className="stat-icon">🍭</div>
              <div className="stat-content">
                <h3 className="stat-value">{sweets.length}</h3>
                <p className="stat-label">Total Sweets</p>
              </div>
            </div>
            
            <div className="stat-card stat-card-blue">
              <div className="stat-icon">✨</div>
              <div className="stat-content">
                <h3 className="stat-value">
                  {Array.isArray(sweets) ? sweets.filter(s => s.quantity > 0).length : 0}
                </h3>
                <p className="stat-label">In Stock</p>
              </div>
            </div>
            
            <div className="stat-card stat-card-green">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3 className="stat-value">
                  ${Array.isArray(sweets) ? sweets.reduce((sum, s) => sum + (s.price || 0), 0).toFixed(2) : '0.00'}
                </h3>
                <p className="stat-label">Total Value</p>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="search-section">
            <form onSubmit={handleSearch} className="search-filter-wrapper">
              <div className="search-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search sweets by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="btn-search">
                  Search
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="btn-toggle-filter"
              >
                <span className="btn-icon">{showFilters ? '🔼' : '🔽'}</span>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </form>

            {showFilters && (
              <div className="filter-panel">
                <div className="filter-group">
                  <label>Category</label>
                  <input
                    type="text"
                    name="category"
                    placeholder="e.g., Chocolate, Candy"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="filter-input"
                  />
                </div>
                <div className="filter-group">
                  <label>Min Price (₹)</label>
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="filter-input"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="filter-group">
                  <label>Max Price (₹)</label>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="filter-input"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="filter-actions">
                  <button onClick={handleApplyFilters} className="btn-apply">
                    Apply Filters
                  </button>
                  <button onClick={handleClearFilters} className="btn-clear">
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="loading-container">
              <div className="loader"></div>
              <p className="loading-text">Loading delicious sweets...</p>
            </div>
          ) : (
            <>
              {/* Sweets Grid */}
              {sweets.length > 0 ? (
                <div className="sweets-grid">
                  {sweets.map((sweet) => (
                    <div key={sweet._id} className="sweet-card">
                      <div className="sweet-card-header">
                        <div className="sweet-emoji">🍬</div>
                        <span className={`stock-badge ${sweet.quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                          {sweet.quantity > 0 ? '✓ In Stock' : '✕ Out of Stock'}
                        </span>
                      </div>
                      
                      <div className="sweet-card-body">
                        <h3 className="sweet-name">{sweet.name}</h3>
                        <p className="sweet-description">{sweet.category}</p>
                        
                        <div className="sweet-details">
                          <div className="detail-item">
                            <span className="detail-label">Price</span>
                            <span className="detail-value price">${sweet.price}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Stock</span>
                            <span className="detail-value stock">{sweet.quantity}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="sweet-card-footer">
                        <button
                          onClick={() => handlePurchase(sweet._id)}
                          disabled={sweet.quantity === 0}
                          className="purchase-btn"
                        >
                          <span className="btn-icon">🛒</span>
                          Purchase
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🍭</div>
                  <h3 className="empty-title">No sweets found</h3>
                  <p className="empty-description">
                    {searchQuery || filters.category || filters.minPrice || filters.maxPrice 
                      ? "Try adjusting your search or filters" 
                      : "No sweets available at the moment"}
                  </p>
                </div>
              )}

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="pagination-container">
                  <div className="pagination-info">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} sweets
                  </div>
                  <div className="pagination-controls">
                    <button 
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="pagination-btn"
                    >
                      ← Previous
                    </button>
                    
                    <div className="pagination-pages">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`pagination-btn ${pagination.page === pageNum ? 'active' : ''}`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button 
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="pagination-btn"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
