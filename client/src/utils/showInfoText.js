const showInfoText = (filter, search, tag, currentFilter) => {
  return filter
    ? `Filtrado para mostrar - "${currentFilter(filter).join(', ')}"`
    : search
    ? `Mostrando los resultados de la búsqueda - "${search}"`
    : tag
    ? `Filtrado por etiqueta - "${tag.toLowerCase()}"`
    : 'Mostrando todos los resultados';
};

export default showInfoText;
