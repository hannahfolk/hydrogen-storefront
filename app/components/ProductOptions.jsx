import {
  Link,
  useLocation,
  useSearchParams,
  useNavigation,
} from '@remix-run/react';
import {useEffect} from 'react';

export default function ProductOptions({options, selectedVariant}) {
  // pathname and search will be used to build option URLs
  const {pathname, search} = useLocation();
  const [currentSearchParams] = useSearchParams();
  const navigation = useNavigation();

  const paramsWithDefaults = (() => {
    const defaultParams = new URLSearchParams(currentSearchParams);

    if (!selectedVariant) {
      return defaultParams;
    }

    for (const {name, value} of selectedVariant.selectedOptions) {
      if (!currentSearchParams.has(name)) {
        defaultParams.set(name, value);
      }
    }

    return defaultParams;
  })();

  // Update the in-flight request data from the 'navigation' (if available)
  // to create an optimistic UI that selects a link before the request completes
  const searchParams = navigation.location
    ? new URLSearchParams(navigation.location.search)
    : currentSearchParams;

  useEffect(() => {
    // This effect will run whenever the search parameters change
  }, [searchParams]);

  return (
    <div className="grid gap-4 mb-6">
      {/* Each option will show a label and option value <Links> */}
      {options.map((option) => {
        if (!option.optionValues.length) {
          return null;
        }
        // get the currently selected option value
        const currentOptionVal = searchParams.get(option.name);
        return (
          <div
            key={option.name}
            className="flex flex-col flex-wrap mb-4 gap-y-2 last:mb-0"
          >
            <h3 className="whitespace-pre-wrap max-w-prose font-bold text-lead min-w-[4rem]">
              {option.name}
            </h3>

            <div className="flex flex-wrap items-baseline gap-4">
              {option.optionValues.map((value) => {
                // Build a URLSearchParams object from the current search string
                const linkParams = new URLSearchParams(searchParams);
                // Set the option name and value, overwriting any existing values
                const isSelected = currentOptionVal === value.name;
                linkParams.set(option.name, value.name);
                return (
                  <Link
                    key={value.name}
                    to={`${pathname}?${linkParams.toString()}`}
                    preventScrollReset
                    replace
                    className={`leading-none py-1 border-b-[1.5px] cursor-pointer hover:no-underline transition-all duration-200 ${
                      isSelected
                        ? 'border-gray-500 underline'
                        : 'border-neutral-50 no-underline'
                    }`}
                  >
                    {value.name}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
