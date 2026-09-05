import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { Input, Button, Tooltip } from 'antd';
import { SearchOutlined, CloseCircleFilled } from '@ant-design/icons';

export interface SearchBarProps {
  value?: string;
  placeholder?: string;
  debounceMs?: number;
  width?: number | string;
  allowClear?: boolean;
  size?: 'small' | 'middle';
  autoFocus?: boolean;
  disabled?: boolean;
  onSearch: (searchTerm: string) => void;
  onClear?: () => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value: externalValue = '',
  placeholder = 'Search by SKU, product name, or barcode...',
  debounceMs = 300,
  width = 280,
  allowClear = true,
  size = 'small',
  autoFocus = false,
  disabled = false,
  onSearch,
  onClear,
  className = '',
}) => {
  const [innerValue, setInnerValue] = useState<string>(externalValue);
  const [prevExternalValue, setPrevExternalValue] = useState<string>(externalValue);
  const [, startTransition] = useTransition();

  if (externalValue !== prevExternalValue) {
    setPrevExternalValue(externalValue);
    setInnerValue(externalValue);
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      if (innerValue !== externalValue) {
        startTransition(() => {
          onSearch(innerValue.trim());
        });
      }
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [innerValue, debounceMs, onSearch, externalValue]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInnerValue(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setInnerValue('');
    onSearch('');
    if (onClear) {
      onClear();
    }
  }, [onSearch, onClear]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSearch(innerValue.trim());
      } else if (e.key === 'Escape') {
        handleClear();
      }
    },
    [innerValue, onSearch, handleClear]
  );

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        width: typeof width === 'number' ? `${width}px` : width,
      }}
      className={className}
    >
      <Input
        value={innerValue}
        placeholder={placeholder}
        size={size}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        prefix={<SearchOutlined style={{ color: '#8c8c8c', fontSize: 13, marginRight: 2 }} />}
        suffix={
          allowClear && innerValue ? (
            <Tooltip title="Clear search (Esc)" mouseEnterDelay={0.4}>
              <Button
                type="text"
                size="small"
                onClick={handleClear}
                disabled={disabled}
                aria-label="Clear search input"
                style={{
                  padding: 0,
                  width: 16,
                  height: 16,
                  minWidth: 16,
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#bfbfbf',
                }}
              >
                <CloseCircleFilled style={{ fontSize: 12 }} />
              </Button>
            </Tooltip>
          ) : (
            <span style={{ fontSize: 11, color: '#bfbfbf', userSelect: 'none' }}>/</span>
          )
        }
        style={{
          borderRadius: 2,
          fontSize: 12,
          backgroundColor: '#ffffff',
          borderColor: '#d9d9d9',
          boxShadow: 'none',
        }}
        aria-label="Search items"
      />
    </div>
  );
};