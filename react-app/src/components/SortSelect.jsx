export default function SortSelect({ id, value, onChange, options }) {
  return (
    <>
      <label htmlFor={id}>Sort by</label>
      <select id={id} value={value} onChange={event => onChange(event.target.value)}>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </>
  );
}
