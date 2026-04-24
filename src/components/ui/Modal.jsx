import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 perspective-container">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal panel with 3D entrance */}
      <div className="relative bg-card text-card-foreground rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all depth-3 gradient-border"
           style={{ animation: 'rise-in 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-muted/20">
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors btn-3d"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
};
