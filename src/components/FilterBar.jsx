// import React, { useState, useRef, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { FiChevronDown } from 'react-icons/fi';

// const TYPES = ['Book', 'Album', 'Movie'];
// const YEARS = ['2025','2024','2023','2022','2021','2020','2019','2018','2017','2016','2015','2010-2014','2000-2009','1990-1999','1980-1989'];
// const GENRES = ['Pop','Rock','Classical','Fiction','Non-fiction','Sci-Fi','Romance','Drama','Comedy'];
// const RATINGS = ['5','4','3','2','1'];

// function getParam(search, key) {
//   const params = new URLSearchParams(search);
//   return params.get(key) || '';
// }

// export default function FilterBar() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const params = new URLSearchParams(location.search);

//   const currentType = getParam(location.search, 'type');
//   const currentYear = getParam(location.search, 'year');
//   const currentGenre = getParam(location.search, 'genre');
//   const currentRating = getParam(location.search, 'rating');

//   function updateParam(key, value) {
//     if (!value) params.delete(key);
//     else params.set(key, value);
//     navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
//   }

//   const outer = { display: 'flex', justifyContent: 'center', padding: '12px 0', background: '#efe2d6', borderBottom: '1px solid #e0d9cf' };
//   const container = { display: 'flex', gap: 30, alignItems: 'center', width: '100%', maxWidth: 800, padding: '0 16px', justifyContent: 'center' };

//   return (
//     <div style={outer}>
//       <div style={container}>
//         <MenuControl label="TYPE" options={[{label:'ALL',value:''}, ...TYPES.map(t=>({label:t.toUpperCase(),value:t}))]} onSelect={(v)=>updateParam('type', v)} />
//         <MenuControl label="YEAR" options={[{label:'ALL',value:''}, ...YEARS.map(y=>({label:y.toUpperCase(),value:y}))]} onSelect={(v)=>updateParam('year', v)} />
//         <MenuControl label="GENRE" options={[{label:'ALL',value:''}, ...GENRES.map(g=>({label:g.toUpperCase(),value:g}))]} onSelect={(v)=>updateParam('genre', v)} />
//         <MenuControl label="RATING" options={[{label:'ALL',value:''}, ...RATINGS.map(r=>({label:`${r}★+`.toUpperCase(),value:r}))]} onSelect={(v)=>updateParam('rating', v)} />
//       </div>
//     </div>
//   );
// }

// function MenuControl({ label, options, onSelect }){
//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);

//   useEffect(()=>{
//     function onDoc(e){ if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
//     document.addEventListener('mousedown', onDoc);
//     return ()=> document.removeEventListener('mousedown', onDoc);
//   },[]);

//   const labelStyle = { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', display:'flex', alignItems:'center', gap:8, cursor: 'default' };
//   const menuStyle = { position: 'absolute', top: 36, left: '50%', transform: 'translateX(-50%)', background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.08)', borderRadius: 8, padding: 6, zIndex: 40, minWidth: 160 };
//   const optStyle = { padding: '8px 10px', cursor: 'pointer', borderRadius: 6, fontSize: 13, textTransform: 'uppercase' };
//   const wrapper = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative' };

//   return (
//     <div style={wrapper} ref={ref}>
//       <div style={labelStyle} onClick={()=>setOpen(s=>!s)}>
//         {label}
//         <FiChevronDown />
//       </div>
//       {open && (
//         <div style={menuStyle} role="menu">
//           {options.map(opt => (
//             <div key={opt.label + opt.value} style={optStyle} onClick={()=>{ onSelect(opt.value); setOpen(false); }} role="menuitem">
//               {opt.label}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
// // import React from 'react';
// // import { useLocation, useNavigate } from 'react-router-dom';

// // const TYPES = ['Book', 'Album', 'Movie'];
// // const YEARS = ['2025','2024','2023','2022','2021','2020','2019','2018','2017','2016','2015','2010-2014','2000-2009','1990-1999','1980-1989'];
// // const GENRES = ['Pop','Rock','Classical','Fiction','Non-fiction','Sci-Fi','Romance','Drama','Comedy'];
// // const RATINGS = ['5','4','3','2','1'];

// function getParam(search, key) {
// //   import React, { useState, useRef, useEffect } from 'react';
// //   import { useLocation, useNavigate } from 'react-router-dom';
// //   import { FiChevronDown } from 'react-icons/fi';

//   // const TYPES = ['Book', 'Album', 'Movie'];
//   // const YEARS = ['2025','2024','2023','2022','2021','2020','2019','2018','2017','2016','2015','2010-2014','2000-2009','1990-1999','1980-1989'];
//   // const GENRES = ['Pop','Rock','Classical','Fiction','Non-fiction','Sci-Fi','Romance','Drama','Comedy'];
//   // const RATINGS = ['5','4','3','2','1'];

//   function getParam(search, key) {
//     const params = new URLSearchParams(search);
//     return params.get(key) || '';
//   }

//   export default function FilterBar() {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const params = new URLSearchParams(location.search);

//     const currentType = getParam(location.search, 'type');
//     const currentYear = getParam(location.search, 'year');
//     const currentGenre = getParam(location.search, 'genre');
//     const currentRating = getParam(location.search, 'rating');

//     function updateParam(key, value) {
//       if (!value) {
//         params.delete(key);
//       } else {
//         params.set(key, value);
//       }
//       navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
//     }

//     const outer = { display: 'flex', justifyContent: 'center', padding: '12px 0', background: '#efe2d6', borderBottom: '1px solid #e0d9cf' };
//     const container = { display: 'flex', gap: 30, alignItems: 'center', width: '100%', maxWidth: 800, padding: '0 16px', justifyContent: 'center' };
//     const control = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative' };
//     const labelStyle = { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', textAlign: 'center', display: 'flex', alignItems: 'center', gap: 8 };
//     const currentStyle = { fontSize: 13, fontWeight: 600, textTransform: 'uppercase', color: '#222' };
//     const menuStyle = { position: 'absolute', top: 34, left: '50%', transform: 'translateX(-50%)', background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.08)', borderRadius: 8, padding: 6, zIndex: 40, minWidth: 160 };
//     const optStyle = { padding: '8px 10px', cursor: 'pointer', borderRadius: 6, fontSize: 13, textTransform: 'uppercase' };

//     return (
//       <div style={outer}>
//         <div style={container}>
//           <div style={control}>
//             <div style={labelStyle}>TYPE <FiChevronDown style={{cursor:'pointer'}} onClick={()=>document.getElementById('btn-type')?.click()} /></div>
//             <MenuControl id="menu-type" buttonId="btn-type" value={currentType} options={[{"label":"ALL","value":""}, ...TYPES.map(t=>({label:t.toString().toUpperCase(), value:t}))]} onSelect={(val)=>updateParam('type', val)} />
//           </div>

//           <div style={control}>
//             <div style={labelStyle}>YEAR <FiChevronDown style={{cursor:'pointer'}} onClick={()=>document.getElementById('btn-year')?.click()} /></div>
//             <MenuControl id="menu-year" buttonId="btn-year" value={currentYear} options={[{"label":"ALL","value":""}, ...YEARS.map(y=>({label:y.toString().toUpperCase(), value:y}))]} onSelect={(val)=>updateParam('year', val)} />
//           </div>

//           <div style={control}>
//             <div style={labelStyle}>GENRE <FiChevronDown style={{cursor:'pointer'}} onClick={()=>document.getElementById('btn-genre')?.click()} /></div>
//             <MenuControl id="menu-genre" buttonId="btn-genre" value={currentGenre} options={[{"label":"ALL","value":""}, ...GENRES.map(g=>({label:g.toString().toUpperCase(), value:g}))]} onSelect={(val)=>updateParam('genre', val)} />
//           </div>

//           <div style={control}>
//             <div style={labelStyle}>RATING <FiChevronDown style={{cursor:'pointer'}} onClick={()=>document.getElementById('btn-rating')?.click()} /></div>
//             <MenuControl id="menu-rating" buttonId="btn-rating" value={currentRating} options={[{"label":"ALL","value":""}, ...RATINGS.map(r=>({label:(`${r}★+`).toString().toUpperCase(), value:r}))]} onSelect={(val)=>updateParam('rating', val)} />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   function MenuControl({ id, buttonId, value, options, onSelect }){
//     const [open, setOpen] = useState(false);
//     const ref = useRef(null);

//     useEffect(()=>{
//       function onDoc(e){ if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
//       document.addEventListener('mousedown', onDoc);
//       return ()=> document.removeEventListener('mousedown', onDoc);
//     },[]);

//     return (
//       <div ref={ref} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
//         <button id={buttonId} onClick={(e)=>{ e.preventDefault(); setOpen(s=>!s); }} style={{display:'none'}} aria-controls={id} />
//         <div style={currentStyle}>{''}</div>
//         {open && (
//           <div id={id} style={menuStyle} role="menu">
//             {options.map(opt=> (
//               <div key={opt.label+opt.value} style={optStyle} onClick={()=>{ onSelect(opt.value); setOpen(false); }} role="menuitem">{opt.label}</div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   }
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';

const TYPES = ['Book', 'Album', 'Movie'];
const YEARS = [
  '2025','2024','2023','2022','2021','2020',
  '2019','2018','2017','2016','2015',
  '2010-2014','2000-2009','1990-1999','1980-1989'
];
const GENRES = [
  'Pop','Rock','Classical',
  'Fiction','Non-fiction','Sci-Fi',
  'Romance','Drama','Comedy'
];
const RATINGS = ['5','4','3','2','1'];

function getParam(search, key) {
  const params = new URLSearchParams(search);
  return params.get(key) || '';
}

export default function FilterBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const currentType = getParam(location.search, 'type');
  const currentYear = getParam(location.search, 'year');
  const currentGenre = getParam(location.search, 'genre');
  const currentRating = getParam(location.search, 'rating');

  function updateParam(key, value) {
    if (!value) params.delete(key);
    else params.set(key, value);

    navigate(
      { pathname: location.pathname, search: params.toString() },
      { replace: true }
    );
  }

  const outer = {
    display: 'flex',
    justifyContent: 'center',
    padding: '8px 0 8px',
    background: '#efe2d6',
    width: '100%',
    boxSizing: 'border-box',
  };

  const bar = {
    width: '100%',
    boxSizing: 'border-box',
    marginTop: '20px',
    marginLeft: '10px',
    marginRight: '10px',
    borderTop: '1px solid #7c6b5bff',
    borderBottom: '1px solid #7c6b5bff',
    padding: '8px 0',
  };

  const container = {
    display: 'flex',
    gap: 0,
    alignItems: 'center',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: 800,
    padding: '0 16px',
    justifyContent: 'center',
  };

  return (
    <div style={outer}>
      <div style={bar}>
        <div style={container}>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <MenuControl
              label="TYPE"
              options={[
                { label: 'ALL', value: '' },
                ...TYPES.map(t => ({ label: t.toUpperCase(), value: t })),
              ]}
              onSelect={v => updateParam('type', v)}
            />
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <MenuControl
              label="YEAR"
              options={[
                { label: 'ALL', value: '' },
                ...YEARS.map(y => ({ label: y.toUpperCase(), value: y })),
              ]}
              onSelect={v => updateParam('year', v)}
            />
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <MenuControl
              label="GENRE"
              options={[
                { label: 'ALL', value: '' },
                ...GENRES.map(g => ({ label: g.toUpperCase(), value: g })),
              ]}
              onSelect={v => updateParam('genre', v)}
            />
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <MenuControl
              label="RATING"
              options={[
                { label: 'ALL', value: '' },
                ...RATINGS.map(r => ({
                  label: `${r}★+`.toUpperCase(),
                  value: r,
                })),
              ]}
              onSelect={v => updateParam('rating', v)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuControl({ label, options, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const labelStyle = {
    fontSize: 15,
    fontWeight: 400,
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
    textAlign: 'center',
    cursor: 'pointer',
    letterSpacing: 1,
  };

  const menuStyle = {
    position: 'absolute',
    top: 36,
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#fff',
    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
    borderRadius: 8,
    padding: 6,
    zIndex: 40,
    minWidth: 160,
  };

  const optStyle = {
    padding: '6px 10px',
    cursor: 'pointer',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 300,
    textTransform: 'uppercase',
  };

  const wrapper = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    position: 'relative',
  };

  return (
    <div style={wrapper} ref={ref}>
      <div style={labelStyle} onClick={() => setOpen(s => !s)}>
        {label}
        <FiChevronDown />
      </div>
      {open && (
        <div style={menuStyle} role="menu">
          {options.map(opt => (
            <div
              key={opt.label + opt.value}
              style={optStyle}
              onClick={() => {
                onSelect(opt.value);
                setOpen(false);
              }}
              role="menuitem"
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
