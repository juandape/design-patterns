import { useFilteredList } from './hooks';

export const FilteredList = () => {
  const { searchQuery, setSearchQuery, filteredItems, count, clear } =
    useFilteredList({
      items: ['apple', 'banana', 'cherry'],
      query: ''
    });

  return (
    <>
      <div>
        <div>
          <h1>Filtered List</h1>
        </div>
        <div>
          <input
            type='text'
            placeholder='search'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={clear}>Clear</button>
          {filteredItems.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </div>
      <div>Count: {count}</div>
    </>
  );
};
