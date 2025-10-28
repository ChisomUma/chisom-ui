// ./registry/new-york/ui/search-input.tsx

/**
 * SearchInput Component
 *
 * A reusable search input component with built-in debouncing, loading states,
 * and recent searches functionality. Perfect for search bars, filters, and autocomplete.
 *
 * @example
 * // Basic usage
 * <SearchInput placeholder="Search..." onSearch={(value) => console.log(value)} />
 *
 * @example
 * // Controlled usage with debounce
 * const [searchValue, setSearchValue] = useState("");
 * <SearchInput
 *   value={searchValue}
 *   onChange={setSearchValue}
 *   onSearch={handleSearch}
 *   debounceMs={500}
 * />
 *
 * @example
 * // With loading state and recent searches
 * <SearchInput
 *   onSearch={handleSearch}
 *   isLoading={loading}
 *   showRecentSearches
 *   recentSearches={['React', 'TypeScript', 'Next.js']}
 *   onRecentSearchClick={(search) => handleSearch(search)}
 * />
 *
 * Features:
 * - Automatic debouncing for performance
 * - Loading indicator during async operations
 * - Clear button to reset input
 * - Recent searches dropdown
 * - Keyboard navigation (Escape to clear)
 * - Fully customizable styling
 * - Form integration support
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { SearchNormal1, CloseCircle } from "iconsax-react";
import { cn } from "@/lib/utils";

const searchInputVariants = cva(
  "flex items-center gap-2 border rounded-[12px] px-4 py-2 transition-all duration-200 bg-white",
  {
    variants: {
      variant: {
        default: "border-neutral-200 focus-within:border-[#656565] focus-within:ring-2 focus-within:ring-[#656565]/10",
        ghost: "border-transparent bg-gray-50 focus-within:bg-white focus-within:border-neutral-200",
      },
      size: {
        sm: "h-9 text-sm px-3",
        md: "h-11 text-base px-4",
        lg: "h-13 text-lg px-5",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed bg-gray-50",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      disabled: false,
    },
  }
);

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "size">,
  VariantProps<typeof searchInputVariants> {
  /**
   * Controlled value of the search input
   */
  value?: string;

  /**
   * Callback fired on every input change (not debounced)
   * @param value - Current input value
   */
  onChange?: (value: string) => void;

  /**
   * Callback fired after debounce delay
   * @param value - Debounced search value
   */
  onSearch?: (value: string) => void;

  /**
   * Debounce delay in milliseconds
   * @default 300
   */
  debounceMs?: number;

  /**
   * Whether to show loading indicator
   * @default false
   */
  isLoading?: boolean;

  /**
   * Whether to show recent searches dropdown
   * @default false
   */
  showRecentSearches?: boolean;

  /**
   * Array of recent search terms
   */
  recentSearches?: string[];

  /**
   * Callback when a recent search is clicked
   * @param search - The clicked search term
   */
  onRecentSearchClick?: (search: string) => void;

  /**
   * Maximum number of recent searches to display
   * @default 5
   */
  maxRecentSearches?: number;

  /**
   * Custom placeholder text
   * @default "Search..."
   */
  placeholder?: string;

  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional className for the container
   */
  containerClassName?: string;
}

/**
 * Custom hook for debouncing values
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      containerClassName,
      variant,
      size,
      value,
      onChange,
      onSearch,
      debounceMs = 300,
      isLoading = false,
      showRecentSearches = false,
      recentSearches = [],
      onRecentSearchClick,
      maxRecentSearches = 5,
      placeholder = "Search...",
      disabled,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState("");
    const [showRecent, setShowRecent] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Use controlled value if provided, otherwise use internal state
    const isControlled = value !== undefined;
    const inputValue = isControlled ? value : internalValue;

    // Debounced value for search callback
    const debouncedValue = useDebounce(inputValue, debounceMs);

    // Call onSearch when debounced value changes
    React.useEffect(() => {
      if (debouncedValue !== undefined && onSearch) {
        onSearch(debouncedValue);
      }
    }, [debouncedValue, onSearch]);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (isControlled) {
        onChange?.(newValue);
      } else {
        setInternalValue(newValue);
      }

      // Show recent searches when input is focused and empty
      if (showRecentSearches && newValue === "") {
        setShowRecent(true);
      } else {
        setShowRecent(false);
      }
    };

    // Handle clear button
    const handleClear = () => {
      if (disabled) return;

      if (isControlled) {
        onChange?.("");
      } else {
        setInternalValue("");
      }

      onSearch?.("");
      setShowRecent(false);
    };

    // Handle recent search click
    const handleRecentClick = (search: string) => {
      if (disabled) return;

      if (isControlled) {
        onChange?.(search);
      } else {
        setInternalValue(search);
      }

      onRecentSearchClick?.(search);
      setShowRecent(false);
    };

    // Handle keyboard events
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        handleClear();
        (e.target as HTMLInputElement).blur();
      }
    };

    // Handle click outside to close recent searches
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setShowRecent(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Show recent searches on focus if input is empty
    const handleFocus = () => {
      if (showRecentSearches && inputValue === "" && recentSearches.length > 0) {
        setShowRecent(true);
      }
    };

    const displayedRecentSearches = recentSearches.slice(0, maxRecentSearches);

    return (
      <div ref={containerRef} className={cn("relative w-full", containerClassName)}>
        <div
          className={cn(
            searchInputVariants({
              variant,
              size,
              disabled,
              className,
            })
          )}
        >
          {/* Search Icon */}
          <SearchNormal1
            size={size === "sm" ? 16 : size === "lg" ? 20 : 18}
            className="text-gray-400 flex-shrink-0"
            variant="Bulk" color="currentColor"
          />

          {/* Input Field */}
          <input
            ref={ref}
            type="text"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 bg-transparent border-none outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
            {...props}
          />

          {/* Loading Spinner */}
          {isLoading && (
            <div className="flex-shrink-0">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600" />
            </div>
          )}

          {/* Clear Button */}
          {inputValue && !isLoading && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded-full hover:bg-gray-100"
              aria-label="Clear search"
            >
              <CloseCircle size={size === "sm" ? 16 : size === "lg" ? 20 : 18} variant="Bulk" color="currentColor" />
            </button>
          )}
        </div>

        {/* Recent Searches Dropdown */}
        {showRecent && showRecentSearches && displayedRecentSearches.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-neutral-200 rounded-[12px] shadow-lg overflow-hidden">
            <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-neutral-100">
              Recent Searches
            </div>
            <ul className="py-1">
              {displayedRecentSearches.map((search, index) => (
                <li key={`${search}-${index}`}>
                  <button
                    type="button"
                    onClick={() => handleRecentClick(search)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 group"
                  >
                    <SearchNormal1 size={14} className="text-gray-400" variant="Bulk" color="currentColor" />
                    <span className="flex-1">{search}</span>
                    <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      ↵
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export { SearchInput, searchInputVariants };