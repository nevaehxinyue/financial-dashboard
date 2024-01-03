'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';


export default function Search({ placeholder }: { placeholder: string }) {
  //Update the URL with the search params
  const searchParams = useSearchParams();
  const pathName =  usePathname();
  const { replace } = useRouter();

  //Implement debouncing by 'use-debounce' package to run the handleSearch function
  // after a specific time (300ms) once the user has stopped typing.
  const handleSearch = useDebouncedCallback((term:string) => {
    
    const param = new URLSearchParams(searchParams);
    param.set('page', '1');
    if(term) {
      param.set('query', term);
    }else {
      param.delete('query');
    };
    replace(`${pathName}?${param.toString()}`);

  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        //Capture the user's input
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        //Keep the URL and input async
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
