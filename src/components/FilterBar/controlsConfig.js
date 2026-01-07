// Configuration builder for FilterBar controls. Kept separate to make
// the FilterBar render logic concise and easier to test.
export function buildControls(filterOptions, params) {
  return [
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
    {
      key: 'year',
      label: 'YEAR',
      currentValue: params.get('year') || '',
      options: [ { label: 'ALL', value: '' }, ...filterOptions.years.map(y => ({ label: `${y}+`, value: y })) ],
      showIcons: false,
      paramKey: 'year'
    },
    {
      key: 'genre',
      label: 'GENRE',
      currentValue: params.get('genre') || '',
      options: [ { label: 'ALL', value: '' }, ...filterOptions.genres.map(g => ({ label: g.toUpperCase(), value: g, type: filterOptions.genresByType[g] })) ],
      showIcons: true,
      paramKey: 'genre'
    },
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
