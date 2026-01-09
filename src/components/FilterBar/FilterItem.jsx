import React from 'react';
import MenuControl from './MenuControl';

// Small wrapper component that renders a single filter slot.
// It accepts a `control` configuration object and the parent's
// `updateParam` function. Styles are passed through via `wrapperStyle`
// to avoid coupling this file to the FilterBar's style exports.
export default function FilterItem({ control, wrapperStyle, disabled, onUpdate }) {
  return (
    <div style={wrapperStyle}>
      <MenuControl
        label={control.label}
        currentValue={control.currentValue}
        options={control.options}
        onSelect={v => onUpdate(control.paramKey, v)}
        disabled={disabled}
        showIcons={control.showIcons}
      />
    </div>
  );
}
