interface Props {
  filters: {
    location: string;
    application: string;
  };
  setFilters: (filters: any) => void;
}

function ProductFilters({ filters, setFilters }: Props) {
  return (
    <div className="filter-group">
      <label>Localización</label>
      <select
        value={filters.location}
        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
      >
        <option value="All">Todos</option>
        <option value="Indoor">Indoor</option>
        <option value="Outdoor">Outdoor</option>
      </select>

      <label>Aplicación</label>
      <select
        value={filters.application}
        onChange={(e) =>
          setFilters({ ...filters, application: e.target.value })
        }
      >
        <option value="All">Todos</option>
        <option value="Rental">Rental</option>
        <option value="Fixed">Fixed Install</option>
        <option value="Broadcast">Broadcast</option>
      </select>
    </div>
  );
}

export default ProductFilters;
