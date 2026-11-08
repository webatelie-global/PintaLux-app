import { useState } from "react";
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
} from "lucide-react";

const navigation = [
  { label: "Dashboard", icon: Home },
  { label: "Calendar", icon: CalendarDays },
  { label: "Orders", icon: ClipboardList },
  { label: "Employees", icon: Users },
  { label: "Documents", icon: FileText },
  { label: "Photos", icon: Image },
];

function App() {
    const [activePage, setActivePage] = useState("Dashboard");
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
            {navigation.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
  className={`nav-item ${activePage === item.label ? "active" : ""}`}
  key={item.label}
  onClick={() => setActivePage(item.label)}
  role="button"
  tabIndex={0}
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
  {activePage === "Dashboard" ? "Welcome back, Admin" : activePage}
</h2>
              <p>
                Here is an overview of your company's work and activities.
              </p>
            </div>

            <div className="date-label">
              <CalendarDays size={17} />
              <span>Dashboard overview</span>
            </div>
          </div>
          {activePage === "Dashboard" ? (
  <>
          <div className="stats-grid">
            <article className="stat-card">
              <div className="stat-icon">
                <ClipboardList size={21} />
              </div>
              <span className="stat-label">Total orders</span>
              <strong>0</strong>
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
) : (
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
