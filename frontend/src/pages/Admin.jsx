import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import "./Admin.css";

function Admin() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });
  const { logout, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSweets();
  }, [pagination.page, searchQuery]);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      let url = `/sweets?page=${pagination.page}&limit=${pagination.limit}`;
      
      // Use search endpoint if there's a search query or filters
      if (searchQuery || filters.minPrice || filters.maxPrice) {
        url = `/sweets/search?page=${pagination.page}&limit=${pagination.limit}`;
        if (searchQuery) url += `&name=${encodeURIComponent(searchQuery)}`;
        if (filters.minPrice) url += `&minPrice=${filters.minPrice}`;
        if (filters.maxPrice) url += `&maxPrice=${filters.maxPrice}`;
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
        const sweetsData = Array.isArray(response.data) 
          ? response.data 
          : [];
        setSweets(sweetsData);
      }
      setError("");
    } catch (err) {
      setError("Failed to load sweets");
      setSweets([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleOpenModal = (sweet = null) => {
    if (sweet) {
      setEditingSweet(sweet);
      setFormData({
        name: sweet.name,
        category: sweet.category,
        price: sweet.price,
        quantity: sweet.quantity,
      });
    } else {
      setEditingSweet(null);
      setFormData({
        name: "",
        category: "",
        price: "",
        quantity: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSweet(null);
    setFormData({
      name: "",
      category: "",
      price: "",
      quantity: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSweet) {
        // Update existing sweet
        await api.put(
          `/sweets/${editingSweet._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } else {
        // Create new sweet
        await api.post(
          "/sweets",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }
      handleCloseModal();
      fetchSweets();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (sweetId) => {
    if (!window.confirm("Are you sure you want to delete this sweet?")) {
      return;
    }
    try {
      await api.delete(`/sweets/${sweetId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSweets();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleRestock = async (sweetId) => {
    const quantity = prompt("Enter quantity to restock:");
    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
      alert("Please enter a valid quantity");
      return;
    }
    
    try {
      await api.post(
        `/sweets/${sweetId}/restock`,
        { quantity: parseInt(quantity) },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchSweets();
    } catch (err) {
      alert(err.response?.data?.message || "Restock failed");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchSweets();
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
    });
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  return (
    <div className="admin">
      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="header-title">
              <span className="title-icon">👨‍💼</span>
              Admin Panel
            </h1>
            <p className="header-subtitle">Manage your sweet inventory</p>
          </div>
          <div className="header-actions">
            <button onClick={() => navigate("/dashboard")} className="dashboard-btn">
              <span className="btn-icon">🏠</span>
              Dashboard
            </button>
            <button onClick={handleLogout} className="logout-btn">
              <span className="logout-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-container">
          {/* Action Bar */}
          <div className="action-bar">
            <h2 className="section-title">Sweet Inventory</h2>
            <button onClick={() => handleOpenModal()} className="add-btn">
              <span className="btn-icon">➕</span>
              Add New Sweet
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="search-filter-section">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input-admin"
                />
              </div>
              <button type="submit" className="search-btn">Search</button>
            </form>
            
            <div className="filter-group">
              <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="filter-input"
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="filter-input"
              />
              <button onClick={handleClearFilters} className="clear-btn">
                Clear
              </button>
            </div>
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
              <p className="loading-text">Loading sweets...</p>
            </div>
          ) : (
            <>
              {/* Sweets Table */}
              {Array.isArray(sweets) && sweets.length > 0 ? (
                <div className="table-wrapper">
                  <table className="sweets-table">
                    <thead>
                      <tr>
                        <th>Sweet</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sweets.map((sweet) => (
                        <tr key={sweet._id}>
                          <td>
                            <div className="sweet-cell">
                              <span className="sweet-emoji">🍬</span>
                              <span className="sweet-name-text">{sweet.name}</span>
                            </div>
                          </td>
                          <td className="category-cell">{sweet.category}</td>
                          <td className="price-cell">${sweet.price}</td>
                          <td className="stock-cell">{sweet.quantity}</td>
                          <td>
                            <span className={`status-badge ${sweet.quantity > 0 ? 'status-available' : 'status-out'}`}>
                              {sweet.quantity > 0 ? '✓ Available' : '✕ Out of Stock'}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                onClick={() => handleOpenModal(sweet)}
                                className="action-btn edit-btn"
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleRestock(sweet._id)}
                                className="action-btn restock-btn"
                                title="Restock"
                              >
                                📦
                              </button>
                              <button
                                onClick={() => handleDelete(sweet._id)}
                                className="action-btn delete-btn"
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="pagination">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="pagination-btn"
                      >
                        ← Previous
                      </button>
                      <span className="pagination-info">
                        Page {pagination.page} of {pagination.totalPages} 
                        ({pagination.total} total items)
                      </span>
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                        className="pagination-btn"
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🍭</div>
                  <h3 className="empty-title">No sweets found</h3>
                  <p className="empty-description">Start by adding your first sweet!</p>
                  <button onClick={() => handleOpenModal()} className="empty-add-btn">
                    <span className="btn-icon">➕</span>
                    Add Sweet
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingSweet ? "Edit Sweet" : "Add New Sweet"}
              </h2>
              <button onClick={handleCloseModal} className="modal-close">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Sweet Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Chocolate Bar"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Chocolate, Candy, Gum"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price" className="form-label">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quantity" className="form-label">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingSweet ? "Update Sweet" : "Add Sweet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
