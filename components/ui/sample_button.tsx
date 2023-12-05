  export const SampleButton = ({ value, selected, onClick }: { value: number, selected: number, onClick: (value: number) => void }) => (
    <button
      className={`bloc w-16 text-base text-gray-900 border border-gray-300 rounded-lg ${
        selected === value ? 'bg-gray-200' : 'bg-gray-50'
      } focus:ring-blue-900 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
      onClick={() => onClick(value)}
    >
      {value}
    </button>
  );