// ./registry/new-york/ui/color-picker-input.tsx

/**
 * ColorPickerInput Component
 *
 * A comprehensive color picker component with multiple input formats,
 * preset colors, and recent colors history.
 *
 * @example
 * // Basic usage
 * <ColorPickerInput value="#FF5733" onChange={(color) => console.log(color)} />
 *
 * @example
 * // Controlled with label
 * const [color, setColor] = useState("#3B82F6");
 * <ColorPickerInput
 *   value={color}
 *   onChange={setColor}
 *   label="Brand Color"
 *   description="Choose your primary brand color"
 * />
 *
 * @example
 * // With preset colors
 * <ColorPickerInput
 *   value={color}
 *   onChange={setColor}
 *   showPresets
 *   presetColors={['#FF5733', '#33FF57', '#3357FF']}
 * />
 *
 * @example
 * // With recent colors history
 * <ColorPickerInput
 *   value={color}
 *   onChange={setColor}
 *   showRecentColors
 *   maxRecentColors={8}
 * />
 *
 * Features:
 * - HEX, RGB, and HSL format support
 * - Visual color preview swatch
 * - Preset color palette
 * - Recent colors history
 * - Copy color to clipboard
 * - Form integration support
 * - Keyboard accessible
 * - Validation for color formats
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const colorPickerVariants = cva(
  "border rounded-[12px] transition-colors bg-white",
  {
    variants: {
      variant: {
        default: "border-neutral-200 focus-within:border-[#656565]",
        error: "border-red-500",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
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

type ColorFormat = "hex" | "rgb" | "hsl";

export interface ColorPickerInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "size">,
    Omit<VariantProps<typeof colorPickerVariants>, "disabled"> {
  /**
   * Current color value (HEX format: #RRGGBB)
   */
  value?: string;

  /**
   * Callback when color changes
   * @param color - New color in HEX format
   */
  onChange?: (color: string) => void;

  /**
   * Label text displayed above the component
   */
  label?: string;

  /**
   * Description text displayed below the component
   */
  description?: string;

  /**
   * Error message displayed in red
   */
  error?: string;

  /**
   * Whether the field is required
   * @default false
   */
  required?: boolean;

  /**
   * Whether to show preset colors
   * @default true
   */
  showPresets?: boolean;

  /**
   * Array of preset colors in HEX format
   */
  presetColors?: string[];

  /**
   * Whether to show recent colors
   * @default true
   */
  showRecentColors?: boolean;

  /**
   * Maximum number of recent colors to store
   * @default 6
   */
  maxRecentColors?: number;

  /**
   * Color format for input field
   * @default "hex"
   */
  format?: ColorFormat;
}

// Default preset colors
const DEFAULT_PRESETS = [
  "#FF5733", "#33FF57", "#3357FF", "#F033FF",
  "#FF33F0", "#33FFF0", "#F0FF33", "#000000",
  "#FFFFFF", "#808080", "#FF0000", "#00FF00",
  "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF",
];

// Utility functions for color conversion
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
};

const hexToHsl = (hex: string): { h: number; s: number; l: number } | null => {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

const isValidHex = (color: string): boolean => {
  return /^#[0-9A-F]{6}$/i.test(color);
};

const ColorPickerInput = React.forwardRef<HTMLInputElement, ColorPickerInputProps>(
  (
    {
      className,
      variant,
      size,
      value = "#3B82F6",
      onChange,
      label,
      description,
      error,
      required,
      disabled,
      showPresets = true,
      presetColors = DEFAULT_PRESETS,
      showRecentColors = true,
      maxRecentColors = 6,
      format = "hex",
      ...props
    },
    ref
  ) => {
    const [currentColor, setCurrentColor] = React.useState(value);
    const [inputValue, setInputValue] = React.useState(value);
    const [recentColors, setRecentColors] = React.useState<string[]>([]);
    const [copied, setCopied] = React.useState(false);

    // Load recent colors from localStorage
    React.useEffect(() => {
      try {
        const stored = localStorage.getItem("color-picker-recent");
        if (stored) {
          setRecentColors(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to load recent colors:", e);
      }
    }, []);

    // Sync with controlled value
    React.useEffect(() => {
      if (value && value !== currentColor) {
        setCurrentColor(value);
        setInputValue(value);
      }
    }, [value]);

    // Update recent colors
    const updateRecentColors = (color: string) => {
      if (!isValidHex(color)) return;

      setRecentColors((prev) => {
        const filtered = prev.filter((c) => c.toLowerCase() !== color.toLowerCase());
        const updated = [color, ...filtered].slice(0, maxRecentColors);
        
        try {
          localStorage.setItem("color-picker-recent", JSON.stringify(updated));
        } catch (e) {
          console.error("Failed to save recent colors:", e);
        }
        
        return updated;
      });
    };

    // Handle color change
    const handleColorChange = (newColor: string) => {
      if (disabled) return;
      
      setCurrentColor(newColor);
      setInputValue(newColor);
      onChange?.(newColor);
      updateRecentColors(newColor);
    };

    // Handle native color picker change
    const handleNativePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleColorChange(e.target.value.toUpperCase());
    };

    // Handle text input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);

      if (isValidHex(value)) {
        handleColorChange(value.toUpperCase());
      }
    };

    // Handle preset color click
    const handlePresetClick = (color: string) => {
      if (disabled) return;
      handleColorChange(color);
    };

    // Format color for display
    const getFormattedColor = () => {
      if (!isValidHex(currentColor)) return currentColor;

      switch (format) {
        case "rgb": {
          const rgb = hexToRgb(currentColor);
          return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : currentColor;
        }
        case "hsl": {
          const hsl = hexToHsl(currentColor);
          return hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : currentColor;
        }
        default:
          return currentColor;
      }
    };

    // Copy color to clipboard
    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(getFormattedColor());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        console.error("Failed to copy:", e);
      }
    };

    return (
      <div className="space-y-2 w-full">
        {/* Label */}
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Main Input Container */}
        <div
          className={cn(
            colorPickerVariants({
              variant: error ? "error" : variant,
              size,
              disabled,
            }),
            "p-3 space-y-3"
          )}
        >
          {/* Color Preview and Input */}
          <div className="flex items-center gap-3">
            {/* Native Color Picker (Hidden but triggers color selection) */}
            <label className="relative cursor-pointer">
              <input
                ref={ref}
                type="color"
                value={currentColor}
                onChange={handleNativePickerChange}
                disabled={disabled}
                className="sr-only"
                {...props}
              />
              <div
                className={cn(
                  "w-12 h-12 rounded-[8px] border-2 border-neutral-200 cursor-pointer transition-all hover:scale-105",
                  disabled && "cursor-not-allowed opacity-50"
                )}
                style={{ backgroundColor: currentColor }}
              />
            </label>

            {/* Text Input */}
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                disabled={disabled}
                placeholder="#000000"
                className={cn(
                  "flex-1 px-3 py-2 border border-neutral-200 rounded-[8px] font-mono text-sm",
                  "focus:outline-none focus:border-[#656565] focus:ring-1 focus:ring-[#656565]/10",
                  disabled && "cursor-not-allowed bg-gray-50"
                )}
              />

              {/* Copy Button */}
              <button
                type="button"
                onClick={handleCopy}
                disabled={disabled}
                className={cn(
                  "p-2 rounded-[8px] border border-neutral-200 hover:bg-gray-50 transition-colors",
                  disabled && "cursor-not-allowed opacity-50"
                )}
                aria-label="Copy color"
              >
                {copied ? (
                  <Check size={16} className="text-green-600" />
                ) : (
                  <Copy size={16} className="text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Format Display */}
          {format !== "hex" && (
            <div className="text-xs text-gray-500 font-mono">
              {getFormattedColor()}
            </div>
          )}

          {/* Preset Colors */}
          {showPresets && (
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">Presets</p>
              <div className="grid grid-cols-8 gap-2">
                {presetColors.map((color, index) => (
                  <button
                    key={`${color}-${index}`}
                    type="button"
                    onClick={() => handlePresetClick(color)}
                    disabled={disabled}
                    className={cn(
                      "w-full aspect-square rounded-[6px] border-2 transition-all hover:scale-110",
                      currentColor.toLowerCase() === color.toLowerCase()
                        ? "border-gray-900 ring-2 ring-gray-900/20"
                        : "border-neutral-200",
                      disabled && "cursor-not-allowed opacity-50"
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recent Colors */}
          {showRecentColors && recentColors.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">Recent</p>
              <div className="flex gap-2">
                {recentColors.map((color, index) => (
                  <button
                    key={`${color}-${index}`}
                    type="button"
                    onClick={() => handlePresetClick(color)}
                    disabled={disabled}
                    className={cn(
                      "w-10 h-10 rounded-[6px] border-2 transition-all hover:scale-110",
                      currentColor.toLowerCase() === color.toLowerCase()
                        ? "border-gray-900 ring-2 ring-gray-900/20"
                        : "border-neutral-200",
                      disabled && "cursor-not-allowed opacity-50"
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={`Select recent color ${color}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Description and Error */}
        {(description || error) && (
          <div className="text-sm">
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <p className="text-gray-500">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

ColorPickerInput.displayName = "ColorPickerInput";

export { ColorPickerInput, colorPickerVariants };