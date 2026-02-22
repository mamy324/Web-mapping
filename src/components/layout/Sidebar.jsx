/*import { Menu, X, Users, Settings } from "lucide-react";
import "./Sidebar.css";

export default function Sidebar({
  maxTotal,
  setMaxTotal,
  isOpen,
  setIsOpen,
}) {

  return (
    <aside className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <div className="sidebar-header">
        {isOpen ? (
          <>
            <h3>Logement Etudiant</h3>
            <button className="toggle-btn" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </>
        ) : (
          <button className="toggle-btn" onClick={() => setIsOpen(true)}>
            <Menu size={24} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="sidebar-content">
          <div className="filter-section">
            <input
              id="max-pop-input"
              type="number"
              value={maxTotal ?? ""}
              onChange={(e) => setMaxTotal(e.target.value)}
              placeholder="filtre population"
            />
          </div>

          <div className="sidebar-spacer"></div>

          <div className="sidebar-footer">
            <button className="admin-btn">
              <Settings size={18} />
              <span>Admin</span>
            </button>
          </div>
        </div>
      )}

      {!isOpen && (
        <div className="collapsed-icons">
          <div className="icon-item" title="Filtres"><Users size={22} /></div>
          <div className="icon-item" title="Admin"><Settings size={22} /></div>
        </div>
      )}
    </aside>
  );
}*/

import { Menu, X, Users, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import "./Sidebar.css";

export default function Sidebar({
  maxTotal,
  setMaxTotal,
  isOpen,
  setIsOpen,
  selectedTypes = [],             // tableau des types sélectionnés (ex: ['location1', 'coloque'])
  setSelectedTypes,               // fonction pour mettre à jour le tableau
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const types = [
    { key: "location", label: "Location", value: "location1" },
    { key: "famille",  label: "Chez parent / famille", value: "famille1" },
    { key: "colo",     label: "Colocation", value: "coloque" },
    { key: "cite",     label: "Cité universitaire", value: "cite" },
  ];

  const toggleType = (value) => {
    setSelectedTypes(prev => {
      if (prev.includes(value)) {
        return prev.filter(v => v !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const isChecked = (value) => selectedTypes.includes(value);

  return (
    <aside className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <div className="sidebar-header">
        {isOpen ? (
          <>
            <h3>Logement Étudiant</h3>
            <button className="toggle-btn" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </>
        ) : (
          <button className="toggle-btn" onClick={() => setIsOpen(true)}>
            <Menu size={24} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="sidebar-content">

          {/* Filtre population */}
          <div className="filter-section">
            <label htmlFor="max-pop-input">Population max</label>
            <input
              id="max-pop-input"
              type="number"
              value={maxTotal ?? ""}
              onChange={(e) => setMaxTotal(e.target.value ? Number(e.target.value) : null)}
              placeholder="ex: 5000"
            />
          </div>

          {/* Dropdown types de logement */}
          <div className="filter-section">
            <div
              className="dropdown-toggle"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>Types de logement</span>
              {dropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            {dropdownOpen && (
              <div className="dropdown-menu">
                {types.map(({ key, label, value }) => (
                  <label key={key} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={isChecked(value)}
                      onChange={() => toggleType(value)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="sidebar-spacer"></div>

          <div className="sidebar-footer">
            <button className="admin-btn">
              <Settings size={18} />
              <span>Admin</span>
            </button>
          </div>
        </div>
      )}

      {!isOpen && (
        <div className="collapsed-icons">
          <div className="icon-item" title="Filtres"><Users size={22} /></div>
          <div className="icon-item" title="Admin"><Settings size={22} /></div>
        </div>
      )}
    </aside>
  );
}

