import { useEffect, useRef, useState } from "react";
import { Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";

const ActionMenu = ({ onView, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleAction = (callback) => {
    if (typeof callback === "function") {
      callback();
    }
    setOpen(false);
  };

  return (
    <div className="action-menu" ref={menuRef}>
      <button
        type="button"
        className="action-menu-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Abrir menu de acoes"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div className="action-menu-dropdown">
          <button
            type="button"
            className="action-menu-item action-menu-item-view"
            onClick={() => handleAction(onView)}
          >
            <Eye size={16} />
            <span>Visualizar</span>
          </button>
          <button
            type="button"
            className="action-menu-item action-menu-item-edit"
            onClick={() => handleAction(onEdit)}
          >
            <Pencil size={16} />
            <span>Editar</span>
          </button>
          <button
            type="button"
            className="action-menu-item action-menu-item-delete"
            onClick={() => handleAction(onDelete)}
          >
            <Trash2 size={16} />
            <span>Excluir</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
