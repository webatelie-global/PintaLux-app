import { useState, type FormEvent } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  Home,
  Image,
  LogOut,
  Search,
  Settings,
  Users,
  Plus,
  X,
  MapPin,
  Phone,
  User,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", icon: Home },
  { label: "Calendar", icon: CalendarDays },
  { label: "Orders", icon: ClipboardList },
  { label: "Employees", icon: Users },
  { label: "Documents", icon: FileText },
  { label: "Photos", icon: Image },
];

type Order = {
  id: number;
  customer: string;
  phone: string;
  address: string;
  date: string;
  description: string;
  price: string;
  status: string;
};

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [showOrderForm, setShowOrderForm] = useState(false);

  function handleCreateOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const newOrder: Order = {
      id: Date.now(),
      customer: String(formData.get("customer")),
      phone: String(formData.get("phone")),
      address: String(formData.get("address")),
      date: String(formData.get("date")),
      description: String(formData.get("description")),
      price: String(formData.get("price")),
      status: "New",
    };

    setOrders((currentOrders) => [...currentOrders, newOrder]);
    setShowOrderForm(false);
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #e5e5e5",
    borderRadius: "9px",
    fontSize: "14px",
    boxSizing: "border-box" as const,
    background: "#fff",
    color: "#333",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "7px",
    fontSize: "13px",
    fontWeight: 600 as const,
    color: "#555",
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">P</div>
          <div>
            <h1>PintaLux</h1>
            <span>WORK MANAGEMENT</span>
          </div>
        </div>

        <div className="sidebar-section">
          <span className="section-label">MAIN MENU</span>

          <nav className="navigation">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  className={`nav-item ${
                    activePage === item.label ? "active" : ""
                  }`}
                  key={item.label}
                  onClick={() => {
                    setActivePage(item.label);
                    setShowOrderForm(false);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActivePage(item.label);
                      setShowOrderForm(false);
                    }
                  }}
                >
                  <Icon size={19} />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="nav-item">
            <Settings size={19} />
            <span>Settings</span>
          </div>

          <div className="nav-item">
            <LogOut size={19} />
            <span>Log out</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="search-box">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search orders, employees..."
            />
          </div>

          <div className="topbar-actions">
            <button
              className="icon-button"
              type="button"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>

            <div className="profile">
              <div className="profile-avatar">A</div>
              <div>
                <strong>Administrator</strong>
                <span>Admin account</span>
              </div>
            </div>
          </div>
        </header>

        <section className="dashboard">
          <div className="welcome-section">
            <div>
              <span className="eyebrow">PINTALUX MANAGEMENT</span>

              <h2>
                {activePage === "Dashboard"
                  ? "Welcome back, Admin"
                  : activePage}
              </h2>

              <p>
                {activePage === "Dashboard"
                  ? "Here is an overview of your company's work and activities."
                  : `Manage your company's ${activePage.toLowerCase()}.`}
              </p>
            </div>

            <div className="date-label">
              <CalendarDays size={17} />
              <span>
                {activePage === "Dashboard"
                  ? "Dashboard overview"
                  : activePage}
              </span>
            </div>
          </div>

          {activePage === "Dashboard" && (
            <>
              <div className="stats-grid">
                <article className="stat-card">
                  <div className="stat-icon">
                    <ClipboardList size={21} />
                  </div>
                  <span className="stat-label">Total orders</span>
                  <strong>{orders.length}</strong>
                  <span className="stat-note">All registered orders</span>
                </article>

                <article className="stat-card">
                  <div className="stat-icon">
                    <CalendarDays size={21} />
                  </div>
                  <span className="stat-label">Upcoming jobs</span>
                  <strong>0</strong>
                  <span className="stat-note">Scheduled work</span>
                </article>

                <article className="stat-card">
                  <div className="stat-icon">
                    <CheckCircle2 size={21} />
                  </div>
                  <span className="stat-label">Completed jobs</span>
                  <strong>0</strong>
                  <span className="stat-note">Successfully completed</span>
                </article>

                <article className="stat-card">
                  <div className="stat-icon">
                    <Users size={21} />
                  </div>
                  <span className="stat-label">Employees</span>
                  <strong>0</strong>
                  <span className="stat-note">Registered workers</span>
                </article>
              </div>

              <div className="dashboard-grid">
                <section className="content-card calendar-card">
                  <div className="card-heading">
                    <div>
                      <h3>Work calendar</h3>
                      <p>Manage upcoming orders and scheduled jobs.</p>
                    </div>
                    <CalendarDays size={21} />
                  </div>

                  <div className="empty-state">
                    <CalendarDays size={34} />
                    <strong>Your calendar is ready</strong>
                    <span>Scheduled jobs will appear here.</span>
                  </div>
                </section>

                <section className="content-card activity-card">
                  <div className="card-heading">
                    <div>
                      <h3>Recent activity</h3>
                      <p>Latest updates from your team.</p>
                    </div>
                    <Bell size={21} />
                  </div>

                  <div className="empty-state">
                    <ClipboardList size={34} />
                    <strong>No activity yet</strong>
                    <span>New orders and updates will appear here.</span>
                  </div>
                </section>
              </div>
            </>
          )}

          {activePage === "Orders" && (
            <section className="content-card" style={{ padding: 26 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  flexWrap: "wrap",
                  marginBottom: 24,
                }}
              >
                <div>
                  <h3 style={{ margin: 0 }}>All orders</h3>
                  <p style={{ color: "#858585", fontSize: 13 }}>
                    Create and manage customer orders.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowOrderForm(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 18px",
                    border: "none",
                    borderRadius: 9,
                    background: "#191919",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  <Plus size={18} />
                  Create New Order
                </button>
              </div>

              {showOrderForm && (
                <form
                  onSubmit={handleCreateOrder}
                  style={{
                    padding: 22,
                    border: "1px solid #e8e3d9",
                    borderRadius: 12,
                    background: "#fdfcf9",
                    marginBottom: 26,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 22,
                    }}
                  >
                    <h3 style={{ margin: 0 }}>New customer order</h3>

                    <button
                      type="button"
                      onClick={() => setShowOrderForm(false)}
                      aria-label="Close form"
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                      }}
                    >
                      <X size={21} />
                    </button>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: 18,
                    }}
                  >
                    <div>
                      <label style={labelStyle}>
                        <User size={14} /> Customer name *
                      </label>
                      <input
                        name="customer"
                        required
                        placeholder="Customer full name"
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>
                        <Phone size={14} /> Phone number *
                      </label>
                      <input
                        name="phone"
                        type="tel"
                        required
                        placeholder="+358..."
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>
                        <MapPin size={14} /> Work address *
                      </label>
                      <input
                        name="address"
                        required
                        placeholder="Street, city"
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Work date *</label>
                      <input
                        name="date"
                        type="date"
                        required
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Estimated price (€)</label>
                      <input
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        style={inputStyle}
                      />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>Work description *</label>
                      <textarea
                        name="description"
                        required
                        rows={4}
                        placeholder="Describe the work, rooms, surfaces and materials..."
                        style={{
                          ...inputStyle,
                          resize: "vertical",
                          fontFamily: "inherit",
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 12,
                      marginTop: 22,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setShowOrderForm(false)}
                      style={{
                        padding: "11px 18px",
                        border: "1px solid #ddd",
                        borderRadius: 8,
                        background: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      style={{
                        padding: "11px 20px",
                        border: "none",
                        borderRadius: 8,
                        background: "#c5a15a",
                        color: "#fff",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Save Order
                    </button>
                  </div>
                </form>
              )}

              {orders.length === 0 ? (
                <div className="empty-state">
                  <ClipboardList size={34} />
                  <strong>No orders yet</strong>
                  <span>
                    Click "Create New Order" to add your first customer order.
                  </span>
                </div>
              ) : (
                <div style={{ display: "grid", gap: 14 }}>
                  {orders.map((order) => (
                    <article
                      key={order.id}
                      style={{
                        padding: 18,
                        border: "1px solid #eeeeeb",
                        borderRadius: 10,
                        background: "#fff",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 12,
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <h3 style={{ margin: "0 0 8px" }}>
                            {order.customer}
                          </h3>
                          <p style={{ margin: "4px 0", color: "#777" }}>
                            Order #{order.id}
                          </p>
                        </div>

                        <span
                          style={{
                            padding: "6px 11px",
                            borderRadius: 20,
                            background: "#f5eddd",
                            color: "#96753b",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {order.status}
                        </span>
                      </div>

                      <p style={{ color: "#666", fontSize: 14 }}>
                        <strong>Phone:</strong> {order.phone}
                      </p>
                      <p style={{ color: "#666", fontSize: 14 }}>
                        <strong>Address:</strong> {order.address}
                      </p>
                      <p style={{ color: "#666", fontSize: 14 }}>
                        <strong>Work date:</strong> {order.date}
                      </p>
                      <p style={{ color: "#666", fontSize: 14 }}>
                        <strong>Description:</strong> {order.description}
                      </p>
                      <p style={{ color: "#666", fontSize: 14 }}>
                        <strong>Estimated price:</strong>{" "}
                        {order.price ? `${order.price} €` : "Not specified"}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {!["Dashboard", "Orders"].includes(activePage) && (
            <section className="content-card">
              <div className="card-heading">
                <div>
                  <h3>{activePage}</h3>
                  <p>
                    Manage your company's {activePage.toLowerCase()}.
                  </p>
                </div>
              </div>

              <div className="empty-state">
                <strong>{activePage} workspace</strong>
                <span>
                  Tools and information for this section will appear here.
                </span>
              </div>
            </section>
          )}

          <footer className="dashboard-footer">
            <span>PintaLux © 2026</span>
            <span>Work management system</span>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
