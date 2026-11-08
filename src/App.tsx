
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
  Trash2,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", icon: Home },
  { label: "Calendar", icon: CalendarDays },
  { label: "Orders", icon: ClipboardList },
  { label: "Employees", icon: Users },
  { label: "Documents", icon: FileText },
  { label: "Photos", icon: Image },
];

const statuses = ["New", "In Progress", "Completed"];

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

function formatDate(date: string) {
  if (!date) return "Date not set";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [showOrderForm, setShowOrderForm] = useState(false);

  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const sortedOrders = [...orders].sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  const upcomingOrders = sortedOrders
    .filter((order) => order.date >= todayString && order.status !== "Completed")
    .slice(0, 5);

  function handleCreateOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

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

    setOrders((current) => [...current, newOrder]);
    setShowOrderForm(false);
  }

  function deleteOrder(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?",
    );

    if (confirmed) {
      setOrders((current) => current.filter((order) => order.id !== id));
    }
  }

  function updateOrderStatus(id: number, status: string) {
    setOrders((current) =>
      current.map((order) =>
        order.id === id ? { ...order, status } : order,
      ),
    );
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

  function OrderCard({ order }: { order: Order }) {
    return (
      <article
        key={order.id}
        style={{
          padding: 18,
          border: "1px solid #eeeeeb",
          borderRadius: 10,
          background: "#fff",
          marginBottom: 12,
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
            <h3 style={{ margin: "0 0 8px", color: "#222" }}>
              {order.customer}
            </h3>
            <p style={{ margin: "4px 0", color: "#777", fontSize: 13 }}>
              Order #{order.id}
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select
              value={order.status}
              onChange={(event) =>
                updateOrderStatus(order.id, event.target.value)
              }
              style={{
                padding: "7px 10px",
                border: "1px solid #e5e5e5",
                borderRadius: 8,
                background: "#fdfcf9",
                color: "#96753b",
                fontWeight: 600,
              }}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => deleteOrder(order.id)}
              title="Delete order"
              aria-label="Delete order"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 35,
                height: 35,
                border: "1px solid #f0dada",
                borderRadius: 8,
                background: "#fff",
                color: "#bd5555",
                cursor: "pointer",
              }}
            >
              <Trash2 size={17} />
            </button>
          </div>
        </div>

        <p style={{ color: "#666", fontSize: 14 }}>
          <strong>Date:</strong> {formatDate(order.date)}
        </p>
        <p style={{ color: "#666", fontSize: 14 }}>
          <strong>Phone:</strong> {order.phone}
        </p>
        <p style={{ color: "#666", fontSize: 14 }}>
          <strong>Address:</strong> {order.address}
        </p>
        <p style={{ color: "#666", fontSize: 14 }}>
          <strong>Description:</strong> {order.description}
        </p>
        <p style={{ color: "#666", fontSize: 14 }}>
          <strong>Estimated price:</strong>{" "}
          {order.price ? `${order.price} €` : "Not specified"}
        </p>
      </article>
    );
  }

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
            <input type="search" placeholder="Search orders, employees..." />
          </div>

          <div className="topbar-actions">
            <button className="icon-button" type="button" aria-label="Notifications">
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
              <span>{formatDate(todayString)}</span>
            </div>
          </div>

          {activePage === "Dashboard" && (
            <>
              <div className="stats-grid">
                <article className="stat-card">
                  <div className="stat-icon"><ClipboardList size={21} /></div>
                  <span className="stat-label">Total orders</span>
                  <strong>{orders.length}</strong>
                  <span className="stat-note">All registered orders</span>
                </article>

                <article className="stat-card">
                  <div className="stat-icon"><CalendarDays size={21} /></div>
                  <span className="stat-label">Upcoming jobs</span>
                  <strong>{upcomingOrders.length}</strong>
                  <span className="stat-note">Next scheduled jobs</span>
                </article>

                <article className="stat-card">
                  <div className="stat-icon"><CheckCircle2 size={21} /></div>
                  <span className="stat-label">Completed jobs</span>
                  <strong>{orders.filter((order) => order.status === "Completed").length}</strong>
                  <span className="stat-note">Successfully completed</span>
                </article>

                <article className="stat-card">
                  <div className="stat-icon"><Users size={21} /></div>
                  <span className="stat-label">Employees</span>
                  <strong>0</strong>
                  <span className="stat-note">Registered workers</span>
                </article>
              </div>

              <section className="content-card" style={{ padding: 24, marginBottom: 22 }}>
                <div className="card-heading">
                  <div>
                    <h3>Upcoming jobs</h3>
                    <p>Next scheduled customer orders.</p>
                  </div>
                  <CalendarDays size={21} />
                </div>

                {upcomingOrders.length === 0 ? (
                  <div className="empty-state">
                    <CalendarDays size={34} />
                    <strong>No upcoming jobs</strong>
                    <span>Orders with future dates will appear here.</span>
                  </div>
                ) : (
                  upcomingOrders.map((order) => (
                    <div key={order.id} style={{ marginTop: 14 }}>
                      <OrderCard order={order} />
                    </div>
                  ))
                )}
              </section>

              <div className="dashboard-grid">
                <section className="content-card calendar-card">
                  <div className="card-heading">
                    <div>
                      <h3>Work calendar</h3>
                      <p>See all scheduled jobs by date.</p>
                    </div>
                    <CalendarDays size={21} />
                  </div>
                  <div className="empty-state">
                    <CalendarDays size={34} />
                    <strong>{orders.length} scheduled orders</strong>
                    <span>Open Calendar to see the full schedule.</span>
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
                    <span>New updates will appear here.</span>
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
                      <label style={labelStyle}><User size={14} /> Customer name *</label>
                      <input name="customer" required placeholder="Customer full name" style={inputStyle} />
                    </div>

                    <div>
                      <label style={labelStyle}><Phone size={14} /> Phone number *</label>
                      <input name="phone" type="tel" required placeholder="+358..." style={inputStyle} />
                    </div>

                    <div>
                      <label style={labelStyle}><MapPin size={14} /> Work address *</label>
                      <input name="address" required placeholder="Street, city" style={inputStyle} />
                    </div>

                    <div>
                      <label style={labelStyle}>Work date *</label>
                      <input name="date" type="date" required style={inputStyle} />
                    </div>

                    <div>
                      <label style={labelStyle}>Estimated price (€)</label>
                      <input name="price" type="number" min="0" step="0.01" placeholder="0.00" style={inputStyle} />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>Work description *</label>
                      <textarea
                        name="description"
                        required
                        rows={4}
                        placeholder="Describe the work, rooms, surfaces and materials..."
                        style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 22 }}>
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
                  <span>Click "Create New Order" to add your first customer order.</span>
                </div>
              ) : (
                sortedOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              )}
            </section>
          )}

          {activePage === "Calendar" && (
            <section className="content-card" style={{ padding: 26 }}>
              <div className="card-heading">
                <div>
                  <h3>Work calendar</h3>
                  <p>All customer orders arranged by scheduled date.</p>
                </div>
                <CalendarDays size={21} />
              </div>

              {sortedOrders.length === 0 ? (
                <div className="empty-state">
                  <CalendarDays size={34} />
                  <strong>Your calendar is empty</strong>
                  <span>Create an order and choose its work date. It will appear here.</span>
                </div>
              ) : (
                sortedOrders.map((order) => (
                  <div key={order.id} style={{ marginTop: 16 }}>
                    <div
                      style={{
                        padding: "9px 13px",
                        background: "#f5eddd",
                        color: "#96753b",
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 13,
                        marginBottom: 10,
                      }}
                    >
                      <CalendarDays size={14} style={{ verticalAlign: "middle", marginRight: 7 }} />
                      {formatDate(order.date)}
                    </div>
                    <OrderCard order={order} />
                  </div>
                ))
              )}
            </section>
          )}

          {!["Dashboard", "Orders", "Calendar"].includes(activePage) && (
            <section className="content-card">
              <div className="card-heading">
                <div>
                  <h3>{activePage}</h3>
                  <p>Manage your company's {activePage.toLowerCase()}.</p>
                </div>
              </div>
              <div className="empty-state">
                <strong>{activePage} workspace</strong>
                <span>Tools and information for this section will appear here.</span>
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
