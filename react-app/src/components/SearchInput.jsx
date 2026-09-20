export default function SearchInput({ id, value, onChange, placeholder }) {
  return (
    <>
      <label htmlFor={id} className="sr-only">Search</label>
      <input
        type="search"
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
      />
    </>
  );
}
