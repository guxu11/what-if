import { useState, useEffect } from "react";

export function SaveModal({ isOpen, onClose, onSave }) {
  const [saveName, setSaveName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSaveName("");
      // Focus input when modal opens
      setTimeout(() => {
        const input = document.getElementById("save-name");
        if (input) input.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = e => {
    e.preventDefault();
    if (saveName.trim()) {
      onSave(saveName);
      onClose();
      setSaveName("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal active" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>💾 Save Game</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="save-name">Save Name</label>
            <input
              type="text"
              id="save-name"
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              placeholder="e.g., Career Path Exploration"
              required
            />
          </div>
          <button type="submit" className="btn btn-success" style={{ width: "100%" }}>
            💾 Save Game
          </button>
        </form>
      </div>
    </div>
  );
}
