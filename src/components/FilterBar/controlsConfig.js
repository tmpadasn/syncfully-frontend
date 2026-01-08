/*
   Translate derived filter option sets and URL parameters
  into a compact array of UI control descriptors consumed by
  `FilterBar`. Keeping this mapping pure simplifies unit testing
  and separates data-shape concerns from rendering concerns.

 
*/
export function buildControls(filterOptions, params) {
  return [
    // Type control: includes a static 'USERS' option plus types derived
    // from the catalogue; labels are presented in uppercase for visual
    // consistency with the rest of the UI.
    {
      key: 'type',
      label: 'TYPE',
      currentValue: params.get('type') || '',
      options: [
        { label: 'ALL', value: '' },
        { label: 'USERS', value: 'user' },
        ...filterOptions.types.map(t => ({ label: t === 'book' ? 'BOOKS' : t === 'movie' ? 'MOVIES' : t.toUpperCase(), value: t }))
      ],
      showIcons: false,
      paramKey: 'type'
    },
    // Year control: presents a descending year range; labels use a
    // `YYYY+` convention indicating "from this year onwards".
    {
      key: 'year',
      label: 'YEAR',
      currentValue: params.get('year') || '',
      options: [ { label: 'ALL', value: '' }, ...filterOptions.years.map(y => ({ label: `${y}+`, value: y })) ],
      showIcons: false,
      paramKey: 'year'
    },
    // Genre control: attaches a lightweight `type` hint to each option so
    // the UI can visually group genres by type (books/music/movies) while
    // preserving a flat navigation order for accessibility.
    {
      key: 'genre',
      label: 'GENRE',
      currentValue: params.get('genre') || '',
      options: [ { label: 'ALL', value: '' }, ...filterOptions.genres.map(g => ({ label: g.toUpperCase(), value: g, type: filterOptions.genresByType[g] })) ],
      showIcons: true,
      paramKey: 'genre'
    },
    // Rating control: uses a human-friendly `N★+` label and keeps options
    // ordered from highest to lowest to reflect typical user expectations.
    {
      key: 'rating',
      label: 'RATING',
      currentValue: params.get('rating') || '',
      options: [ { label: 'ALL', value: '' }, ...filterOptions.ratings.map(r => ({ label: `${r}★+`.toUpperCase(), value: r })) ],
      showIcons: false,
      paramKey: 'rating'
    }
  ];
}
