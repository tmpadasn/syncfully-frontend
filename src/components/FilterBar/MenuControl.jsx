import React, { useRef, useEffect, useState } from 'react';
import { FiChevronDown, FiBook, FiMusic, FiFilm } from 'react-icons/fi';
import styles from './FilterBar.styles';

// MenuControl: encapsulates a keyboard-accessible, screen-reader-friendly
// dropdown (listbox). Responsibilities:
// - Provide predictable keyboard semantics (arrows, Home/End, Enter, Escape)
// - Maintain a single focused index that maps to both keyboard and mouse
//   interactions to avoid disjointed behavior.
// - Render optional grouped sections with icons while preserving a flat
//   linear navigation model for accessibility.
export default function MenuControl({ label, options, onSelect, currentValue = '', disabled = false, showIcons = false }) {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const ref = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  // Close when clicking outside: keeps interaction model isolated and
  // predictable for the user.
  useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  // Keyboard navigation: mirror native listbox semantics so assistive
  // technologies and experienced users get expected behavior.
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      const flatOptions = options;
      switch (e.key) {
        case 'Escape':
          e.preventDefault(); setOpen(false); buttonRef.current?.focus(); break;
        case 'ArrowDown':
          e.preventDefault(); setFocusedIndex(prev => (prev < flatOptions.length - 1 ? prev + 1 : 0)); break;
        case 'ArrowUp':
          e.preventDefault(); setFocusedIndex(prev => (prev > 0 ? prev - 1 : flatOptions.length - 1)); break;
        case 'Enter':
        case ' ':
          e.preventDefault(); if (focusedIndex >= 0 && focusedIndex < flatOptions.length) { onSelect(flatOptions[focusedIndex].value); setOpen(false); buttonRef.current?.focus(); } break;
        case 'Home': e.preventDefault(); setFocusedIndex(0); break;
        case 'End': e.preventDefault(); setFocusedIndex(flatOptions.length - 1); break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, focusedIndex, options, onSelect]);

  // Reset focused index when opening to avoid surprising selections.
  useEffect(() => { if (open) setFocusedIndex(-1); }, [open]);

  const selectedOption = options.find(opt => opt.value === currentValue);
  const displayLabel = (selectedOption && currentValue !== '') ? selectedOption.label : label;
  const isSelected = currentValue && currentValue !== '';

  const getIcon = (type) => {
    switch (type) {
      case 'book': return <FiBook size={14} />;
      case 'music': return <FiMusic size={14} />;
      case 'movie': return <FiFilm size={14} />;
      default: return null;
    }
  };

  // Grouped options: visually groups items while preserving a flat keyboard
  // navigation order. This allows clearer visual structure without
  // compromising accessibility.
  const groupedOptions = showIcons ? (() => {
    const groups = { book: [], music: [], movie: [], other: [] };
    options.forEach(opt => { if (opt.value === '') return; const type = opt.type || 'other'; if (groups[type]) groups[type].push(opt); else groups.other.push(opt); });
    return groups;
  })() : null;

  const labelStyle = { ...styles.labelBase, ...styles.labelButton(isSelected, disabled, open) };

  // makeOption centralizes click/hover behavior so mouse and keyboard
  // interactions map to the same focused index and visual state.
  let idxCounter = -1;
  const makeOption = (opt) => {
    idxCounter += 1; const idx = idxCounter;
    // Apply centered layout only when icons are present (used by GENRE)
    const base = { ...styles.option };
    const optionLayout = (showIcons && opt.type) ? { ...styles.groupedOption } : {};
    const optionStyle = { ...base, ...optionLayout, backgroundColor: focusedIndex === idx ? '#f5f5f5' : 'transparent' };
    return (
      <div key={opt.label + opt.value} style={optionStyle} onClick={() => { onSelect(opt.value); setOpen(false); buttonRef.current?.focus(); }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5'; setFocusedIndex(idx); }} onMouseLeave={(e) => { if (focusedIndex !== idx) e.currentTarget.style.backgroundColor = 'transparent'; }} role="option" aria-selected={opt.value === currentValue}>
        {showIcons && opt.type ? <span style={styles.icon}>{getIcon(opt.type)}</span> : null}
        <span>{opt.label}</span>
      </div>
    );
  };

  // Render: toggle button for the control and a conditional, accessible listbox menu
  return (
    <div style={styles.menuWrapper} ref={ref}>
      <button ref={buttonRef} type="button" style={{ ...labelStyle, border: 'none' }} onClick={() => !disabled && setOpen(s => !s)} onMouseEnter={(e) => { if (!disabled) e.target.style.backgroundColor = '#f5f5f5'; }} onMouseLeave={(e) => { if (!disabled && !open) e.target.style.backgroundColor = isSelected ? '#f8f5f0' : 'transparent'; }} aria-haspopup="listbox" aria-expanded={open} aria-label={`${label} filter${isSelected ? `, currently set to ${displayLabel}` : ''}`} disabled={disabled}>
        {disabled ? 'LOADING...' : displayLabel}
        {!disabled && <FiChevronDown style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} aria-hidden="true" />}
      </button>
      {open && !disabled && (
        <div ref={menuRef} style={styles.menu} role="listbox" aria-label={`${label} options`}>
          {!showIcons ? ( options.map(opt => makeOption(opt)) ) : (
            <>
              {options.filter(opt => opt.value === '').map(opt => (<div key={opt.label + opt.value} style={{ ...styles.option, ...styles.optionSeparator }}>{makeOption(opt)}</div>))}
              {['book','music','movie','other'].map(type => { const group = groupedOptions[type]; if (!group || group.length === 0) return null; const headerLabel = type === 'other' ? 'Other' : type.charAt(0).toUpperCase() + type.slice(1) + 's'; return (<div key={type}><div style={{ ...styles.groupHeader }}>{headerLabel}</div>{group.map(opt => makeOption(opt))}</div>); })}
            </>
          )}
        </div>
      )}
    </div>
  );
}
